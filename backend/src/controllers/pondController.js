const pool = require("../config/db");
const xml2js = require("xml2js");
const axios = require("axios");
const BASE_URL = process.env.BASE_URL;

const buildFileUrl = (request, folder) => {
  if (!request.file) return null;
  return `${BASE_URL}/uploads/${folder}/${request.file.filename}`;
};

const isNumber = (val) => !isNaN(val) && val !== null;

const getAdminPonds = async (request, reply) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM spots");
    return reply.send({
      status: "Success",
      data: rows,
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
      status: "Success",
      data: rows,
    });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

const createPond = async (request, reply) => {
  const {
    nama_spot,
    deskripsi,
    harga_per_jam,
    alamat,
    latitude,
    longitude,
    total_kursi,
    jam_buka,
    jam_tutup,
    kode_wilayah,
    fasilitas_ids,
  } = request.body;

  const ownerId = request.user.id;
  const fotoUtama = buildFileUrl(request, "ponds"); // ✅

  if (harga_per_jam <= 0) {
    return reply.code(400).send({ message: "Harga per jam tidak valid" });
  }

  if (total_kursi <= 0 || total_kursi > 100) {
    return reply.code(400).send({ message: "Jumlah kursi tidak valid" });
  }

  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return reply.code(400).send({ message: "Koordinat tidak valid" });
  }
  if (!fotoUtama) {
    return reply.code(400).send({ message: "Foto utama wajib diupload" });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [result] = await connection.execute(
      `INSERT INTO spots (
        owner_id, nama_spot, deskripsi, harga_per_jam, alamat, 
        latitude, longitude, total_kursi, jam_buka, jam_tutup, 
        kode_wilayah, foto_utama, status, action_type
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'create')`,
      [
        ownerId,
        nama_spot,
        deskripsi,
        harga_per_jam,
        alamat,
        latitude,
        longitude,
        total_kursi,
        jam_buka,
        jam_tutup,
        kode_wilayah,
        fotoUtama,
      ]
    );

    for (let i = 1; i <= total_kursi; i++) {
      await connection.execute(
        'INSERT INTO seats (spot_id, nomor_kursi, status) VALUES (?, ?, "Available")',
        [result.insertId, i]
      );
    }

    if (Array.isArray(fasilitas_ids)) {
      for (const fid of fasilitas_ids) {
        await connection.execute(
          "INSERT INTO spot_facilities (spot_id, fasilitas_id) VALUES (?, ?)",
          [result.insertId, fid]
        );
      }
    }

    await connection.commit();

    reply.code(201).send({
      status: "Success",
      spotId: result.insertId,
      foto: fotoUtama,
    });
  } catch (err) {
    await connection.rollback();
    reply.code(500).send({ error: err.message });
  } finally {
    connection.release();
  }
};

const updatePond = async (request, reply) => {
  const ownerId = request.user.id;
  const pondId = request.params.id;

  const { nama_spot, alamat, harga_per_jam } = request.body;
  const fotoBaru = buildFileUrl(request, "ponds");

  const [pond] = await pool.execute(
    'SELECT id FROM spots WHERE id = ? AND owner_id = ? AND status != "deleted"',
    [pondId, ownerId]
  );

  if (!pond.length) {
    return reply
      .code(403)
      .send({ message: "Pond tidak ditemukan atau bukan milik Anda" });
  }

  let fields = [];
  let values = [];

  if (nama_spot) {
    fields.push("nama_spot=?");
    values.push(nama_spot);
  }
  if (alamat) {
    fields.push("alamat=?");
    values.push(alamat);
  }
  if (harga_per_jam) {
    if (harga_per_jam <= 0) {
      return reply.code(400).send({ message: "Harga tidak valid" });
    }
    fields.push("harga_per_jam=?");
    values.push(harga_per_jam);
  }
  if (fotoBaru) {
    fields.push("foto_utama=?");
    values.push(fotoBaru);
  }

  if (fields.length === 0) {
    return reply.code(400).send({ message: "Tidak ada data diubah" });
  }

  fields.push("status='pending'");
  fields.push("action_type='update'");

  await pool.execute(`UPDATE spots SET ${fields.join(", ")} WHERE id=?`, [
    ...values,
    pondId,
  ]);

  reply.send({ message: "Update berhasil, menunggu approval admin" });
};

