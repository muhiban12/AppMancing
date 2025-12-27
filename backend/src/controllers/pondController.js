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

module.exports = { getAllPonds };