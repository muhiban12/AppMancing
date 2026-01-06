require("dotenv").config();
const path = require("path");
const pool = require("./src/config/db");
const fastify = require("fastify")({ logger: true });
const multer = require("fastify-multer");

const rootDir = process.cwd();

/* ================= CORE PLUGINS ================= */

// CORS
fastify.register(require("@fastify/cors"), {
  origin: "*",
});

// Multipart / Upload
fastify.register(multer.contentParser);

// Static files - GUNAKAN rootDir atau __dirname yang sudah didefinisikan
fastify.register(require("@fastify/static"), {
  root: path.join(rootDir, "uploads"), // Lebih aman pakai rootDir
  prefix: "/uploads/",
});

// JWT
fastify.register(require("@fastify/jwt"), {
  secret: process.env.JWT_SECRET || "supersecret",
});


/* ================= HEALTH CHECK ================= */
fastify.get("/cek-koneksi", async (request, reply) => {
  try {
    const [rows] = await pool.execute("SELECT 1 + 1 AS result");
    return {
      status: "Berhasil!",
      message: "Backend sudah nyambung ke database apps_pancingin",
      data: rows,
    };
  } catch (err) {
    console.error("Database error:", err);
    return reply.code(500).send({
      status: "Gagal",
      error: "Tidak bisa terhubung ke database",
      detail: err.message,
    });
  }
});

// Tambahkan route test untuk debug
fastify.get("/debug-paths", async (request, reply) => {
  return {
    rootDir: rootDir,
    cwd: process.cwd(),
    mainModule: require.main.filename,
    uploadsPath: path.join(rootDir, "uploads")
  };
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
    const PORT = process.env.PORT || 3000;
    
    // Test koneksi database dulu
    try {
      const [result] = await pool.execute("SELECT 1");
      console.log("✅ Database connected successfully");
    } catch (dbErr) {
      console.error("❌ Database connection failed:", dbErr.message);
      console.log("⚠️  Continuing without database...");
    }
    
    await fastify.listen({
      port: PORT,
      host: "0.0.0.0",
    });
    
    console.log("=".repeat(60));
    console.log("🚀 SERVER APPMANCING BERHASIL DIAKTIFKAN");
    console.log("=".repeat(60));
    console.log(`📍 Server URL: http://localhost:${PORT}`);
    console.log(`📍 API Base URL: http://localhost:${PORT}/api`);
    console.log(`📍 Health Check: http://localhost:${PORT}/cek-koneksi`);
    console.log(`📍 Debug Paths: http://localhost:${PORT}/debug-paths`);
    console.log("");
    console.log("📌 ENDPOINT UTAMA:");
    console.log(`   🔐 POST  http://localhost:${PORT}/api/auth/login`);
    console.log(`   🔔 GET   http://localhost:${PORT}/api/notifications`);
    console.log(`   📍 GET   http://localhost:${PORT}/api/map-spots`);
    console.log("");
    console.log("🛠️  Untuk testing:");
    console.log("   curl http://localhost:3000/debug-paths");
    console.log("   curl http://localhost:3000/cek-koneksi");
    console.log("=".repeat(60));
    
  } catch (err) {
    console.error("❌ GAGAL MENJALANKAN SERVER:");
    console.error("Error:", err.message);
    console.error("Stack:", err.stack);
    process.exit(1);
  }
};

// Error handlers
process.on("uncaughtException", (error) => {
  console.error("💥 UNCAUGHT EXCEPTION:", error.message);
  console.error(error.stack);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("💥 UNHANDLED REJECTION at:", promise);
  console.error("Reason:", reason);
});

// Start server
start();