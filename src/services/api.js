import axios from "axios";

const api = axios.create({
  baseURL: "https://movienew.cybersoft.edu.vn/api/",
});

api.interceptors.request.use((config) => {
  const userLocal = JSON.parse(localStorage.getItem("user"));
  const accessToken = userLocal?.accessToken || userLocal?.token;
  return {
    ...config,
    headers: {
      ...config.headers,
      TokenCybersoft:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA4MyIsIkhldEhhblN0cmluZyI6IjE4LzAxLzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc2ODY5NDQwMDAwMCIsIm5iZiI6MTc0MTg4ODgwMCwiZXhwIjoxNzY4ODQ1NjAwfQ.rosAjjMuXSBmnsEQ7BQi1qmo6eVOf1g8zhTZZg6WSx4",
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
  };
});

// API functions
export const movieAPI = {
  // Lấy danh sách banner
  getBanners: () => api.get("QuanLyPhim/LayDanhSachBanner"),
  
  // Lấy thông tin phim chi tiết theo maPhim
  getMovieDetail: (maPhim) => api.get(`QuanLyPhim/LayThongTinPhim?MaPhim=${maPhim}`),
  
  // Lấy danh sách phim
  getMovieList: () => api.get("QuanLyPhim/LayDanhSachPhim?maNhom=GP00"),

  // Cinema APIs
  getHeThongRap: () => api.get("QuanLyRap/LayThongTinHeThongRap"),
  getCumRapTheoHeThong: (maHeThongRap) => api.get(`QuanLyRap/LayThongTinCumRapTheoHeThong?maHeThongRap=${maHeThongRap}`),
  getLichChieuHeThongRap: () => api.get("QuanLyRap/LayThongTinLichChieuHeThongRap?maNhom=GP00"),
  getLichChieuPhim: (maPhim) => api.get(`QuanLyRap/LayThongTinLichChieuPhim?MaPhim=${maPhim}`),
  // Lấy danh sách phòng vé (ghế) theo mã lịch chiếu
  getPhongVe: (maLichChieu) => api.get(`QuanLyDatVe/LayDanhSachPhongVe?MaLichChieu=${maLichChieu}`),
  // Đặt vé
  datVe: (data) => api.post("QuanLyDatVe/DatVe", data),
  // Thêm phim mới (có upload hình)
  addMovie: (formData) => api.post("QuanLyPhim/ThemPhimUploadHinh", formData),
  // Xóa phim
  deleteMovie: (maPhim) => api.delete(`QuanLyPhim/XoaPhim?MaPhim=${maPhim}`),
  // Cập nhật phim (có upload hình)
  updateMovie: (formData) => api.post("QuanLyPhim/CapNhatPhimUpload", formData),
};

export default api;
