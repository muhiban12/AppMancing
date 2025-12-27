require('dotenv').config();
const fastify = require('fastify')({ logger: true });

// Register CORS agar bisa diakses browser/frontend nanti
fastify.register(require('@fastify/cors'), { origin: "*" });

// Panggil koneksi database
const pool = require('./src/config/db');

// API sederhana untuk cek apakah database sudah konek
fastify.get('/cek-koneksi', async (request, reply) => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS result');
    return { 
      status: "Berhasil!", 
      message: "Backend sudah nyambung ke database apps_pancingin",
      data: rows 
    };
  } catch (err) {
    console.error("Detail Error DB:", err);
    return reply.status(500).send({ 
      status: "Gagal", 
      error: err.message 
    });
  }
});

// Menjalankan server
const start = async () => {
  try {
    await fastify.listen({ port: process.env.PORT || 3000, host: '0.0.0.0' });
    console.log("🚀 Server jalan di http://localhost:3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();