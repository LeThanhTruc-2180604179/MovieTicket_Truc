import { useEffect, useState, useRef } from "react";
import axios from "axios";

export default function ScheduleManagement() {
  const [movies, setMovies] = useState([]);
  const [heThongList, setHeThongList] = useState([]); // Danh sách hệ thống rạp
  const [selectedHeThong, setSelectedHeThong] = useState("");
  const [cumRapList, setCumRapList] = useState([]); // Danh sách cụm rạp của hệ thống đã chọn
  const [form, setForm] = useState({ maPhim: "", maRap: "", ngayChieuGioChieu: "", giaVe: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showCumRapDropdown, setShowCumRapDropdown] = useState(false);
  const cumRapDropdownRef = useRef(null);
  
  // Thêm state cho thông tin phim được chọn
  const [selectedMovieInfo, setSelectedMovieInfo] = useState(null);
  const [movieFilter, setMovieFilter] = useState("all"); // all, dangChieu, sapChieu

  // Lấy danh sách phim và hệ thống rạp
  useEffect(() => {
    axios.get("https://movienew.cybersoft.edu.vn/api/QuanLyPhim/LayDanhSachPhim?maNhom=GP00", {
      headers: { TokenCybersoft: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA4MyIsIkhldEhhblN0cmluZyI6IjE4LzAxLzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc2ODY5NDQwMDAwMCIsIm5iZiI6MTc0MTg4ODgwMCwiZXhwIjoxNzY4ODQ1NjAwfQ.rosAjjMuXSBmnsEQ7BQi1qmo6eVOf1g8zhTZZg6WSx4" }
    }).then(res => setMovies(res.data.content || []));
    // Lấy danh sách hệ thống rạp và cụm rạp
    axios.get("https://movienew.cybersoft.edu.vn/api/QuanLyRap/LayThongTinHeThongRap", {
      headers: { TokenCybersoft: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA4MyIsIkhldEhhblN0cmluZyI6IjE4LzAxLzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc2ODY5NDQwMDAwMCIsIm5iZiI6MTc0MTg4ODgwMCwiZXhwIjoxNzY4ODQ1NjAwfQ.rosAjjMuXSBmnsEQ7BQi1qmo6eVOf1g8zhTZZg6WSx4" }
    }).then(async res => {
      const heThongList = res.data.content || [];
      setHeThongList(heThongList);
      if (heThongList.length > 0) {
        setSelectedHeThong(heThongList[0].maHeThongRap);
        await fetchCumRapList(heThongList[0].maHeThongRap);
      }
    });
  }, []);

  const fetchCumRapList = async (maHeThongRap) => {
    try {
      const res = await axios.get(
        `https://movienew.cybersoft.edu.vn/api/QuanLyRap/LayThongTinCumRapTheoHeThong?maHeThongRap=${maHeThongRap}`,
        { headers: { TokenCybersoft: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA4MyIsIkhldEhhblN0cmluZyI6IjE4LzAxLzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc2ODY5NDQwMDAwMCIsIm5iZiI6MTc0MTg4ODgwMCwiZXhwIjoxNzY4ODQ1NjAwfQ.rosAjjMuXSBmnsEQ7BQi1qmo6eVOf1g8zhTZZg6WSx4" } }
      );
      setCumRapList(res.data.content || []);
    } catch (error) {
      console.error("Error fetching cum rap list:", error);
    }
  };

  // Lọc phim theo trạng thái
  const getFilteredMovies = () => {
    switch (movieFilter) {
      case "dangChieu":
        return movies.filter(movie => movie.dangChieu);
      case "sapChieu":
        return movies.filter(movie => movie.sapChieu);
      default:
        return movies;
    }
  };

  // Hàm chuyển đổi định dạng ngày từ YYYY-MM-DD sang dd/MM/yyyy
  const formatDateForAPI = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  // Hàm chuyển đổi ngày từ dd/MM/yyyy sang Date object
  const parseVietnameseDate = (dateStr) => {
    if (!dateStr) return null;
    const [day, month, year] = dateStr.split("/");
    return new Date(year, month - 1, day);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Khi chọn phim, lấy thông tin chi tiết
    if (name === "maPhim" && value) {
      const selectedMovie = movies.find(movie => movie.maPhim === Number(value));
      setSelectedMovieInfo(selectedMovie);
    } else if (name === "maPhim" && !value) {
      setSelectedMovieInfo(null);
    }
  };

  // Xử lý click outside để đóng dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cumRapDropdownRef.current && !cumRapDropdownRef.current.contains(event.target)) {
        setShowCumRapDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCumRapSelect = (maCumRap, tenCumRap) => {
    setForm({ ...form, maRap: maCumRap });
    setShowCumRapDropdown(false);
  };

  // Validate ngày chiếu
  const validateScheduleDate = () => {
    if (!form.ngayChieuGioChieu || !selectedMovieInfo) return { isValid: true, message: "" };
    
    const scheduleDate = new Date(form.ngayChieuGioChieu);
    const movieReleaseDate = parseVietnameseDate(selectedMovieInfo.ngayKhoiChieu);
    
    if (!movieReleaseDate) return { isValid: true, message: "" };
    
    // Ngày chiếu phải từ ngày khởi chiếu trở đi
    const minScheduleDate = new Date(movieReleaseDate);
    
    // So sánh chỉ theo ngày (bỏ qua giờ phút)
    const scheduleDateOnly = new Date(scheduleDate.getFullYear(), scheduleDate.getMonth(), scheduleDate.getDate());
    const minScheduleDateOnly = new Date(minScheduleDate.getFullYear(), minScheduleDate.getMonth(), minScheduleDate.getDate());
    
    if (scheduleDateOnly < minScheduleDateOnly) {
      return { 
        isValid: false, 
        message: `Ngày chiếu phải từ ngày khởi chiếu (${selectedMovieInfo.ngayKhoiChieu}) trở đi` 
      };
    }
    
    return { isValid: true, message: "" };
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    // Validate ngày chiếu
    const dateValidation = validateScheduleDate();
    if (!dateValidation.isValid) {
      setMessage(dateValidation.message);
      return;
    }
    
    setLoading(true);
    setMessage("");
    
    // Định dạng lại ngày giờ sang dd/MM/yyyy HH:mm:ss
    let ngayChieuGioChieu = form.ngayChieuGioChieu;
    if (ngayChieuGioChieu) {
      // input: yyyy-MM-ddTHH:mm
      const [date, time] = ngayChieuGioChieu.split('T');
      if (date && time) {
        const [yyyy, MM, dd] = date.split('-');
        ngayChieuGioChieu = `${dd}/${MM}/${yyyy} ${time}:00`;
      }
    }
    
    try {
      const userLocal = JSON.parse(localStorage.getItem("user"));
      await axios.post(
        "https://movienew.cybersoft.edu.vn/api/QuanLyDatVe/TaoLichChieu",
        {
          maPhim: Number(form.maPhim),
          ngayChieuGioChieu,
          maRap: form.maRap,
          giaVe: Number(form.giaVe)
        },
        {
          headers: {
            Authorization: `Bearer ${userLocal?.accessToken || userLocal?.token}`,
            TokenCybersoft: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA4MyIsIkhldEhhblN0cmluZyI6IjE4LzAxLzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc2ODY5NDQwMDAwMCIsIm5iZiI6MTc0MTg4ODgwMCwiZXhwIjoxNzY4ODQ1NjAwfQ.rosAjjMuXSBmnsEQ7BQi1qmo6eVOf1g8zhTZZg6WSx4"
          }
        }
      );
      setMessage("Tạo lịch chiếu thành công!");
      setForm({ maPhim: "", maRap: "", ngayChieuGioChieu: "", giaVe: "" });
      setSelectedMovieInfo(null);
    } catch (err) {
      setMessage(err?.response?.data?.content || "Lỗi tạo lịch chiếu");
    } finally {
      setLoading(false);
    }
  };

  // Hàm lấy thông tin từ ngày giờ chiếu
  const getScheduleInfo = () => {
    if (!form.ngayChieuGioChieu) {
      return { thu: "Chưa chọn", ngayThang: "Chưa chọn", gio: "Chưa chọn" };
    }
    
    const date = new Date(form.ngayChieuGioChieu);
    const thu = date.toLocaleDateString('vi-VN', { weekday: 'long' });
    const ngayThang = date.toLocaleDateString('vi-VN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
    const gio = date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    return { thu, ngayThang, gio };
  };

  const scheduleInfo = getScheduleInfo();
  const filteredMovies = getFilteredMovies();
  const dateValidation = validateScheduleDate();

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Card thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4 border border-neutral-100">
          <div className="bg-blue-100 rounded-full w-14 h-14 flex items-center justify-center">
            <i className="fas fa-calendar-day text-2xl text-gray-800" />
          </div>
          <div>
            <div className="text-neutral-500 text-sm font-medium">Thứ</div>
            <div className="text-2xl font-bold text-neutral-900">{scheduleInfo.thu}</div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4 border border-neutral-100">
          <div className="bg-green-100 rounded-full w-14 h-14 flex items-center justify-center">
            <i className="fas fa-calendar-alt text-2xl text-gray-800" />
          </div>
          <div>
            <div className="text-neutral-500 text-sm font-medium">Ngày tháng năm</div>
            <div className="text-2xl font-bold text-neutral-900">{scheduleInfo.ngayThang}</div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4 border border-neutral-100">
          <div className="bg-orange-100 rounded-full w-14 h-14 flex items-center justify-center">
            <i className="fas fa-clock text-2xl text-gray-800" />
          </div>
          <div>
            <div className="text-neutral-500 text-sm font-medium">Giờ</div>
            <div className="text-2xl font-bold text-neutral-900">{scheduleInfo.gio}</div>
          </div>
        </div>
      </div>

      {/* Form tạo lịch chiếu */}
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xl font-bold text-neutral-900">Tạo lịch chiếu mới</div>
            <div className="text-green-500 text-sm font-medium">Schedule Management</div>
          </div>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-semibold text-sm">Chọn phim</label>
                <select 
                  value={movieFilter} 
                  onChange={(e) => setMovieFilter(e.target.value)}
                  className="text-xs border border-neutral-200 px-2 py-1 rounded bg-neutral-50"
                >
                  <option value="all">Tất cả phim</option>
                  <option value="dangChieu">Đang chiếu</option>
                  <option value="sapChieu">Sắp chiếu</option>
                </select>
              </div>
              <select 
                name="maPhim" 
                value={form.maPhim} 
                onChange={handleChange} 
                className="w-full border border-neutral-200 px-4 py-3 rounded-lg bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-transparent" 
                required
              >
                <option value="">-- Chọn phim --</option>
                {filteredMovies.map(phim => (
                  <option key={phim.maPhim} value={phim.maPhim}>
                    {phim.tenPhim} {phim.dangChieu ? "(Đang chiếu)" : phim.sapChieu ? "(Sắp chiếu)" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-2 text-sm">Chọn hệ thống rạp</label>
              <select 
                name="selectedHeThong" 
                value={selectedHeThong} 
                onChange={e => {
                  setSelectedHeThong(e.target.value);
                  setCumRapList([]); // Clear previous cum rap list
                  fetchCumRapList(e.target.value);
                }} 
                className="w-full border border-neutral-200 px-4 py-3 rounded-lg bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-transparent" 
                required
              >
                <option value="">-- Chọn hệ thống rạp --</option>
                {heThongList.map(heThong => (
                  <option key={heThong.maHeThongRap} value={heThong.maHeThongRap}>{heThong.tenHeThongRap}</option>
                ))}
              </select>
            </div>

            <div className="relative" ref={cumRapDropdownRef}>
              <label className="block font-semibold mb-2 text-sm">Chọn cụm rạp</label>
              <div 
                className="w-full border border-neutral-200 px-4 py-3 rounded-lg bg-neutral-50 focus-within:ring-2 focus-within:ring-green-200 focus-within:border-transparent cursor-pointer flex items-center justify-between"
                onClick={() => setShowCumRapDropdown(!showCumRapDropdown)}
              >
                <span className={form.maRap ? "text-neutral-900" : "text-neutral-500"}>
                  {form.maRap 
                    ? cumRapList.find(rap => rap.maCumRap === form.maRap)?.tenCumRap 
                    : "-- Chọn cụm rạp --"
                  }
                </span>
                <i className={`fas fa-chevron-down text-neutral-400 transition-transform ${showCumRapDropdown ? 'rotate-180' : ''}`}></i>
              </div>
              
              {showCumRapDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                  {cumRapList.length > 0 ? (
                    cumRapList.map(cumRap => (
                      <div
                        key={cumRap.maCumRap}
                        className="px-4 py-3 hover:bg-neutral-50 cursor-pointer border-b border-neutral-100 last:border-b-0"
                        onClick={() => handleCumRapSelect(cumRap.maCumRap, cumRap.tenCumRap)}
                      >
                        {cumRap.tenCumRap}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-neutral-500">
                      Không có cụm rạp nào
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block font-semibold mb-2 text-sm">Ngày giờ chiếu</label>
              <input 
                type="datetime-local" 
                name="ngayChieuGioChieu" 
                value={form.ngayChieuGioChieu} 
                onChange={handleChange} 
                min={selectedMovieInfo ? (() => {
                  const releaseDate = new Date(selectedMovieInfo.ngayKhoiChieu);
                  return `${releaseDate.getFullYear()}-${String(releaseDate.getMonth() + 1).padStart(2, '0')}-${String(releaseDate.getDate()).padStart(2, '0')}T00:00`;
                })() : undefined}
                className={`w-full border px-4 py-3 rounded-lg bg-neutral-50 focus:outline-none focus:ring-2 focus:border-transparent ${
                  !dateValidation.isValid 
                    ? 'border-red-300 focus:ring-red-200' 
                    : 'border-neutral-200 focus:ring-green-200'
                }`}
                required 
              />
              {!dateValidation.isValid && (
                <div className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <i className="fas fa-exclamation-triangle"></i>
                  {dateValidation.message}
                </div>
              )}
              {selectedMovieInfo && (
                <div className="mt-1 text-xs text-blue-600 flex items-center gap-1">
                  <i className="fas fa-info-circle"></i>
                  Chỉ có thể chọn từ ngày khởi chiếu ({selectedMovieInfo.ngayKhoiChieu}) trở đi
                </div>
              )}
            </div>

            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <label className="font-semibold text-sm">Giá vé thường (VNĐ)</label>
                <div className="relative group">
                  <button 
                    type="button"
                    className="w-5 h-5 bg-blue-500 text-white rounded-full text-xs font-bold flex items-center justify-center hover:bg-blue-600 transition-colors"
                  >
                    !
                  </button>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    <div className="font-medium mb-1">Lưu ý về giá vé:</div>
                    <div>• Giá vé thường: Giá vé cơ bản</div>
                    <div>• Giá vé VIP: Tự động +20%</div>
                    <div>• Ví dụ: 100,000 → VIP: 120,000 VNĐ</div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              </div>
              <input 
                type="number" 
                name="giaVe" 
                value={form.giaVe} 
                onChange={handleChange} 
                className="w-full border border-neutral-200 px-4 py-3 rounded-lg bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-transparent" 
                min={75000} 
                max={200000} 
                placeholder="Nhập giá vé thường từ 75,000 - 200,000 VNĐ"
                required 
              />
            </div>
          </div>

          {/* Thông tin phim được chọn */}
          {selectedMovieInfo && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-4">
                <img 
                  src={selectedMovieInfo.hinhAnh} 
                  alt={selectedMovieInfo.tenPhim} 
                  className="w-16 h-24 object-cover rounded shadow"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-blue-900 mb-2">{selectedMovieInfo.tenPhim}</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-semibold text-blue-700">Ngày khởi chiếu:</span>
                      <span className="ml-2 text-blue-600">{selectedMovieInfo.ngayKhoiChieu}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-blue-700">Đánh giá:</span>
                      <span className="ml-2 text-blue-600">{selectedMovieInfo.danhGia}/10</span>
                    </div>
                    <div>
                      <span className="font-semibold text-blue-700">Trạng thái:</span>
                      <span className="ml-2">
                        {selectedMovieInfo.dangChieu ? (
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Đang chiếu</span>
                        ) : selectedMovieInfo.sapChieu ? (
                          <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs">Sắp chiếu</span>
                        ) : (
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">Không xác định</span>
                        )}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-blue-700">Hot:</span>
                      <span className="ml-2">
                        {selectedMovieInfo.hot ? (
                          <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">🔥 Hot</span>
                        ) : (
                          <span className="text-gray-500">Không</span>
                        )}
                      </span>
                    </div>
                  </div>
                  {selectedMovieInfo.moTa && (
                    <div className="mt-2">
                      <span className="font-semibold text-blue-700">Mô tả:</span>
                      <p className="text-blue-600 text-sm mt-1 line-clamp-2">{selectedMovieInfo.moTa}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {message && (
            <div className={`p-4 rounded-lg ${
              message.includes('thành công') 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          <div className="flex justify-end">
            <button 
              type="submit" 
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-200 flex items-center gap-2" 
              disabled={loading || !dateValidation.isValid}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Đang tạo...
                </>
              ) : (
                <>
                  <i className="fas fa-plus"></i>
                  Tạo lịch chiếu
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 