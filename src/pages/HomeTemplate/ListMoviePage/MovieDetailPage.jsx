import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import api, { movieAPI } from "../../../services/api";
import { FaInfoCircle, FaStar, FaPlayCircle, FaTicketAlt, FaRegBookmark } from "react-icons/fa";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function MovieDetailPage() {
  const { maPhim } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const maLichChieuFromQuery = query.get("maLichChieu");
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('info');
  const [lichChieu, setLichChieu] = useState(null);
  const [loadingLichChieu, setLoadingLichChieu] = useState(true);
  const [selectedHeThong, setSelectedHeThong] = useState(null);
  const [selectedLichChieu, setSelectedLichChieu] = useState(null);
  const [showSelectWarning, setShowSelectWarning] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const lichChieuRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    api.get(`QuanLyPhim/LayThongTinPhim?MaPhim=${maPhim}`)
      .then(res => {
        setMovie(res.data.content);
        setLoading(false);
      })
      .catch(() => {
        setError("Không thể tải thông tin phim.");
        setLoading(false);
      });
    setLoadingLichChieu(true);
    movieAPI.getLichChieuPhim(maPhim)
      .then(res => {
        setLichChieu(res.data.content);
        setLoadingLichChieu(false);
        // Chọn hệ thống đầu tiên nếu có
        if (res.data.content && res.data.content.heThongRapChieu && res.data.content.heThongRapChieu.length > 0) {
          setSelectedHeThong(res.data.content.heThongRapChieu[0].maHeThongRap);
        }
      })
      .catch(() => {
        setLichChieu(null);
        setLoadingLichChieu(false);
      });
  }, [maPhim]);

  // Khi có maLichChieu trên URL, tự động chọn
  useEffect(() => {
    if (!lichChieu || !lichChieu.heThongRapChieu) return;
    let found = null;
    lichChieu.heThongRapChieu.forEach(htr => {
      htr.cumRapChieu.forEach(cum => {
        cum.lichChieuPhim.forEach(lich => {
          if (String(lich.maLichChieu) === String(maLichChieuFromQuery)) found = lich;
        });
      });
    });
    if (found) setSelectedLichChieu(found);
  }, [lichChieu, maLichChieuFromQuery]);

  const handleTabChange = (tab) => {
    if (tab !== activeTab) setActiveTab(tab);
  };

  // Hàm lọc lịch chiếu theo ngày
  const filterLichChieuByDate = (lichChieuList, targetDate) => {
    if (!targetDate || !lichChieuList) return lichChieuList;
    
    return lichChieuList.filter(lich => {
      const lichDate = new Date(lich.ngayChieuGioChieu);
      const targetDateObj = new Date(targetDate);
      
      return lichDate.toDateString() === targetDateObj.toDateString();
    });
  };

  // Hàm lấy danh sách ngày từ hôm nay đến 7 ngày sau
  const getAvailableDates = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  };

  // Hàm kiểm tra xem ngày có lịch chiếu hay không
  const hasScheduleForDate = (targetDate) => {
    if (!lichChieu || !lichChieu.heThongRapChieu) return false;
    
    return lichChieu.heThongRapChieu.some(heThong => 
      heThong.cumRapChieu.some(cumRap => 
        cumRap.lichChieuPhim.some(lich => {
          const lichDate = new Date(lich.ngayChieuGioChieu);
          const targetDateObj = new Date(targetDate);
          return lichDate.toDateString() === targetDateObj.toDateString();
        })
      )
    );
  };

  // Tự động chọn ngày đầu tiên khi có dữ liệu
  useEffect(() => {
    if (lichChieu && !selectedDate) {
      const availableDates = getAvailableDates();
      if (availableDates.length > 0) {
        // Tìm ngày đầu tiên không quá hạn
        const now = new Date();
        const today = now.setHours(0, 0, 0, 0);
        
        const validDate = availableDates.find(date => {
          const dateObj = new Date(date);
          return dateObj >= today;
        });
        
        if (validDate) {
          setSelectedDate(validDate);
        } else {
          // Nếu tất cả ngày đều quá hạn, chọn ngày đầu tiên
          setSelectedDate(availableDates[0]);
        }
      }
    }
  }, [lichChieu, selectedDate]);

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-lg text-gray-600">Đang tải thông tin phim...</div>;
  if (error) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-lg text-red-500">{error}</div>;
  if (!movie) return null;

  const handleBookTicket = (maLichChieu) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      // Lưu lại đường dẫn hiện tại để redirect sau login
      localStorage.setItem("redirectAfterLogin", `/booking/${maLichChieu}`);
      navigate("/login");
    } else {
      navigate(`/booking/${maLichChieu}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section (Banner) */}
      <div className="relative h-64 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-700"></div>
        <div className="relative container mx-auto px-6 h-full flex items-center z-10">
          <div className="text-white mt-8 md:mt-16">
            <h1 className="text-3xl md:text-5xl font-bold mb-3">{movie.tenPhim}
              {movie.hot && <span className="ml-3 px-2 py-1 bg-red-500 text-white text-xs rounded">HOT</span>}
              {movie.dangChieu && <span className="ml-2 px-2 py-1 bg-green-500 text-white text-xs rounded">Đang chiếu</span>}
              {movie.sapChieu && <span className="ml-2 px-2 py-1 bg-yellow-500 text-white text-xs rounded">Sắp chiếu</span>}
            </h1>
            <div className="flex items-center gap-4 text-sm">
              <span className="bg-white bg-opacity-80 backdrop-blur-sm px-3 py-1 rounded-lg text-black font-medium">
                {movie.maPhim}
              </span>
              <span className="text-gray-300">|</span>
              <span className="text-gray-300">Khởi chiếu: {movie.ngayKhoiChieu}</span>
              <span className="text-gray-300">|</span>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-white font-medium">{movie.danhGia}/10</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-row"> {/* Loại bỏ space-x và gap */}
          {/* Left Content Area */}
          <div className="flex-1">
            {activeTab === 'info' && (
              <div className="max-w-6xl">
                {/* Hàng 1: Ảnh + Thông tin */}
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Movie Poster */}
                  <div className="flex justify-center lg:justify-start lg:w-1/3">
                    <img
                      src={movie.hinhAnh}
                      alt={movie.tenPhim}
                      className="w-full max-w-xs rounded-lg shadow-lg"
                    />
                  </div>
                  {/* Movie Info */}
                  <div className="space-y-6 flex-1">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Tóm tắt</h2>
                      <p className="text-gray-700 leading-relaxed">{movie.moTa}</p>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Thông tin phim</h2>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                          <div className="text-sm text-gray-500 mb-1">Mã phim</div>
                          <div className="text-lg font-semibold">{movie.maPhim}</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                          <div className="text-sm text-gray-500 mb-1">Đánh giá</div>
                          <div className="text-lg font-semibold">{movie.danhGia}/10</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm col-span-2 flex gap-4">
                          <div className="text-sm text-gray-500 mb-1">Trạng thái</div>
                          <div className="flex gap-2">
                            {movie.hot && <span className="px-2 py-1 bg-red-500 text-white text-xs rounded">HOT</span>}
                            {movie.dangChieu && <span className="px-2 py-1 bg-green-500 text-white text-xs rounded">Đang chiếu</span>}
                            {movie.sapChieu && <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded">Sắp chiếu</span>}
                            {!(movie.hot || movie.dangChieu || movie.sapChieu) && <span className="text-gray-400">Không có</span>}
                          </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm col-span-2">
                          <div className="text-sm text-gray-500 mb-1">Ngày khởi chiếu</div>
                          <div className="text-lg font-semibold">{movie.ngayKhoiChieu}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Hàng 2: Lịch chiếu */}
                <div className="mt-10" ref={lichChieuRef}>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Lịch chiếu</h2>
                  
                  {/* Chọn ngày */}
                  <div className="mb-6">
                    <label className="block font-semibold text-gray-700 mb-2">Chọn ngày chiếu:</label>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {getAvailableDates().map((date) => {
                        const dateObj = new Date(date);
                        const isToday = dateObj.toDateString() === new Date().toDateString();
                        const isSelected = selectedDate === date;
                        
                        // Kiểm tra xem ngày có quá hạn so với lịch chiếu hay không
                        const now = new Date();
                        const isExpired = dateObj < now.setHours(0, 0, 0, 0);
                        
                        return (
                          <button
                            key={date}
                            onClick={() => setSelectedDate(date)}
                            className={`px-4 py-2 rounded-lg border font-medium whitespace-nowrap transition-all text-sm flex flex-col items-center min-w-[80px] ${
                              isExpired
                                ? 'bg-gray-200 text-gray-400 border-gray-200 hover:bg-gray-100'
                                : isSelected 
                                  ? 'bg-blue-500 text-white border-blue-500 shadow-md' 
                                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <span className="text-xs opacity-80">
                              {dateObj.toLocaleDateString('vi-VN', { weekday: 'short' })}
                            </span>
                            <span className="font-bold">
                              {dateObj.getDate()}/{dateObj.getMonth() + 1}
                            </span>
                            {isToday && !isExpired && (
                              <span className="text-xs bg-green-500 text-white px-1 rounded mt-1">Hôm nay</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {showSelectWarning && (
                    <div className="mt-1 mb-4 p-3 bg-pink-100 text-pink-700 rounded font-semibold text-center animate-pulse">
                      Vui lòng chọn hệ thống rạp và suất chiếu để đặt vé.
                    </div>
                  )}
                  {loadingLichChieu ? (
                    <div className="text-gray-500 py-4">Đang tải lịch chiếu...</div>
                  ) : !lichChieu || !lichChieu.heThongRapChieu || lichChieu.heThongRapChieu.length === 0 ? (
                    <div className="text-gray-400 italic py-4">Không có lịch chiếu cho phim này.</div>
                  ) : !selectedDate ? (
                    <div className="text-gray-400 italic py-4">Vui lòng chọn ngày chiếu.</div>
                  ) : !hasScheduleForDate(selectedDate) ? (
                    <div className="text-gray-400 italic py-4">Không có lịch chiếu cho ngày {selectedDate ? new Date(selectedDate).toLocaleDateString('vi-VN') : ''}.</div>
                  ) : (
                    <>
                     {/* Thanh chọn hệ thống rạp */}
                     <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
                       {lichChieu.heThongRapChieu.map((heThong) => (
                         <button
                           key={heThong.maHeThongRap}
                           onClick={() => setSelectedHeThong(heThong.maHeThongRap)}
                           className={`px-6 py-3 rounded-full border font-semibold whitespace-nowrap transition-all text-base flex items-center gap-2 ${selectedHeThong === heThong.maHeThongRap ? 'bg-pink-100 text-pink-600 border-pink-400 shadow' : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-100'}`}
                           style={{ minWidth: 120 }}
                         >
                           {heThong.logo && (
                             <img src={heThong.logo} alt={heThong.tenHeThongRap} className="w-6 h-6 object-contain rounded-full bg-white border" />
                           )}
                           {heThong.tenHeThongRap}
                         </button>
                       ))}
                     </div>
                     {/* Lịch chiếu của hệ thống đã chọn */}
                     {(() => {
                       const heThong = lichChieu.heThongRapChieu.find(h => h.maHeThongRap === selectedHeThong);
                       if (!heThong) return <div className="text-gray-400 italic">Không có lịch chiếu cho hệ thống này.</div>;
                       return (
                         <div className="space-y-8">
                           {heThong.cumRapChieu.map((cumRap) => (
                             <div key={cumRap.maCumRap} className="mb-6">
                               <div className="font-bold text-lg text-gray-900 mb-1">{heThong.tenHeThongRap} - {cumRap.tenCumRap}</div>
                               <div className="text-xs text-gray-500 mb-2">{cumRap.diaChi}</div>
                               <div className="flex flex-wrap gap-2">
                                 {(() => {
                                   const filteredLichChieu = filterLichChieuByDate(cumRap.lichChieuPhim, selectedDate);
                                   return filteredLichChieu && filteredLichChieu.length > 0 ? (
                                     filteredLichChieu.slice(0, 20).map((lich) => {
                                       // Kiểm tra xem suất chiếu có quá hạn hay không
                                       const lichDate = new Date(lich.ngayChieuGioChieu);
                                       const now = new Date();
                                       const isExpired = lichDate < now;
                                       
                                       return (
                                         <span
                                           key={lich.maLichChieu}
                                           className={`px-3 py-2 text-sm font-medium rounded-lg transition-all shadow-sm ${
                                             isExpired
                                               ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60'
                                               : 'bg-[#fbbf24] text-white cursor-pointer hover:bg-[#fbbf24]/90 hover:shadow-md transform hover:scale-105'
                                           } ${selectedLichChieu?.maLichChieu === lich.maLichChieu && !isExpired ? 'ring-2 ring-pink-500' : ''}`}
                                           onClick={() => {
                                             if (!isExpired) {
                                               setSelectedLichChieu({
                                                 ...lich,
                                                 _tenHeThongRap: heThong.tenHeThongRap,
                                                 _tenCumRap: cumRap.tenCumRap
                                               });
                                             }
                                           }}
                                         >
                                           {lichDate.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })}
                                           {isExpired && <span className="ml-1 text-xs">(Quá hạn)</span>}
                                         </span>
                                       );
                                     })
                                   ) : (
                                     <span className="text-gray-400 italic">Không có suất chiếu cho ngày đã chọn</span>
                                   );
                                 })()}
                               </div>
                             </div>
                           ))}
                         </div>
                       );
                     })()}
                    </>
                  )}
                </div>
              </div>
            )}
            {activeTab === 'review' && movie.trailer && (
              <div className="max-w-5xl">
              
                <div className="relative bg-black rounded-lg overflow-hidden shadow-lg">
                  <div className="aspect-video">
                    <iframe
                      title="Trailer"
                      width="100%"
                      height="100%"
                      src={movie.trailer.replace("watch?v=", "embed/")}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0"
                    ></iframe>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="w-72 min-w-[18rem] mr-0"> {/* Loại bỏ mr-4, giữ w-72 và min-width */}
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-28">
              {/* Navigation Tabs */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => handleTabChange('info')}
                  className={`w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 border border-gray-300 ${
                    activeTab === 'info' 
                      ? 'bg-gray-900 text-white' 
                      : 'bg-white text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span className="inline-flex items-center gap-2 justify-center">
                    <FaInfoCircle className="text-black" /> Thông tin phim
                  </span>
                </button>
                <button
                  onClick={() => handleTabChange('review')}
                  className={`w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 border border-gray-300 ${
                    activeTab === 'review' 
                      ? 'bg-gray-900 text-white' 
                      : 'bg-white text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span className="inline-flex items-center gap-2 justify-center">
                    <FaPlayCircle className="text-black" /> Xem Trailer 
                  </span>
                </button>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 my-6"></div>

              {/* Quick Info */}
              <div className="space-y-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Thông tin nhanh</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 inline-flex items-center gap-1"><FaStar className="text-black" /> Đánh giá:</span>
                    <span className="font-semibold text-amber-600">{movie.danhGia}/10</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Mã phim:</span>
                    <span className="font-semibold">{movie.maPhim}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Ngày khởi chiếu:</span>
                    <span className="font-semibold">{movie.ngayKhoiChieu}</span>
                  </div>
                </div>
              </div>

              {/* Ticket Booking */}
              <div className="space-y-3">
                {/* Chọn suất chiếu */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Suất chiếu đã chọn:</label>
                  {selectedLichChieu ? (
                    <>
                      <div className="text-base font-semibold text-pink-600">
                        {new Date(selectedLichChieu.ngayChieuGioChieu).toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit", year: "numeric" })}
                      </div>
                      <div className="text-sm text-gray-700 mt-1">
                        <span className="font-semibold">Hệ thống rạp:</span> {selectedLichChieu._tenHeThongRap}
                      </div>
                      <div className="text-sm text-gray-700">
                        <span className="font-semibold">Chi nhánh:</span> {selectedLichChieu._tenCumRap}
                      </div>
                    </>
                  ) : (
                    <div className="text-gray-400 italic">Chưa chọn suất chiếu</div>
                  )}
                </div>
                {/* Nút đặt vé ngay */}
                <button
                  className={`w-full px-6 py-3 font-semibold rounded-lg transition-all duration-200 shadow-md flex items-center justify-center gap-2 mt-2 ${
                    selectedLichChieu && new Date(selectedLichChieu.ngayChieuGioChieu) < new Date()
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 hover:shadow-lg transform hover:-translate-y-0.5'
                  }`}
                  onClick={() => {
                    if (selectedLichChieu) {
                      // Kiểm tra xem suất chiếu có quá hạn hay không
                      if (new Date(selectedLichChieu.ngayChieuGioChieu) < new Date()) {
                        // Suất chiếu đã quá hạn
                        return;
                      }
                      handleBookTicket(selectedLichChieu.maLichChieu);
                    } else {
                      if (activeTab !== 'info') {
                        handleTabChange('info');
                        setTimeout(() => {
                          setShowSelectWarning(true);
                          setTimeout(() => setShowSelectWarning(false), 2500);
                          if (lichChieuRef.current) {
                            lichChieuRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                        }, 100); // Đợi tab chuyển xong mới scroll
                      } else {
                        setShowSelectWarning(true);
                        setTimeout(() => setShowSelectWarning(false), 2500);
                        if (lichChieuRef.current) {
                          lichChieuRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }
                    }
                  }}
                  disabled={selectedLichChieu && new Date(selectedLichChieu.ngayChieuGioChieu) < new Date()}
                >
                  {selectedLichChieu && new Date(selectedLichChieu.ngayChieuGioChieu) < new Date() 
                    ? 'Suất chiếu đã quá hạn' 
                    : 'Đặt vé ngay'
                  }
                </button>
              
              </div>

              {/* Social Share */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Chia sẻ phim</h4>
                <div className="flex justify-center space-x-3">
                  <button className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </button>
                  <button className="p-2 bg-blue-800 text-white rounded-full hover:bg-blue-900 transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </button>
                  <button className="p-2 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.083.347-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001 12.017 0z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% { background-size: 200% 200%; background-position: left center; }
          50% { background-size: 200% 200%; background-position: right center; }
        }
        .animate-gradient-x { animation: gradient-x 8s ease infinite; }
      `}</style>
      {/* Hide scrollbar utility for horizontal scroll */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}