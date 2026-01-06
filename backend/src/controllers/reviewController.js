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

module.exports = {
    createReview,
    getSpotReviews
};