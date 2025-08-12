import { useEffect, useState, useRef } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function TopRatedSlider({ movieList }) {
  const [topMovies, setTopMovies] = useState([]);
  const sliderRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!movieList || movieList.length === 0) return;
    // Chỉ lấy phim hot
    const hotMovies = movieList.filter((movie) => movie.hot);
    setTopMovies(hotMovies.slice(0, 7));
  }, [movieList]);

  const handlePrev = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -sliderRef.current.offsetWidth, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: sliderRef.current.offsetWidth, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full bg-gray-50 py-12 relative z-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-red-500 to-red-700 rounded-full"></div>
            <h2 className="text-3xl font-bold text-gray-900">Top Rated Movies</h2>
          </div>
          <div className="text-sm text-gray-500">Rated 9.0+</div>
        </div>

        {/* Slider Container */}
        <div className="relative">
          {topMovies.length > 3 && (
            <>
              <button
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center -ml-6"
                onClick={handlePrev}
              >
                <IoIosArrowBack className="text-xl" />
              </button>
              
              <button
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center -mr-6"
                onClick={handleNext}
              >
                <IoIosArrowForward className="text-xl" />
              </button>
            </>
          )}

          <div
            ref={sliderRef}
            className="flex overflow-x-hidden gap-4 pt-3 pb-2"
            style={{ scrollBehavior: "smooth" }}
          >
            {topMovies.map((movie, idx) => (
              <div
                key={movie.maPhim}
                className="group relative bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden flex-shrink-0 w-80 h-32 hover:-translate-y-2"
                onClick={() => navigate(`/movie/${movie.maPhim}`)}
              >
                {/* Rank Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg ${
                    idx === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                    idx === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-600' :
                    idx === 2 ? 'bg-gradient-to-br from-amber-500 to-amber-700' :
                    'bg-gradient-to-br from-slate-400 to-slate-600'
                  }`}>
                    {idx + 1}
                  </div>
                </div>

                {/* Movie Content */}
                <div className="flex h-full p-4">
                  {/* Movie Poster */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={movie.hinhAnh}
                      alt={movie.tenPhim}
                      className="w-20 h-24 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-300"
                    />
                  </div>

                  {/* Movie Info */}
                  <div className="ml-3 flex-1 flex flex-col justify-between min-h-0">
                    <div className="space-y-2">
                      <div className="h-10 flex items-start">
                        <h3 
                          className="font-bold text-base text-gray-900 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors duration-300"
                          title={movie.tenPhim}
                        >
                          {movie.tenPhim}
                        </h3>
                      </div>
                      {movie.hot && (
                        <div className="inline-block mt-1 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">
                          HOT
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                        <FaStar className="text-amber-500 text-xs" />
                        <span className="font-bold text-gray-900 text-sm">{movie.danhGia}</span>
                        <span className="text-gray-500 text-xs">/10</span>
                      </div>
                      
                      <button className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium shadow-sm hover:shadow-md transform group-hover:scale-100 scale-95 cursor-pointer">
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                </div>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-200 rounded-xl transition-colors duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}