const requestDeletePond = async (request, reply) => {
  const ownerId = request.user.id;
  const pondId = request.params.id;

  const [pond] = await pool.execute(
    'SELECT id FROM spots WHERE id = ? AND owner_id = ? AND status != "deleted"',
    [pondId, ownerId]
  );

  if (!pond.length) {
    return reply.code(404).send({ message: "Pond tidak ditemukan" });
  }

  await pool.execute(
    'UPDATE spots SET status = "delete_requested" WHERE id = ?',
    [pondId]
  );

  reply.send({ message: "Permintaan hapus dikirim ke admin" });
};

const approveDeletePond = async (request, reply) => {
  const pondId = request.params.id;

  await pool.execute(
    'UPDATE spots SET status = "deleted" WHERE id = ? AND status = "delete_requested"',
    [pondId]
  );

  reply.send({ message: "Pond berhasil dihapus" });
};

// Fungsi untuk Admin mengubah status spot
const approveSpot = async (request, reply) => {
  const adminId = request.user.id;
  const { id } = request.params;
  const { decision } = request.body; // approved | rejected

  if (!["approved", "rejected"].includes(decision)) {
    return reply.code(400).send({ message: "Decision tidak valid" });
  }

  const [[spot]] = await pool.execute(
    `
    SELECT id, owner_id, action_type
    FROM spots 
    WHERE id = ? AND status = 'pending'
    `,
    [id]
  );

  if (!spot) {
    return reply.code(404).send({
      message: "Spot tidak ditemukan atau bukan status pending",
    });
  }

  let finalStatus = decision;

  // 🔥 LOGIKA UTAMA
  if (spot.action_type === "delete") {
    finalStatus = decision === "approved" ? "deleted" : "approved";
  }

  await pool.execute(
    `
    UPDATE spots
    SET 
      status = ?,
      approved_at = NOW(),
      approved_by = ?
    WHERE id = ?
    `,
    [finalStatus, adminId, id]
  );

  // Kirim notifikasi ke owner
  await pool.execute(
    `
  INSERT INTO notifications (user_id, title, message)
  VALUES (?, ?, ?)
  `,
    [
      spot.owner_id,
      "Status Spot Diperbarui",
      `Spot kamu telah ${decision} oleh admin`,
    ]
  );

  reply.send({
    status: "Success",
    message: `Spot berhasil di-${decision}`,
  });
};

