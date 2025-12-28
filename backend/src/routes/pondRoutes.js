const { getAllPonds, createPond, updatePond, deletePond } = require('../controllers/pondController');
const { authenticate, isOwner } = require('../middleware/authMiddleware');

async function pondRoutes(fastify) {
  fastify.get('/', getAllPonds);
  fastify.post('/', { preHandler: [authenticate, isOwner] }, createPond);
  fastify.put('/:id', { preHandler: [authenticate, isOwner] }, updatePond);
  
  // Tambahkan baris penghapusan ini:
  fastify.delete('/:id', { preHandler: [authenticate, isOwner] }, deletePond);
}

module.exports = pondRoutes;