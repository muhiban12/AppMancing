const { 
  // Import semua fungsi dari controller kamu
  getAllMapSpots, getSpotDetail, getSpotSeats, 
  createBooking, getUserBookings, 
  registerEvent, getOwnerWallet, withdrawFunds,
  createStrikeFeed, getStrikeFeeds, getLeaderboard,
  adminDeleteStrikeFeed, adminDeleteReview,
  updateExpiredBookings, getNotifications, markNotificationRead
} = require('../controllers/pondController');

const { authenticate } = require('../middleware/auth');

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

  // --- ADMIN & SISTEM ---
  // Route untuk bersih-bersih kursi kadaluwarsa secara manual
  fastify.post('/system/refresh-seats', updateExpiredBookings); 
  
  // Hapus postingan/ulasan bermasalah
  fastify.delete('/admin/feed/:id', { preHandler: [authenticate] }, adminDeleteStrikeFeed);
  fastify.delete('/admin/review/:id', { preHandler: [authenticate] }, adminDeleteReview);

  // untuk notifikasi
  fastify.get('/notifications', { preHandler: [authenticate] }, getNotifications);
  fastify.patch('/notifications/:id/read', { preHandler: [authenticate] }, markNotificationRead);
}

module.exports = pondRoutes;