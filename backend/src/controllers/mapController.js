const pool = require("../config/db");
const { isNumber } = require("./helper/validation.helper");
const axios = require("axios");

/* ================= GET ALL MAP SPOTS ================= */
const getAllMapSpots = async (request, reply) => {
  const { user_lat, user_lon, radius_km = 10, search = "", tipe = "all" } = request.query;

  // Validasi koordinat jika disediakan
  if (user_lat && user_lon) {
    if (!isNumber(user_lat) || !isNumber(user_lon)) {
      return reply.code(400).send({
        message: "Koordinat lokasi tidak valid",
      });
    }

    if (!isNumber(radius_km) || radius_km <= 0) {
      return reply.code(400).send({
        message: "Radius harus berupa angka positif",
      });
    }
  }

  const searchPattern = `%${search}%`;

  try {
    let commercialQuery = "";
    let wildQuery = "";
    let params = [];

    // Query untuk spots komersial
    if (tipe === "all" || tipe === "komersial") {
      commercialQuery = `
        SELECT 
          id, 
          nama_spot AS nama, 
          latitude, 
          longitude, 
          'Komersial' AS tipe, 
          foto_utama,
          harga_per_jam,
          alamat,
          COALESCE(
            (SELECT AVG(rating) FROM reviews WHERE spot_id = spots.id),
            0
          ) as avg_rating
      `;

      if (user_lat && user_lon) {
        commercialQuery += `,
          (6371 * acos(
            cos(radians(?)) * cos(radians(latitude)) *
            cos(radians(longitude) - radians(?)) +
            sin(radians(?)) * sin(radians(latitude))
          )) AS jarak
        `;
        params.push(user_lat, user_lon, user_lat);
      } else {
        commercialQuery += `, NULL AS jarak`;
      }

      commercialQuery += `
        FROM spots 
        WHERE status = 'approved' 
      `;

      if (search) {
        commercialQuery += ` AND (nama_spot LIKE ? OR alamat LIKE ?)`;
        params.push(searchPattern, searchPattern);
      }
    }

    // Query untuk wild spots
    if (tipe === "all" || tipe === "liar") {
      if (commercialQuery) commercialQuery += " UNION ";

      wildQuery = `
        SELECT 
          id, 
          nama_lokasi AS nama, 
          latitude, 
          longitude, 
          'Alam Liar' AS tipe, 
          foto_carousel AS foto_utama,
          NULL as harga_per_jam,
          kabupaten_provinsi as alamat,
          COALESCE(
            (SELECT AVG(rating) FROM reviews WHERE wild_spot_id = wild_spots.id),
            0
          ) as avg_rating
      `;

      if (user_lat && user_lon) {
        wildQuery += `,
          (6371 * acos(
            cos(radians(?)) * cos(radians(latitude)) *
            cos(radians(longitude) - radians(?)) +
            sin(radians(?)) * sin(radians(latitude))
          )) AS jarak
        `;
        params.push(user_lat, user_lon, user_lat);
      } else {
        wildQuery += `, NULL AS jarak`;
      }

      wildQuery += `
        FROM wild_spots
        WHERE 1=1
      `;

      if (search) {
        wildQuery += ` AND (nama_lokasi LIKE ? OR kabupaten_provinsi LIKE ?)`;
        params.push(searchPattern, searchPattern);
      }
    }

    const fullQuery = commercialQuery + (wildQuery ? wildQuery : "");
    
    // Tambahkan filter jarak jika ada
    let finalQuery = "";
    if (user_lat && user_lon) {
      finalQuery = `
        SELECT * FROM (${fullQuery}) AS semua_spots
        WHERE jarak <= ?
        ORDER BY jarak ASC, avg_rating DESC
      `;
      params.push(radius_km);
    } else {
      finalQuery = `
        SELECT * FROM (${fullQuery}) AS semua_spots
        ORDER BY avg_rating DESC, nama ASC
      `;
    }

    const [rows] = await pool.execute(finalQuery, params);

    // Format response
    const formattedSpots = rows.map(spot => ({
      id: spot.id,
      nama: spot.nama,
      latitude: parseFloat(spot.latitude),
      longitude: parseFloat(spot.longitude),
      tipe: spot.tipe,
      foto_utama: spot.foto_utama,
      harga_per_jam: spot.harga_per_jam,
      alamat: spot.alamat,
      rating: parseFloat(spot.avg_rating.toFixed(1)),
      jarak_km: spot.jarak ? parseFloat(spot.jarak.toFixed(1)) : null
    }));

    return reply.send({
      status: "Success",
      total_found: rows.length,
      filters: {
        tipe,
        search_keyword: search,
        radius_km: user_lat && user_lon ? radius_km : null,
        user_location: user_lat && user_lon ? {
          lat: parseFloat(user_lat),
          lon: parseFloat(user_lon)
        } : null
      },
      data: formattedSpots,
    });
  } catch (error) {
    console.error("Get all map spots error:", error);
    return reply.code(500).send({ 
      error: "Internal server error",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/* ================= SPOT DETAIL ================= */
const getSpotDetail = async (request, reply) => {
  const { id } = request.params;
  const { tipe = "komersial" } = request.query;

  try {
    let spotData;
    let query = "";

    if (tipe === "liar") {
      // Detail wild spot
      query = `
        SELECT 
          ws.*,
          u.nama_lengkap as admin_name,
          COALESCE(
            (SELECT AVG(rating) FROM reviews WHERE wild_spot_id = ws.id),
            0
          ) as avg_rating,
          COALESCE(
            (SELECT COUNT(id) FROM reviews WHERE wild_spot_id = ws.id),
            0
          ) as total_reviews
        FROM wild_spots ws
        LEFT JOIN users u ON ws.admin_id = u.id
        WHERE ws.id = ?
      `;
      
      const [rows] = await pool.execute(query, [id]);
      
      if (rows.length === 0) {
        return reply.code(404).send({
          message: "Detail spot liar tidak ditemukan",
        });
      }

      spotData = rows[0];

      // Ambil accessibility info
      const [accessibility] = await pool.execute(
        "SELECT * FROM wild_spot_accessibility WHERE wild_spot_id = ?",
        [id]
      );
      
      spotData.accessibility = accessibility;

    } else {
      // Detail commercial spot
      query = `
        SELECT 
          s.*,
          u.nama_lengkap as owner_name,
          u.nomer_wa as owner_wa,
          COALESCE(
            (SELECT AVG(rating) FROM reviews WHERE spot_id = s.id),
            0
          ) as avg_rating,
          COALESCE(
            (SELECT COUNT(id) FROM reviews WHERE spot_id = s.id),
            0
          ) as total_reviews,
          GROUP_CONCAT(DISTINCT mf.nama_fasilitas) AS fasilitas,
          GROUP_CONCAT(DISTINCT mf.ikon) AS fasilitas_ikon,
          (SELECT COUNT(*) FROM seats se WHERE se.spot_id = s.id AND se.status = 'Available') as kursi_tersedia
        FROM spots s
        LEFT JOIN users u ON s.owner_id = u.id
        LEFT JOIN spot_facilities sf ON s.id = sf.spot_id
        LEFT JOIN master_fasilitas mf ON sf.fasilitas_id = mf.id
        WHERE s.id = ? AND s.status = 'approved'
        GROUP BY s.id
      `;

      const [rows] = await pool.execute(query, [id]);

      if (rows.length === 0) {
        return reply.code(404).send({
          message: "Detail spot tidak ditemukan",
        });
      }

      spotData = rows[0];
      
      // Parse fasilitas
      if (spotData.fasilitas) {
        const fasilitasList = spotData.fasilitas.split(',');
        const ikonList = spotData.fasilitas_ikon ? spotData.fasilitas_ikon.split(',') : [];
        spotData.fasilitas_detail = fasilitasList.map((nama, index) => ({
          nama,
          ikon: ikonList[index] || 'help'
        }));
      }
    }

    // Ambil cuaca jika ada kode wilayah
    let weatherInfo = {
      temp: "N/A",
      condition: "Pilih lokasi",
      humidity: "N/A",
      wind_speed: "N/A",
      icon: "",
    };

    if (spotData.kode_wilayah) {
      try {
        const response = await axios.get(
          `https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=${spotData.kode_wilayah}`,
          { timeout: 5000 }
        );

        if (response.data.data && response.data.data[0]) {
          const forecast = response.data.data[0].cuaca[0][0];
          weatherInfo = {
            temp: `${forecast.t}°C`,
            condition: forecast.weather_desc,
            humidity: `${forecast.hu}%`,
            wind_speed: `${forecast.ws} km/j`,
            icon: forecast.image,
            updated_at: new Date().toISOString()
          };
        }
      } catch (err) {
        console.error("BMKG API error:", err.message);
        // Tetap lanjut tanpa cuaca
      }
    }

    // Ambil spot photos jika ada
    let spotPhotos = [];
    if (tipe === "komersial") {
      const [photos] = await pool.execute(
        "SELECT * FROM spot_photos WHERE spot_id = ? ORDER BY id",
        [id]
      );
      spotPhotos = photos;
    }

    // Ambil reviews terbaru
    const reviewTable = tipe === "liar" ? "wild_spot_id" : "spot_id";
    const [recentReviews] = await pool.execute(
      `
      SELECT r.*, u.nama_lengkap, u.foto_profil 
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.${reviewTable} = ?
      ORDER BY r.created_at DESC
      LIMIT 5
      `,
      [id]
    );

    // Format final response
    const responseData = {
      ...spotData,
      cuaca: weatherInfo,
      photos: spotPhotos,
      recent_reviews: recentReviews,
      rating_summary: {
        average: parseFloat(spotData.avg_rating.toFixed(1)),
        total: spotData.total_reviews,
        formatted: spotData.total_reviews > 0 
          ? `${spotData.avg_rating.toFixed(1)} (${spotData.total_reviews})`
          : "Belum ada rating"
      }
    };

    // Hapus field yang tidak perlu
    delete responseData.fasilitas;
    delete responseData.fasilitas_ikon;

    return reply.send({
      status: "Success",
      data: responseData,
    });
  } catch (error) {
    console.error("Get spot detail error:", error);
    return reply.code(500).send({ 
      error: "Internal server error",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/* ================= GET NEARBY SPOTS ================= */
const getNearbySpots = async (request, reply) => {
  const {
    user_lat,
    user_lon,
    radius_km = 5,
    limit = 10,
    tipe = "komersial"
  } = request.query;

  if (!user_lat || !user_lon) {
    return reply.code(400).send({
      message: "Koordinat user (user_lat, user_lon) diperlukan"
    });
  }

  if (!isNumber(user_lat) || !isNumber(user_lon)) {
    return reply.code(400).send({
      message: "Koordinat tidak valid"
    });
  }

  try {
    const table = tipe === "liar" ? "wild_spots" : "spots";
    const nameField = tipe === "liar" ? "nama_lokasi" : "nama_spot";
    const fotoField = tipe === "liar" ? "foto_carousel" : "foto_utama";
    const alamatField = tipe === "liar" ? "kabupaten_provinsi" : "alamat";
    const statusCondition = tipe === "liar" ? "1=1" : "status = 'approved'";

    const [spots] = await pool.execute(
      `
      SELECT 
        id,
        ${nameField} as nama,
        ${fotoField} as foto_utama,
        ${alamatField} as alamat,
        latitude,
        longitude,
        ${tipe === "komersial" ? "harga_per_jam," : "NULL as harga_per_jam,"}
        (6371 * acos(
          cos(radians(?)) * cos(radians(latitude)) *
          cos(radians(longitude) - radians(?)) +
          sin(radians(?)) * sin(radians(latitude))
        )) as jarak_km,
        COALESCE(
          (SELECT AVG(rating) FROM reviews 
           WHERE ${tipe === "liar" ? "wild_spot_id" : "spot_id"} = ${table}.id),
          0
        ) as avg_rating,
        COALESCE(
          (SELECT COUNT(id) FROM reviews 
           WHERE ${tipe === "liar" ? "wild_spot_id" : "spot_id"} = ${table}.id),
          0
        ) as total_reviews
      FROM ${table}
      WHERE ${statusCondition}
        AND latitude IS NOT NULL 
        AND longitude IS NOT NULL
      HAVING jarak_km <= ?
      ORDER BY jarak_km ASC
      LIMIT ?
      `,
      [user_lat, user_lon, user_lat, parseFloat(radius_km), parseInt(limit)]
    );

    const formattedSpots = spots.map(spot => ({
      id: spot.id,
      nama: spot.nama,
      foto_utama: spot.foto_utama,
      alamat: spot.alamat,
      harga_per_jam: spot.harga_per_jam,
      latitude: parseFloat(spot.latitude),
      longitude: parseFloat(spot.longitude),
      jarak: {
        km: parseFloat(spot.jarak_km.toFixed(1)),
        formatted: `${spot.jarak_km.toFixed(1)} km`
      },
      rating: {
        avg: parseFloat(spot.avg_rating.toFixed(1)),
        total: spot.total_reviews,
        formatted: spot.total_reviews > 0 
          ? `${spot.avg_rating.toFixed(1)} (${spot.total_reviews})`
          : "Belum ada rating"
      }
    }));

    return reply.send({
      status: "Success",
      data: formattedSpots,
      location_info: {
        user_lat: parseFloat(user_lat),
        user_lon: parseFloat(user_lon),
        radius_km: parseFloat(radius_km),
        tipe
      }
    });

  } catch (error) {
    console.error("Get nearby spots error:", error);
    return reply.code(500).send({ 
      error: "Internal server error",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/* ================= GET SPOT REVIEWS ================= */
const getSpotReviews = async (request, reply) => {
  const { spot_id } = request.params;
  const { tipe = "komersial", page = 1, limit = 10 } = request.query;
  const offset = (page - 1) * limit;

  try {
    const idField = tipe === "liar" ? "wild_spot_id" : "spot_id";
    
    const [reviews] = await pool.execute(
      `
      SELECT 
        r.*,
        u.nama_lengkap,
        u.foto_profil,
        DATE_FORMAT(r.created_at, '%d %b %Y %H:%i') as formatted_date
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.${idField} = ?
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?
      `,
      [spot_id, parseInt(limit), offset]
    );

    // Get total count
    const [[countResult]] = await pool.execute(
      `SELECT COUNT(*) as total FROM reviews WHERE ${idField} = ?`,
      [spot_id]
    );

    // Get rating distribution
    const [ratingDistribution] = await pool.execute(
      `
      SELECT 
        rating,
        COUNT(*) as count
      FROM reviews
      WHERE ${idField} = ?
      GROUP BY rating
      ORDER BY rating DESC
      `,
      [spot_id]
    );

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    ratingDistribution.forEach(row => {
      distribution[row.rating] = row.count;
    });

    // Get average rating
    const [[avgRating]] = await pool.execute(
      `SELECT AVG(rating) as avg FROM reviews WHERE ${idField} = ?`,
      [spot_id]
    );

    return reply.send({
      status: "Success",
      data: {
        reviews: reviews,
        summary: {
          total_reviews: countResult.total,
          average_rating: avgRating.avg ? parseFloat(avgRating.avg.toFixed(1)) : 0,
          rating_distribution: distribution
        },
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: countResult.total,
          total_pages: Math.ceil(countResult.total / limit)
        }
      }
    });

  } catch (error) {
    console.error("Get spot reviews error:", error);
    return reply.code(500).send({ 
      error: "Internal server error",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/* ================= GET SPOT GALLERY ================= */
const getSpotGallery = async (request, reply) => {
  const { spot_id } = request.params;
  const { tipe = "komersial" } = request.query;

  try {
    let photos = [];
    
    if (tipe === "liar") {
      // Untuk wild spots, ambil dari foto_carousel JSON
      const [wildSpot] = await pool.execute(
        "SELECT foto_carousel FROM wild_spots WHERE id = ?",
        [spot_id]
      );
      
      if (wildSpot.length > 0 && wildSpot[0].foto_carousel) {
        try {
          const carouselData = JSON.parse(wildSpot[0].foto_carousel);
          photos = carouselData.map((url, index) => ({
            id: index + 1,
            url_foto: url,
            keterangan: `Foto ${index + 1}`
          }));
        } catch (err) {
          console.error("Error parsing foto_carousel:", err);
        }
      }
    } else {
      // Untuk commercial spots, ambil dari spot_photos
      const [rows] = await pool.execute(
        "SELECT * FROM spot_photos WHERE spot_id = ? ORDER BY id",
        [spot_id]
      );
      photos = rows;
    }

    return reply.send({
      status: "Success",
      data: photos
    });

  } catch (error) {
    console.error("Get spot gallery error:", error);
    return reply.code(500).send({ 
      error: "Internal server error",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/* ================= GET SPOT EVENTS ================= */
const getSpotEvents = async (request, reply) => {
  const { spot_id } = request.params;
  const { status = "upcoming", limit = 5 } = request.query;

  try {
    let statusCondition = "";
    switch (status) {
      case "upcoming":
        statusCondition = "AND e.tanggal_mulai > NOW()";
        break;
      case "ongoing":
        statusCondition = "AND NOW() BETWEEN e.tanggal_mulai AND e.tanggal_selesai";
        break;
      case "past":
        statusCondition = "AND e.tanggal_selesai < NOW()";
        break;
      default:
        statusCondition = "";
    }

    const [events] = await pool.execute(
      `
      SELECT 
        e.*,
        s.nama_spot,
        s.alamat,
        DATE_FORMAT(e.tanggal_mulai, '%d %b %Y') as tanggal_formatted,
        DATE_FORMAT(e.batas_pendaftaran, '%d %b %Y') as batas_pendaftaran_formatted,
        (SELECT COUNT(*) FROM event_registrations er WHERE er.event_id = e.id) as jumlah_pendaftar,
        CASE
          WHEN NOW() < e.batas_pendaftaran THEN 'Pendaftaran Dibuka'
          WHEN NOW() BETWEEN e.tanggal_mulai AND e.tanggal_selesai THEN 'Sedang Berlangsung'
          ELSE 'Selesai'
        END AS status_event
      FROM events e
      JOIN spots s ON e.spot_id = s.id
      WHERE e.spot_id = ?
        AND e.status_persetujuan = 'Approved'
        ${statusCondition}
      ORDER BY e.tanggal_mulai ASC
      LIMIT ?
      `,
      [spot_id, parseInt(limit)]
    );

    return reply.send({
      status: "Success",
      data: events
    });

  } catch (error) {
    console.error("Get spot events error:", error);
    return reply.code(500).send({ 
      error: "Internal server error",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getAllMapSpots,
  getSpotDetail,
  getNearbySpots,
  getSpotReviews,
  getSpotGallery,
  getSpotEvents
};