import { useEffect, useState } from "react";
import { movieAPI } from "../../../services/api";
import { ChevronLeft, ChevronRight, Clock, MapPin, Calendar, Film, Star, Play, Sparkles, Award, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NewsPage() {
  const [heThongRapList, setHeThongRapList] = useState([]);
  const [selectedHeThongRap, setSelectedHeThongRap] = useState(null);
  const [cumRapList, setCumRapList] = useState([]);
  const [selectedCumRap, setSelectedCumRap] = useState(null);
  const [movieList, setMovieList] = useState([]);
  const [lichChieuByPhim, setLichChieuByPhim] = useState({});
  const [loading, setLoading] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [moviesPerPage] = useState(6);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Filter states
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [filterType, setFilterType] = useState('coLich'); // 'coLich', 'tatCa'

  // Hero carousel state
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  // Lấy danh sách hệ thống rạp
  useEffect(() => {
    movieAPI.getHeThongRap().then(res => {
      setHeThongRapList(res.data.content);
      if (res.data.content.length > 0) {
        setSelectedHeThongRap(res.data.content[0].maHeThongRap);
      }
    });
  }, []);

  // Lấy danh sách cụm rạp khi chọn hệ thống rạp
  useEffect(() => {
    if (selectedHeThongRap) {
      setLoading(true);
      movieAPI.getCumRapTheoHeThong(selectedHeThongRap).then(res => {
        setCumRapList(res.data.content);
        if (res.data.content.length > 0) {
          setSelectedCumRap(res.data.content[0].maCumRap);
        }
        setLoading(false);
      });
    }
  }, [selectedHeThongRap]);

  // Lấy danh sách phim
  useEffect(() => {
    movieAPI.getMovieList().then(res => {
      setMovieList(res.data.content);
    });
  }, []);

  // Lấy lịch chiếu cho từng phim khi đã có cụm rạp và phim
  useEffect(() => {
    const fetchAllLichChieu = async () => {
      if (!cumRapList.length || !movieList.length) return;
      setLoading(true);
      const lichChieuObj = {};
      for (const movie of movieList) {
        try {
          const res = await movieAPI.getLichChieuPhim(movie.maPhim);
          const heThong = res.data.content?.heThongRapChieu?.find(htr => htr.maHeThongRap === selectedHeThongRap);
          let lichChieuArr = [];
          if (heThong && heThong.cumRapChieu) {
            for (const cumRap of heThong.cumRapChieu) {
              if (cumRapList.some(cr => cr.maCumRap === cumRap.maCumRap)) {
                for (const lich of cumRap.lichChieuPhim || []) {
                  lichChieuArr.push({
                    ...lich,
                    tenCumRap: cumRap.tenCumRap,
                    diaChi: cumRap.diaChi,
                  });
                }
              }
            }
          }
          lichChieuObj[movie.maPhim] = lichChieuArr;
        } catch {
          lichChieuObj[movie.maPhim] = [];
        }
      }
      setLichChieuByPhim(lichChieuObj);
      setLoading(false);
    };
    fetchAllLichChieu();
    setCurrentPage(1); // Reset về trang đầu khi thay đổi rạp
  }, [cumRapList, movieList, selectedHeThongRap]);

  // Auto-rotate hero carousel with movies from API
  useEffect(() => {
    if (movieList.length > 0) {
      const interval = setInterval(() => {
        setCurrentHeroIndex((prev) => (prev + 1) % Math.min(movieList.length, 3));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [movieList]);

  // Pagination logic
  const selectedCumRapData = cumRapList.find(cr => cr.maCumRap === selectedCumRap);
  
  // Lọc phim theo filterType và ngày đã chọn
  const filteredMovies = movieList.filter(movie => {
    let lichChieuArr = (lichChieuByPhim[movie.maPhim] || []).filter(lc => lc.tenCumRap === selectedCumRapData?.tenCumRap);
    
    // Lọc theo ngày nếu đã chọn ngày
    if (selectedDate) {
      lichChieuArr = lichChieuArr.filter(lc => {
        const lichDate = new Date(lc.ngayChieuGioChieu);
        const selectedDateObj = new Date(selectedDate);
        return lichDate.toDateString() === selectedDateObj.toDateString();
      });
    }
    
    const hasLichChieu = lichChieuArr.length > 0;
    
    switch (filterType) {
      case 'coLich':
        return hasLichChieu;
      case 'tatCa':
        return true;
      default:
        return hasLichChieu;
    }
  });
  
  const sortedMovies = [...filteredMovies].sort((a, b) => {
    let aLich = (lichChieuByPhim[a.maPhim] || []).filter(lc => lc.tenCumRap === selectedCumRapData?.tenCumRap);
    let bLich = (lichChieuByPhim[b.maPhim] || []).filter(lc => lc.tenCumRap === selectedCumRapData?.tenCumRap);
    
    // Lọc theo ngày nếu đã chọn ngày
    if (selectedDate) {
      aLich = aLich.filter(lc => {
        const lichDate = new Date(lc.ngayChieuGioChieu);
        const selectedDateObj = new Date(selectedDate);
        return lichDate.toDateString() === selectedDateObj.toDateString();
      });
      bLich = bLich.filter(lc => {
        const lichDate = new Date(lc.ngayChieuGioChieu);
        const selectedDateObj = new Date(selectedDate);
        return lichDate.toDateString() === selectedDateObj.toDateString();
      });
    }
    
    return bLich.length - aLich.length;
  });
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = sortedMovies.slice(indexOfFirstMovie, indexOfLastMovie);
  const totalPages = Math.ceil(sortedMovies.length / moviesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showFilterMenu && !event.target.closest('.filter-dropdown')) {
        setShowFilterMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilterMenu]);

  // Generate next 7 days for date filter
  const getNext7Days = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push({
        value: date.toISOString().split('T')[0],
        label: i === 0 ? 'Hôm nay' : i === 1 ? 'Ngày mai' : date.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' }),
        dayName: date.toLocaleDateString('vi-VN', { weekday: 'long' }),
        dayNumber: date.getDate()
      });
    }
    return days;
  };

  const navigate = useNavigate();

  // Get featured movies for hero section (first 3 movies)
  const heroMovies = movieList.slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      {heroMovies.length > 0 && (
        <div className="relative h-[70vh] overflow-hidden">
          {heroMovies.map((movie, index) => (
            <div
              key={movie.maPhim}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentHeroIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${movie.hinhAnh})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30" />
              
              <div className="relative h-full flex items-center">
                <div className="max-w-7xl mx-auto px-4 w-full">
                  <div className="max-w-2xl text-white">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-6 h-6 text-[#fbbf24]" />
                      <span className="text-[#fbbf24] font-semibold">PHIM HOT</span>
                    </div>
                    
                    <h1 className="text-5xl font-bold mb-4 leading-tight">
                      {movie.tenPhim}
                    </h1>
                    
                    <p className="text-xl text-gray-200 mb-6">
                      {movie.moTa ? movie.moTa.substring(0, 100) + '...' : 'Trải nghiệm điện ảnh đầy cảm xúc'}
                    </p>
                    
                    <div className="flex items-center gap-6 mb-8">
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-[#fbbf24] fill-current" />
                        <span className="text-lg font-semibold">{movie.danhGia || '8.5'}/10</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-white" />
                        <span>Bom tấn 2024</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <button 
                        onClick={() => navigate(`/movie/${movie.maPhim}`)}
                        className="flex items-center gap-3 bg-[#fbbf24] hover:bg-[#fbbf24]/90 text-black px-8 py-4 rounded-full font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
                      >
                        <Play className="w-6 h-6 fill-current" />
                        Xem Trailer
                      </button>
                      <button className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/20 transition-all">
                        <Calendar className="w-6 h-6" />
                        Đặt Vé Ngay
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Hero Navigation Dots */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3">
            {heroMovies.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentHeroIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentHeroIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-white rounded-full px-6 py-3 mb-4 shadow-lg border border-gray-200">
            <Film className="w-6 h-6 text-[#fbbf24]" />
            <span className="text-black font-semibold">LỊCH CHIẾU PHIM</span>
          </div>
          <h2 className="text-4xl font-bold text-black mb-2">
            Chọn Rạp & Suất Chiếu
          </h2>
          <p className="text-gray-600 text-lg">
            Trải nghiệm điện ảnh tuyệt vời với chất lượng hình ảnh và âm thanh đỉnh cao
          </p>
        </div>

        {/* Enhanced Date Filter */}
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-xl border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#fbbf24] rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-black" />
            </div>
            <h3 className="text-2xl font-bold text-black">Chọn Ngày Chiếu</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {getNext7Days().map((day) => (
              <button
                key={day.value}
                onClick={() => setSelectedDate(day.value)}
                className={`p-4 rounded-xl text-center transition-all transform hover:scale-105 ${
                  selectedDate === day.value
                    ? 'bg-[#fbbf24] text-black shadow-lg scale-105'
                    : 'bg-white hover:bg-gray-50 text-black shadow-md border border-gray-200'
                }`}
              >
                <div className="text-sm font-medium opacity-80 mb-1">
                  {day.dayName}
                </div>
                <div className="text-2xl font-bold">
                  {day.dayNumber}
                </div>
                <div className="text-xs opacity-60">
                  {day.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Cinema System Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 h-[700px] flex flex-col">
              <div className="flex items-center gap-3 p-6 sticky top-0 bg-white z-10 border-b border-gray-200">
                <div className="w-8 h-8 bg-[#fbbf24] rounded-full flex items-center justify-center">
                  <Film className="w-4 h-4 text-black" />
                </div>
                <h3 className="text-xl font-bold text-black">Hệ Thống Rạp</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-3">
                  {heThongRapList.map((heThong) => (
                    <div
                      key={heThong.maHeThongRap}
                      className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all transform hover:scale-[1.02] ${
                        selectedHeThongRap === heThong.maHeThongRap
                          ? 'bg-[#fbbf24] text-black shadow-lg'
                          : 'bg-gray-50 hover:bg-gray-100 shadow-md border border-gray-200'
                      }`}
                      onClick={() => setSelectedHeThongRap(heThong.maHeThongRap)}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden ${
                        selectedHeThongRap === heThong.maHeThongRap
                          ? 'bg-white/20'
                          : 'bg-white'
                      }`}>
                        {heThong.logo ? (
                          <img 
                            src={heThong.logo} 
                            alt={heThong.tenHeThongRap}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className={`w-full h-full flex items-center justify-center font-bold text-xs ${
                          selectedHeThongRap === heThong.maHeThongRap ? 'text-black' : 'text-[#fbbf24]'
                        } ${!heThong.logo ? 'flex' : 'hidden'}`}>
                          {heThong.tenHeThongRap.substring(0, 3)}
                        </div>
                      </div>
                      <span className="font-semibold text-sm">{heThong.tenHeThongRap}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Branch Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 h-[700px] flex flex-col">
              <div className="flex items-center gap-3 p-6 sticky top-0 bg-white z-10 border-b border-gray-200">
                <div className="w-8 h-8 bg-[#fbbf24] rounded-full flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-black" />
                </div>
                <h3 className="text-xl font-bold text-black">Chi Nhánh</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-3 border-[#fbbf24] border-t-transparent mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang tải...</p>
                  </div>
                ) : cumRapList.length === 0 ? (
                  <div className="text-center py-12">
                    <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">Không có chi nhánh</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cumRapList.map((cumRap) => (
                      <div
                        key={cumRap.maCumRap}
                        className={`p-4 rounded-xl cursor-pointer transition-all transform hover:scale-[1.02] ${
                          selectedCumRap === cumRap.maCumRap
                            ? 'bg-[#fbbf24] text-black shadow-lg'
                            : 'bg-gray-50 hover:bg-gray-100 shadow-md border border-gray-200'
                        }`}
                        onClick={() => setSelectedCumRap(cumRap.maCumRap)}
                      >
                        <div className="font-semibold text-sm mb-2">{cumRap.tenCumRap}</div>
                        <div className="text-xs opacity-80 line-clamp-2">{cumRap.diaChi}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Movie Schedule */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 h-[700px] flex flex-col">
              <div className="flex items-center justify-between p-6 sticky top-0 bg-white z-10 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#fbbf24] rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-black" />
                  </div>
                  <h3 className="text-xl font-bold text-black">
                    Lịch Chiếu Phim
                    {movieList.length > 0 && (
                      <span className="text-sm text-gray-500 font-normal ml-2">({sortedMovies.length} phim)</span>
                    )}
                    {selectedDate && (
                      <div className="text-sm text-blue-600 font-medium mt-1">
                        Đang lọc theo ngày: {new Date(selectedDate).toLocaleDateString('vi-VN')}
                      </div>
                    )}
                  </h3>
                </div>
                
                {/* Enhanced Filter Dropdown */}
                <div className="relative filter-dropdown">
                  <button
                    onClick={() => setShowFilterMenu(!showFilterMenu)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
                  >
                    <Search className="w-4 h-4" />
                    <span>
                      {filterType === 'coLich' && 'Có lịch chiếu'}
                      {filterType === 'tatCa' && 'Tất cả phim'}
                    </span>
                    <svg className={`w-4 h-4 transition-transform ${showFilterMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {showFilterMenu && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-10 overflow-hidden">
                      <div className="py-2">
                        <button
                          onClick={() => {
                            setFilterType('coLich');
                            setShowFilterMenu(false);
                            setCurrentPage(1);
                          }}
                          className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-100 transition-colors ${
                            filterType === 'coLich' ? 'text-[#fbbf24] font-medium bg-yellow-50' : 'text-black'
                          }`}
                        >
                          Có lịch chiếu
                        </button>
                        <button
                          onClick={() => {
                            setFilterType('tatCa');
                            setShowFilterMenu(false);
                            setCurrentPage(1);
                          }}
                          className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-100 transition-colors ${
                            filterType === 'tatCa' ? 'text-[#fbbf24] font-medium bg-yellow-50' : 'text-black'
                          }`}
                        >
                          Tất cả phim
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                {loading ? (
                  <div className="text-center py-16">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#fbbf24] border-t-transparent mx-auto"></div>
                    <p className="mt-4 text-gray-600 text-lg">Đang tải lịch chiếu...</p>
                  </div>
                ) : !selectedCumRap ? (
                  <div className="text-center py-16">
                    <Clock className="w-20 h-20 mx-auto mb-4 text-gray-300" />
                    <p className="text-xl text-gray-500">Vui lòng chọn chi nhánh</p>
                  </div>
                ) : (
                  <>
                    {/* Enhanced Movies Grid */}
                    <div className="space-y-6 mb-8">
                      {currentMovies.map((movie) => {
                        // Lọc lịch chiếu theo cụm rạp và ngày đã chọn
                        const lichChieuArr = (lichChieuByPhim[movie.maPhim] || [])
                          .filter(lc => lc.tenCumRap === selectedCumRapData?.tenCumRap)
                          .filter(lc => {
                            if (!selectedDate) return true;
                            const lichDate = new Date(lc.ngayChieuGioChieu);
                            const selectedDateObj = new Date(selectedDate);
                            return lichDate.toDateString() === selectedDateObj.toDateString();
                          });
                        const hasLichChieu = lichChieuArr.length > 0;
                        return (
                          <div
                            key={movie.maPhim}
                            className={`flex gap-6 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] border border-gray-100 ${!hasLichChieu ? 'opacity-50' : 'cursor-pointer'}`}
                            onClick={() => hasLichChieu && navigate(`/movie/${movie.maPhim}`)}
                          >
                            <div className="relative flex-shrink-0">
                              <img 
                                src={movie.hinhAnh} 
                                alt={movie.tenPhim} 
                                className="w-20 h-28 object-cover rounded-xl shadow-md" 
                              />
                              {movie.hot && (
                                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                                  HOT
                                </div>
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xl font-bold text-black mb-2 line-clamp-1">{movie.tenPhim}</h4>
                              
                              {movie.danhGia && (
                                <div className="flex items-center gap-2 mb-3">
                                  <Star className="w-4 h-4 text-[#fbbf24] fill-current" />
                                  <span className="text-sm font-semibold text-gray-700">{movie.danhGia}/10</span>
                                </div>
                              )}
                              
                              <div className="flex flex-wrap gap-2">
                                {hasLichChieu ? (
                                  lichChieuArr.slice(0, 6).map((suatChieu) => (
                                    <button
                                      key={suatChieu.maLichChieu}
                                      className="px-4 py-2 bg-[#fbbf24] text-black text-sm font-medium rounded-lg hover:bg-[#fbbf24]/90 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                                      onClick={e => { 
                                        e.stopPropagation(); 
                                        navigate(`/movie/${movie.maPhim}?maLichChieu=${suatChieu.maLichChieu}`); 
                                      }}
                                    >
                                      {new Date(suatChieu.ngayChieuGioChieu).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </button>
                                  ))
                                ) : (
                                  <span className="text-gray-400 italic px-4 py-2 bg-gray-100 rounded-lg">
                                    {selectedDate ? `Không có lịch chiếu ngày ${new Date(selectedDate).toLocaleDateString('vi-VN')}` : 'Không có lịch chiếu'}
                                  </span>
                                )}
                                
                                {lichChieuArr.length > 6 && (
                                  <span className="text-sm text-gray-500 px-3 py-2 bg-gray-100 rounded-lg">
                                    +{lichChieuArr.length - 6} suất khác
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Enhanced Pagination */}
                    {totalPages > 1 && (
                      <div className="flex justify-center items-center gap-3 pt-6 border-t border-gray-200">
                        <button
                          onClick={() => paginate(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-300 text-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          Trước
                        </button>
                        
                        <div className="flex gap-2">
                          {[...Array(totalPages)].map((_, index) => (
                            <button
                              key={index + 1}
                              onClick={() => paginate(index + 1)}
                              className={`w-10 h-10 rounded-xl font-semibold transition-all ${
                                currentPage === index + 1
                                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-110'
                                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm'
                              }`}
                            >
                              {index + 1}
                            </button>
                          ))}
                        </div>
                        
                        <button
                          onClick={() => paginate(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                        >
                          Sau
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white rounded-2xl p-6 text-center shadow-xl border border-gray-200">
            <div className="w-12 h-12 bg-[#fbbf24] rounded-full flex items-center justify-center mx-auto mb-4">
              <Film className="w-6 h-6 text-black" />
            </div>
            <h3 className="text-2xl font-bold text-black mb-2">{movieList.length}</h3>
            <p className="text-gray-600">Phim đang chiếu</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 text-center shadow-xl border border-gray-200">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-black mb-2">{cumRapList.length}</h3>
            <p className="text-gray-600">Chi nhánh rạp</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 text-center shadow-xl border border-gray-200">
            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-black mb-2">
              {Object.values(lichChieuByPhim).reduce((total, lichChieu) => total + lichChieu.length, 0)}
            </h3>
            <p className="text-gray-600">Suất chiếu hôm nay</p>
          </div>
        </div>
      </div>
    </div>
  );
}