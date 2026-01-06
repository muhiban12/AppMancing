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

module.exports = {
    getAllMapSpots,
    getSpotDetail
};