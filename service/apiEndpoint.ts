// services/apiEndpoints.ts
import api from './api';
import { createFormData } from '../utils/fileupload';
import type {
  LoginData,
  RegisterData,
  OwnerUpgradeData,
  SpotData,
  EventData,
  BookingData,
  ReviewData,
  StrikeFeedData,
  WithdrawData,
  WildSpotData,
  FileType
} from '../types/api';

// ================= AUTH =================
export const authAPI = {
  // Register user baru (default role: Angler)
  register: (data: RegisterData) => api.post('/auth/register', data),
  
  // Login user
  login: (data: LoginData) => api.post('/auth/login', data),
  
  // Upgrade user dari Angler ke Owner + Buat Spot Pertama
  upgradeToOwner: (data: OwnerUpgradeData) => {
    const formData = createFormData(
      {
        no_rekening: data.no_rekening,
        nama_bank: data.nama_bank,
        atas_nama: data.atas_nama,
        spot_data: JSON.stringify({
          nama_spot: data.spot_data.nama_spot,
          alamat: data.spot_data.alamat,
          deskripsi: data.spot_data.deskripsi || '',
          harga_per_jam: data.spot_data.harga_per_jam,
          latitude: data.spot_data.latitude,
          longitude: data.spot_data.longitude,
          total_kursi: data.spot_data.total_kursi || 10,
          jam_buka: data.spot_data.jam_buka || '08:00:00',
          jam_tutup: data.spot_data.jam_tutup || '20:00:00',
          kode_wilayah: data.spot_data.kode_wilayah || ''
        })
      },
      {
        foto_ktp: data.foto_ktp,
        foto_wajah_verifikasi: data.foto_wajah_verifikasi,
        spot_foto: data.spot_data.foto_utama
      }
    );
    
    return api.post('/user/upgrade-to-owner', formData, {
      headers: { 
        'Content-Type': 'multipart/form-data',
      }
    });
  },
  
  // Check status upgrade request user
  checkUpgradeStatus: () => api.get('/user/upgrade-status'),
  
  // Logout
  logout: () => api.post('/auth/logout'),
};

// ================= MAP & PUBLIC =================
export const mapAPI = {
  // Get semua map spots (approved only)
  getAllMapSpots: (params?: { 
    status?: 'approved'; 
    limit?: number;
    offset?: number;
  }) => api.get('/map-spots', { params }),
  
  // Get detail spot
  getSpotDetail: (id: number) => api.get(`/spots/${id}`),
  
  // Get nearby spots
  getNearbySpots: (params: { 
    lat: number; 
    lng: number; 
    radius?: number;
    status?: string;
  }) => api.get('/spots/nearby', { params }),
  
  // Get reviews spot
  getSpotReviews: (spotId: number, params?: { limit?: number; offset?: number }) => 
    api.get(`/spots/${spotId}/reviews`, { params }),
  
  // Get gallery spot
  getSpotGallery: (spotId: number) => api.get(`/spots/${spotId}/gallery`),
  
  // Get events di spot
  getSpotEvents: (spotId: number, params?: { status?: string }) => 
    api.get(`/spots/${spotId}/events`, { params }),
  
  // Get wild spots
  getAllWildSpots: (params?: { 
    status_potensi?: string;
    limit?: number;
    offset?: number;
  }) => api.get('/wild-spots', { params }),
};

