const pool = require('../config/db');

const getAllPonds = async (request, reply) => {
  try {
    // Mengambil semua data dari tabel kolam_pancing
    const [rows] = await pool.execute('SELECT * FROM spots');
    return reply.send({
      status: 'Success',
      message: 'Daftar kolam pancing berhasil diambil',
      data: rows
    });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

const createPond = async (request, reply) => {
  const { nama_kolam, alamat, deskripsi, harga_tiket, latitude, longitude } = request.body;
  const ownerId = request.user.id; // User yang sedang login menjadi pemiliknya

  try {
    const [result] = await pool.execute(
      'INSERT INTO kolam_pancing (nama_kolam, alamat, deskripsi, harga_tiket, latitude, longitude, owner_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nama_kolam, alamat, deskripsi, harga_tiket, latitude, longitude, ownerId]
    );

    return reply.code(201).send({
      status: 'Success',
      message: 'Spot pancing berhasil ditambahkan!',
      pondId: result.insertId
    });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

// Update ekspornya
module.exports = { getAllPonds, createPond };