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

module.exports = {
    createEvent,
    registerEvent,
    getApprovedEvents
};