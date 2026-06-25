// API Base Configuration
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://192.168.31.76:8000',
  timeout: 30000,
  endpoints: {
    login: '/V1/veichle_booking_controller/web/admin/staff/login/',
    refresh: '/V1/veichle_booking_controller/web/admin/token/refresh/',
    logout: '/V1/veichle_booking_controller/web/admin/staff/logout/',
    logoutAllDevices: '/V1/veichle_booking_controller/web/admin/staff/logout-from-all-device/',
    profile: '/V1/veichle_booking_controller/web/admin/staff/profile/',
  }
};

export default API_CONFIG;