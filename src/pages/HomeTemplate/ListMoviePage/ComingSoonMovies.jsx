import React from "react";
import { useNavigate } from "react-router-dom";

export default function ComingSoonMovies({ movieList }) {
  const navigate = useNavigate();
  const comingSoon = (movieList || []).filter((m) => m.sapChieu);
  if (comingSoon.length === 0) return null;
  return (
    <div className="w-full bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-8 bg-gradient-to-b from-yellow-600 to-yellow-400 rounded-full"></div>
          <h2 className="text-2xl md:text-3xl font-bold text-yellow-900">Phim Sắp Chiếu</h2>
        </div>
        <div className="flex flex-col gap-8">
          {comingSoon.map((movie) => (
            <div key={movie.maPhim} className="flex items-center gap-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 cursor-pointer border border-transparent hover:border-yellow-400" onClick={() => navigate(`/movie/${movie.maPhim}`)}>
              <div className="flex-shrink-0">
                <img src={movie.hinhAnh} alt={movie.tenPhim} className="w-32 h-44 object-cover rounded-xl" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-xl text-yellow-800 mb-2 line-clamp-2">{movie.tenPhim}</h3>
                <div className="text-sm text-gray-600 mb-2 line-clamp-3">{movie.moTa}</div>
                <div className="text-xs text-gray-500 mb-2">Khởi chiếu: {movie.ngayKhoiChieu}</div>
                <button
                  className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200 shadow cursor-pointer"
                  onClick={e => { e.stopPropagation(); navigate(`/movie/${movie.maPhim}`); }}
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 