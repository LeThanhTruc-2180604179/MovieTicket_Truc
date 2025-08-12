import { FaExclamationCircle, FaPlay, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Movie(props) {
  const { movie } = props;
  const navigate = useNavigate();

  return (
    <div className="group relative w-full h-[400px] rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{
          backgroundImage: `url(${movie.hinhAnh})`,
        }}
      />
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Hover Play Button */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
        <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 shadow-2xl">
          <FaPlay className="text-white text-2xl ml-1" />
        </div>
      </div>
      
      {/* Content Container */}
      <div 
        className="relative h-full flex flex-col justify-between p-6 z-10"
        onClick={() => navigate(`/movie/${movie.maPhim}`)}
      >
        {/* Top Section - Rating Badge */}
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-1 bg-yellow-500/90 backdrop-blur-sm px-3 py-1 rounded-full">
            <FaStar className="text-white text-sm" />
            <span className="text-white text-sm font-bold">{movie.danhGia}</span>
          </div>
          
          {/* Status Badge */}
          {movie.hot && (
            <div className="bg-red-500/90 backdrop-blur-sm px-3 py-1 rounded-full">
              <span className="text-white text-xs font-bold uppercase tracking-wide">HOT</span>
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className="space-y-4">
          {/* Movie Info */}
          <div className="space-y-2">
            <h3 className="text-white text-2xl font-bold leading-tight line-clamp-2 group-hover:text-cyan-300 transition-colors duration-300" title={movie.tenPhim}>
              {movie.tenPhim}
            </h3>
            
            {/* Movie Details */}
            <div className="flex items-center space-x-4 text-white/80 text-sm">
              <span className="bg-white/10 backdrop-blur-sm px-2 py-1 rounded-md font-medium">
                #{movie.maPhim}
              </span>
              <span>2024</span>
              <span>120 phút</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            {/* Info Button */}
            <button 
              className="group/btn w-12 h-12 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-2xl flex items-center justify-center transition-all duration-300 border border-white/20 hover:border-white/40 hover:scale-110 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                // Handle info click
              }}
            >
              <FaExclamationCircle className="text-white text-lg group-hover/btn:scale-110 transition-transform duration-300" />
            </button>

            {/* Book Ticket Button */}
            <button 
              className="group/btn px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold rounded-2xl shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/movie/${movie.maPhim}`);
              }}
            >
              <span className="flex items-center space-x-2">
                <span>Đặt vé</span>
                <div className="w-2 h-2 bg-white rounded-full opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Subtle Border Glow */}
      <div className="absolute inset-0 rounded-3xl border border-white/10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Bottom Accent Line */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:w-32"></div>
    </div>
  );
}