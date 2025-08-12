import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState as useStateReact } from "react";
import { useRef } from "react";
import TicketModal from "../../components/TicketModal";

const PAGE_SIZE = 8;

// Simple Bar Chart component
function BarChart({ data, label }) {
  const max = Math.max(...data.map(d => d.value), 1);
  // Màu sắc nổi bật, không dùng vàng/đen
  const colors = ["#f59e42", "#e11d48", "#0ea5e9", "#16a34a", "#a21caf", "#fbbf24", "#10b981", "#f43f5e", "#6366f1", "#ff6f00", "#00bcd4"];
  return (
    <div className="w-full flex flex-col gap-2">
      {data.map((d, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-32 truncate text-sm font-medium text-black">{d.name}</div>
          <div className="flex-1 bg-neutral-200 rounded h-5 relative">
            <div
              className="h-5 rounded"
              style={{ width: `${(d.value / max) * 100}%`, background: colors[i % colors.length] }}
            ></div>
            <div className="absolute left-2 top-0 h-5 flex items-center text-xs font-bold text-black">
              {d.value.toLocaleString()}
            </div>
          </div>
        </div>
      ))}
      <div
        className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 justify-center items-center"
        style={{ maxHeight: 90, overflowY: 'auto', paddingRight: 4 }}
      >
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2 text-sm min-w-0">
            <span style={{ width: 16, height: 16, background: colors[i % colors.length], display: "inline-block", borderRadius: 4, border: "1px solid #222" }}></span>
            <span className="truncate max-w-[120px] text-black">{d.name}</span>
          </div>
        ))}
      </div>
      <div className="text-xs text-neutral-500 mt-2">{label}</div>
    </div>
  );
}

