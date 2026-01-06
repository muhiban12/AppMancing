require("dotenv").config();
const path = require("path");
const fastify = require("fastify")({ logger: true });
const multer = require("fastify-multer");
const pool = require("./src/config/db");
const __dirname = path.resolve();


/* ================= CORE PLUGINS ================= */

// CORS
fastify.register(require("@fastify/cors"), {
  origin: "*",
});

// Multipart / Upload
fastify.register(multer.contentParser);

// Static files
fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "uploads"),
  prefix: "/uploads/",
});

// JWT
fastify.register(require("@fastify/jwt"), {
  secret: process.env.JWT_SECRET || "supersecret",
});

/* ================= DATABASE ================= */

/* ================= HEALTH CHECK ================= */
fastify.get("/cek-koneksi", async (request, reply) => {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS result");
    return {
      status: "Berhasil!",
      message: "Backend sudah nyambung ke database apps_pancingin",
      data: rows,
    };
  } catch (err) {
    return reply.code(500).send({
      status: "Gagal",
      error: err.message,
    });
  }
});

/* ================= ROUTES ================= */
fastify.register(require("./src/routes/indexRoutes"), {
  prefix: "/api",
});

/* ================= SYSTEM JOB ================= */
const {
  systemUpdateExpiredBookings,
} = require("./src/controllers/systemController");

setInterval(async () => {
  try {
    await systemUpdateExpiredBookings();
    console.log("⏰ Booking expired berhasil diperbarui");
  } catch (err) {
    console.error("❌ Cron error:", err.message);
  }
}, 5 * 60 * 1000);

/* ================= START SERVER ================= */
const start = async () => {
  try {
    await fastify.listen({
      port: process.env.PORT || 3000,
      host: "0.0.0.0",
    });
    console.log("🚀 Server jalan di http://localhost:3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
