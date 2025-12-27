const { register, login } = require('../controllers/authController');

async function authRoutes(fastify) {
  fastify.post('/register', register);
  fastify.post('/login', login); // Tambahkan ini
}

module.exports = authRoutes;