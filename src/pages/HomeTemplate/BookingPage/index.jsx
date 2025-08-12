import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { movieAPI } from "../../../services/api";
import Swal from "sweetalert2";
import ParticlesBackground from "../../../components/ParticlesBackground";

export default function BookingPage() {
  const { maLichChieu } = useParams();
  const [phongVe, setPhongVe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [movieDetail, setMovieDetail] = useState(null);

  useEffect(() => {
    setLoading(true);
    movieAPI.getPhongVe(maLichChieu)
      .then(res => {
        setPhongVe(res.data.content);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [maLichChieu]);

  useEffect(() => {
    if (phongVe && phongVe.thongTinPhim && phongVe.thongTinPhim.maPhim) {
      movieAPI.getMovieDetail(phongVe.thongTinPhim.maPhim)
        .then(res => setMovieDetail(res.data.content))
        .catch(() => setMovieDetail(null));
    }
  }, [phongVe]);

  // Thống kê số lượng ghế và các loại giá vé
  let seatStats = null;
  if (phongVe && phongVe.danhSachGhe) {
    const totalSeats = phongVe.danhSachGhe.length;
    const priceMap = {};
    phongVe.danhSachGhe.forEach(ghe => {
      if (!priceMap[ghe.giaVe]) priceMap[ghe.giaVe] = 0;
      priceMap[ghe.giaVe]++;
    });
    
    // Thống kê ghế còn lại theo loại
    const availableSeats = phongVe.danhSachGhe.filter(ghe => !ghe.daDat);
    const availableByPrice = {};
    availableSeats.forEach(ghe => {
      if (!availableByPrice[ghe.giaVe]) availableByPrice[ghe.giaVe] = 0;
      availableByPrice[ghe.giaVe]++;
    });
    
    // Lấy các mức giá động
    const prices = Object.keys(priceMap).map(Number).sort((a, b) => a - b);
    seatStats = {
      totalSeats,
      priceMap,
      availableSeats: availableSeats.length,
      availableByPrice,
      prices
    };
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Đang tải dữ liệu phòng vé...</p>
      </div>
    </div>
  );

  if (!phongVe) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-6xl mb-4">🎬</div>
        <p className="text-red-500 text-lg">Không tìm thấy thông tin phòng vé.</p>
      </div>
    </div>
  );

  const handleSelectSeat = (ghe) => {
    if (ghe.daDat) return;
    
    const isSelected = selectedSeats.find(seat => seat.maGhe === ghe.maGhe);
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter(seat => seat.maGhe !== ghe.maGhe));
    } else {
      setSelectedSeats([...selectedSeats, ghe]);
    }
  };

  // Tạo mã ghế đầy đủ (hàng + số)
  const getFullSeatCode = (ghe) => {
    if (!ghe) return '';
    const rowIndex = seatGrid.findIndex(row => row.some(seat => seat?.maGhe === ghe.maGhe));
    const rowLetter = String.fromCharCode(65 + rowIndex);
    const seatNumber = ghe.tenGhe.replace(/[A-Z]/g, ''); // Lấy số từ tên ghế
    return `${rowLetter}${seatNumber}`;
  };

  const total = selectedSeats.reduce((sum, ghe) => sum + ghe.giaVe, 0);

  const handleBooking = async () => {
    if (selectedSeats.length === 0) return;
    setBookingLoading(true);
    try {
      await movieAPI.datVe({
        maLichChieu: Number(maLichChieu),
        danhSachVe: selectedSeats.map(ghe => ({ maGhe: ghe.maGhe, giaVe: ghe.giaVe }))
      });
      Swal.fire({ icon: 'success', title: 'Đặt vé thành công!', showConfirmButton: false, timer: 1800 });
      setSelectedSeats([]);
      setLoading(true);
      const res = await movieAPI.getPhongVe(maLichChieu);
      setPhongVe(res.data.content);
      setLoading(false);
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Đặt vé thất bại!', text: err?.response?.data?.content || 'Vui lòng thử lại.' });
    } finally {
      setBookingLoading(false);
    }
  };

  // Tạo sơ đồ ghế đều và phân bổ giá hợp lý
  const rows = 10;
  const cols = 16;
  let seatGrid = [];
  // Lấy các mức giá động và gán màu động
  let priceColors = {};
  if (phongVe && phongVe.danhSachGhe) {
    const sortedSeats = [...phongVe.danhSachGhe].sort((a, b) => a.maGhe - b.maGhe);
    const uniquePrices = [...new Set(sortedSeats.map(g => g.giaVe))].sort((a, b) => a - b);
    // Gán màu cho từng mức giá
    if (uniquePrices.length > 0) priceColors[uniquePrices[0]] = 'bg-blue-100 text-blue-800 border-blue-400 hover:bg-blue-200'; // thường
    if (uniquePrices.length > 1) priceColors[uniquePrices[uniquePrices.length-1]] = 'bg-yellow-200 text-yellow-800 border-yellow-400 hover:bg-yellow-300'; // vip
    for (let i = 1; i < uniquePrices.length-1; i++) {
      priceColors[uniquePrices[i]] = 'bg-purple-100 text-purple-800 border-purple-400 hover:bg-purple-200';
    }
    const vipPrice = uniquePrices[uniquePrices.length - 1];
    const normalPrice = uniquePrices[0];
    // Phân bổ ghế giá cao nhất (VIP) vào giữa, giá thấp nhất (thường) vào rìa
    let centerCols = [4,5,6,7,8,9,10,11]; // 8 cột giữa
    let grid = Array.from({length: rows}, () => Array(cols).fill(null));
    let idxNormal = 0, idxVip = 0;
    const vipSeats = sortedSeats.filter(g => g.giaVe === vipPrice);
    const normalSeats = sortedSeats.filter(g => g.giaVe === normalPrice);
    // Phân bổ các hàng trên như cũ
    for (let r = 0; r < rows - 1; r++) {
      for (let c = 0; c < cols; c++) {
        if (centerCols.includes(c)) {
          if (idxVip < vipSeats.length) {
            grid[r][c] = vipSeats[idxVip++];
          }
        } else {
          if (idxNormal < normalSeats.length) {
            grid[r][c] = normalSeats[idxNormal++];
          }
        }
      }
    }
    // Hàng cuối cùng: lấp ghế còn lại vào các cột giữa bằng ghế "đặc biệt" (màu xanh)
    for (let c = 0; c < cols; c++) {
      if (centerCols.includes(c)) {
        if (idxVip < vipSeats.length) {
          grid[rows-1][c] = vipSeats[idxVip++];
        } else if (idxNormal < normalSeats.length) {
          grid[rows-1][c] = normalSeats[idxNormal++];
        } else {
          // Nếu hết ghế, tạo ghế đặc biệt màu xanh
          grid[rows-1][c] = { maGhe: `special-${c}`, tenGhe: `${String.fromCharCode(65+rows-1)}${String(c+1).padStart(2,'0')}`, giaVe: -1, daDat: false, isSpecial: true };
        }
      } else {
        if (idxNormal < normalSeats.length) {
          grid[rows-1][c] = normalSeats[idxNormal++];
        }
      }
    }
    seatGrid = grid;
  }



  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Particles chỉ hiển thị trong phần nội dung */}
        <div className="relative">
          <ParticlesBackground />
          <div className="relative z-10">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8 border border-white/20">
              <div className="flex items-start gap-6">
                {movieDetail?.hinhAnh && (
                  <img 
                    src={movieDetail.hinhAnh} 
                    alt={movieDetail.tenPhim} 
                    className="w-20 h-28 object-cover rounded-lg shadow-md" 
                  />
                )}
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{phongVe.thongTinPhim.tenPhim}</h1>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Rạp:</span> {phongVe.thongTinPhim.tenCumRap} - {phongVe.thongTinPhim.tenRap}
                    </div>
                    <div>
                      <span className="font-medium">Ngày:</span> {phongVe.thongTinPhim.ngayChieu}
                    </div>
                    <div>
                      <span className="font-medium">Giờ:</span> {phongVe.thongTinPhim.gioChieu}
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    <span className="font-medium">Địa chỉ:</span> {phongVe.thongTinPhim.diaChi}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Seat Map Section */}
              <div className="lg:col-span-3">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
                  {/* Screen */}
                  <div className="mb-12">
                    <div className="relative mx-auto w-4/5 h-3 bg-gradient-to-r from-transparent via-gray-800 to-transparent rounded-full mb-2">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 rounded-full animate-pulse"></div>
                    </div>
                    <p className="text-center text-sm text-gray-500 font-medium">MÀN HÌNH</p>
                  </div>

                  {/* Sơ đồ ghế mới */}
                  {seatGrid.length > 0 && (
                    <div className="mb-8">
                      <div className="flex flex-col gap-2 items-center">
                        {seatGrid.map((row, rowIdx) => (
                          <div key={rowIdx} className="flex gap-2 justify-center items-center">
                            {/* Nhãn hàng ghế */}
                            <div className="w-8 text-center font-semibold text-gray-600 text-sm">
                              {String.fromCharCode(65 + rowIdx)}
                            </div>
                            {row.map((ghe, colIdx) => (
                              ghe ? (
                                <button
                                  key={ghe.maGhe}
                                  onClick={() => handleSelectSeat(ghe)}
                                  disabled={ghe.daDat || bookingLoading}
                                  className={`
                                    w-8 h-8 rounded text-xs font-medium border-2 transition-all duration-300 transform hover:scale-110 hover:shadow-lg
                                    ${ghe.isSpecial
                                      ? 'bg-green-300 text-white border-green-600 hover:bg-green-400'
                                      : ghe.daDat 
                                        ? 'bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed'
                                        : selectedSeats.find(seat => seat.maGhe === ghe.maGhe)
                                          ? 'bg-green-500 text-white border-green-600 hover:bg-green-600 shadow-lg'
                                          : priceColors[ghe.giaVe] || 'bg-blue-100 text-blue-800 border-blue-400 hover:bg-blue-200'}
                                  `}
                                  title={`${getFullSeatCode(ghe)} - ${ghe.giaVe?.toLocaleString() || 0}đ`}
                                >
                                  {ghe.tenGhe.replace(/[A-Z]/g, '')}
                                </button>
                              ) : (
                                // Tạo lối đi giữa các khối ghế
                                <div key={`aisle-${rowIdx}-${colIdx}`} className="w-4 h-8 flex items-center justify-center">
                                  <div className="w-1 h-4 bg-gray-200 rounded-full opacity-50"></div>
                                </div>
                              )
                            ))}
                          </div>
                        ))}
                      </div>
                      {/* Chú thích màu */}
                      <div className="flex gap-6 justify-center mt-4">
                        {Object.entries(priceColors).map(([price, color]) => (
                          <div className="flex items-center gap-2" key={price}><span className={`w-5 h-5 rounded border inline-block ${color}`}></span> <span className="text-sm">{Number(price).toLocaleString()}đ</span></div>
                        ))}
                        <div className="flex items-center gap-2"><span className="w-5 h-5 rounded bg-green-500 border-green-600 border inline-block"></span> <span className="text-sm">Đang chọn</span></div>
                        <div className="flex items-center gap-2"><span className="w-5 h-5 rounded bg-gray-300 border-gray-400 border inline-block"></span> <span className="text-sm">Đã đặt</span></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 sticky top-24 border border-white/20">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Thông tin đặt vé</h3>
                  
                  {/* Selected Seats with Scroll */}
                  <div className="mb-6" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Ghế đã chọn</h4>
                    {selectedSeats.length === 0 ? (
                      <p className="text-gray-400 text-sm">Chưa chọn ghế nào</p>
                    ) : (
                      <div className="space-y-2">
                        {selectedSeats.map(ghe => (
                          <div key={ghe.maGhe} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                            <span className="font-medium text-gray-900">{getFullSeatCode(ghe)}</span>
                            <span className="text-gray-600">{ghe.giaVe?.toLocaleString() || 0}đ</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Total */}
                  <div className="border-t border-gray-200 pt-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Tổng tiền:</span>
                      <span className="text-xl font-bold text-green-600">{total.toLocaleString()}đ</span>
                    </div>
                  </div>

                  {/* Book Button */}
                  <button
                    className={`
                      w-full py-3 px-4 rounded-lg font-bold text-white transition-all duration-200
                      ${selectedSeats.length === 0 || bookingLoading
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-black hover:bg-gray-800 shadow-lg hover:shadow-xl'
                      }
                    `}
                    disabled={selectedSeats.length === 0 || bookingLoading}
                    onClick={handleBooking}
                  >
                    {bookingLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Đang đặt vé...
                      </div>
                    ) : (
                      'Đặt vé ngay'
                    )}
                  </button>

                  {selectedSeats.length > 0 && (
                    <p className="text-xs text-gray-500 text-center mt-3">
                      Bạn đang chọn {selectedSeats.length} ghế
                    </p>
                  )}

                  {seatStats && (
                    <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="font-bold text-base mb-2">Thống kê ghế phòng vé</div>
                      <div className="mb-1">Tổng số ghế: <span className="font-semibold text-blue-600">{seatStats.totalSeats}</span></div>
                      <div>
                        <span className="font-semibold">Số lượng từng loại giá vé:</span>
                        <ul className="list-disc ml-6 mt-1">
                          {seatStats.prices.map(price => (
                            <li key={price} className="text-sm">{price.toLocaleString()}đ: <span className="font-semibold">{seatStats.priceMap[price]}</span> ghế</li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-4">
                        <span className="font-semibold">Số ghế còn lại:</span>
                        <ul className="list-disc ml-6 mt-1">
                          <li className="text-sm">Tổng: <span className="font-semibold text-blue-600">{seatStats.availableSeats}</span></li>
                          {seatStats.prices.map(price => (
                            <li className="text-sm" key={price}>{price.toLocaleString()}đ: <span className="font-semibold text-green-600">{seatStats.availableByPrice[price] || 0}</span></li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 