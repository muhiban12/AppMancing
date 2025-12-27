const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const register = async (request, reply) => {
  const { nama_lengkap, email, password, nomer_wa, provinsi_asal, kota_kabupaten, role_id } = request.body;

  try {
    // Cek email ganda
    const [existing] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) return reply.code(400).send({ message: 'Email sudah terdaftar' });

    // Enkripsi password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan User
    const [result] = await pool.execute(
      'INSERT INTO users (nama_lengkap, email, password, nomer_wa, provinsi_asal, kota_kabupaten) VALUES (?, ?, ?, ?, ?, ?)',
      [nama_lengkap, email, hashedPassword, nomer_wa, provinsi_asal, kota_kabupaten]
    );

    // Beri Role (Default: 3 / Angler)
    await pool.execute('INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)', [result.insertId, role_id || 3]);

    return reply.code(201).send({ status: 'Success', message: 'Registrasi Berhasil!' });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

const login = async (request, reply) => {
  const { email, password } = request.body;

  try {
    // 1. Cari user berdasarkan email
    const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) return reply.code(401).send({ message: 'Email atau password salah' });

    const user = users[0];

    // 2. Cek password dengan bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return reply.code(401).send({ message: 'Email atau password salah' });

    // 3. Buat Token (Kunci masuk sementara)
    // Di dalam fungsi login authController.js
    const token = request.server.jwt.sign({ id: user.id, email: user.email });

    return reply.send({ 
      status: 'Success', 
      message: 'Login Berhasil!',
      token,
      user: { id: user.id, nama: user.nama_lengkap } 
    });
  } catch (error) {
    return reply.code(500).send({ error: error.message });
  }
};

// Update module.exports nya
module.exports = { register, login };