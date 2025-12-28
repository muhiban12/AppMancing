const pool = require('../config/db');

const getAllPonds = async (request, reply) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM spots');
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

// Update exports paling bawah
module.exports = { getAllPonds, createPond, updatePond, deletePond };