const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const register = async (request, reply) => {
  const {
    nama_lengkap,
    email,
    password,
    nomer_wa,
    provinsi_asal,
    kota_kabupaten
  } = request.body;

  try {
    const [existing] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      return reply.code(400).send({ message: 'Email sudah terdaftar' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 1️⃣ Insert user
    const [result] = await pool.execute(
      `INSERT INTO users 
       (nama_lengkap, email, password, nomer_wa, provinsi_asal, kota_kabupaten)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nama_lengkap, email, hashedPassword, nomer_wa, provinsi_asal, kota_kabupaten]
    );

    // 2️⃣ Set role DEFAULT = angler (misal role_id = 3)
    await pool.execute(
      'INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)',
      [result.insertId, 3]
    );

    return reply.code(201).send({
      status: 'Success',
      message: 'Registrasi berhasil sebagai Angler'
    });

  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};


const login = async (request, reply) => {
  const { email, password } = request.body;
  try {
    const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) return reply.code(401).send({ message: 'Email atau password salah' });
    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return reply.code(401).send({ message: 'Email atau password salah' });
    const token = request.server.jwt.sign({ id: user.id, email: user.email });
    return reply.send({ status: 'Success', token, user: { id: user.id, nama: user.nama_lengkap } });
  } catch (error) { return reply.code(500).send({ error: error.message }); }
};

// --- FUNGSI BARU ---
const getProfile = async (request, reply) => {
  try {
    const userId = request.user.id; // Diambil dari token oleh middleware
    const [rows] = await pool.execute(
      'SELECT id, nama_lengkap, email, nomer_wa, provinsi_asal, kota_kabupaten FROM users WHERE id = ?',
      [userId]
    );
    return reply.send({ status: 'Success', data: rows[0] });
  } catch (error) { return reply.code(500).send({ error: error.message }); }
};

module.exports = { register, login, getProfile };