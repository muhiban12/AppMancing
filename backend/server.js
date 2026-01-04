require('dotenv').config();
const path = require('path');
const multer = require('fastify-multer');
const fastify = require('fastify')({ logger: true });

// Register CORS agar bisa diakses browser/frontend nanti
fastify.register(require('@fastify/cors'), { origin: "*" });


fastify.register(multer.contentParser);

// untuk mekanisme uploud foto 
fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, 'uploads'),
  prefix: '/uploads/', // URL publik
});
// Daftarkan JWT (Gunakan secret dari .env)
fastify.register(require('@fastify/jwt'), {
  secret: process.env.JWT_SECRET || 'supersecret'
});

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
// Daftarkan Route Auth
fastify.register(require('./src/routes/authRoutes'), { prefix: '/api/auth' });
fastify.register(require('./src/routes/pondRoutes'), { prefix: '/api/ponds' });

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

// Contoh di server.js
const { updateExpiredBookings } = require('./src/controllers/pondController');

// Jalankan pengecekan setiap 5 menit
setInterval(async () => {
  await updateExpiredBookings();
  console.log('Status kursi telah diperbarui otomatis.');
}, 5 * 60 * 1000);
start();