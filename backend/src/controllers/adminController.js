const pool = require("../config/db");
const { buildFileUrl } = require("./helper/file.helper");

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

const getFeedReports = async (request, reply) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        fr.id,
        fr.reason,
        fr.status,
        fr.created_at,
        u.nama_lengkap AS reporter,
        sf.caption
      FROM feed_reports fr
      JOIN users u ON fr.reporter_id = u.id
      JOIN strike_feeds sf ON fr.feed_id = sf.id
      ORDER BY fr.created_at DESC
    `);

    return reply.send({
      status: 'Success',
      data: rows
    });

  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

const resolveFeedReport = async (request, reply) => {
  const { id } = request.params;
  const { action } = request.body;
  // action: 'delete' | 'ignore'

  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const [[report]] = await conn.execute(
      'SELECT feed_id FROM feed_reports WHERE id = ?',
      [id]
    );

    if (!report) {
      await conn.rollback();
      return reply.code(404).send({ message: 'Laporan tidak ditemukan' });
    }

    if (action === 'delete') {
      await conn.execute(
        'DELETE FROM strike_feeds WHERE id = ?',
        [report.feed_id]
      );
    }

    await conn.execute(
      'UPDATE feed_reports SET status = ? WHERE id = ?',
      ['reviewed', id]
    );

    await conn.commit();

    return reply.send({
      status: 'Success',
      message: 'Laporan berhasil diproses'
    });

  } catch (error) {
    await conn.rollback();
    return reply.code(500).send({ error: error.message });
  } finally {
    conn.release();
  }
};

const getPendingEvents = async (request, reply) => {
  try {
    const [events] = await pool.execute(`
      SELECT 
        e.*,
        s.nama_spot,
        s.alamat,
        u.nama_lengkap as owner_name,
        u.email as owner_email,
        u.nomer_wa as owner_wa,
        DATE_FORMAT(e.tanggal_mulai, '%a, %d %b %Y • %H:%i') as formatted_start,
        DATE_FORMAT(e.tanggal_selesai, '%a, %d %b %Y • %H:%i') as formatted_end,
        (SELECT COUNT(*) FROM event_registrations er WHERE er.event_id = e.id) as total_registrants
      FROM events e
      JOIN spots s ON e.spot_id = s.id
      JOIN users u ON s.owner_id = u.id
      WHERE e.status_persetujuan = 'Pending'
      ORDER BY e.created_at DESC
    `);

    return reply.send({
      status: "Success",
      data: events,
    });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

const approveEvent = async (request, reply) => {
  const { event_id } = request.params;
  const { decision, rejection_reason } = request.body; // decision: 'Approved' | 'Rejected'

  if (!['Approved', 'Rejected'].includes(decision)) {
    return reply.code(400).send({ message: 'Decision tidak valid' });
  }

  const conn = await pool.getConnection();
  
  try {
    await conn.beginTransaction();

    // Cek apakah event masih pending
    const [[event]] = await conn.execute(
      `SELECT e.*, s.owner_id, u.nama_lengkap as owner_name, u.email 
       FROM events e
       JOIN spots s ON e.spot_id = s.id
       JOIN users u ON s.owner_id = u.id
       WHERE e.id = ? AND e.status_persetujuan = 'Pending'`,
      [event_id]
    );

    if (!event) {
      await conn.rollback();
      return reply.code(404).send({ 
        message: 'Event tidak ditemukan atau sudah diproses' 
      });
    }

    // Update status event
    await conn.execute(
      `UPDATE events 
       SET status_persetujuan = ?, 
           admin_action_at = NOW(),
           rejection_reason = ?
       WHERE id = ?`,
      [decision, rejection_reason || null, event_id]
    );

    // Kirim notifikasi ke owner
    let notificationTitle, notificationMessage;
    
    if (decision === 'Approved') {
      notificationTitle = 'Event Disetujui!';
      notificationMessage = `Event "${event.nama_event}" telah disetujui oleh admin dan sekarang aktif.`;
    } else {
      notificationTitle = 'Event Ditolak';
      notificationMessage = `Event "${event.nama_event}" ditolak oleh admin.${rejection_reason ? ` Alasan: ${rejection_reason}` : ''}`;
    }

    await conn.execute(
      `INSERT INTO notifications (user_id, title, message) 
       VALUES (?, ?, ?)`,
      [event.owner_id, notificationTitle, notificationMessage]
    );

    await conn.commit();

    return reply.send({
      status: "Success",
      message: `Event berhasil di-${decision.toLowerCase()}`
    });

  } catch (error) {
    await conn.rollback();
    return reply.code(500).send({ error: error.message });
  } finally {
    conn.release();
  }
};

const deleteEvent = async (request, reply) => {
  const { event_id } = request.params;
  const { reason } = request.body;

  const conn = await pool.getConnection();
  
  try {
    await conn.beginTransaction();

    // Ambil info event
    const [[event]] = await conn.execute(
      `SELECT e.*, s.owner_id 
       FROM events e
       JOIN spots s ON e.spot_id = s.id
       WHERE e.id = ?`,
      [event_id]
    );

    if (!event) {
      await conn.rollback();
      return reply.code(404).send({ 
        message: 'Event tidak ditemukan' 
      });
    }

    // Hapus semua registrations terlebih dahulu (karena foreign key)
    await conn.execute(
      `DELETE FROM event_registrations WHERE event_id = ?`,
      [event_id]
    );

    // Hapus event
    await conn.execute(
      `DELETE FROM events WHERE id = ?`,
      [event_id]
    );

    // Kirim notifikasi ke owner dan semua yang terdaftar
    const notificationMessage = reason 
      ? `Event "${event.nama_event}" telah dihapus oleh admin. Alasan: ${reason}`
      : `Event "${event.nama_event}" telah dihapus oleh admin.`;

    // Notify owner
    await conn.execute(
      `INSERT INTO notifications (user_id, title, message) 
       VALUES (?, ?, ?)`,
      [event.owner_id, 'Event Dihapus', notificationMessage]
    );

    // Notify all registered users
    const [registrants] = await conn.execute(
      `SELECT DISTINCT user_id FROM event_registrations WHERE event_id = ?`,
      [event_id]
    );

    for (const registrant of registrants) {
      await conn.execute(
        `INSERT INTO notifications (user_id, title, message) 
         VALUES (?, ?, ?)`,
        [registrant.user_id, 'Event Dibatalkan', `Event "${event.nama_event}" yang Anda daftari telah dibatalkan.`]
      );
    }

    await conn.commit();

    return reply.send({
      status: "Success",
      message: "Event berhasil dihapus"
    });

  } catch (error) {
    await conn.rollback();
    return reply.code(500).send({ error: error.message });
  } finally {
    conn.release();
  }
};

const getEventDetailForAdmin = async (request, reply) => {
  const { event_id } = request.params;

  try {
    const [events] = await pool.execute(`
      SELECT 
        e.*,
        s.nama_spot,
        s.alamat,
        s.foto_utama as spot_foto,
        u.nama_lengkap as owner_name,
        u.email as owner_email,
        u.nomer_wa as owner_wa,
        DATE_FORMAT(e.tanggal_mulai, '%a, %d %b %Y • %H:%i') as formatted_start,
        DATE_FORMAT(e.tanggal_selesai, '%a, %d %b %Y • %H:%i') as formatted_end,
        DATE_FORMAT(e.batas_pendaftaran, '%a, %d %b %Y • %H:%i') as formatted_registration_deadline,
        (SELECT COUNT(*) FROM event_registrations er WHERE er.event_id = e.id) as total_registrants,
        GROUP_CONCAT(DISTINCT er.user_id) as registrant_ids
      FROM events e
      JOIN spots s ON e.spot_id = s.id
      JOIN users u ON s.owner_id = u.id
      LEFT JOIN event_registrations er ON e.id = er.event_id
      WHERE e.id = ?
      GROUP BY e.id
    `, [event_id]);

    if (events.length === 0) {
      return reply.code(404).send({ 
        message: 'Event tidak ditemukan' 
      });
    }

    const event = events[0];
    
    // Parse hadiah dari JSON
    let hadiahArray = [];
    if (event.hadiah) {
      try {
        hadiahArray = JSON.parse(event.hadiah);
      } catch (err) {
        hadiahArray = [];
      }
    }

    // Ambil daftar peserta
    const [participants] = await pool.execute(`
      SELECT 
        er.*,
        u.nama_lengkap,
        u.email,
        u.nomer_wa,
        DATE_FORMAT(er.registration_date, '%d %b %Y %H:%i') as formatted_registration_date
      FROM event_registrations er
      JOIN users u ON er.user_id = u.id
      WHERE er.event_id = ?
      ORDER BY er.registration_date DESC
    `, [event_id]);

    const responseData = {
      ...event,
      hadiah: hadiahArray,
      participants: participants,
      kuota_tersisa: Math.max(0, event.maks_peserta - event.total_registrants),
      status_event: event.status_persetujuan === 'Pending' ? 'Menunggu Approval' : 
                    event.status_persetujuan === 'Approved' ? 'Aktif' : 'Ditolak'
    };

    return reply.send({
      status: "Success",
      data: responseData,
    });

  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};



module.exports = {
    getAdminPonds,
    approveDeletePond,
    approveSpot,
    createWildSpot,
    updateWildSpot,
    deleteWildSpot,
    adminDeleteReview,
    adminDeleteStrikeFeed,
    getFeedReports,
    resolveFeedReport,
    getPendingEvents,
    approveEvent,
    deleteEvent,
    getEventDetailForAdmin
};