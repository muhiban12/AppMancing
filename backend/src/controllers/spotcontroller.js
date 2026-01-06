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

module.exports = {
    getSpotSeats,
    createPond,
    updatePond,
    requestDeletePond
};