//bagian spots liar
const createWildSpot = async (request, reply) => {
  const {
    nama_lokasi,
    kabupaten_provinsi,
    deskripsi_spot,
    latitude,
    longitude,
    status_potensi,
    kode_wilayah,
    foto_carousel, // Tambahkan ini agar cuaca & foto muncul
  } = request.body;

  const adminId = request.user.id;

  try {
    const [result] = await pool.execute(
      `INSERT INTO wild_spots (
        admin_id, nama_lokasi, kabupaten_provinsi, deskripsi_spot, 
        latitude, longitude, status_potensi, kode_wilayah, foto_carousel
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        adminId,
        nama_lokasi,
        kabupaten_provinsi,
        deskripsi_spot,
        latitude,
        longitude,
        status_potensi,
        kode_wilayah,
        foto_carousel,
      ]
    );

    return reply.code(201).send({
      status: "Success",
      message: "Spot liar berhasil ditambahkan!",
      spotId: result.insertId,
    });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

const updateWildSpot = async (request, reply) => {
  const { id } = request.params;
  const {
    nama_lokasi,
    kabupaten_provinsi,
    deskripsi_spot,
    latitude,
    longitude,
    status_potensi,
    kode_wilayah,
  } = request.body;

  const fotoCarousel = buildFileUrl(request, "wildspots");

  let query = `
    UPDATE wild_spots SET
      nama_lokasi=?, kabupaten_provinsi=?, deskripsi_spot=?,
      latitude=?, longitude=?, status_potensi=?, kode_wilayah=?
  `;
  const values = [
    nama_lokasi,
    kabupaten_provinsi,
    deskripsi_spot,
    latitude,
    longitude,
    status_potensi,
    kode_wilayah,
  ];

  if (fotoCarousel) {
    query += `, foto_carousel=?`;
    values.push(fotoCarousel);
  }

  query += ` WHERE id=?`;
  values.push(id);

  await pool.execute(query, values);

  reply.send({ status: "Success", foto: fotoCarousel || "tidak diubah" });
};

const deleteWildSpot = async (request, reply) => {
  const { id } = request.params;

  try {
    // 1. Cek apakah data spot liar tersebut ada
    const [exist] = await pool.execute(
      "SELECT id FROM wild_spots WHERE id = ?",
      [id]
    );

    if (exist.length === 0) {
      return reply.code(404).send({
        status: "Error",
        message: "Spot liar tidak ditemukan!",
      });
    }

    // 2. Hapus data dari database
    await pool.execute("DELETE FROM wild_spots WHERE id = ?", [id]);

    return reply.send({
      status: "Success",
      message: "Spot liar berhasil dihapus dari sistem oleh Admin.",
    });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

const getAllMapSpots = async (request, reply) => {
  // Ambil koordinat user, radius, dan kata kunci pencarian (search)
  const { user_lat, user_lon, radius_km = 10, search = "" } = request.query;

  if (!user_lat || !user_lon) {
    return reply.code(400).send({
      message: "Koordinat lokasi kamu diperlukan untuk melihat spot terdekat.",
    });
  }

  // Parameter untuk Haversine + Filter Nama (Liar & Komersial)
  // Kita tambahkan wildcard % untuk pencarian partial (LIKE)
  const searchPattern = `%${search}%`;
  const params = [
    user_lat,
    user_lon,
    user_lat,
    searchPattern, // Parameter untuk blok Komersial
    user_lat,
    user_lon,
    user_lat,
    searchPattern, // Parameter untuk blok Liar
    radius_km, // Filter radius terakhir
  ];

  const query = `
    SELECT * FROM (
      SELECT id, nama_spot AS nama, latitude, longitude, 'Komersial' AS tipe, foto_utama,
      (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) AS jarak
      FROM spots 
      WHERE status = 'approved' AND nama_spot LIKE ?
      
      UNION
      
      SELECT id, nama_lokasi AS nama, latitude, longitude, 'Alam Liar' AS tipe, foto_carousel AS foto_utama,
      (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) AS jarak
      FROM wild_spots
      WHERE nama_lokasi LIKE ?
    ) AS gabungan
    WHERE jarak <= ? 
    ORDER BY jarak ASC
  `;

  try {
    const [rows] = await pool.execute(query, params);
    return reply.send({
      status: "Success",
      total_found: rows.length,
      search_keyword: search,
      data: rows,
    });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

const getSpotDetail = async (request, reply) => {
  const { id } = request.params;
  const { tipe } = request.query; // 'liar' atau 'komersial'

  try {
    let query = "";
    if (tipe === "liar") {
      // Mengambil data dari tabel wild_spots
      query = "SELECT * FROM wild_spots WHERE id = ?";
    } else {
      // Mengambil data dari tabel spots
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
      return reply.code(404).send({ message: "Detail spot tidak ditemukan" });
    }

    const spotData = rows[0];

    // --- LOGIKA CUACA JSON BMKG (LOGIKA DARI PHP BMKG) ---
    // Default info jika data tidak tersedia
    let weatherInfo = {
      temp: "N/A",
      condition: "Pilih lokasi",
      humidity: "N/A",
      wind_speed: "N/A",
      icon: "",
    };

    // Ambil kode_wilayah (adm4) dari kolom database yang baru kamu alter
    const adm4 = spotData.kode_wilayah;

    if (adm4) {
      try {
        // Memanggil API BMKG sesuai contoh di file PHP (adm4 parameter)
        const response = await axios.get(
          `https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=${adm4}`,
          { timeout: 5000 }
        );

        // Mengambil ramalan jam pertama (index 0) dari hari pertama (index 0)
        const forecast = response.data.data[0].cuaca[0][0];

        // Memetakan parameter sesuai dokumentasi BMKG
        weatherInfo = {
          temp: `${forecast.t}°C`, // t = Suhu
          condition: forecast.weather_desc, // weather_desc = Kondisi
          humidity: `${forecast.hu}%`, // hu = Kelembapan
          wind_speed: `${forecast.ws} km/j`, // ws = Kecepatan Angin
          icon: forecast.image, // Mengambil URL icon langsung
        };
      } catch (weatherErr) {
        console.error("Gagal mengambil data BMKG:", weatherErr.message);
      }
    }

    return reply.send({
      status: "Success",
      data: {
        ...spotData,
        cuaca: weatherInfo,
      },
    });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

const createBooking = async (request, reply) => {
  const { seat_id, payment_channel_id, start_time, duration } = request.body;
  const userId = request.user.id;

  if (!seat_id || !start_time || !duration) {
    return reply.code(400).send({ message: "Data booking tidak lengkap" });
  }

  if (isNaN(duration) || duration <= 0) {
    return reply.code(400).send({ message: "Durasi tidak valid" });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1️⃣ Ambil kursi + owner + harga spot (LOCK)
    const [seatData] = await connection.execute(
      `
      SELECT 
        s.status AS seat_status,
        p.id AS spot_id,
        p.owner_id,
        p.harga_per_jam,
        p.status AS spot_status,
        p.jam_buka,
        p.jam_tutup
      FROM seats s
      JOIN spots p ON s.spot_id = p.id
      WHERE s.id = ?
      FOR UPDATE
      `,
      [seat_id]
    );

    // 2️⃣ Validasi durasi
    if (duration > 12) {
      await connection.rollback();
      return reply.code(400).send({
        message: "Durasi maksimal booking adalah 12 jam",
      });
    }

    // 3️⃣ Validasi jam operasional
    const bookingStart = new Date(start_time);
    const bookingHour = bookingStart.getHours();

    const jamBuka = parseInt(seatData[0].jam_buka.split(":")[0]);
    const jamTutup = parseInt(seatData[0].jam_tutup.split(":")[0]);

    if (bookingHour < jamBuka || bookingHour >= jamTutup) {
      await connection.rollback();
      return reply.code(400).send({
        message: "Booking di luar jam operasional spot",
      });
    }

    // ❌ Kursi tidak ada / tidak tersedia
    if (seatData.length === 0 || seatData[0].seat_status !== "Available") {
      await connection.rollback();
      return reply.code(400).send({ message: "Kursi tidak tersedia" });
    }

    // ❌ Spot belum disetujui admin
    if (seatData[0].spot_status !== "approved") {
      await connection.rollback();
      return reply.code(403).send({
        message: "Spot belum disetujui admin",
      });
    }

    // 1️⃣ Cek bentrok waktu booking
    const [overlap] = await connection.execute(
      `
      SELECT id FROM bookings
      WHERE seat_id = ?
      AND status = 'Active'
      AND (
        start_time < (? + INTERVAL ? HOUR)
        AND
        (start_time + INTERVAL duration HOUR) > ?
      )
      `,
      [seat_id, start_time, duration, start_time]
    );

    if (overlap.length > 0) {
      await connection.rollback();
      return reply.code(409).send({
        message: "Kursi sudah dibooking di waktu tersebut",
      });
    }

    // 2️⃣ HITUNG TOTAL HARGA DI SERVER (WAJIB)
    const total_harga = seatData[0].harga_per_jam * duration;

    // 3️⃣ Buat booking
    const booking_token =
      "BKG-" + Math.random().toString(36).substr(2, 9).toUpperCase();

    await connection.execute(
      `
      INSERT INTO bookings
      (user_id, seat_id, payment_channel_id, start_time, duration, total_harga, booking_token, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'Active')
      `,
      [
        userId,
        seat_id,
        payment_channel_id,
        start_time,
        duration,
        total_harga,
        booking_token,
      ]
    );

    // 4️⃣ Update kursi
    await connection.execute(
      `UPDATE seats SET status = 'Booked' WHERE id = ?`,
      [seat_id]
    );

    // 5️⃣ Tambah saldo owner
    await connection.execute(
      `
      UPDATE owner_wallets
      SET balance = balance + ?, total_earned = total_earned + ?
      WHERE owner_id = ?
      `,
      [total_harga, total_harga, seatData[0].owner_id]
    );

    await connection.commit();

    return reply.code(201).send({
      status: "Success",
      booking_token,
      total_harga,
    });
  } catch (error) {
    await connection.rollback();
    return reply.code(500).send({ error: error.message });
  } finally {
    connection.release();
  }
};

const getUserBookings = async (request, reply) => {
  const userId = request.user.id;

  try {
    const query = `
      SELECT b.*, s.nomor_kursi, p.nama_spot, p.alamat 
      FROM bookings b
      JOIN seats s ON b.seat_id = s.id
      JOIN spots p ON s.spot_id = p.id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC
    `;
    const [rows] = await pool.execute(query, [userId]);

    return reply.send({
      status: "Success",
      data: rows,
    });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

// Contoh logika yang dijalankan setiap beberapa menit
const updateExpiredBookings = async () => {
  // Ambil booking yang akan selesai
  const [finishedBookings] = await pool.execute(`
    SELECT id, user_id FROM bookings
    WHERE status = 'Active'
    AND (start_time + INTERVAL duration HOUR) < NOW()
  `);

  // Balikin kursi
  await pool.execute(`
    UPDATE seats
    SET status = 'Available'
    WHERE id IN (
      SELECT seat_id FROM bookings
      WHERE status = 'Active'
      AND (start_time + INTERVAL duration HOUR) < NOW()
    )
  `);

  // Update booking
  await pool.execute(`
    UPDATE bookings
    SET status = 'Finished'
    WHERE status = 'Active'
    AND (start_time + INTERVAL duration HOUR) < NOW()
  `);

  // Kirim notifikasi ke user
  for (const b of finishedBookings) {
    await pool.execute(
      `
      INSERT INTO notifications (user_id, title, message)
      VALUES (?, ?, ?)
      `,
      [
        b.user_id,
        "Booking Selesai",
        "Booking kamu telah selesai. Terima kasih!",
      ]
    );
  }
};

// keuangan
const getOwnerWallet = async (request, reply) => {
  const ownerId = request.user.id;

  try {
    const [wallet] = await pool.execute(
      "SELECT balance, total_earned FROM owner_wallets WHERE owner_id = ?",
      [ownerId]
    );

    if (wallet.length === 0) {
      return reply.send({ balance: 0, total_earned: 0 });
    }

    return reply.send({
      status: "Success",
      data: wallet[0],
    });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

const withdrawFunds = async (request, reply) => {
  const { amount, bank_tujuan, nomor_rekening } = request.body;
  const ownerId = request.user.id;

  if (isNaN(amount) || amount <= 0) {
    return reply.code(400).send({ message: "Jumlah tidak valid" });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [wallet] = await connection.execute(
      `SELECT balance FROM owner_wallets WHERE owner_id = ? FOR UPDATE`,
      [ownerId]
    );

    if (wallet.length === 0 || wallet[0].balance < amount) {
      await connection.rollback();
      return reply.code(400).send({ message: "Saldo tidak mencukupi" });
    }

    await connection.execute(
      `UPDATE owner_wallets SET balance = balance - ? WHERE owner_id = ?`,
      [amount, ownerId]
    );

    await connection.execute(
      `
      INSERT INTO payout_logs 
      (owner_id, amount, bank_tujuan, nomor_rekening, status)
      VALUES (?, ?, ?, ?, 'Success')
      `,
      [ownerId, amount, bank_tujuan, nomor_rekening]
    );

    await connection.commit();
    return reply.send({ message: "Penarikan berhasil" });
  } catch (err) {
    await connection.rollback();
    return reply.code(500).send({ error: err.message });
  } finally {
    connection.release();
  }
};

const getOwnerTransactions = async (request, reply) => {
  const ownerId = request.user.id;

  try {
    const query = `
      SELECT b.id, b.total_harga, b.created_at, b.booking_token, u.nama_lengkap as pembeli
      FROM bookings b
      JOIN seats s ON b.seat_id = s.id
      JOIN spots p ON s.spot_id = p.id
      JOIN users u ON b.user_id = u.id
      WHERE p.owner_id = ?
      ORDER BY b.created_at DESC
    `;
    const [rows] = await pool.execute(query, [ownerId]);
    return reply.send({ status: "Success", data: rows });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

// bagian strike feeds
const createStrikeFeed = async (request, reply) => {
  const { wild_spot_id, nama_ikan, berat, panjang, caption } = request.body;

  const userId = request.user.id;

  // ⬇️ INI DIA FOTO URL-NYA
  const fotoUrl = buildFileUrl(request, "feeds");

  try {
    if (!wild_spot_id || !nama_ikan || !fotoUrl) {
      return reply.code(400).send({
        message: "Lokasi, jenis ikan, dan foto wajib diisi!",
      });
    }

    await pool.execute(
      `INSERT INTO strike_feeds 
       (user_id, wild_spot_id, nama_ikan, berat, panjang, caption, foto_ikan) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        wild_spot_id,
        nama_ikan,
        berat,
        panjang,
        caption,
        fotoUrl, // ✅ DISIMPAN KE DB
      ]
    );

    return reply.code(201).send({
      status: "Success",
      message: "Strike berhasil diposting!",
      foto: fotoUrl,
    });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

const getStrikeFeeds = async (request, reply) => {
  try {
    const query = `
      SELECT f.*, u.nama_lengkap, w.nama_lokasi 
      FROM strike_feeds f
      JOIN users u ON f.user_id = u.id
      JOIN wild_spots w ON f.wild_spot_id = w.id
      ORDER BY f.created_at DESC
    `;
    const [rows] = await pool.execute(query);
    return reply.send({ status: "Success", data: rows });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

// reviews
const createReview = async (request, reply) => {
  const { spot_id, wild_spot_id, rating, ulasan } = request.body;
  const userId = request.user.id;

  const fotoUlasan = buildFileUrl(request, "reviews");

  if (rating < 1 || rating > 5) {
    return reply.code(400).send({ message: "Rating harus 1 - 5" });
  }
  await pool.execute(
    `INSERT INTO reviews
     (user_id, spot_id, wild_spot_id, rating, ulasan, foto_ulasan)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [userId, spot_id || null, wild_spot_id || null, rating, ulasan, fotoUlasan]
  );

  reply.code(201).send({
    status: "Success",
    foto: fotoUlasan,
  });
};

const getSpotReviews = async (request, reply) => {
  const { spot_id, type } = request.query; // type: 'komersial' atau 'liar'

  try {
    let query = `
      SELECT r.*, u.nama_lengkap, u.foto_profil 
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE 
    `;

    if (type === "komersial") {
      query += `r.spot_id = ?`;
    } else {
      query += `r.wild_spot_id = ?`;
    }

    query += ` ORDER BY r.created_at DESC`;

    const [rows] = await pool.execute(query, [spot_id]);
    return reply.send({ status: "Success", data: rows });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

// leaderboard
const getLeaderboard = async (request, reply) => {
  const { criteria } = request.query; // 'berat' atau 'panjang'

  try {
    // Kita urutkan berdasarkan kriteria yang dipilih user di UI
    const orderBy = criteria === "panjang" ? "f.panjang" : "f.berat";

    const query = `
      SELECT 
        u.nama_lengkap, 
        u.foto_profil, 
        f.nama_ikan, 
        f.berat, 
        f.panjang, 
        w.nama_lokasi as lokasi_spot,
        f.created_at
      FROM strike_feeds f
      JOIN users u ON f.user_id = u.id
      JOIN wild_spots w ON f.wild_spot_id = w.id
      ORDER BY ${orderBy} DESC
      LIMIT 10
    `;

    const [rows] = await pool.execute(query);
    return reply.send({
      status: "Success",
      data: rows,
    });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

// Admin menghapus strike feed yang melanggar aturan
const adminDeleteStrikeFeed = async (request, reply) => {
  const { id } = request.params;
  // Pastikan request.user.role === 'Admin' (dari JWT)

  try {
    await pool.execute("DELETE FROM strike_feeds WHERE id = ?", [id]);
    return reply.send({
      status: "Success",
      message: "Postingan berhasil dihapus oleh Admin.",
    });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

// Admin menghapus ulasan yang tidak pantas
const adminDeleteReview = async (request, reply) => {
  const { id } = request.params;

  try {
    await pool.execute("DELETE FROM reviews WHERE id = ?", [id]);
    return reply.send({
      status: "Success",
      message: "Ulasan berhasil dihapus oleh Admin.",
    });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

// event
const createEvent = async (request, reply) => {
  const ownerId = request.user.id;
  const {
    spot_id,
    nama_event,
    biaya_pendaftaran,
    deskripsi_event,
    hadiah,
    maks_peserta,
    batas_pendaftaran,
    tanggal_mulai,
    tanggal_selesai,
  } = request.body;

  const foto_poster = request.file?.filename || null;

  try {
    // Validasi spot
    const [spot] = await pool.execute(
      'SELECT id FROM spots WHERE id = ? AND owner_id = ? AND status = "approved"',
      [spot_id, ownerId]
    );

    if (spot.length === 0) {
      return reply.code(403).send({ message: "Spot tidak valid" });
    }

    await pool.execute(
      `INSERT INTO events 
      (spot_id, nama_event, biaya_pendaftaran, deskripsi_event, hadiah, foto_poster,
       maks_peserta, batas_pendaftaran, tanggal_mulai, tanggal_selesai, status_persetujuan)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')`,
      [
        spot_id,
        nama_event,
        biaya_pendaftaran,
        deskripsi_event,
        hadiah,
        foto_poster,
        maks_peserta,
        batas_pendaftaran,
        tanggal_mulai,
        tanggal_selesai,
      ]
    );

    return reply.send({
      status: "Success",
      message: "Event berhasil dibuat dan menunggu persetujuan admin",
    });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

const getApprovedEvents = async (request, reply) => {
  try {
    const [events] = await pool.execute(
      `
      SELECT 
        e.*,
        s.nama_spot,
        CASE
          WHEN NOW() < e.batas_pendaftaran THEN 'Pendaftaran Dibuka'
          WHEN NOW() BETWEEN e.tanggal_mulai AND e.tanggal_selesai THEN 'Sedang Berlangsung'
          ELSE 'Selesai'
        END AS status_event,
        CASE
          WHEN NOW() < e.batas_pendaftaran THEN 1
          ELSE 0
        END AS bisa_daftar
      FROM events e
      JOIN spots s ON e.spot_id = s.id
      WHERE 
        e.status_persetujuan = 'Approved'
        AND NOW() <= DATE_ADD(e.tanggal_selesai, INTERVAL 1 DAY)
      `
    );

    return reply.send({
      status: "Success",
      data: events,
    });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

const registerEvent = async (request, reply) => {
  const { event_id, payment_channel_id } = request.body;
  const user_id = request.user.id;

  try {
    const [[event]] = await pool.execute(
      "SELECT nama_event, maks_peserta FROM events WHERE id = ?",
      [event_id]
    );
    const [[current]] = await pool.execute(
      "SELECT COUNT(*) as total FROM event_registrations WHERE event_id = ?",
      [event_id]
    );

    const [[exist]] = await pool.execute(
      "SELECT id FROM event_registrations WHERE user_id = ? AND event_id = ?",
      [user_id, event_id]
    );

    if (exist) {
      return reply.code(409).send({
        message: "Kamu sudah terdaftar di event ini",
      });
    }

    if (current.total >= event.maks_peserta) {
      return reply
        .code(400)
        .send({ message: "Maaf, kuota lomba sudah penuh!" });
    }

    if (new Date() > new Date(event.batas_pendaftaran)) {
      return reply.code(400).send({
        message: "Pendaftaran event sudah ditutup",
      });
    }

    const ticket_code = `EVT-${Date.now()}`;
    await pool.execute(
      `INSERT INTO event_registrations (user_id, event_id, payment_channel_id, status_pembayaran, ticket_code) 
       VALUES (?, ?, ?, 'Paid', ?)`,
      [user_id, event_id, payment_channel_id, ticket_code]
    );

    // --- TAMBAHKAN KODE NOTIFIKASI DI SINI ---
    await pool.execute(
      "INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)",
      [
        user_id,
        "Pendaftaran Berhasil",
        `Selamat! Kamu terdaftar di event ${event.nama_event}. Kode Tiket: ${ticket_code}`,
      ]
    );

    return reply.send({ status: "Success", ticket_code });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

// Fungsi untuk mengambil daftar notifikasi milik user
const getNotifications = async (request, reply) => {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC",
      [request.user.id]
    );
    return reply.send({ status: "Success", data: rows });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

// Fungsi untuk menandai notifikasi sudah dibaca (opsional)
const markNotificationRead = async (request, reply) => {
  const { id } = request.params;
  try {
    await pool.execute("UPDATE notifications SET is_read = 1 WHERE id = ?", [
      id,
    ]);
    return reply.send({ status: "Success", message: "Notifikasi dibaca" });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

// Fungsi untuk mengambil daftar fasilitas yang tersedia
const getMasterFacilities = async (request, reply) => {
  try {
    const [rows] = await pool.execute(
      "SELECT id, nama_fasilitas, ikon FROM master_fasilitas"
    );
    return reply.send({
      status: "Success",
      data: rows,
    });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

// Fungsi untuk mengambil daftar ikan untuk pilihan di Strike Feed
const getFishMaster = async (request, reply) => {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM fish_master ORDER BY nama_ikan ASC"
    );
    return reply.send({
      status: "Success",
      data: rows,
    });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

// Update exports paling bawah
module.exports = {
  createPond,
  updatePond,
  approveSpot,
  getAdminPonds,
  createWildSpot,
  getAllMapSpots,
  getSpotDetail,
  getSpotSeats,
  createBooking,
  getUserBookings,
  getOwnerWallet,
  withdrawFunds,
  getOwnerTransactions,
  createStrikeFeed,
  getStrikeFeeds,
  createReview,
  getSpotReviews,
  getLeaderboard,
  adminDeleteStrikeFeed,
  adminDeleteReview,
  registerEvent,
  updateExpiredBookings,
  getNotifications,
  markNotificationRead,
  getMasterFacilities,
  getFishMaster,
  updateWildSpot,
  deleteWildSpot,
  approveDeletePond,
  requestDeletePond,
  isNumber,
  createEvent,
  getApprovedEvents,
};
