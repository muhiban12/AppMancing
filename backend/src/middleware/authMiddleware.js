const authenticate = async (request, reply) => {
  try {
    // Memverifikasi token JWT yang dikirim user di Header
    await request.jwtVerify();
  } catch (err) {
    // Jika token salah, kadaluarsa, atau tidak ada
    return reply.code(401).send({ 
      status: 'Error', 
      message: 'Sesi habis atau tidak sah, silakan login kembali' 
    });
  }
};

module.exports = { authenticate };