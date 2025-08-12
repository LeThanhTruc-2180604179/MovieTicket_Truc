import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaEnvelope, FaPhone } from "react-icons/fa";
import React from "react";

// Thống kê cá nhân từ lịch sử đặt vé
function PersonalStatistics({ bookings }) {
  // Tổng số vé
  const totalTickets = bookings.reduce((sum, b) => sum + (b.danhSachGhe?.length || 0), 0);
  // Tổng tiền (nếu có giá vé)
  const totalAmount = bookings.reduce((sum, b) => sum + (b.giaVe ? b.giaVe * (b.danhSachGhe?.length || 1) : 0), 0);
  // Thống kê phim xem nhiều nhất
  const movieCount = {};
  bookings.forEach(b => {
    if (!movieCount[b.tenPhim]) movieCount[b.tenPhim] = 0;
    movieCount[b.tenPhim] += 1;
  });
  const mostWatched = Object.entries(movieCount).sort((a, b) => b[1] - a[1])[0]?.[0];

  return (
    <div className="flex flex-wrap gap-8">
      <div className="bg-blue-50 rounded p-4 min-w-[160px]">
        <div className="text-2xl font-bold text-blue-700">{totalTickets}</div>
        <div className="text-neutral-600">Tổng số vé đã đặt</div>
      </div>
      <div className="bg-green-50 rounded p-4 min-w-[160px]">
        <div className="text-2xl font-bold text-green-700">{totalAmount.toLocaleString()} đ</div>
        <div className="text-neutral-600">Tổng tiền đã chi</div>
      </div>
      <div className="bg-pink-50 rounded p-4 min-w-[160px]">
        <div className="text-lg font-bold text-pink-700">{mostWatched || "-"}</div>
        <div className="text-neutral-600">Phim xem nhiều nhất</div>
      </div>
    </div>
  );
}

// Lịch sử đặt vé
function BookingHistory({ bookings }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-neutral-200 rounded">
        <thead>
          <tr className="bg-neutral-100">
            <th className="px-3 py-2 text-left">Tên phim</th>
            <th className="px-3 py-2 text-left">Ngày đặt</th>
            <th className="px-3 py-2 text-left">Rạp</th>
            <th className="px-3 py-2 text-left">Ghế</th>
            <th className="px-3 py-2 text-left">Giá vé</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b, idx) => (
            <tr key={idx} className="border-t">
              <td className="px-3 py-2 font-semibold">{b.tenPhim}</td>
              <td className="px-3 py-2">{new Date(b.ngayDat).toLocaleString("vi-VN")}</td>
              <td className="px-3 py-2">{b.tenHeThongRap} - {b.tenRap}</td>
              <td className="px-3 py-2">{b.danhSachGhe?.map(g => g.tenGhe).join(", ")}</td>
              <td className="px-3 py-2">{b.giaVe ? b.giaVe.toLocaleString() + " đ" : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function EditProfilePage() {
  const { user } = useSelector((state) => state.authSlice);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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
  }, []);

  if (!user) return <div className="p-10 text-center">Bạn cần đăng nhập để xem thông tin cá nhân.</div>;
  if (loading) return <div className="p-10 text-center">Đang tải thông tin tài khoản...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
  if (!profile) return null;

  return (
    <div className="relative min-h-screen bg-white">
      {/* Gradient bar under header - static, scrolls with content */}
      <div className="w-full h-56 bg-gradient-to-r from-[#c2e9fb] via-[#f9f6e7] to-[#fbc2eb] top-0 left-0 z-10" />
      {/* Top: Avatar, Name, Email - align left, normal flow, overlap gradient */}
      <div className="max-w-5xl mx-auto px-4 pt-16 -mt-48 flex items-center gap-6 mb-10" style={{position: 'relative', zIndex: 20}}>
          <img
            src={profile.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.hoTen || profile.taiKhoan)}&background=dedede&color=222&size=128`}
            alt="avatar"
          className="w-24 h-24 rounded-full object-cover border-4 border-white shadow"
          />
        <div>
          <div className="font-bold text-2xl text-neutral-800 mb-1">{profile.hoTen || profile.taiKhoan}</div>
          <div className="text-neutral-500 text-lg">{profile.email}</div>
        </div>
      </div>
      {/* User info fields, 2-column grid, spaced below avatar section */}
      <div className="max-w-5xl mx-auto pt-20 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mb-8">
          {/* Left column */}
          <div className="flex flex-col gap-4">
            <div>
              <label className="block font-semibold mb-1 text-neutral-700">Họ tên</label>
              <input className="w-full border border-neutral-200 bg-neutral-50 px-3 py-2 rounded text-neutral-700" value={profile.hoTen || ""} readOnly />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-neutral-700">Điện thoại</label>
              <input className="w-full border border-neutral-200 bg-neutral-50 px-3 py-2 rounded text-neutral-700" value={profile.soDT || profile.soDt || ""} readOnly />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-neutral-700">Language</label>
              <input className="w-full border border-neutral-200 bg-neutral-50 px-3 py-2 rounded text-neutral-700" value="Vietnamese" readOnly />
            </div>
          </div>
          {/* Right column */}
          <div className="flex flex-col gap-4">
            <div>
              <label className="block font-semibold mb-1 text-neutral-700">Email</label>
              <input className="w-full border border-neutral-200 bg-neutral-50 px-3 py-2 rounded text-neutral-700" value={profile.email || ""} readOnly />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-neutral-700">Tài khoản</label>
              <input className="w-full border border-neutral-200 bg-neutral-50 px-3 py-2 rounded text-neutral-700" value={profile.taiKhoan || ""} readOnly />
            </div>
          </div>
        </div>
        {/* Contact info */}
        <div className="mt-10">
        <div className="font-bold text-lg mb-4 text-neutral-800">Thông tin liên hệ</div>
          <div className="flex flex-row gap-8 items-center">
            <div className="flex items-center gap-3">
            <span className="bg-blue-100 p-2 rounded-full"><FaEnvelope className="text-blue-500 text-lg" /></span>
            <div>
              <div className="font-medium text-neutral-800">{profile.email}</div>
              <div className="text-neutral-400 text-sm">Email</div>
            </div>
          </div>
            <div className="flex items-center gap-3">
            <span className="bg-green-100 p-2 rounded-full"><FaPhone className="text-green-500 text-lg" /></span>
            <div>
              <div className="font-medium text-neutral-800">{profile.soDT || profile.soDt}</div>
              <div className="text-neutral-400 text-sm">Điện thoại</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Booking statistics and history */}
      <div className="mt-12 max-w-5xl mx-auto px-4">
        {/* Thống kê cá nhân */}
        <div className="mb-10">
          <div className="font-bold text-lg mb-4 text-neutral-800">Thống kê cá nhân</div>
          {profile.thongTinDatVe && profile.thongTinDatVe.length > 0 ? (
            <PersonalStatistics bookings={profile.thongTinDatVe} />
          ) : (
            <div className="text-neutral-500">Chưa có lịch sử đặt vé.</div>
          )}
        </div>
        {/* Lịch sử đặt vé */}
        <div>
          <div className="font-bold text-lg mb-4 text-neutral-800">Lịch sử đặt vé</div>
          {profile.thongTinDatVe && profile.thongTinDatVe.length > 0 ? (
            <BookingHistory bookings={profile.thongTinDatVe} />
          ) : (
            <div className="text-neutral-500">Chưa có lịch sử đặt vé.</div>
          )}
        </div>
      </div>
    </div>
  );
} 