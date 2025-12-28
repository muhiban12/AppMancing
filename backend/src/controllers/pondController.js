const pool = require('../config/db');

const getAllPonds = async (request, reply) => {
  try {
    // Ubah query agar hanya mengambil yang statusnya 'approved'
    const [rows] = await pool.execute("SELECT * FROM spots WHERE status = 'approved'");
    return reply.send({
      status: 'Success',
      data: rows
    });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

const getAdminPonds = async (request, reply) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM spots");
    return reply.send({
      status: 'Success',
      data: rows
    });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

const getSpotSeats = async (request, reply) => {
  const { spot_id } = request.params;

  try {
    const [rows] = await pool.execute(
      "SELECT * FROM seats WHERE spot_id = ? AND status = 'Available'", 
      [spot_id]
    );
    
    return reply.send({
      status: 'Success',
      data: rows
    });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};


const createPond = async (request, reply) => {
  const { 
    nama_spot, deskripsi, harga_per_jam, alamat, 
    latitude, longitude, total_kursi, jam_buka, jam_tutup,
    fasilitas_ids // Contoh: [1, 2, 4]
  } = request.body;
  
  const ownerId = request.user.id; 
  const connection = await pool.getConnection(); // Gunakan connection untuk transaksi

  try {
    await connection.beginTransaction();

    // 1. Simpan data spot
    const [result] = await connection.execute(
      'INSERT INTO spots (owner_id, nama_spot, deskripsi, harga_per_jam, alamat, latitude, longitude, total_kursi, jam_buka, jam_tutup) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [ownerId, nama_spot, deskripsi, harga_per_jam, alamat, latitude, longitude, total_kursi, jam_buka, jam_tutup]
    );

    const spotId = result.insertId;

    // 2. Simpan fasilitas jika ada
    if (fasilitas_ids && fasilitas_ids.length > 0) {
      const values = fasilitas_ids.map(fId => [spotId, fId]);
      await connection.query(
        'INSERT INTO spot_facilities (spot_id, fasilitas_id) VALUES ?',
        [values]
      );
    }

    await connection.commit();
    return reply.code(201).send({ status: 'Success', message: 'Spot dan fasilitas berhasil disimpan!' });

  } catch (error) {
    await connection.rollback();
    return reply.code(500).send({ error: error.message });
  } finally {
    connection.release();
  }
};

const updatePond = async (request, reply) => {
  const { id } = request.params; // Mengambil ID spot dari URL
  const { nama_spot, deskripsi, harga_per_jam, alamat, total_kursi, jam_buka, jam_tutup } = request.body;
  const ownerId = request.user.id; // ID user yang sedang login

  try {
    // 1. Cek dulu, apakah spot ini memang milik user yang login?
    const [spot] = await pool.execute('SELECT owner_id FROM spots WHERE id = ?', [id]);

    if (spot.length === 0) {
      return reply.code(404).send({ message: 'Spot tidak ditemukan' });
    }

    if (spot[0].owner_id !== ownerId) {
      return reply.code(403).send({ message: 'Kamu tidak berhak mengedit spot ini!' });
    }

    // 2. Jika aman, baru kita update datanya
    await pool.execute(
      'UPDATE spots SET nama_spot=?, deskripsi=?, harga_per_jam=?, alamat=?, total_kursi=?, jam_buka=?, jam_tutup=? WHERE id = ?',
      [nama_spot, deskripsi, harga_per_jam, alamat, total_kursi, jam_buka, jam_tutup, id]
    );

    return reply.send({ status: 'Success', message: 'Data spot berhasil diperbarui!' });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

const deletePond = async (request, reply) => {
  const { id } = request.params;
  const ownerId = request.user.id;

  try {
    // 1. Cek kepemilikan spot
    const [spot] = await pool.execute('SELECT owner_id FROM spots WHERE id = ?', [id]);

    if (spot.length === 0) {
      return reply.code(404).send({ message: 'Spot tidak ditemukan' });
    }

    // Hanya pemilik (Owner) atau Admin yang boleh hapus
    if (spot[0].owner_id !== ownerId) {
      return reply.code(403).send({ message: 'Akses ditolak! Kamu bukan pemilik spot ini.' });
    }

    // 2. Hapus data (relasi di spot_facilities akan otomatis terhapus karena ON DELETE CASCADE)
    await pool.execute('DELETE FROM spots WHERE id = ?', [id]);

    return reply.send({ status: 'Success', message: 'Spot pancing berhasil dihapus selamanya.' });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

// Fungsi untuk Admin mengubah status spot
const approveSpot = async (request, reply) => {
  const { id } = request.params;
  const { status } = request.body; // 'approved' atau 'rejected'

  try {
    await pool.execute('UPDATE spots SET status = ? WHERE id = ?', [status, id]);
    return reply.send({ status: 'Success', message: `Spot pancing kini berstatus: ${status}` });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

//bagian spots liar
const createWildSpot = async (request, reply) => {
  const { 
    nama_lokasi, kabupaten_provinsi, deskripsi_spot, 
    latitude, longitude, status_potensi 
  } = request.body;
  
  const adminId = request.user.id; // Diambil dari token admin

  try {
    const [result] = await pool.execute(
      'INSERT INTO wild_spots (admin_id, nama_lokasi, kabupaten_provinsi, deskripsi_spot, latitude, longitude, status_potensi) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [adminId, nama_lokasi, kabupaten_provinsi, deskripsi_spot, latitude, longitude, status_potensi]
    );

    return reply.code(201).send({
      status: 'Success',
      message: 'Spot liar berhasil ditambahkan oleh Admin!',
      spotId: result.insertId
    });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

const getAllMapSpots = async (request, reply) => {
  const { search } = request.query; // Menangkap apa yang diketik user di UI
  let query = `
    SELECT id, nama_spot AS nama, latitude, longitude, 'komersil' AS tipe, status FROM spots WHERE status = 'approved'
    UNION
    SELECT id, nama_lokasi AS nama, latitude, longitude, 'liar' AS tipe, 'approved' AS status FROM wild_spots
  `;

  try {
    const [rows] = await pool.execute(query);
    
    // Logika Filter Sederhana di Backend
    let filteredData = rows;
    if (search) {
      filteredData = rows.filter(spot => 
        spot.nama.toLowerCase().includes(search.toLowerCase())
      );
    }

    return reply.send({
      status: 'Success',
      data: filteredData
    });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

const getSpotDetail = async (request, reply) => {
  const { id } = request.params;
  const { tipe } = request.query; // Kita kirim tipe ('komersil' atau 'liar') dari frontend

  try {
    let query = '';
    if (tipe === 'liar') {
      query = 'SELECT * FROM wild_spots WHERE id = ?';
    } else {
      // Untuk komersil, kita sekalian ambil data fasilitasnya menggunakan JOIN
      query = `
        SELECT s.*, GROUP_CONCAT(mf.nama_fasilitas) as fasilitas 
        FROM spots s
        LEFT JOIN spot_facilities sf ON s.id = sf.spot_id
        LEFT JOIN master_fasilitas mf ON sf.fasilitas_id = mf.id
        WHERE s.id = ?
        GROUP BY s.id
      `;
    }

    const [rows] = await pool.execute(query, [id]);

    if (rows.length === 0) {
      return reply.code(404).send({ message: 'Detail spot tidak ditemukan' });
    }

    return reply.send({
      status: 'Success',
      data: rows[0]
    });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

// Update exports paling bawah
module.exports = { getAllPonds, createPond, updatePond, deletePond, approveSpot, getAdminPonds, createWildSpot, getAllMapSpots, getSpotDetail, getSpotSeats};