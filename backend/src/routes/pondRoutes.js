// Tambahkan approveSpot dan getAdminPonds di sini
const { 
  getAllPonds, 
  createPond, 
  updatePond, 
  deletePond, 
  approveSpot, 
  getAdminPonds,
  createWildSpot,
  getAllMapSpots,
  getSpotDetail
} = require('../controllers/pondController');

const { authenticate, isOwner, isAdmin } = require('../middleware/authMiddleware');

// Tambahkan route ini di dalam function pondRoutes

async function pondRoutes(fastify) {
  fastify.get('/', getAllPonds);
  fastify.get('/:spot_id/seats', getSpotSeats);
  fastify.post('/', { preHandler: [authenticate, isOwner] }, createPond);
  fastify.put('/:id', { preHandler: [authenticate, isOwner] }, updatePond);
  fastify.delete('/:id', { preHandler: [authenticate, isOwner] }, deletePond);
  
  // Route Admin
  fastify.get('/admin/all', { preHandler: [authenticate, isAdmin] }, getAdminPonds);
  fastify.patch('/:id/status', { preHandler: [authenticate, isAdmin] }, approveSpot);

  // untuk spots liar
  fastify.post('/wild', { preHandler: [authenticate, isAdmin] }, createWildSpot);
  // Tambahkan getAllMapSpots di require controller
  fastify.get('/map-all', getAllMapSpots);
  fastify.get('/detail/:id', getSpotDetail);
}

module.exports = pondRoutes;