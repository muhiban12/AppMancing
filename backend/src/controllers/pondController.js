const pool = require('../config/db');
const axios = require('axios');

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
  // Ambil koordinat GPS user dan radius maksimal dari Frontend
  const { user_lat, user_lon, radius_km = 10 } = request.query;

  if (!user_lat || !user_lon) {
    return reply.code(400).send({ message: 'Koordinat lokasi kamu diperlukan untuk melihat spot terdekat.' });
  }

  // Parameter untuk rumus Haversine (Latitude, Longitude, Latitude)
  const params = [user_lat, user_lon, user_lat, user_lat, user_lon, user_lat];

  // Query UNION untuk mencari spot komersil & liar yang masuk radius
  const query = `
    SELECT * FROM (
      SELECT id, nama_spot AS nama, latitude, longitude, 'Komersial' AS tipe, foto_utama,
      (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) AS jarak
      FROM spots WHERE status = 'approved'
      
      UNION
      
      SELECT id, nama_lokasi AS nama, latitude, longitude, 'Alam Liar' AS tipe, foto_carousel AS foto_utama,
      (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) AS jarak
      FROM wild_spots
    ) AS gabungan
    WHERE jarak <= ? 
    ORDER BY jarak ASC
  `;

  // Tambahkan radius_km ke dalam parameter query
  params.push(radius_km);

  try {
    const [rows] = await pool.execute(query, params);
    return reply.send({
      status: 'Success',
      total_found: rows.length,
      data: rows
    });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

const getSpotDetail = async (request, reply) => {
  const { id } = request.params;
  const { tipe } = request.query;

  try {
    let query = '';
    if (tipe === 'liar') {
      query = 'SELECT * FROM wild_spots WHERE id = ?';
    } else {
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

    const spotData = rows[0];

    // --- LOGIKA CUACA DIMULAI DI SINI ---
    let weatherInfo = null;
    try {
      // Ambil API KEY dari OpenWeatherMap (Gratis)
      const apiKey = 'MASUKKAN_API_KEY_KAMU_DISINI'; 
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${spotData.latitude}&lon=${spotData.longitude}&appid=${apiKey}&units=metric&lang=id`;
      
      const response = await axios.get(weatherUrl);
      
      weatherInfo = {
        temp: response.data.main.temp,
        condition: response.data.weather[0].description,
        icon: `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
      };
    } catch (weatherErr) {
      console.error("Gagal fetch cuaca:", weatherErr.message);
      // Biarkan null jika gagal, agar aplikasi tidak crash
    }
    // --- LOGIKA CUACA SELESAI ---

    return reply.send({
      status: 'Success',
      data: {
        ...spotData,
        cuaca: weatherInfo // Ini yang akan kamu panggil di UI Figma
      }
    });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

const createBooking = async (request, reply) => {
  const { seat_id, payment_channel_id, start_time, duration, total_harga } = request.body;
  const userId = request.user.id;

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Ambil info kursi dan ID Owner-nya
    const [seatInfo] = await connection.execute(`
      SELECT s.status, p.owner_id 
      FROM seats s 
      JOIN spots p ON s.spot_id = p.id 
      WHERE s.id = ? FOR UPDATE`, [seat_id]);
    
    if (seatInfo.length === 0 || seatInfo[0].status !== 'Available') {
      await connection.rollback();
      return reply.code(400).send({ message: 'Kursi tidak tersedia.' });
    }

    const ownerId = seatInfo[0].owner_id;

    // 2. Masukkan data ke tabel bookings
    const booking_token = 'BKG-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    await connection.execute(
      'INSERT INTO bookings (user_id, seat_id, payment_channel_id, start_time, duration, total_harga, booking_token, status_pembayaran) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, seat_id, payment_channel_id, start_time, duration, total_harga, booking_token, 'Paid'] // Langsung 'Paid'
    );

    // 3. Update status kursi jadi 'Booked'
    await connection.execute('UPDATE seats SET status = "Booked" WHERE id = ?', [seat_id]);

    // 4. Update Saldo Owner (Sesuai Tabel owner_wallets)
    // Cek apakah owner sudah punya wallet, jika belum bisa dibuat otomatis (optional)
    await connection.execute(`
      UPDATE owner_wallets 
      SET balance = balance + ?, total_earned = total_earned + ? 
      WHERE owner_id = ?`, 
      [total_harga, total_harga, ownerId]
    );

    await connection.commit();
    return reply.code(201).send({ status: 'Success', message: 'Booking sukses & Saldo Owner bertambah!', booking_token });
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
      status: 'Success',
      data: rows
    });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

// Contoh logika yang dijalankan setiap beberapa menit
const updateExpiredBookings = async () => {
  const query = `
    UPDATE seats 
    SET status = 'Available' 
    WHERE id IN (
      SELECT seat_id FROM bookings 
      WHERE (start_time + INTERVAL duration HOUR) < NOW() 
      AND status_pembayaran = 'Paid'
    )
  `;
  await pool.execute(query);
};

// keuangan
const getOwnerWallet = async (request, reply) => {
  const ownerId = request.user.id;

  try {
    const [wallet] = await pool.execute(
      'SELECT balance, total_earned FROM owner_wallets WHERE owner_id = ?',
      [ownerId]
    );

    if (wallet.length === 0) {
      return reply.send({ balance: 0, total_earned: 0 });
    }

    return reply.send({
      status: 'Success',
      data: wallet[0]
    });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

const withdrawFunds = async (request, reply) => {
  const { amount, bank_tujuan, nomor_rekening } = request.body;
  const ownerId = request.user.id;

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Cek apakah saldo cukup
    const [wallet] = await connection.execute(
      'SELECT balance FROM owner_wallets WHERE owner_id = ? FOR UPDATE',
      [ownerId]
    );

    if (wallet.length === 0 || wallet[0].balance < amount) {
      await connection.rollback();
      return reply.code(400).send({ message: 'Saldo tidak mencukupi.' });
    }

    // 2. Kurangi saldo Owner
    await connection.execute(
      'UPDATE owner_wallets SET balance = balance - ? WHERE owner_id = ?',
      [amount, ownerId]
    );

    // 3. Catat ke payout_logs (status langsung Success sesuai permintaanmu)
    await connection.execute(
      'INSERT INTO payout_logs (owner_id, amount, bank_tujuan, nomor_rekening, status) VALUES (?, ?, ?, ?, ?)',
      [ownerId, amount, bank_tujuan, nomor_rekening, 'Success']
    );

    await connection.commit();
    return reply.send({ status: 'Success', message: 'Penarikan dana berhasil diproses!' });
  } catch (error) {
    await connection.rollback();
    return reply.code(500).send({ error: error.message });
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
    return reply.send({ status: 'Success', data: rows });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

// bagian strike feeds
const createStrikeFeed = async (request, reply) => {
  const { wild_spot_id, nama_ikan, berat, panjang, caption, foto_ikan } = request.body; 
  const userId = request.user.id;

  try {
    const query = `
      INSERT INTO strike_feeds (user_id, wild_spot_id, nama_ikan, berat, panjang, caption, foto_ikan) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    await pool.execute(query, [userId, wild_spot_id, nama_ikan, berat, panjang, caption, foto_ikan]);

    return reply.code(201).send({ 
      status: 'Success', 
      message: 'Postingan strike liar berhasil diunggah!' 
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
    return reply.send({ status: 'Success', data: rows });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

// reviews
const createReview = async (request, reply) => {
  const { spot_id, wild_spot_id, rating, ulasan, foto_ulasan } = request.body;
  const userId = request.user.id;

  try {
    const query = `
      INSERT INTO reviews (user_id, spot_id, wild_spot_id, rating, ulasan, foto_ulasan) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await pool.execute(query, [
      userId, 
      spot_id || null, 
      wild_spot_id || null, 
      rating, 
      ulasan, 
      foto_ulasan
    ]);

    return reply.code(201).send({ 
      status: 'Success', 
      message: 'Terima kasih! Ulasan kamu telah dipublikasikan.' 
    });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
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
    
    if (type === 'komersial') {
      query += `r.spot_id = ?`;
    } else {
      query += `r.wild_spot_id = ?`;
    }
    
    query += ` ORDER BY r.created_at DESC`;

    const [rows] = await pool.execute(query, [spot_id]);
    return reply.send({ status: 'Success', data: rows });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

// leaderboard
const getLeaderboard = async (request, reply) => {
  const { criteria } = request.query; // 'berat' atau 'panjang'

  try {
    // Kita urutkan berdasarkan kriteria yang dipilih user di UI
    const orderBy = criteria === 'panjang' ? 'f.panjang' : 'f.berat';
    
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
      status: 'Success',
      data: rows
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
    await pool.execute('DELETE FROM strike_feeds WHERE id = ?', [id]);
    return reply.send({ status: 'Success', message: 'Postingan berhasil dihapus oleh Admin.' });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

// Admin menghapus ulasan yang tidak pantas
const adminDeleteReview = async (request, reply) => {
  const { id } = request.params;
  
  try {
    await pool.execute('DELETE FROM reviews WHERE id = ?', [id]);
    return reply.send({ status: 'Success', message: 'Ulasan berhasil dihapus oleh Admin.' });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

// event
const registerEvent = async (request, reply) => {
  const { event_id, payment_channel_id } = request.body;
  const user_id = request.user.id;

  try {
    const [[event]] = await pool.execute('SELECT nama_event, maks_peserta FROM events WHERE id = ?', [event_id]);
    const [[current]] = await pool.execute('SELECT COUNT(*) as total FROM event_registrations WHERE event_id = ?', [event_id]);

    if (current.total >= event.maks_peserta) {
      return reply.code(400).send({ message: 'Maaf, kuota lomba sudah penuh!' });
    }

    const ticket_code = `EVT-${Date.now()}`;
    await pool.execute(
      `INSERT INTO event_registrations (user_id, event_id, payment_channel_id, status_pembayaran, ticket_code) 
       VALUES (?, ?, ?, 'Paid', ?)`,
      [user_id, event_id, payment_channel_id, ticket_code]
    );

    // --- TAMBAHKAN KODE NOTIFIKASI DI SINI ---
    await pool.execute(
      'INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)',
      [user_id, 'Pendaftaran Berhasil', `Selamat! Kamu terdaftar di event ${event.nama_event}. Kode Tiket: ${ticket_code}`]
    );

    return reply.send({ status: 'Success', ticket_code });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

// Fungsi untuk mengambil daftar notifikasi milik user
const getNotifications = async (request, reply) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC', 
      [request.user.id]
    );
    return reply.send({ status: 'Success', data: rows });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

// Fungsi untuk menandai notifikasi sudah dibaca (opsional)
const markNotificationRead = async (request, reply) => {
  const { id } = request.params;
  try {
    await pool.execute('UPDATE notifications SET is_read = 1 WHERE id = ?', [id]);
    return reply.send({ status: 'Success', message: 'Notifikasi dibaca' });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

// Update exports paling bawah
module.exports = { getAllPonds, createPond, updatePond, deletePond, approveSpot,
   getAdminPonds, createWildSpot, getAllMapSpots, getSpotDetail, getSpotSeats, createBooking,
   getUserBookings, getOwnerWallet, withdrawFunds, getOwnerTransactions, createStrikeFeed, getStrikeFeeds,
   createReview, getSpotReviews, getLeaderboard, adminDeleteStrikeFeed, adminDeleteReview, registerEvent,
   updateExpiredBookings, getNotifications, markNotificationRead};