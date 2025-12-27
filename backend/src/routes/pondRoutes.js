const { getAllPonds, createPond } = require('../controllers/pondController');
const { authenticate, isOwner } = require('../middleware/authMiddleware');

async function pondRoutes(fastify) {
  // Semua orang bisa melihat daftar kolam
  fastify.get('/', getAllPonds);

  // Hanya Owner/Admin yang bisa menambah kolam
  fastify.post('/', { preHandler: [authenticate, isOwner] }, createPond);
}

module.exports = pondRoutes;