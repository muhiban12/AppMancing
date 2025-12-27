const { getAllPonds } = require('../controllers/pondController');

async function pondRoutes(fastify) {
  // Alamat: GET /api/ponds
  fastify.get('/', getAllPonds);
}

module.exports = pondRoutes;