// Pie Chart component
function PieChart({ data }) {
  const [hoverIdx, setHoverIdx] = useStateReact(-1);
  const [tooltip, setTooltip] = useStateReact({ show: false, x: 0, y: 0, name: "", value: 0, percent: 0 });
  const svgRef = useRef();
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  let startAngle = 0;
  // Màu sắc nổi bật, không dùng vàng/đen
  const colors = ["#f59e42", "#e11d48", "#0ea5e9", "#16a34a", "#a21caf", "#fbbf24", "#10b981", "#f43f5e", "#6366f1", "#ff6f00", "#00bcd4"];
  return (
    <div className="relative flex flex-col items-center">
      <svg ref={svgRef} width="220" height="220" viewBox="0 0 220 220" className="mx-auto">
        {data.map((d, i) => {
          const angle = (d.value / total) * 360;
          const x1 = 110 + 100 * Math.cos((Math.PI * startAngle) / 180);
          const y1 = 110 + 100 * Math.sin((Math.PI * startAngle) / 180);
          const x2 = 110 + 100 * Math.cos((Math.PI * (startAngle + angle)) / 180);
          const y2 = 110 + 100 * Math.sin((Math.PI * (startAngle + angle)) / 180);
          const largeArc = angle > 180 ? 1 : 0;
          const pathData = `M110,110 L${x1},${y1} A100,100 0 ${largeArc} 1 ${x2},${y2} Z`;
          const fill = colors[i % colors.length];
          const labelAngle = startAngle + angle / 2;
          const percent = ((d.value / total) * 100).toFixed(1);
          const idx = i;
          const isHover = hoverIdx === idx;
          const pathProps = {
            d: pathData,
            fill,
            stroke: isHover ? "#222" : "#fff",
            strokeWidth: isHover ? 4 : 2,
            style: { cursor: "pointer", opacity: isHover ? 0.85 : 1, transition: "all 0.2s" },
            onMouseEnter: (e) => {
              setHoverIdx(idx);
              const rect = svgRef.current.getBoundingClientRect();
              setTooltip({
                show: true,
                x: e.clientX - rect.left,
                y: e.clientY - rect.top - 20,
                name: d.name,
                value: d.value,
                percent,
              });
            },
            onMouseLeave: () => {
              setHoverIdx(-1);
              setTooltip({ ...tooltip, show: false });
            },
          };
          startAngle += angle;
          return (
            <g key={i}>
              <path {...pathProps} />
              {d.value > 0 && (
                <text x={110 + 70 * Math.cos((Math.PI * labelAngle) / 180)} y={110 + 70 * Math.sin((Math.PI * labelAngle) / 180)} textAnchor="middle" dominantBaseline="middle" fontSize="12" fill="#222">
                  {percent}%
                </text>
              )}
            </g>
          );
        })}
      </svg>
      {/* Tooltip */}
      {tooltip.show && (
        <div style={{ position: "absolute", left: tooltip.x, top: tooltip.y, background: "#fff", color: "#222", border: "1px solid #222", borderRadius: 6, padding: "4px 10px", fontSize: 13, fontWeight: 500, pointerEvents: "none", zIndex: 10, boxShadow: "0 2px 8px #0001" }}>
          {tooltip.name}: {tooltip.value} ({tooltip.percent}%)
        </div>
      )}
      {/* Legend */}
      <div
        className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 justify-center items-center"
        style={{ maxHeight: 90, overflowY: 'auto', paddingRight: 4 }}
      >
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2 text-sm min-w-0">
            <span style={{ width: 16, height: 16, background: colors[i % colors.length], display: "inline-block", borderRadius: 4, border: "1px solid #222" }}></span>
            <span className="truncate max-w-[120px] text-black">{d.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MyTicketsPage() {
  const { user } = useSelector((state) => state.authSlice);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [view, setView] = useState("count"); // "count" | "amount"
  const [chartType, setChartType] = useState("bar"); // "bar" | "pie"
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ticketFilter, setTicketFilter] = useState("all"); // "all" | "valid" | "expired"

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    const fetchProfile = async () => {
      try {
        const userLocal = JSON.parse(localStorage.getItem("user"));
        const token = userLocal?.accessToken || userLocal?.token;
        if (!token) throw new Error("Không tìm thấy token đăng nhập");
        const res = await axios.post(
          "https://movienew.cybersoft.edu.vn/api/QuanLyNguoiDung/ThongTinTaiKhoan",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              TokenCybersoft:
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA4MyIsIkhldEhhblN0cmluZyI6IjE4LzAxLzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc2ODY5NDQwMDAwMCIsIm5iZiI6MTc0MTg4ODgwMCwiZXhwIjoxNzY4ODQ1NjAwfQ.rosAjjMuXSBmnsEQ7BQi1qmo6eVOf1g8zhTZZg6WSx4",
            },
          }
        );
        setProfile(res.data.content);
        setLoading(false);
      } catch (err) {
        setError(err?.response?.data?.content || err.message || "Lỗi lấy thông tin tài khoản");
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user, navigate]);

  // Filter, search, pagination logic
  const bookings = useMemo(() => {
    if (!profile?.thongTinDatVe) return [];
    let filtered = profile.thongTinDatVe;
    
    // Lọc theo trạng thái hiệu lực
    if (ticketFilter !== "all") {
      filtered = filtered.filter(b => {
        const isExpired = new Date(b.ngayDat) < new Date();
        return ticketFilter === "valid" ? !isExpired : isExpired;
      });
    }
    
    // Lọc theo tìm kiếm
    if (search.trim()) {
      const keyword = search.trim().toLowerCase();
      filtered = filtered.filter(b =>
        b.tenPhim?.toLowerCase().includes(keyword) ||
        b.danhSachGhe?.some(g => g.tenGhe?.toLowerCase().includes(keyword))
      );
    }
    return filtered;
  }, [profile, search, ticketFilter]);
  const totalPages = Math.ceil(bookings.length / PAGE_SIZE) || 1;
  const pagedBookings = bookings.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Chart data
  const chartData = useMemo(() => {
    if (!profile?.thongTinDatVe) return [];
    const movieMap = {};
    profile.thongTinDatVe.forEach(b => {
      if (!movieMap[b.tenPhim]) movieMap[b.tenPhim] = { count: 0, amount: 0 };
      movieMap[b.tenPhim].count += b.danhSachGhe?.length || 0;
      movieMap[b.tenPhim].amount += (b.giaVe || 0) * (b.danhSachGhe?.length || 1);
    });
    return Object.entries(movieMap).map(([name, v]) => ({ name, value: view === "count" ? v.count : v.amount }));
  }, [profile, view]);

  // Hàm xử lý mở modal thông tin vé
  const handleOpenTicketModal = (ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  // Hàm xử lý đóng modal
  const handleCloseTicketModal = () => {
    setIsModalOpen(false);
    setSelectedTicket(null);
  };

  if (!user) return null;
  if (loading) return <div className="p-10 text-center">Đang tải thông tin vé...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
  if (!profile) return null;

  return (
    <div className="min-h-screen bg-white pt-24 pb-12" style={{ color: "#111", background: "#fff" }}>
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-8">
        {/* Left: Danh sách vé */}
        <div className="flex-1 bg-white rounded-xl shadow-lg p-6 border border-neutral-200 min-w-[340px]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-black">Danh sách vé đã đặt</h2>
              <p className="text-sm text-gray-600 mt-1">Click vào vé để xem chi tiết và mã QR</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Bộ lọc trạng thái vé */}
              <select
                value={ticketFilter}
                onChange={(e) => { setTicketFilter(e.target.value); setPage(1); }}
                className="border border-neutral-300 px-3 py-2 rounded text-sm focus:border-yellow-500 focus:ring-yellow-500 bg-white"
                style={{ color: "#111" }}
              >
                <option value="all">Tất cả vé</option>
                <option value="valid">Còn hiệu lực</option>
                <option value="expired">Đã hết hạn</option>
              </select>
              <input
                type="text"
                placeholder="Tìm kiếm phim, ghế..."
                className="border border-neutral-300 px-3 py-2 rounded text-sm focus:border-yellow-500 focus:ring-yellow-500"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                style={{ minWidth: 180, color: "#111" }}
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-neutral-200 rounded text-sm">
              <thead>
                <tr style={{ background: "#f5f5f5" }}>
                  <th className="px-3 py-2 text-left">Tên phim</th>
                  <th className="px-3 py-2 text-left">Ngày đặt</th>
                  <th className="px-3 py-2 text-left">Ghế</th>
                  <th className="px-3 py-2 text-left">Tổng giá</th>
                </tr>
              </thead>
              <tbody>
                {pagedBookings.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-6 text-neutral-400">Không có vé nào</td></tr>
                ) : pagedBookings.map((b, idx) => {
                  // Kiểm tra xem vé có hết hạn hay không
                  const isExpired = new Date(b.ngayDat) < new Date();
                  
                  return (
                    <tr 
                      key={idx} 
                      className={`border-t border-neutral-100 transition ${
                        isExpired 
                          ? 'bg-gray-100 opacity-60 cursor-not-allowed' 
                          : 'hover:bg-neutral-50 cursor-pointer'
                      }`}
                      onClick={() => !isExpired && handleOpenTicketModal(b)}
                    >
                      <td className="px-3 py-2 font-semibold text-black">
                        {b.tenPhim}
                        {isExpired && (
                          <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                            Hết hạn
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-gray-600">
                        {new Date(b.ngayDat).toLocaleString("vi-VN")}
                      </td>
                      <td className="px-3 py-2 text-black">{b.danhSachGhe?.map(g => g.tenGhe).join(", ")}</td>
                      <td className="px-3 py-2 text-black">
                        {b.giaVe && b.danhSachGhe 
                          ? (b.giaVe * b.danhSachGhe.length).toLocaleString() + " đ" 
                          : "-"
                        }
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-neutral-500">Trang {page}/{totalPages}</div>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 rounded border border-yellow-300 bg-white text-black hover:bg-yellow-100 disabled:opacity-50">Trước</button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 rounded border border-yellow-300 bg-white text-black hover:bg-yellow-100 disabled:opacity-50">Sau</button>
            </div>
          </div>
        </div>
        {/* Right: Thống kê dạng biểu đồ */}
        <div className="w-full md:w-[380px] bg-white rounded-xl shadow-lg p-6 border border-neutral-200 flex flex-col gap-6">
          {/* Thống kê trạng thái vé */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-3">Trạng thái vé</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {profile?.thongTinDatVe?.filter(b => new Date(b.ngayDat) >= new Date()).length || 0}
                </div>
                <div className="text-sm text-gray-600">Còn hiệu lực</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {profile?.thongTinDatVe?.filter(b => new Date(b.ngayDat) < new Date()).length || 0}
                </div>
                <div className="text-sm text-gray-600">Đã hết hạn</div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 mb-4">
            <button
              className={`flex-1 px-4 py-2 rounded font-semibold border ${view === "count" ? "bg-yellow-400 text-black border-yellow-400" : "bg-white text-black border-yellow-300"}`}
              onClick={() => setView("count")}
            >
              Biểu đồ tổng vé đã đặt
            </button>
            <button
              className={`flex-1 px-4 py-2 rounded font-semibold border ${view === "amount" ? "bg-yellow-400 text-black border-yellow-400" : "bg-white text-black border-yellow-300"}`}
              onClick={() => setView("amount")}
            >
              Biểu đồ tổng tiền đã chi
            </button>
          </div>
          {/* Chọn kiểu biểu đồ cho tổng vé đã đặt */}
          {view === "count" && (
            <div className="flex gap-2 mb-2">
              <button
                className={`flex-1 px-3 py-1 rounded font-semibold border ${chartType === "bar" ? "bg-yellow-400 text-black border-yellow-400" : "bg-white text-black border-yellow-300"}`}
                onClick={() => setChartType("bar")}
              >
                Bar Chart
              </button>
              <button
                className={`flex-1 px-3 py-1 rounded font-semibold border ${chartType === "pie" ? "bg-yellow-400 text-black border-yellow-400" : "bg-white text-black border-yellow-300"}`}
                onClick={() => setChartType("pie")}
              >
                Pie Chart
              </button>
            </div>
          )}
          {view === "count"
            ? chartType === "bar"
              ? <BarChart data={chartData.sort((a, b) => b.value - a.value)} label="Số vé đã đặt theo phim" />
              : <PieChart data={chartData.filter(d => d.value > 0)} />
            : <BarChart data={chartData.sort((a, b) => b.value - a.value)} label="Tổng tiền đã chi theo phim" />
          }
        </div>
      </div>

      {/* Modal hiển thị thông tin vé */}
      <TicketModal
        isOpen={isModalOpen}
        onClose={handleCloseTicketModal}
        ticketData={selectedTicket}
      />
    </div>
  );
} 