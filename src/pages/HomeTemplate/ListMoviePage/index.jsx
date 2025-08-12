import { useEffect, useState } from "react";
import Movie from "./Movie";
import { useSelector, useDispatch } from "react-redux";
import { fetchListMovie } from "./slice";
import { movieAPI } from "../../../services/api";
import { FaTicketAlt, FaSearch, FaInstagram, FaTwitter, FaInfoCircle } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import TopRatedSlider from "./TopRatedSlider";
import { useNavigate } from "react-router-dom";
import NowShowingMovies from "./NowShowingMovies";
import ComingSoonMovies from "./ComingSoonMovies";

export default function ListMoviePage() {
  const { data } = useSelector((state) => state.listMovieSlice);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Banner state
  const [banners, setBanners] = useState([]);
  const [bannerMovies, setBannerMovies] = useState([]); // Thông tin chi tiết phim từ banner
  const [bannerLoading, setBannerLoading] = useState(true);
  const [bannerError, setBannerError] = useState(null);
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    dispatch(fetchListMovie());
    // Fetch banner
    movieAPI.getBanners()
      .then((res) => {
        const bannerData = res.data.content;
        setBanners(bannerData);
        
        // Lấy thông tin chi tiết cho từng phim trong banner
        const fetchMovieDetails = async () => {
          try {
            const moviePromises = bannerData.map(banner => 
              movieAPI.getMovieDetail(banner.maPhim)
                .then(response => response.data.content)
                .catch(error => {
                  console.error(`Error fetching movie ${banner.maPhim}:`, error);
                  return null;
                })
            );
            
            const movieDetails = await Promise.all(moviePromises);
            setBannerMovies(movieDetails.filter(movie => movie !== null));
            setBannerLoading(false);
          } catch (error) {
            console.error("Error fetching movie details:", error);
            setBannerError("Không thể tải thông tin phim");
            setBannerLoading(false);
          }
        };
        
        fetchMovieDetails();
      })
      .catch(() => {
        setBannerError("Không thể tải banner");
        setBannerLoading(false);
      });
  }, [dispatch]);

  // Auto slide banner
  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % banners.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [banners]);

  const handlePrev = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
  };
  const handleNext = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  const handleMovieInfo = () => {
    const currentMovie = bannerMovies[currentBanner];
    if (currentMovie) {
      navigate(`/movie/${currentMovie.maPhim}`);
    }
  };

  const handleBookTicket = () => {
    const currentMovie = bannerMovies[currentBanner];
    if (currentMovie) {
      // Có thể navigate đến trang đặt vé hoặc hiển thị modal
      navigate(`/movie/${currentMovie.maPhim}`);
    }
  };

  const renderMovies = () => {
    if (data) {
      return data.map((movie, idx) => {
        return <Movie key={movie.maPhim} movie={movie} index={idx} />;
      });
    }
  };

  // Lấy thông tin phim hiện tại
  const currentMovie = bannerMovies[currentBanner];
  const currentBannerData = banners[currentBanner];

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Banner Full Width */}
      <div className="relative w-full h-[540px] md:h-[640px] flex items-center justify-center overflow-hidden bg-white shadow-lg" style={{marginTop: 0}}>
        {bannerLoading ? (
          <div className="flex items-center justify-center h-full w-full bg-gray-100 text-gray-700 text-base">Đang tải banner...</div>
        ) : bannerError ? (
          <div className="flex items-center justify-center h-full w-full bg-red-100 text-red-700 text-base">{bannerError}</div>
        ) : banners.length > 0 ? (
          <>
            <img
              src={currentBannerData?.hinhAnh}
              alt={currentBannerData?.maBanner}
              className="absolute top-0 left-0 w-full h-full object-cover select-none transition-all duration-700 ease-in-out"
              style={{ zIndex: 1, objectPosition: 'center', transition: 'opacity 0.7s cubic-bezier(0.4,0,0.2,1)' }}
            />
            {/* Overlay gradient phía dưới */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{zIndex:2,
              background: 'linear-gradient(to bottom, rgba(30,30,30,0.35) 0%, rgba(30,30,30,0.15) 40%, rgba(0,0,0,0.7) 100%)'}} />
            
            {/* Banner content layout */}
            <div className="relative z-30 w-full h-full flex flex-col md:flex-row items-center md:items-end justify-between px-8 md:px-24 pb-16 md:pb-24">
              {/* Text bên trái */}
              <div className="max-w-xl text-left text-white drop-shadow-2xl flex-1">
                <h2 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight" style={{letterSpacing: 1}}>
                  {currentMovie?.tenPhim || currentBannerData?.tenBanner || "Đang tải..."}
                </h2>
                <div className="text-sm md:text-base font-medium opacity-90 mb-4">
                  {currentMovie ? (
                    <>
                      Đánh giá: {currentMovie.danhGia}/10 • {currentMovie.ngayKhoiChieu} • {currentMovie.moTa?.length > 100 ? currentMovie.moTa.substring(0, 100) + '...' : currentMovie.moTa}
                    </>
                  ) : (
                    "Đang tải thông tin phim..."
                  )}
                </div>
                <p className="text-sm md:text-base font-medium opacity-90 mb-6 leading-relaxed">
                  {currentMovie?.moTa ? (
                    <>
                      {currentMovie.moTa.length > 200 ? currentMovie.moTa.substring(0, 200) + '...' : currentMovie.moTa}
                      <span className="text-yellow-400 cursor-pointer hover:underline ml-1" onClick={handleMovieInfo}>Xem thêm</span>
                    </>
                  ) : (
                    "Đang tải mô tả phim..."
                  )}
                </p>
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    className="flex items-center gap-2 bg-transparent border-2 border-white text-white font-semibold px-6 py-3 rounded transition-all duration-200 hover:bg-white hover:text-black cursor-pointer"
                    onClick={handleMovieInfo}
                    disabled={!currentMovie}
                  >
                    <FaInfoCircle className="text-lg" />
                    Xem thông tin
                  </button>
                  <button 
                    className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded transition-all duration-200 shadow-lg cursor-pointer"
                    onClick={handleBookTicket}
                    disabled={!currentMovie}
                  >
                    <FaTicketAlt className="text-lg" />
                    Đặt vé ngay
                  </button>
                </div>
              </div>
            </div>
            {/* Arrows */}
            <button
              className="absolute left-6 top-1/2 -translate-y-1/2 z-40 bg-black/30 hover:bg-black/60 text-white p-3 rounded-full shadow-xl backdrop-blur-lg scale-110 transition-all duration-200 border border-white/10"
              onClick={handlePrev}
              aria-label="Previous banner"
              style={{ zIndex: 50 }}
            >
              <IoIosArrowBack className="text-3xl" />
            </button>
            <button
              className="absolute right-6 top-1/2 -translate-y-1/2 z-40 bg-black/30 hover:bg-black/60 text-white p-3 rounded-full shadow-xl backdrop-blur-lg scale-110 transition-all duration-200 border border-white/10"
              onClick={handleNext}
              aria-label="Next banner"
              style={{ zIndex: 50 }}
            >
              <IoIosArrowForward className="text-3xl" />
            </button>
            {/* Dots */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-3 z-40">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  className={`w-4 h-4 rounded-full border-2 border-gray-300 transition-all duration-200 ${idx === currentBanner ? "bg-yellow-400 scale-125 shadow-lg" : "bg-white/80 scale-100"}`}
                  onClick={() => setCurrentBanner(idx)}
                  aria-label={`Chọn banner ${idx + 1}`}
                  style={{transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)'}}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
      {/* Top Rated Slider */}
      <TopRatedSlider movieList={data || []} />
      {/* Now Showing Movies */}
      <NowShowingMovies movieList={data || []} />
      {/* Coming Soon Movies */}
      <ComingSoonMovies movieList={data || []} />
      {/* Movie List */}
      <div className="max-w-7xl mx-auto mt-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-8 bg-gradient-to-b from-red-600 to-red-400 rounded-full"></div>
          <h2 className="text-2xl font-bold text-black text-left">Danh sách phim</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
          {renderMovies()}
        </div>
      </div>
    </div>
  );
}
