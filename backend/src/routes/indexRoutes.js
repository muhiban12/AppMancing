module.exports = async function (fastify) {
  const upload = require("../middleware/upload");
  const { authenticate, isAdmin } = require("../middleware/authMiddleware");

  /* ================= AUTH ================= */
  const auth = require("../controllers/authController");
  fastify.post("/auth/register", auth.register);
  fastify.post("/auth/login", auth.login);

  /* ================= MAP & PUBLIC ================= */
  const map = require("../controllers/mapController");
  fastify.get("/map-spots", map.getAllMapSpots);
  fastify.get("/spots/:id", map.getSpotDetail);

  /* ================= SPOT / POND ================= */
  const spot = require("../controllers/spotcontroller");

  fastify.get("/spots/:id/seats", spot.getSpotSeats);

  fastify.post(
    "/ponds",
    { preHandler: [authenticate, upload.single("foto")] },
    spot.createPond
  );

  fastify.put(
    "/ponds/:id",
    { preHandler: [authenticate, upload.single("foto")] },
    spot.updatePond
  );

  fastify.patch(
    "/ponds/:id/request-delete",
    { preHandler: authenticate },
    spot.requestDeletePond
  );

  /* ================= BOOKINGS ================= */
  const booking = require("../controllers/bookingController");

  fastify.post(
    "/bookings",
    { preHandler: authenticate },
    booking.createBooking
  );

  fastify.get(
    "/my-bookings",
    { preHandler: authenticate },
    booking.getUserBookings
  );

  /* ================= EVENTS ================= */
  const event = require("../controllers/eventController");

  fastify.post(
    "/events",
    { preHandler: [authenticate, upload.single("poster")] },
    event.createEvent
  );

  fastify.get("/events", event.getApprovedEvents);

  fastify.post(
    "/events/register",
    { preHandler: authenticate },
    event.registerEvent
  );

  /* ================= SOCIAL / FEEDS ================= */
  const social = require("../controllers/socialController");

  fastify.get("/feeds", social.getStrikeFeeds);

  fastify.post(
    "/feeds",
    { preHandler: [authenticate, upload.single("foto")] },
    social.createStrikeFeed
  );

  fastify.post(
    "/feeds/:id/report",
    { preHandler: authenticate },
    social.reportFeed
  );

  fastify.get("/leaderboard", social.getLeaderboard);

  /* ================= REVIEWS ================= */
  const review = require("../controllers/reviewController");

  fastify.post(
    "/reviews",
    { preHandler: authenticate },
    review.createReview
  );

  fastify.get("/reviews", review.getSpotReviews);

  /* ================= WALLET / FINANCE ================= */
  const finance = require("../controllers/financeController");

  fastify.get(
    "/wallet",
    { preHandler: authenticate },
    finance.getOwnerWallet
  );

  fastify.get(
    "/wallet/transactions",
    { preHandler: authenticate },
    finance.getOwnerTransactions
  );

  fastify.post(
    "/wallet/withdraw",
    { preHandler: authenticate },
    finance.withdrawFunds
  );

  /* ================= MASTER DATA ================= */
  const master = require("../controllers/masterController");
  fastify.get("/master/fish", master.getFishMaster);
  fastify.get("/master/facilities", master.getMasterFacilities);

  /* ================= NOTIFICATIONS ================= */
  const notif = require("../controllers/notificationsController");

  fastify.get(
    "/notifications",
    { preHandler: authenticate },
    notif.getNotifications
  );

  fastify.patch(
    "/notifications/:id/read",
    { preHandler: authenticate },
    notif.markNotificationRead
  );

  /* ================= ADMIN ================= */
  const admin = require("../controllers/adminController");

  fastify.get(
    "/admin/ponds",
    { preHandler: [authenticate, isAdmin] },
    admin.getAdminPonds
  );

  fastify.patch(
    "/admin/ponds/:id/approve",
    { preHandler: [authenticate, isAdmin] },
    admin.approveSpot
  );

  fastify.patch(
    "/admin/ponds/:id/approve-delete",
    { preHandler: [authenticate, isAdmin] },
    admin.approveDeletePond
  );

  fastify.post(
    "/admin/wild-spots",
    { preHandler: [authenticate, isAdmin] },
    admin.createWildSpot
  );

  fastify.put(
    "/admin/wild-spots/:id",
    { preHandler: [authenticate, isAdmin] },
    admin.updateWildSpot
  );

  fastify.delete(
    "/admin/wild-spots/:id",
    { preHandler: [authenticate, isAdmin] },
    admin.deleteWildSpot
  );

  fastify.delete(
    "/admin/reviews/:id",
    { preHandler: [authenticate, isAdmin] },
    admin.adminDeleteReview
  );

  fastify.delete(
    "/admin/feeds/:id",
    { preHandler: [authenticate, isAdmin] },
    admin.adminDeleteStrikeFeed
  );

  fastify.get(
    "/admin/feed-reports",
    { preHandler: [authenticate, isAdmin] },
    admin.getFeedReports
  );

  fastify.patch(
    "/admin/feed-reports/:id",
    { preHandler: [authenticate, isAdmin] },
    admin.resolveFeedReport
  );
};
