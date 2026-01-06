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
    resolveFeedReport
};