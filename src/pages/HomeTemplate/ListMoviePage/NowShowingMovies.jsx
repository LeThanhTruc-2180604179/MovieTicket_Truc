import React from "react";
import { useNavigate } from "react-router-dom";

export default function NowShowingMovies({ movieList }) {
  const navigate = useNavigate();
  const nowShowing = (movieList || []).filter((m) => m.dangChieu);
  if (nowShowing.length === 0) return null;
  return (
    <div className="w-full bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-8 bg-gradient-to-b from-green-600 to-green-400 rounded-full"></div>
          <h2 className="text-2xl md:text-3xl font-bold text-green-900">Phim Đang Chiếu</h2>
        </div>
        <div className="flex overflow-x-auto gap-8 pb-2">
          {nowShowing.map((movie) => (
            <div key={movie.maPhim} className="min-w-[340px] max-w-xs bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col cursor-pointer border border-transparent hover:border-green-400" onClick={() => navigate(`/movie/${movie.maPhim}`)}>
              <img src={movie.hinhAnh} alt={movie.tenPhim} className="w-full h-56 object-cover rounded-t-2xl" />
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg text-green-800 mb-2 line-clamp-2">{movie.tenPhim}</h3>
                  <div className="text-sm text-gray-600 mb-2 line-clamp-3">{movie.moTa}</div>
                  <div className="text-xs text-gray-500 mb-2">Khởi chiếu: {movie.ngayKhoiChieu}</div>
                </div>
                <button
                  className="mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200 shadow cursor-pointer"
                  onClick={e => { e.stopPropagation(); navigate(`/movie/${movie.maPhim}`); }}
                >
                  Xem chi tiết & Đặt vé
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 