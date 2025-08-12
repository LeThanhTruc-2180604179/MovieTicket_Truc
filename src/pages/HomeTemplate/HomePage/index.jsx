import { useState, useEffect, useRef } from 'react';
import { ChevronRight, Star, MapPin, Calendar, Clock, Play, ArrowRight, Check, Film, Ticket, Users, Award } from 'lucide-react';
import './BannerGradients.css';
import { movieAPI } from '../../../services/api';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentMovieSlide, setCurrentMovieSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [moviesLoading, setMoviesLoading] = useState(true);
  const [cinemaChains, setCinemaChains] = useState([]);
  const [cinemasLoading, setCinemasLoading] = useState(true);
  
  const sectionsRef = useRef({});
  const [visibleSections, setVisibleSections] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    
      const movieInterval = setInterval(() => {
    if (featuredMovies.length > 0) {
      setCurrentMovieSlide((prev) => (prev + 1) % featuredMovies.length);
    }
  }, 4000);

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            setVisibleSections(prev => new Set([...prev, sectionId]));
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    // Observe all sections
    Object.values(sectionsRef.current).forEach((section) => {
      if (section) observer.observe(section);
    });
    
    return () => {
      clearInterval(interval);
      clearInterval(movieInterval);
      observer.disconnect();
    };
  }, []);

  const setRef = (id) => (el) => {
    sectionsRef.current[id] = el;
  };

  const isVisibleSection = (sectionId) => visibleSections.has(sectionId);

  const bannerSlides = [
    {
      title: "Đặt Vé Xem Phim",
      subtitle: "Nhanh Chóng & Tiện Lợi",
      description: "Đặt vé xem phim tại hơn 500+ rạp trên toàn quốc chỉ với vài cú click",
      imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      title: "Phim Mới Nhất",
      subtitle: "Cập Nhật Liên Tục",
      description: "Xem phim mới nhất từ Hollywood đến Bollywood, từ phim Việt đến phim Hàn",
      imageUrl: "https://cdn.playbackonline.ca/wp/wp-content/uploads/2020/05/Screen-Shot-2020-05-04-at-1.41.10-PM.png"
    },
    {
      title: "Ưu Đãi Hấp Dẫn",
      subtitle: "Tiết Kiệm Đến 50%",
      description: "Nhiều chương trình khuyến mãi và ưu đãi đặc biệt cho thành viên VIP",
      imageUrl: "https://plus.unsplash.com/premium_photo-1710522706751-c2f0c76cc5fd?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
  ];

  const features = [
    { icon: Ticket, title: "Đặt Vé Dễ Dàng", desc: "Chọn phim, chọn ghế, thanh toán trong 3 bước đơn giản" },
    { icon: MapPin, title: "500+ Rạp Phim", desc: "CGV, Lotte, Galaxy, BHD Star trên toàn quốc" },
    { icon: Calendar, title: "Lịch Chiếu Đầy Đủ", desc: "Cập nhật lịch chiếu real-time 24/7" },
    { icon: Star, title: "Ưu Đãi VIP", desc: "Giảm giá đến 50% cho thành viên thân thiết" }
  ];

  // Fetch cinema chains from API
  useEffect(() => {
    const fetchCinemaChains = async () => {
      try {
        setCinemasLoading(true);
        const response = await movieAPI.getHeThongRap();
        const cinemaData = response.data.content;
        
        // Lấy số lượng chi nhánh cho từng hệ thống rạp
        const chainsWithBranchCount = await Promise.all(
          cinemaData.map(async (cinema) => {
            try {
              // Gọi API để lấy danh sách chi nhánh của từng hệ thống rạp
              const branchResponse = await movieAPI.getCumRapTheoHeThong(cinema.maHeThongRap);
              const branchCount = branchResponse.data.content?.length || 0;
              
              return {
                maHeThongRap: cinema.maHeThongRap,
                name: cinema.tenHeThongRap,
                logo: cinema.logo, // URL logo từ API
                locations: `${branchCount}+ rạp`,
                biDanh: cinema.biDanh,
                branchCount: branchCount
              };
            } catch (error) {
              console.error(`Error fetching branches for ${cinema.tenHeThongRap}:`, error);
              // Fallback nếu không lấy được số chi nhánh
              return {
                maHeThongRap: cinema.maHeThongRap,
                name: cinema.tenHeThongRap,
                logo: cinema.logo,
                locations: "Đang cập nhật",
                biDanh: cinema.biDanh,
                branchCount: 0
              };
            }
          })
        );
        
        setCinemaChains(chainsWithBranchCount);
      } catch (error) {
        console.error("Error fetching cinema chains:", error);
        // Fallback to default data if API fails
        setCinemaChains([
          { maHeThongRap: "CGV", name: "CGV Cinemas", logo: "https://www.cgv.vn/media/site/cache/1/logo/logo.png", locations: "120+ rạp", biDanh: "cgv", branchCount: 120 },
          { maHeThongRap: "Lotte", name: "Lotte Cinema", logo: "https://www.lottecinemavn.com/Assets/images/logo.png", locations: "80+ rạp", biDanh: "lotte", branchCount: 80 },
          { maHeThongRap: "Galaxy", name: "Galaxy Cinema", logo: "https://www.galaxycine.vn/Assets/images/logo.png", locations: "60+ rạp", biDanh: "galaxy", branchCount: 60 },
          { maHeThongRap: "BHD", name: "BHD Star", logo: "https://www.bhdstar.vn/Assets/images/logo.png", locations: "45+ rạp", biDanh: "bhd", branchCount: 45 },
          { maHeThongRap: "Cinestar", name: "Cinestar", logo: "https://www.cinestar.com.vn/Assets/images/logo.png", locations: "35+ rạp", biDanh: "cinestar", branchCount: 35 },
          { maHeThongRap: "MegaGS", name: "Mega GS", logo: "https://www.megags.vn/Assets/images/logo.png", locations: "30+ rạp", biDanh: "megags", branchCount: 30 }
        ]);
      } finally {
        setCinemasLoading(false);
      }
    };

    fetchCinemaChains();
  }, []);

  // Fetch featured movies from API
  useEffect(() => {
    const fetchFeaturedMovies = async () => {
      try {
        setMoviesLoading(true);
        const response = await movieAPI.getMovieList();
        const allMovies = response.data.content;
        
        // Lấy thông tin chi tiết cho từng phim
        const moviesWithDetails = await Promise.all(
          allMovies.slice(0, 4).map(async (movie) => {
            try {
              const detailResponse = await movieAPI.getMovieDetail(movie.maPhim);
              const movieDetail = detailResponse.data.content;
                              // Xử lý URL trailer để chuyển thành embed URL
                let trailerUrl = "";
                if (movieDetail.trailer) {
                  const trailer = movieDetail.trailer;
                  // Nếu là URL YouTube thường, chuyển thành embed URL
                  if (trailer.includes('youtube.com/watch?v=')) {
                    const videoId = trailer.split('v=')[1]?.split('&')[0];
                    if (videoId) {
                      trailerUrl = `https://www.youtube.com/embed/${videoId}`;
                    }
                  } else if (trailer.includes('youtu.be/')) {
                    const videoId = trailer.split('youtu.be/')[1]?.split('?')[0];
                    if (videoId) {
                      trailerUrl = `https://www.youtube.com/embed/${videoId}`;
                    }
                  } else if (trailer.includes('youtube.com/embed/')) {
                    trailerUrl = trailer;
                  } else {
                    trailerUrl = trailer; // Giữ nguyên nếu không phải YouTube
                  }
                }

                return {
                  maPhim: movie.maPhim,
                  title: movie.tenPhim,
                  genre: movieDetail.biDanh || "Phim hay",
                  rating: movieDetail.danhGia || "8.0",
                  image: movie.hinhAnh,
                  trailer: trailerUrl,
                  ngayKhoiChieu: movieDetail.ngayKhoiChieu || "Sắp ra mắt"
                };
            } catch (error) {
              console.error(`Error fetching details for movie ${movie.maPhim}:`, error);
              return {
                maPhim: movie.maPhim,
                title: movie.tenPhim,
                genre: "Phim hay",
                rating: "8.0",
                image: movie.hinhAnh,
                trailer: "",
                ngayKhoiChieu: "Sắp ra mắt"
              };
            }
          })
        );
        
        setFeaturedMovies(moviesWithDetails);
      } catch (error) {
        console.error("Error fetching featured movies:", error);
        // Fallback to default movies if API fails
        setFeaturedMovies([
          {
            maPhim: "1",
            title: "Avatar: The Way of Water",
            genre: "Hành động, Khoa học viễn tưởng",
            rating: "9.2",
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            trailer: "https://www.youtube.com/embed/d9MyW72ELq0",
            ngayKhoiChieu: "16/12/2022"
          },
          {
            maPhim: "2",
            title: "Black Panther: Wakanda Forever",
            genre: "Hành động, Phiêu lưu",
            rating: "8.8",
            image: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            trailer: "https://www.youtube.com/embed/_Z3QKkl1WyM",
            ngayKhoiChieu: "11/11/2022"
          },
          {
            maPhim: "3",
            title: "Top Gun: Maverick",
            genre: "Hành động, Drama",
            rating: "8.5",
            image: "https://images.unsplash.com/photo-1518929458119-e5bf444c30f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            trailer: "",
            ngayKhoiChieu: "27/05/2022"
          },
          {
            maPhim: "4",
            title: "Spider-Man: No Way Home",
            genre: "Hành động, Siêu anh hùng",
            rating: "9.0",
            image: "https://images.unsplash.com/photo-1635805737707-575885ab0820?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            trailer: "",
            ngayKhoiChieu: "17/12/2021"
          }
        ]);
      } finally {
        setMoviesLoading(false);
      }
    };

    fetchFeaturedMovies();
  }, []);

  const testimonials = [
    {
      name: "Nguyễn Minh Anh",
      role: "Khách hàng VIP",
      content: "Đặt vé siêu nhanh, giao diện đẹp và nhiều ưu đãi. Tôi đã tiết kiệm được rất nhiều tiền!",
      rating: 5,
      cinema: "CGV Vincom"
    },
    {
      name: "Trần Văn Hùng",
      role: "Người dùng thường xuyên",
      content: "Lịch chiếu cập nhật nhanh, chọn ghế trực quan. App rất tiện lợi để đặt vé.",
      rating: 5,
      cinema: "Lotte Landmark"
    },
    {
      name: "Lê Thị Mai",
      role: "Sinh viên",
      content: "Giá vé sinh viên rất hợp lý, còn có nhiều combo bắp nước giảm giá nữa.",
      rating: 5,
      cinema: "Galaxy Nguyễn Du"
    }
  ];

  const promotions = [
    {
      title: "Thứ 3 Vui Vẻ",
      desc: "Giảm 30% tất cả suất chiếu vào thứ 3 hàng tuần",
      code: "TUE30"
    },
    {
      title: "Combo Bắp Nước",
      desc: "Mua 1 tặng 1 combo size L cho tất cả các rạp",
      code: "COMBO2024"
    },
    {
      title: "Sinh Viên Ưu Đãi",
      desc: "Vé chỉ từ 45,000đ dành cho sinh viên có thẻ",
      code: "STUDENT50"
    },
    {
      title: "Thành Viên VIP",
      desc: "Tích điểm đổi vé miễn phí và nhiều ưu đãi khác",
      code: "VIP2024"
    }
  ];

  return (
    <div style={{ paddingTop: 72 }} className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative h-screen overflow-hidden hero-banner">
        {bannerSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div 
              className="absolute inset-0"
              style={{ 
                backgroundImage: `url(${slide.imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                filter: 'brightness(0.7)'
              }}
            />
            {/* Movie theater pattern overlay */}
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                               radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }} />
          </div>
        ))}
        
        <div className="relative z-10 flex items-center justify-center h-full text-white">
          <div className="text-center max-w-5xl mx-auto px-6">
            <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
                {bannerSlides[currentSlide].title}
              </h1>
              <h2 className="text-2xl md:text-4xl font-light mb-6 text-gray-200">
                {bannerSlides[currentSlide].subtitle}
              </h2>
              <p className="text-lg md:text-xl mb-8 text-gray-300 max-w-3xl mx-auto leading-relaxed">
                {bannerSlides[currentSlide].description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => navigate('/list-movie')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center shadow-lg cursor-pointer"
                >
                  <Ticket className="mr-2 w-5 h-5" /> Đặt Vé Ngay
                </button>
                <button 
                  onClick={() => navigate('/news')}
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-gray-900 transform hover:scale-105 transition-all duration-300 flex items-center justify-center cursor-pointer"
                >
                  <Calendar className="mr-2 w-5 h-5" /> Xem Lịch Chiếu
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {bannerSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white scale-125' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section 
        id="features-section" 
        ref={setRef('features-section')}
        className="py-20 bg-white"
        style={{ backgroundColor: 'white' }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className={`text-center mb-16 transition-all duration-1000 ${
            isVisibleSection('features-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tại Sao Chọn Chúng Tôi?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Trải nghiệm đặt vé xem phim tốt nhất tại Việt Nam
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`text-center group hover:scale-105 transition-all duration-500 ${
                  isVisibleSection('features-section')
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-20'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="bg-gray-100 hover:bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6 transition-all duration-300">
                  <feature.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Movies Slider */}
      <section 
        id="movies-section" 
        ref={setRef('movies-section')}
        className="py-20 bg-gray-900"
        style={{ backgroundColor: '#111827' }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className={`text-center mb-16 transition-all duration-1000 ${
            isVisibleSection('movies-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Phim Đang Hot
            </h2>
            <p className="text-lg text-gray-300">
              Những bộ phim được yêu thích nhất hiện tại
            </p>
          </div>
          
          <div className="relative overflow-hidden">
            {moviesLoading ? (
              <div className="flex items-center justify-center h-96">
                <div className="text-white text-xl">Đang tải phim...</div>
              </div>
            ) : (
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentMovieSlide * 100}%)` }}
              >
                {featuredMovies.map((movie, index) => (
                  <div key={movie.maPhim || index} className="w-full flex-shrink-0 px-4">
                    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center transition-all duration-1000 ${
                      isVisibleSection('movies-section') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                    }`}>
                      <div className="order-2 lg:order-1">
                        <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">{movie.title}</h3>
                        <p className="text-lg text-gray-300 mb-6">{movie.genre}</p>
                                              <div className="flex items-center mb-8">
                        <div className="flex items-center bg-yellow-500 px-3 py-1 rounded-full mr-6">
                          <Star className="w-4 h-4 text-white mr-1" />
                          <span className="text-white font-semibold">{movie.rating}</span>
                        </div>
                        <div className="flex items-center bg-green-500 px-3 py-1 rounded-full">
                          <Calendar className="w-4 h-4 text-white mr-1" />
                          <span className="text-white font-semibold">{movie.ngayKhoiChieu}</span>
                        </div>
                      </div>
                        <button 
                          onClick={() => navigate(`/movie/${movie.maPhim}`)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transform hover:scale-105 transition-all duration-300 shadow-lg cursor-pointer"
                        >
                          Xem Thông Tin
                        </button>
                      </div>
                      <div className="order-1 lg:order-2">
                        <div className="relative group">
                          {movie.trailer ? (
                            <iframe
                              src={movie.trailer}
                              title={movie.title}
                              className="w-full h-96 rounded-2xl shadow-2xl"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              loading="lazy"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                console.error('Video load error:', e);
                                // Fallback to image if video fails to load
                                e.target.style.display = 'none';
                                const imgElement = e.target.parentElement.querySelector('.fallback-image');
                                if (imgElement) imgElement.style.display = 'block';
                              }}
                            />
                          ) : null}
                          <img 
                            src={movie.image} 
                            alt={movie.title}
                            className={`w-full h-96 object-cover rounded-2xl shadow-2xl group-hover:scale-105 transition-transform duration-300 fallback-image ${movie.trailer ? 'hidden' : ''}`}
                          />
                          {!movie.trailer && (
                            <div className="absolute inset-0 bg-black bg-opacity-40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <Play className="w-16 h-16 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Movie Slide Indicators */}
            {!moviesLoading && (
              <div className="flex justify-center mt-12 pb-4 space-x-3">
                {featuredMovies.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentMovieSlide(index)}
                    className={`w-4 h-4 rounded-full transition-all duration-300 ${
                      index === currentMovieSlide ? 'bg-blue-500 scale-125' : 'bg-gray-500'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Cinema Chains */}
      <section 
        id="cinemas-section" 
        ref={setRef('cinemas-section')}
        className="py-20 bg-white"
        style={{ backgroundColor: 'white' }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className={`text-center mb-16 transition-all duration-1000 ${
            isVisibleSection('cinemas-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Hệ Thống Rạp Đối Tác
            </h2>
            <p className="text-lg text-gray-600">
              Kết nối với tất cả các chuỗi rạp hàng đầu Việt Nam
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {cinemasLoading ? (
              // Loading skeleton
              Array.from({ length: 6 }).map((_, index) => (
                <div 
                  key={index} 
                  className="text-center animate-pulse"
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className="bg-gray-200 rounded-2xl p-6 h-32 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 bg-gray-300 rounded-lg mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-20 mb-1"></div>
                    <div className="h-3 bg-gray-300 rounded w-16"></div>
                  </div>
                </div>
              ))
            ) : (
              cinemaChains.map((cinema, index) => (
                <div 
                  key={cinema.maHeThongRap || index} 
                  className={`text-center group hover:scale-105 transition-all duration-500 ${
                    isVisibleSection('cinemas-section')
                      ? 'opacity-100 translate-y-0 rotate-0'
                      : 'opacity-0 translate-y-20 rotate-6'
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className="bg-gray-50 hover:bg-gray-100 rounded-2xl p-6 h-32 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="w-12 h-12 mb-2 flex items-center justify-center">
                      {cinema.logo ? (
                        <img 
                          src={cinema.logo} 
                          alt={cinema.name}
                          className="max-w-full max-h-full object-contain"
                          onError={(e) => {
                            // Fallback to text if image fails to load
                            e.target.style.display = 'none';
                            const fallbackText = e.target.parentElement.querySelector('.fallback-text');
                            if (fallbackText) fallbackText.style.display = 'block';
                          }}
                        />
                      ) : null}
                      <div className="fallback-text text-2xl font-bold text-gray-600" style={{ display: cinema.logo ? 'none' : 'block' }}>
                        {cinema.name.charAt(0)}
                      </div>
                    </div>
                    <div className="font-semibold text-gray-900 text-sm mb-1">{cinema.name}</div>
                    <div className="text-gray-500 text-xs">{cinema.locations}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Promotions */}
      <section 
        id="promotions-section" 
        ref={setRef('promotions-section')}
        className="py-20 bg-gray-50"
        style={{ backgroundColor: '#f9fafb' }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className={`text-center mb-16 transition-all duration-1000 ${
            isVisibleSection('promotions-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ưu Đãi Đặc Biệt
            </h2>
            <p className="text-lg text-gray-600">
              Tiết kiệm hơn với các chương trình khuyến mãi hấp dẫn
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {promotions.map((promo, index) => (
              <div 
                key={index} 
                className={`group hover:scale-105 transition-all duration-500 ${
                  isVisibleSection('promotions-section')
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-20'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 h-60 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{promo.title}</h3>
                  <p className="text-gray-600 text-sm mb-6 flex-grow leading-relaxed">{promo.desc}</p>
                  <div className="bg-gray-100 rounded-lg px-4 py-2 text-center mb-4">
                    <span className="text-gray-800 font-mono font-bold text-sm">{promo.code}</span>
                  </div>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold text-sm transition-colors">
                    Sử Dụng Ngay
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section 
        id="testimonials-section" 
        ref={setRef('testimonials-section')}
        className="py-20 bg-white"
        style={{ backgroundColor: 'white' }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className={`text-center mb-16 transition-all duration-1000 ${
            isVisibleSection('testimonials-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Khách Hàng Nói Gì?
            </h2>
            <p className="text-lg text-gray-600">
              Hơn 2 triệu khách hàng đã tin tưởng
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className={`bg-gray-50 rounded-2xl p-8 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-500 h-80 flex flex-col ${
                  isVisibleSection('testimonials-section')
                    ? 'opacity-100 translate-y-0 rotate-0'
                    : 'opacity-0 translate-y-20 rotate-3'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed flex-grow">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-3 text-sm">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{testimonial.name}</div>
                      <div className="text-gray-500 text-xs">{testimonial.role}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                    {testimonial.cinema}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        id="cta-section" 
        ref={setRef('cta-section')}
        className="py-20 bg-gray-900 text-white"
        style={{ backgroundColor: '#111827' }}
      >
        <div className={`max-w-4xl mx-auto text-center px-6 transition-all duration-1000 ${
          isVisibleSection('cta-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h2 className={`text-3xl md:text-4xl font-bold mb-6 transition-all duration-1000 delay-200 ${
            isVisibleSection('cta-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Sẵn Sàng Xem Phim?
          </h2>
          <p className={`text-lg mb-8 text-gray-300 transition-all duration-1000 delay-400 ${
            isVisibleSection('cta-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Đặt vé ngay hôm nay và nhận ngay ưu đãi 20% cho lần đầu sử dụng
          </p>
          <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-600 ${
            isVisibleSection('cta-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <button 
              onClick={() => navigate('/list-movie')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center shadow-lg cursor-pointer"
            >
              <Ticket className="mr-2 w-5 h-5" /> Đặt Vé Ngay
            </button>
            <button 
              onClick={() => navigate('/news')}
              className="border-2 border-gray-300 text-gray-300 hover:bg-white hover:text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center cursor-pointer"
            >
              <Calendar className="mr-2 w-5 h-5" /> Xem Lịch Chiếu
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}