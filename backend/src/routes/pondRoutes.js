const { 
  // Import semua fungsi dari controller kamu
  getAllMapSpots, getSpotDetail, getSpotSeats, 
  createBooking, getUserBookings, 
  registerEvent, getOwnerWallet, withdrawFunds,
  createStrikeFeed, getStrikeFeeds, getLeaderboard,
  adminDeleteStrikeFeed, adminDeleteReview,
  updateExpiredBookings, getNotifications, markNotificationRead,
  getMasterFacilities, getFishMaster, createWildSpot, updateWildSpot,
  deleteWildSpot, getSpotReviews, createReview,
  getAdminPonds, approveSpot, getOwnerTransactions
} = require('../controllers/pondController');

const { authenticate } = require('../middleware/authMiddleware');

async function pondRoutes(fastify, options) {
  
  // --- PETA & DETAIL (UI MAPS) ---
  fastify.get('/map-all', getAllMapSpots);
  fastify.get('/detail/:id', getSpotDetail);
  fastify.get('/seats/:spot_id', getSpotSeats);

  // --- BOOKING & EVENT (TRANSAKSI) ---
  fastify.post('/bookings', { preHandler: [authenticate] }, createBooking);
  fastify.get('/my-bookings', { preHandler: [authenticate] }, getUserBookings);
  fastify.post('/events/register', { preHandler: [authenticate] }, registerEvent);

  // --- KOMUNITAS & LEADERBOARD ---
  fastify.get('/feeds', getStrikeFeeds);
  fastify.post('/feeds', { preHandler: [authenticate] }, createStrikeFeed);
  fastify.get('/leaderboard', getLeaderboard);

  // --- KEUANGAN OWNER ---
  fastify.get('/wallet', { preHandler: [authenticate] }, getOwnerWallet);
  fastify.post('/withdraw', { preHandler: [authenticate] }, withdrawFunds);
  fastify.get('/owner-transactions', { preHandler: [authenticate] }, getOwnerTransactions);

  // --- ADMIN & SISTEM ---

  // Fitur Admin untuk Approval Spot Komersial
  fastify.get('/admin/ponds', { preHandler: [authenticate] }, getAdminPonds);
  fastify.patch('/admin/approve-spot/:id', { preHandler: [authenticate] }, approveSpot);
  
  // Route untuk bersih-bersih kursi kadaluwarsa secara manual
  fastify.post('/system/refresh-seats', updateExpiredBookings); 
  fastify.post('/wild-spots', { preHandler: [authenticate] }, createWildSpot);
  fastify.put('/wild-spots/:id', { preHandler: [authenticate] }, updateWildSpot);
  fastify.delete('/wild-spots/:id', { preHandler: [authenticate] }, deleteWildSpot); // Route Hapus
  
  // ulasan
  fastify.get('/reviews', getSpotReviews); // Untuk melihat ulasan di detail spot
  fastify.post('/reviews', { preHandler: [authenticate] }, createReview); // Untuk user kasih bintang/ulasan

  // Hapus postingan/ulasan bermasalah
  fastify.delete('/admin/feed/:id', { preHandler: [authenticate] }, adminDeleteStrikeFeed);
  fastify.delete('/admin/review/:id', { preHandler: [authenticate] }, adminDeleteReview);

  // untuk notifikasi
  fastify.get('/notifications', { preHandler: [authenticate] }, getNotifications);
  fastify.patch('/notifications/:id/read', { preHandler: [authenticate] }, markNotificationRead);

  // untuk dropdown 
  fastify.get('/master-facilities', getMasterFacilities);
  fastify.get('/master-fish', getFishMaster);
}

module.exports = pondRoutes;