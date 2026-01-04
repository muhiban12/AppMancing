const {
  getAllMapSpots, getSpotDetail, getSpotSeats,
  createBooking, getUserBookings,
  registerEvent, getOwnerWallet, withdrawFunds,
  createStrikeFeed, getStrikeFeeds, getLeaderboard,
  adminDeleteStrikeFeed, adminDeleteReview,
  updateExpiredBookings, getNotifications, markNotificationRead,
  getMasterFacilities, getFishMaster, createWildSpot, updateWildSpot,
  deleteWildSpot, getSpotReviews, createReview,
  getAdminPonds, approveSpot, getOwnerTransactions, createPond, 
  updatePond, requestDeletePond, approveDeletePond 
} = require('../controllers/pondController');

const { authenticate, isOwner, isAdmin } = require('../middleware/authMiddleware');
const upload = require('../middlewares/upload');

async function pondRoutes(fastify, options) {

  // ======================
  // MAP & DETAIL (PUBLIC)
  // ======================
  fastify.get('/map-all', getAllMapSpots);
  fastify.get('/detail/:id', getSpotDetail);
  fastify.get('/seats/:spot_id', getSpotSeats);

  // ======================
  // USER (LOGIN REQUIRED)
  // ======================
  fastify.post('/bookings', { preHandler: [authenticate] }, createBooking);
  fastify.get('/my-bookings', { preHandler: [authenticate] }, getUserBookings);
  fastify.post('/events/register', { preHandler: [authenticate] }, registerEvent);

  fastify.get('/notifications', { preHandler: [authenticate] }, getNotifications);
  fastify.patch('/notifications/:id/read', { preHandler: [authenticate] }, markNotificationRead);

  fastify.post('/reviews', { preHandler: [authenticate] }, createReview);
  fastify.get('/reviews', getSpotReviews);

  // ======================
  // KOMUNITAS
  // ======================
  fastify.get('/feeds', getStrikeFeeds);
  fastify.post(
    '/feeds',
    { preHandler: [authenticate, upload.single('foto')] },
    createStrikeFeed
  );

  fastify.get('/leaderboard', getLeaderboard);

  // ======================
  // OWNER ONLY
  // ======================
  fastify.post(
  '/ponds',
  {
    preHandler: [
      authenticate,
      isOwner,
      upload.single('foto_utama')
    ]
  },
  createPond
);

  fastify.put(
  '/ponds/:id',
  {
    preHandler: [
      authenticate,
      isOwner,
      upload.single('foto_utama')
    ]
  },
  updatePond
);

  fastify.delete(
  '/ponds/:id',
  {
    preHandler: [authenticate, isOwner]
  },
  requestDeletePond
);



fastify.get('/wallet', { preHandler: [authenticate, isOwner] }, getOwnerWallet);
fastify.post('/withdraw', { preHandler: [authenticate, isOwner] }, withdrawFunds);
fastify.get('/owner-transactions', { preHandler: [authenticate, isOwner] }, getOwnerTransactions);

// ======================
// ADMIN ONLY
// ======================
fastify.get('/admin/ponds', { preHandler: [authenticate, isAdmin] }, getAdminPonds);
fastify.patch('/admin/approve-spot/:id', { preHandler: [authenticate, isAdmin] }, approveSpot);

fastify.post('/wild-spots', { preHandler: [authenticate, isAdmin] }, createWildSpot);
fastify.put('/wild-spots/:id', { preHandler: [authenticate, isAdmin] }, updateWildSpot);
fastify.delete('/wild-spots/:id', { preHandler: [authenticate, isAdmin] }, deleteWildSpot);

fastify.delete('/admin/feed/:id', { preHandler: [authenticate, isAdmin] }, adminDeleteStrikeFeed);
fastify.delete('/admin/review/:id', { preHandler: [authenticate, isAdmin] }, adminDeleteReview);

fastify.patch(
  '/admin/approve-delete-pond/:id',
  { preHandler: [authenticate, isAdmin] },
  approveDeletePond
);
// ======================
// SYSTEM
  // ======================
  fastify.post('/system/refresh-seats', { preHandler: [authenticate, isAdmin] }, updateExpiredBookings);

  // ======================
  // MASTER DATA
  // ======================
  fastify.get('/master-facilities', getMasterFacilities);
  fastify.get('/master-fish', getFishMaster);
}

module.exports = pondRoutes;
