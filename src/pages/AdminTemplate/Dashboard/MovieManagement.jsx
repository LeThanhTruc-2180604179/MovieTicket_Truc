import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "./Modal";
import { movieAPI } from '../../../services/api';

// Hàm chuyển đổi định dạng ngày từ YYYY-MM-DD sang dd/MM/yyyy
const formatDateForAPI = (dateStr) => {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
};

export default function MovieManagement() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [totalMovies, setTotalMovies] = useState(0);
  const [hotMovies, setHotMovies] = useState(0);
  const [showingMovies, setShowingMovies] = useState(0);

  // Thêm phim mới
  const [formAdd, setFormAdd] = useState({ tenPhim: "", trailer: "", moTa: "", ngayKhoiChieu: "", danhGia: "", hinhAnh: null, hot: false, dangChieu: false, sapChieu: false });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");
  const [addImagePreview, setAddImagePreview] = useState(null);

  const handleAddChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (name === "hinhAnh") {
      const file = files[0];
      setFormAdd({ ...formAdd, hinhAnh: file });
      // Tạo preview cho ảnh
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => setAddImagePreview(e.target.result);
        reader.readAsDataURL(file);
      } else {
        setAddImagePreview(null);
      }
    } else if (type === "checkbox") {
      setFormAdd({ ...formAdd, [name]: checked });
    } else {
      setFormAdd({ ...formAdd, [name]: value });
    }
  };

  const handleAddMovie = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError("");
    const formData = new FormData();
    
    // Chuyển đổi format ngày trước khi gửi API
    const formDataToSend = {
      ...formAdd,
      ngayKhoiChieu: formatDateForAPI(formAdd.ngayKhoiChieu)
    };
    
    Object.entries(formDataToSend).forEach(([k, v]) => {
      if (k === "hinhAnh" && v) {
        formData.append(k, v);
      } else if (k !== "hinhAnh") {
        formData.append(k, v);
      }
    });
    formData.append("maNhom", "GP00");
    
    try {
      await movieAPI.addMovie(formData);
      setShowAddModal(false);
      setFormAdd({ tenPhim: "", trailer: "", moTa: "", ngayKhoiChieu: "", danhGia: "", hinhAnh: null, hot: false, dangChieu: false, sapChieu: false });
      setAddImagePreview(null);
      setRefresh((r) => !r);
    } catch (err) {
      setAddError(err?.response?.data?.content || "Lỗi thêm phim");
    } finally {
      setAddLoading(false);
    }
  };

  // Sửa phim
  const [formEdit, setFormEdit] = useState({ maPhim: "", tenPhim: "", trailer: "", moTa: "", ngayKhoiChieu: "", danhGia: "", hinhAnh: null, hot: false, dangChieu: false, sapChieu: false });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [editImagePreview, setEditImagePreview] = useState(null);

  useEffect(() => {
    if (showEditModal && selectedMovie) {
      setFormEdit({
        maPhim: selectedMovie.maPhim,
        tenPhim: selectedMovie.tenPhim || "",
        trailer: selectedMovie.trailer || "",
        moTa: selectedMovie.moTa || "",
        ngayKhoiChieu: selectedMovie.ngayKhoiChieu ? selectedMovie.ngayKhoiChieu.slice(0, 10) : "",
        danhGia: selectedMovie.danhGia || "",
        hinhAnh: null,
        hot: !!selectedMovie.hot,
        dangChieu: !!selectedMovie.dangChieu,
        sapChieu: !!selectedMovie.sapChieu,
      });
      setEditImagePreview(null);
    }
  }, [showEditModal, selectedMovie]);

  const handleEditChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (name === "hinhAnh") {
      const file = files[0];
      setFormEdit({ ...formEdit, hinhAnh: file });
      // Tạo preview cho ảnh
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => setEditImagePreview(e.target.result);
        reader.readAsDataURL(file);
      } else {
        setEditImagePreview(null);
      }
    } else if (type === "checkbox") {
      setFormEdit({ ...formEdit, [name]: checked });
    } else {
      setFormEdit({ ...formEdit, [name]: value });
    }
  };

  const handleEditMovie = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError("");
    const formData = new FormData();
    
    // Chuyển đổi format ngày trước khi gửi API
    const formDataToSend = {
      ...formEdit,
      ngayKhoiChieu: formatDateForAPI(formEdit.ngayKhoiChieu)
    };
    
    Object.entries(formDataToSend).forEach(([k, v]) => {
      if (k === "hinhAnh" && v) {
        formData.append(k, v);
      } else if (k !== "hinhAnh") {
        formData.append(k, v);
      }
    });
    formData.append("maNhom", "GP00");
    
    try {
      await movieAPI.updateMovie(formData);
      setShowEditModal(false);
      setFormEdit({ maPhim: "", tenPhim: "", trailer: "", moTa: "", ngayKhoiChieu: "", danhGia: "", hinhAnh: null, hot: false, dangChieu: false, sapChieu: false });
      setEditImagePreview(null);
      setRefresh((r) => !r);
    } catch (err) {
      setEditError(err?.response?.data?.content || "Lỗi sửa phim");
    } finally {
      setEditLoading(false);
    }
  };

  // Xóa phim
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const handleDeleteMovie = async () => {
    if (!selectedMovie) return;
    setDeleteLoading(true);
    setDeleteError("");
    try {
      await movieAPI.deleteMovie(selectedMovie.maPhim);
      setShowDeleteModal(false);
      setSelectedMovie(null);
      setRefresh((r) => !r);
    } catch (err) {
      setDeleteError(err?.response?.data?.content || "Lỗi xóa phim");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Lấy chi tiết phim khi mở modal chi tiết
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");
  const [movieDetail, setMovieDetail] = useState(null);

  useEffect(() => {
    if (showDetailModal && selectedMovie) {
      setDetailLoading(true);
      setDetailError("");
      axios
        .get(`https://movienew.cybersoft.edu.vn/api/QuanLyPhim/LayThongTinPhim?MaPhim=${selectedMovie.maPhim}`, {
          headers: { TokenCybersoft: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA4MyIsIkhldEhhblN0cmluZyI6IjE4LzAxLzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc2ODY5NDQwMDAwMCIsIm5iZiI6MTc0MTg4ODgwMCwiZXhwIjoxNzY4ODQ1NjAwfQ.rosAjjMuXSBmnsEQ7BQi1qmo6eVOf1g8zhTZZg6WSx4" }
        })
        .then((res) => setMovieDetail(res.data.content))
        .catch(() => setDetailError("Không lấy được thông tin phim"))
        .finally(() => setDetailLoading(false));
    }
    if (!showDetailModal) setMovieDetail(null);
  }, [showDetailModal, selectedMovie]);

  const fetchMovies = async (pageNum = 1, searchText = "") => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://movienew.cybersoft.edu.vn/api/QuanLyPhim/LayDanhSachPhimPhanTrang?maNhom=GP00&soTrang=${pageNum}&soPhanTuTrenTrang=8${searchText ? `&tenPhim=${encodeURIComponent(searchText)}` : ""}`,
        { headers: { TokenCybersoft: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA4MyIsIkhldEhhblN0cmluZyI6IjE4LzAxLzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc2ODY5NDQwMDAwMCIsIm5iZiI6MTc0MTg4ODgwMCwiZXhwIjoxNzY4ODQ1NjAwfQ.rosAjjMuXSBmnsEQ7BQi1qmo6eVOf1g8zhTZZg6WSx4" } }
      );
      setMovies(res.data.content.items || []);
      setTotalMovies(res.data.content.totalCount || 0);
      setTotalPages(res.data.content.totalPages || 1);
    } catch {
      setMovies([]);
      setTotalPages(1);
      setTotalMovies(0);
    } finally {
      setLoading(false);
    }
  };

  // Hàm lấy thống kê phim
  const fetchMovieStats = async () => {
    try {
      // Lấy tất cả phim để đếm thống kê
      const res = await axios.get(
        `https://movienew.cybersoft.edu.vn/api/QuanLyPhim/LayDanhSachPhim?maNhom=GP00`,
        { headers: { TokenCybersoft: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA4MyIsIkhldEhhblN0cmluZyI6IjE4LzAxLzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc2ODY5NDQwMDAwMCIsIm5iZiI6MTc0MTg4ODgwMCwiZXhwIjoxNzY4ODQ1NjAwfQ.rosAjjMuXSBmnsEQ7BQi1qmo6eVOf1g8zhTZZg6WSx4" } }
      );
      const allMovies = res.data.content || [];
      
      // Đếm phim hot
      const hotCount = allMovies.filter(movie => movie.hot).length;
      setHotMovies(hotCount);
      
      // Đếm phim đang chiếu
      const showingCount = allMovies.filter(movie => movie.dangChieu).length;
      setShowingMovies(showingCount);
    } catch (error) {
      console.error("Lỗi lấy thống kê phim:", error);
      setHotMovies(0);
      setShowingMovies(0);
    }
  };

  useEffect(() => {
    fetchMovies(page, search);
    fetchMovieStats();
    // eslint-disable-next-line
  }, [page, search, refresh]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  // Phân trang chỉ hiển thị tối đa 5 nút số trang
  const renderPagination = () => {
    const PAGE_SIZE = 8;
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i + 1}
          className={`w-7 h-7 rounded ${page === i + 1 ? "bg-neutral-900 text-white font-bold" : "hover:bg-neutral-200"}`}
          onClick={() => setPage(i + 1)}
          disabled={page === i + 1}
        >
          {i + 1}
        </button>
      ));
    }
    const buttons = [];
    if (page > 3) {
      buttons.push(
        <button key={1} className={`w-7 h-7 rounded ${page === 1 ? "bg-neutral-900 text-white font-bold" : "hover:bg-neutral-200"}`} onClick={() => setPage(1)} disabled={page === 1}>1</button>
      );
      if (page > 4) buttons.push(<span key="start-ellipsis" className="px-1">...</span>);
    }
    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);
    for (let i = start; i <= end; i++) {
      buttons.push(
        <button
          key={i}
          className={`w-7 h-7 rounded ${page === i ? "bg-neutral-900 text-white font-bold" : "hover:bg-neutral-200"}`}
          onClick={() => setPage(i)}
          disabled={page === i}
        >
          {i}
        </button>
      );
    }
    if (page < totalPages - 2) {
      if (page < totalPages - 3) buttons.push(<span key="end-ellipsis" className="px-1">...</span>);
      buttons.push(
        <button key={totalPages} className={`w-7 h-7 rounded ${page === totalPages ? "bg-neutral-900 text-white font-bold" : "hover:bg-neutral-200"}`} onClick={() => setPage(totalPages)} disabled={page === totalPages}>{totalPages}</button>
      );
    }
    return buttons;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Card thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4 border border-neutral-100">
                     <div className="bg-blue-100 rounded-full w-14 h-14 flex items-center justify-center">
             <i className="fas fa-film text-2xl text-gray-800" />
           </div>
          <div>
            <div className="text-neutral-500 text-sm font-medium">Tổng số phim</div>
            <div className="text-2xl font-bold text-neutral-900">{totalMovies.toLocaleString()}</div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4 border border-neutral-100">
                     <div className="bg-orange-100 rounded-full w-14 h-14 flex items-center justify-center">
             <i className="fas fa-fire text-2xl text-gray-800" />
           </div>
          <div>
            <div className="text-neutral-500 text-sm font-medium">Phim hot</div>
            <div className="text-2xl font-bold text-neutral-900">{hotMovies.toLocaleString()}</div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4 border border-neutral-100">
                     <div className="bg-green-100 rounded-full w-14 h-14 flex items-center justify-center">
             <i className="fas fa-play-circle text-2xl text-gray-800" />
           </div>
          <div>
            <div className="text-neutral-500 text-sm font-medium">Đang chiếu</div>
            <div className="text-2xl font-bold text-neutral-900">{showingMovies.toLocaleString()}</div>
          </div>
        </div>
      </div>
      {/* Card danh sách phim */}
      <div className="bg-white rounded-2xl shadow p-8 border border-neutral-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xl font-bold text-neutral-900">Danh sách phim</div>
            <div className="text-green-500 text-sm font-medium">Movies Management</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm tên phim..."
                className="pl-10 pr-3 py-2 rounded-lg border border-neutral-200 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-green-200"
                value={search}
                onChange={handleSearch}
              />
              <i className="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            </div>
            <button
              className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              onClick={() => setShowAddModal(true)}
            >
              Thêm phim
            </button>
          </div>
        </div>
        {loading ? (
          <div className="text-center py-10 text-neutral-400">Đang tải danh sách...</div>
        ) : movies.length === 0 ? (
          <div className="text-center py-10 text-neutral-400">Không có phim nào</div>
        ) : (
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="text-neutral-500 border-b">
                  <th className="py-3 px-4 font-semibold">Mã phim</th>
                  <th className="py-3 px-4 font-semibold">Tên phim</th>
                  <th className="py-3 px-4 font-semibold">Hình ảnh</th>
                  <th className="py-3 px-4 font-semibold">Ngày khởi chiếu</th>
                  <th className="py-3 px-4 font-semibold">Đánh giá</th>
                  <th className="py-3 px-4 font-semibold">Hot</th>
                  <th className="py-3 px-4 font-semibold">Đang chiếu</th>
                  <th className="py-3 px-4 font-semibold">Sắp chiếu</th>
                  <th className="py-3 px-4 font-semibold text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {movies.map((movie) => (
                  <tr key={movie.maPhim} className="border-b last:border-0 hover:bg-neutral-50">
                    <td className="py-3 px-4">{movie.maPhim}</td>
                    <td className="py-3 px-4">{movie.tenPhim}</td>
                    <td className="py-3 px-4">
                      <img src={movie.hinhAnh} alt={movie.tenPhim} className="w-16 h-20 object-cover rounded" />
                    </td>
                    <td className="py-3 px-4">{movie.ngayKhoiChieu ? new Date(movie.ngayKhoiChieu).toLocaleDateString() : ""}</td>
                    <td className="py-3 px-4">{movie.danhGia}</td>
                    <td className="py-3 px-4 text-center">{movie.hot ? "🔥" : ""}</td>
                    <td className="py-3 px-4 text-center">{movie.dangChieu ? "✔️" : ""}</td>
                    <td className="py-3 px-4 text-center">{movie.sapChieu ? "✔️" : ""}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          className="border border-neutral-400 text-neutral-800 bg-white px-3 py-1 rounded hover:border-black transition font-semibold"
                          onClick={() => {
                            setSelectedMovie(movie);
                            setShowDetailModal(true);
                          }}
                        >
                          Chi tiết
                        </button>
                        <button
                          className="border border-neutral-400 text-neutral-800 bg-white px-3 py-1 rounded hover:border-black transition font-semibold"
                          onClick={() => {
                            setSelectedMovie(movie);
                            setShowEditModal(true);
                          }}
                        >
                          Sửa
                        </button>
                        <button
                          className="border border-red-300 text-red-500 bg-white px-3 py-1 rounded hover:border-red-500 hover:text-red-700 transition font-semibold"
                          onClick={() => {
                            setSelectedMovie(movie);
                            setShowDeleteModal(true);
                          }}
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* Pagination */}
        <div className="flex justify-between items-center mt-4 text-neutral-400 text-xs">
          <div>
            Showing data {movies.length > 0 ? 8 * (page - 1) + 1 : 0} to {8 * (page - 1) + movies.length} of {totalMovies} entries
          </div>
          <div className="flex gap-1">{renderPagination()}</div>
        </div>
      </div>
      {/* Modal thêm phim */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} size="xl">
        <div className="text-lg font-bold mb-4">Thêm phim mới</div>
        <form onSubmit={handleAddMovie} encType="multipart/form-data">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                         {/* Bên trái - Form nhập thông tin */}
             <div className="space-y-3">
               <div className="grid grid-cols-2 gap-3">
                 <div>
                   <label className="block font-semibold mb-1 text-sm">Tên phim</label>
                   <input className="w-full border px-3 py-2 rounded text-sm" name="tenPhim" value={formAdd.tenPhim} onChange={handleAddChange} required />
                 </div>
                 <div>
                   <label className="block font-semibold mb-1 text-sm">Trailer</label>
                   <input className="w-full border px-3 py-2 rounded text-sm" name="trailer" value={formAdd.trailer} onChange={handleAddChange} required />
                 </div>
               </div>
               <div>
                 <label className="block font-semibold mb-1 text-sm">Mô tả</label>
                 <textarea className="w-full border px-3 py-2 rounded text-sm" name="moTa" value={formAdd.moTa} onChange={handleAddChange} required rows="3" />
               </div>
               <div className="grid grid-cols-2 gap-3">
                 <div>
                   <label className="block font-semibold mb-1 text-sm">Ngày khởi chiếu</label>
                   <input 
                     type="date" 
                     className="w-full border px-3 py-2 rounded text-sm" 
                     name="ngayKhoiChieu" 
                     value={formAdd.ngayKhoiChieu} 
                     onChange={handleAddChange} 
                     min={new Date().toISOString().split('T')[0]}
                     required 
                   />
                   <div className="text-xs text-gray-500 mt-1">
                     Ngày khởi chiếu phải từ hôm nay trở đi
                   </div>
                 </div>
                 <div>
                   <label className="block font-semibold mb-1 text-sm">Đánh giá</label>
                   <input type="number" min={1} max={10} className="w-full border px-3 py-2 rounded text-sm" name="danhGia" value={formAdd.danhGia} onChange={handleAddChange} required />
                 </div>
               </div>
               <div>
                 <label className="block font-semibold mb-1 text-sm">Hình ảnh</label>
                 <input type="file" accept="image/*" className="w-full border px-3 py-2 rounded text-sm" name="hinhAnh" onChange={handleAddChange} required />
               </div>
               <div className="grid grid-cols-3 gap-3">
                 <div className="flex items-center">
                   <input type="checkbox" name="hot" checked={formAdd.hot} onChange={handleAddChange} className="mr-2" />
                   <label className="text-sm font-semibold">Phim hot</label>
                 </div>
                 <div className="flex items-center">
                   <input type="checkbox" name="dangChieu" checked={formAdd.dangChieu} onChange={handleAddChange} className="mr-2" />
                   <label className="text-sm font-semibold">Đang chiếu</label>
                 </div>
                 <div className="flex items-center">
                   <input type="checkbox" name="sapChieu" checked={formAdd.sapChieu} onChange={handleAddChange} className="mr-2" />
                   <label className="text-sm font-semibold">Sắp chiếu</label>
                 </div>
               </div>
             </div>

                         {/* Bên phải - Khung xem ảnh */}
             <div className="flex flex-col">
               <div className="font-semibold mb-3">Xem trước ảnh</div>
               <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center h-[300px] bg-gray-50">
                 {addImagePreview ? (
                   <img 
                     src={addImagePreview} 
                     alt="Preview" 
                     className="max-w-full max-h-full object-contain rounded shadow-lg"
                   />
                 ) : (
                   <div className="text-center text-gray-500">
                     <i className="fa fa-image text-4xl mb-2"></i>
                     <p>Chọn ảnh để xem trước</p>
                   </div>
                 )}
               </div>
             </div>
          </div>

          {addError && <div className="text-red-500 text-sm mt-4">{addError}</div>}
          
          <div className="flex gap-3 justify-end mt-6">
            <button 
              type="button" 
              className="px-4 py-2 rounded bg-neutral-200 hover:bg-neutral-300" 
              onClick={() => {
                setShowAddModal(false);
                setAddImagePreview(null);
              }} 
              disabled={addLoading}
            >
              Hủy
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700" 
              disabled={addLoading}
            >
              {addLoading ? "Đang thêm..." : "Thêm"}
            </button>
          </div>
        </form>
      </Modal>
      {/* Modal sửa phim */}
      <Modal open={showEditModal} onClose={() => setShowEditModal(false)} size="xl">
        <div className="text-lg font-bold mb-4">Sửa thông tin phim</div>
        <form onSubmit={handleEditMovie} encType="multipart/form-data">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                         {/* Bên trái - Form nhập thông tin */}
             <div className="space-y-3">
               <div className="grid grid-cols-2 gap-3">
                 <div>
                   <label className="block font-semibold mb-1 text-sm">Tên phim</label>
                   <input className="w-full border px-3 py-2 rounded text-sm" name="tenPhim" value={formEdit.tenPhim} onChange={handleEditChange} required />
                 </div>
                 <div>
                   <label className="block font-semibold mb-1 text-sm">Trailer</label>
                   <input className="w-full border px-3 py-2 rounded text-sm" name="trailer" value={formEdit.trailer} onChange={handleEditChange} required />
                 </div>
               </div>
               <div>
                 <label className="block font-semibold mb-1 text-sm">Mô tả</label>
                 <textarea className="w-full border px-3 py-2 rounded text-sm" name="moTa" value={formEdit.moTa} onChange={handleEditChange} required rows="3" />
               </div>
               <div className="grid grid-cols-2 gap-3">
                 <div>
                   <label className="block font-semibold mb-1 text-sm">Ngày khởi chiếu</label>
                   <input 
                     type="date" 
                     className="w-full border px-3 py-2 rounded text-sm" 
                     name="ngayKhoiChieu" 
                     value={formEdit.ngayKhoiChieu} 
                     onChange={handleEditChange} 
                     min={new Date().toISOString().split('T')[0]}
                     required 
                   />
                   <div className="text-xs text-gray-500 mt-1">
                     Ngày khởi chiếu phải từ hôm nay trở đi
                   </div>
                 </div>
                 <div>
                   <label className="block font-semibold mb-1 text-sm">Đánh giá</label>
                   <input type="number" min={1} max={10} className="w-full border px-3 py-2 rounded text-sm" name="danhGia" value={formEdit.danhGia} onChange={handleEditChange} required />
                 </div>
               </div>
               <div>
                 <label className="block font-semibold mb-1 text-sm">Hình ảnh mới (nếu muốn thay)</label>
                 <input type="file" accept="image/*" className="w-full border px-3 py-2 rounded text-sm" name="hinhAnh" onChange={handleEditChange} />
               </div>
               <div className="grid grid-cols-3 gap-3">
                 <div className="flex items-center">
                   <input type="checkbox" name="hot" checked={formEdit.hot} onChange={handleEditChange} className="mr-2" />
                   <label className="text-sm font-semibold">Phim hot</label>
                 </div>
                 <div className="flex items-center">
                   <input type="checkbox" name="dangChieu" checked={formEdit.dangChieu} onChange={handleEditChange} className="mr-2" />
                   <label className="text-sm font-semibold">Đang chiếu</label>
                 </div>
                 <div className="flex items-center">
                   <input type="checkbox" name="sapChieu" checked={formEdit.sapChieu} onChange={handleEditChange} className="mr-2" />
                   <label className="text-sm font-semibold">Sắp chiếu</label>
                 </div>
               </div>
             </div>

                         {/* Bên phải - Khung xem ảnh */}
             <div className="flex flex-col">
               <div className="font-semibold mb-3">Xem trước ảnh</div>
               <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center h-[300px] bg-gray-50 overflow-hidden">
                 {editImagePreview ? (
                   <img 
                     src={editImagePreview} 
                     alt="Preview" 
                     className="max-w-full max-h-full object-contain rounded shadow-lg"
                   />
                 ) : selectedMovie?.hinhAnh ? (
                   <div className="text-center w-full">
                     <img 
                       src={selectedMovie.hinhAnh} 
                       alt="Current" 
                       className="max-w-full max-h-full object-contain rounded shadow-lg mx-auto"
                     />
                     <p className="text-sm text-gray-500 mt-2">Ảnh hiện tại</p>
                   </div>
                 ) : (
                   <div className="text-center text-gray-500">
                     <i className="fa fa-image text-4xl mb-2"></i>
                     <p>Chọn ảnh để xem trước</p>
                   </div>
                 )}
               </div>
             </div>
          </div>

          {editError && <div className="text-red-500 text-sm mt-4">{editError}</div>}
          
          <div className="flex gap-3 justify-end mt-6">
            <button 
              type="button" 
              className="px-4 py-2 rounded bg-neutral-200 hover:bg-neutral-300" 
              onClick={() => {
                setShowEditModal(false);
                setEditImagePreview(null);
              }} 
              disabled={editLoading}
            >
              Hủy
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700" 
              disabled={editLoading}
            >
              {editLoading ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </Modal>
      {/* Modal xem chi tiết phim */}
      <Modal open={showDetailModal} onClose={() => setShowDetailModal(false)}>
        <div className="text-lg font-bold mb-4">Chi tiết phim</div>
        {detailLoading ? (
          <div className="text-center py-4 text-neutral-400">Đang tải...</div>
        ) : detailError ? (
          <div className="text-red-500 text-sm mb-2">{detailError}</div>
        ) : movieDetail ? (
          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <img src={movieDetail.hinhAnh} alt={movieDetail.tenPhim} className="w-32 h-44 object-cover rounded shadow" />
              <div className="space-y-2">
                <div className="font-semibold text-lg">{movieDetail.tenPhim}</div>
                <div>
                  <span className="font-semibold">Mã phim:</span> {movieDetail.maPhim}
                </div>
                <div>
                  <span className="font-semibold">Ngày khởi chiếu:</span>{" "}
                  {movieDetail.ngayKhoiChieu ? new Date(movieDetail.ngayKhoiChieu).toLocaleDateString() : ""}
                </div>
                <div>
                  <span className="font-semibold">Đánh giá:</span> {movieDetail.danhGia}
                </div>
                <div>
                  <span className="font-semibold">Trailer:</span>{" "}
                  <a href={movieDetail.trailer} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                    Xem trailer
                  </a>
                </div>
                <div>
                  <span className="font-semibold">Hot:</span> {movieDetail.hot ? "Có" : "Không"}
                </div>
                <div>
                  <span className="font-semibold">Đang chiếu:</span> {movieDetail.dangChieu ? "Có" : "Không"}
                </div>
                <div>
                  <span className="font-semibold">Sắp chiếu:</span> {movieDetail.sapChieu ? "Có" : "Không"}
                </div>
              </div>
            </div>
            <div>
              <span className="font-semibold">Mô tả:</span>
              <div className="bg-neutral-50 rounded p-2 mt-1 text-sm text-neutral-700 whitespace-pre-line">{movieDetail.moTa}</div>
            </div>
          </div>
        ) : null}
      </Modal>
      {/* Modal xác nhận xóa phim */}
      <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <div className="text-lg font-bold mb-4 text-red-600">Xác nhận xóa phim</div>
        <div className="mb-4">
          Bạn có chắc chắn muốn xóa phim <span className="font-semibold">{selectedMovie?.tenPhim}</span> (Mã: {selectedMovie?.maPhim}) không?
        </div>
        {deleteError && <div className="text-red-500 text-sm mb-2">{deleteError}</div>}
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            className="px-4 py-2 rounded bg-neutral-200 hover:bg-neutral-300"
            onClick={() => setShowDeleteModal(false)}
            disabled={deleteLoading}
          >
            Hủy
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700"
            onClick={handleDeleteMovie}
            disabled={deleteLoading}
          >
            {deleteLoading ? "Đang xóa..." : "Xóa"}
          </button>
        </div>
      </Modal>
    </div>
  );
}