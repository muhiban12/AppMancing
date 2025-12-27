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

// Update ekspornya
module.exports = { getAllPonds, createPond };