// ================= SPOT / POND =================
export const spotAPI = {
  // Owner operations
  createPond: (data: SpotData) => {
    const { foto_utama, foto_denah, ...restData } = data;
    const formData = createFormData(
      restData,
      {
        foto: foto_utama,
        foto_denah: foto_denah
      }
    );
    
    return api.post('/ponds', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  updatePond: (id: number, data: Partial<SpotData>) => {
    const { foto_utama, foto_denah, ...restData } = data;
    const formData = createFormData(
      restData,
      {
        foto: foto_utama,
        foto_denah: foto_denah
      }
    );
    
    return api.put(`/ponds/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  requestDeletePond: (id: number) => 
    api.patch(`/ponds/${id}/request-delete`),
  
  // Public operations
  getSpotSeats: (spotId: number) => api.get(`/spots/${spotId}/seats`),
  
  searchSpots: (params: {
    query?: string;
    lat?: number;
    lng?: number;
    radius?: number;
    facilities?: number[];
    min_price?: number;
    max_price?: number;
    status?: string;
  }) => api.get('/spots/search', { params }),
  
  getMultipleSpotPreviews: (spotIds: number[]) => 
    api.get('/spots/previews/batch', { params: { ids: spotIds.join(',') } }),
  
  getSpotMiniPreview: (spotId: number) => 
    api.get(`/spots/${spotId}/preview/mini`),
  
  getSpotPeekPreview: (spotId: number) => 
    api.get(`/spots/${spotId}/preview/peek`),
  
  // Owner stats
  getSpotStats: (spotId: number) => 
    api.get(`/owner/spots/${spotId}/stats`),
  
  // Get spot facilities
  getSpotFacilities: (spotId: number) => 
    api.get(`/spots/${spotId}/facilities`),
  
  // Get spot photos
  getSpotPhotos: (spotId: number) => 
    api.get(`/spots/${spotId}/photos`),
};

// ================= BOOKINGS =================
export const bookingAPI = {
  // Create booking baru
  createBooking: (data: BookingData) => api.post('/bookings', data),
  
  // Get bookings user
  getUserBookings: (params?: { 
    status?: string;
    upcoming?: boolean;
    limit?: number;
    offset?: number;
  }) => api.get('/my-bookings', { params }),
  
  // Check-in booking
  checkInBooking: (bookingToken: string) => 
    api.patch(`/bookings/${bookingToken}/check-in`),
  
  // Cancel booking
  cancelBooking: (bookingId: number) => 
    api.patch(`/bookings/${bookingId}/cancel`),
  
  // Get booking detail
  getBookingDetail: (bookingId: number) => 
    api.get(`/bookings/${bookingId}`),
};

// ================= EVENTS =================
export const eventAPI = {
  // Create event baru (owner only)
  createEvent: (data: EventData) => {
    const { foto_poster, ...restData } = data;
    const formData = createFormData(
      restData,
      { poster: foto_poster }
    );
    
    return api.post('/events', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  // Get event detail
  getEventDetail: (eventId: number) => api.get(`/events/${eventId}`),
  
  // Get approved events (public)
  getApprovedEvents: (params?: { 
    spot_id?: number; 
    limit?: number;
    upcoming?: boolean;
    offset?: number;
  }) => api.get('/events', { params }),
  
  // Register untuk event
  registerEvent: (data: { event_id: number; payment_channel_id?: number }) => 
    api.post('/events/register', data),
  
  // Get tickets user
  getMyEventTickets: (params?: { 
    status?: string;
    upcoming?: boolean;
    limit?: number;
    offset?: number;
  }) => api.get('/my-tickets', { params }),
  
  // Get events owner
  getOwnerEvents: (params?: { 
    status?: string;
    limit?: number;
    offset?: number;
  }) => api.get('/owner/events', { params }),
  
  // Confirm payment event
  confirmPayment: (data: { event_id: number; image_proof: FileType }) => {
    const formData = createFormData(
      {},
      { image_proof: data.image_proof }
    );
    
    return api.post('/events/payment/confirm', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  // Cancel registration event
  cancelRegistration: (eventId: number) => 
    api.delete(`/events/${eventId}/register`),
  
  // Get event participants (owner only)
  getEventParticipants: (eventId: number) => 
    api.get(`/events/${eventId}/participants`),
};

// ================= SOCIAL / FEEDS =================
export const socialAPI = {
  // Get strike feeds (public)
  getStrikeFeeds: (params?: { 
    limit?: number; 
    offset?: number;
    wild_spot_id?: number;
    user_id?: number;
    sort_by?: 'latest' | 'popular';
  }) => api.get('/feeds', { params }),
  
  // Create strike feed
  createStrikeFeed: (data: StrikeFeedData) => {
    const { foto_ikan, ...restData } = data;
    const formData = createFormData(
      restData,
      { foto: foto_ikan }
    );
    
    return api.post('/feeds', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  // Report feed
  reportFeed: (feedId: number, reason: string) => 
    api.post(`/feeds/${feedId}/report`, { reason }),
  
  // Get leaderboard
  getLeaderboard: (params?: { 
    period?: 'daily' | 'weekly' | 'monthly' | 'all';
    limit?: number;
  }) => api.get('/leaderboard', { params }),
  
  // Like feed
  likeFeed: (feedId: number) => 
    api.post(`/feeds/${feedId}/like`),
  
  // Unlike feed
  unlikeFeed: (feedId: number) => 
    api.delete(`/feeds/${feedId}/like`),
  
  // Get feed comments
  getFeedComments: (feedId: number) => 
    api.get(`/feeds/${feedId}/comments`),
  
  // Add comment to feed
  addComment: (feedId: number, comment: string) => 
    api.post(`/feeds/${feedId}/comments`, { comment }),
};

// ================= REVIEWS =================
export const reviewAPI = {
  // Create review
  createReview: (data: ReviewData) => {
    const { foto_ulasan, ...restData } = data;
    const formData = createFormData(
      restData,
      { foto: foto_ulasan }
    );
    
    return api.post('/reviews', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  // Get reviews
  getReviews: (params?: { 
    spot_id?: number;
    wild_spot_id?: number;
    user_id?: number;
    limit?: number; 
    offset?: number;
    rating?: number;
  }) => api.get('/reviews', { params }),
  
  // Update review
  updateReview: (reviewId: number, data: Partial<ReviewData>) => 
    api.put(`/reviews/${reviewId}`, data),
  
  // Delete review
  deleteReview: (reviewId: number) => 
    api.delete(`/reviews/${reviewId}`),
  
  // Like review
  likeReview: (reviewId: number) => 
    api.post(`/reviews/${reviewId}/like`),
  
  // Report review
  reportReview: (reviewId: number, reason: string) => 
    api.post(`/reviews/${reviewId}/report`, { reason }),
};

// ================= WALLET / FINANCE =================
export const financeAPI = {
  // Get wallet owner
  getOwnerWallet: () => api.get('/wallet'),
  
  // Get transactions owner
  getOwnerTransactions: (params?: { 
    limit?: number; 
    offset?: number;
    type?: string;
    start_date?: string;
    end_date?: string;
  }) => api.get('/wallet/transactions', { params }),
  
  // Withdraw funds
  withdrawFunds: (data: WithdrawData) => 
    api.post('/wallet/withdraw', data),
  
  // Get payment channels
  getPaymentChannels: () => api.get('/payment-channels'),
  
  // Get payout history
  getPayoutHistory: (params?: { 
    status?: string;
    limit?: number;
    offset?: number;
  }) => api.get('/wallet/payouts', { params }),
};

// ================= MASTER DATA =================
export const masterAPI = {
  // Get fish master data
  getFishMaster: () => api.get('/master/fish'),
  
  // Get master facilities
  getMasterFacilities: () => api.get('/master/facilities'),
  
  // Get provinces
  getProvinces: () => api.get('/master/provinces'),
  
  // Get cities by province
  getCities: (provinceId?: string) => 
    api.get('/master/cities', { params: { province_id: provinceId } }),
  
  // Get all payment channels
  getAllPaymentChannels: () => api.get('/master/payment-channels'),
};

// ================= NOTIFICATIONS =================
export const notificationAPI = {
  // Get notifications user
  getNotifications: (params?: { 
    unread_only?: boolean;
    limit?: number;
    offset?: number;
  }) => api.get('/notifications', { params }),
  
  // Mark notification as read
  markNotificationRead: (id: number) => 
    api.patch(`/notifications/${id}/read`),
  
  // Mark all notifications as read
  markAllNotificationsRead: () => 
    api.patch('/notifications/read-all'),
  
  // Get unread count
  getUnreadCount: () => api.get('/notifications/unread-count'),
  
  // Delete notification
  deleteNotification: (id: number) => 
    api.delete(`/notifications/${id}`),
};

// ================= ADMIN =================
export const adminAPI = {
  // Pond management
  getAdminPonds: (params?: { 
    status?: string;
    action_type?: string;
    owner_id?: number;
    limit?: number;
    offset?: number;
  }) => api.get('/admin/ponds', { params }),
  
  approveSpot: (id: number) => 
    api.patch(`/admin/ponds/${id}/approve`),
  
  approveDeletePond: (id: number) => 
    api.patch(`/admin/ponds/${id}/approve-delete`),
  
  rejectSpot: (id: number, reason?: string) => 
    api.patch(`/admin/ponds/${id}/reject`, { reason }),
  
  // Wild spots management
  createWildSpot: (data: WildSpotData) => {
    const { foto_carousel, ...restData } = data;
    const fileFields: { [key: string]: FileType } = {};
    
    if (foto_carousel && foto_carousel.length > 0) {
      foto_carousel.forEach((file, index) => {
        fileFields[`foto_${index}`] = file;
      });
    }
    
    const formData = createFormData(restData, fileFields);
    
    return api.post('/admin/wild-spots', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  updateWildSpot: (id: number, data: Partial<WildSpotData>) => 
    api.put(`/admin/wild-spots/${id}`, data),
  
  deleteWildSpot: (id: number) => 
    api.delete(`/admin/wild-spots/${id}`),
  
  // Content moderation
  adminDeleteReview: (id: number) => 
    api.delete(`/admin/reviews/${id}`),
  
  adminDeleteStrikeFeed: (id: number) => 
    api.delete(`/admin/feeds/${id}`),
  
  // Feed reports
  getFeedReports: (params?: { 
    status?: string;
    limit?: number;
    offset?: number;
  }) => api.get('/admin/feed-reports', { params }),
  
  resolveFeedReport: (id: number, action: string) => 
    api.patch(`/admin/feed-reports/${id}`, { action }),
  
  // Event approvals
  getPendingEvents: (params?: { limit?: number; offset?: number }) => 
    api.get('/admin/events/pending', { params }),
  
  getEventDetailForAdmin: (eventId: number) => 
    api.get(`/admin/events/${eventId}`),
  
  approveEvent: (eventId: number) => 
    api.patch(`/admin/events/${eventId}/approve`),
  
  rejectEvent: (eventId: number, reason?: string) => 
    api.patch(`/admin/events/${eventId}/reject`, { reason }),
  
  deleteEvent: (eventId: number) => 
    api.delete(`/admin/events/${eventId}`),
  
  // Owner upgrade requests
  getOwnerUpgradeRequests: (params?: { 
    status?: 'pending' | 'approved' | 'rejected';
    limit?: number;
    offset?: number;
  }) => api.get('/admin/owner-upgrade-requests', { params }),
  
  getOwnerUpgradeDetail: (userId: number) => 
    api.get(`/admin/owner-upgrade-requests/${userId}`),
  
  approveOwnerUpgrade: (userId: number, data?: {
    spot_id?: number;
    notes?: string;
  }) => api.post(`/admin/owner-upgrade-requests/${userId}/approve`, data),
  
  rejectOwnerUpgrade: (userId: number, reason?: string) => 
    api.post(`/admin/owner-upgrade-requests/${userId}/reject`, { reason }),
  
  // User management
  getUsers: (params?: { 
    role?: string; 
    status?: string;
    limit?: number;
    offset?: number;
  }) => api.get('/admin/users', { params }),
  
  updateUserStatus: (userId: number, status: string) => 
    api.patch(`/admin/users/${userId}/status`, { status }),
  
  // Dashboard stats
  getAdminDashboardStats: () => api.get('/admin/dashboard/stats'),
  
  // Revenue reports
  getRevenueReports: (params?: {
    start_date?: string;
    end_date?: string;
    period?: 'daily' | 'weekly' | 'monthly';
  }) => api.get('/admin/reports/revenue', { params }),
};

// ================= OWNER =================
export const ownerAPI = {
  // Get spots owner
  getOwnerSpots: (params?: { 
    status?: string;
    limit?: number;
    offset?: number;
  }) => api.get('/owner/spots', { params }),
  
  // Get dashboard owner
  getOwnerDashboard: (params?: { 
    period?: string;
    spot_id?: number;
  }) => api.get('/owner/dashboard', { params }),
  
  // Set active spot
  setActiveSpot: (data: { spot_id: number }) => 
    api.post('/owner/set-active-spot', data),
  
  // Get owner status
  getOwnerStatus: () => api.get('/owner/status'),
  
  // Get bookings owner
  getOwnerBookings: (params?: { 
    spot_id?: number;
    status?: string;
    date?: string;
    limit?: number;
    offset?: number;
  }) => api.get('/owner/bookings', { params }),
  
  // Update spot facilities
  updateSpotFacilities: (spotId: number, facilityIds: number[]) => 
    api.put(`/owner/spots/${spotId}/facilities`, { facilities: facilityIds }),
  
  // Add spot photo
  addSpotPhoto: (spotId: number, photo: FileType, keterangan?: string) => {
    const formData = createFormData(
      { keterangan: keterangan || '' },
      { foto: photo }
    );
    
    return api.post(`/owner/spots/${spotId}/photos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  // Delete spot photo
  deleteSpotPhoto: (photoId: number) => 
    api.delete(`/owner/photos/${photoId}`),
  
  // Update seat status
  updateSeatStatus: (seatId: number, status: string) => 
    api.patch(`/owner/seats/${seatId}`, { status }),
  
  // Get spot earnings
  getSpotEarnings: (spotId: number, params?: {
    start_date?: string;
    end_date?: string;
    period?: 'daily' | 'weekly' | 'monthly';
  }) => api.get(`/owner/spots/${spotId}/earnings`, { params }),
  
  // Get spot reviews (owner view)
  getSpotReviewsForOwner: (spotId: number, params?: {
    limit?: number;
    offset?: number;
  }) => api.get(`/owner/spots/${spotId}/reviews`, { params }),
};

// ================= USER PROFILE =================
export const userAPI = {
  // Get profile user
  getProfile: () => api.get('/user/profile'),
  
  // Update profile user
  updateProfile: (data: {
    nama_lengkap?: string;
    nomer_wa?: string;
    provinsi_asal?: string;
    kota_kabupaten?: string;
    foto_profil?: FileType;
  }) => {
    const { foto_profil, ...restData } = data;
    const formData = createFormData(
      restData,
      { foto: foto_profil }
    );
    
    return api.put('/user/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  // Change password
  changePassword: (data: {
    current_password: string;
    new_password: string;
  }) => api.post('/user/change-password', data),
  
  // Get user role
  getUserRole: () => api.get('/user/role'),
  
  // Check if user is owner
  isOwner: () => api.get('/user/is-owner'),
  
  // Get owner application status
  getOwnerApplicationStatus: () => api.get('/user/owner-application'),
  
  // Get user stats
  getUserStats: () => api.get('/user/stats'),
  
  // Get user fishing history
  getFishingHistory: (params?: {
    limit?: number;
    offset?: number;
  }) => api.get('/user/fishing-history', { params }),
};

// Export semua API dalam satu object
export const API = {
  auth: authAPI,
  map: mapAPI,
  spot: spotAPI,
  booking: bookingAPI,
  event: eventAPI,
  social: socialAPI,
  review: reviewAPI,
  finance: financeAPI,
  master: masterAPI,
  notification: notificationAPI,
  admin: adminAPI,
  owner: ownerAPI,
  user: userAPI,
};

export default API;