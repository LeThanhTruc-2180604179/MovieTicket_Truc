import { useState, useEffect, useRef } from "react";
import { fetchUserListPaging, fetchUserList, searchUserListPaging } from "../../../services/authApi";
import axios from "axios";

const PAGE_SIZE = 8;
const FILTERS = [
  { label: "Tất cả", value: "all" },
  { label: "User", value: "user" },
  { label: "Admin", value: "admin" },
];

function VerticalDots({ onClick }) {
  return (
    <button onClick={onClick} className="p-2 hover:bg-neutral-200 rounded-full">
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-neutral-500">
        <circle cx="12" cy="5" r="1.5"/>
        <circle cx="12" cy="12" r="1.5"/>
        <circle cx="12" cy="19" r="1.5"/>
      </svg>
    </button>
  );
}

function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-lg p-6 min-w-[320px] relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-neutral-400 hover:text-neutral-700 text-xl">×</button>
        {children}
      </div>
    </div>
  );
}

export default function UserManagement() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]); // Dữ liệu hiển thị trên bảng
  const [allUsers, setAllUsers] = useState([]); // Dữ liệu toàn bộ để lọc FE
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [adminCount, setAdminCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [filter, setFilter] = useState("all");
  const [actionIdx, setActionIdx] = useState(null); // index user đang mở action
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const actionMenuRef = useRef();
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  // Lấy tổng số user/admin (toàn bộ, không phân trang)
  useEffect(() => {
    fetchUserList()
      .then(data => {
        setAdminCount(data.filter(u => u.maLoaiNguoiDung === "QuanTri").length);
        setUserCount(data.filter(u => u.maLoaiNguoiDung !== "QuanTri").length);
        setAllUsers(data); // Lưu lại toàn bộ để lọc FE
      })
      .catch(() => {
        setAdminCount(0);
        setUserCount(0);
        setAllUsers([]);
      });
  }, []);

  // Lấy danh sách phân trang hoặc tìm kiếm (chỉ khi filter là 'all')
  useEffect(() => {
    if (filter === "all") {
      setLoading(true);
      const fetchData = search.trim()
        ? searchUserListPaging(search, page, PAGE_SIZE)
        : fetchUserListPaging(page, PAGE_SIZE);
      fetchData
        .then(data => {
          setUsers(data.items);
          setTotalCount(data.totalCount);
          setLoading(false);
        })
        .catch(() => {
          setError("Lỗi tải danh sách người dùng");
          setLoading(false);
        });
    }
  }, [page, search, filter]);

  // Khi filter là 'admin' hoặc 'user', lọc và phân trang FE
  useEffect(() => {
    if (filter !== "all") {
      setLoading(true);
      let filtered = allUsers;
      if (filter === "admin") filtered = allUsers.filter(u => u.maLoaiNguoiDung === "QuanTri");
      if (filter === "user") filtered = allUsers.filter(u => u.maLoaiNguoiDung !== "QuanTri");
      // Tìm kiếm FE nếu có search
      if (search.trim()) {
        const keyword = search.trim().toLowerCase();
        filtered = filtered.filter(u =>
          u.hoTen?.toLowerCase().includes(keyword) ||
          u.taiKhoan?.toLowerCase().includes(keyword) ||
          u.email?.toLowerCase().includes(keyword) ||
          u.soDt?.toLowerCase().includes(keyword)
        );
      }
      setTotalCount(filtered.length);
      // Phân trang FE
      const start = (page - 1) * PAGE_SIZE;
      setUsers(filtered.slice(start, start + PAGE_SIZE));
      setLoading(false);
    }
  }, [filter, allUsers, page, search]);

  // Đóng action menu khi click ra ngoài
  useEffect(() => {
    const handleClick = (e) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(e.target)) {
        setActionIdx(null);
      }
    };
    if (actionIdx !== null) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [actionIdx]);

  const total = totalCount;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  // Khi thay đổi từ khóa tìm kiếm hoặc filter thì reset về trang 1
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setPage(1);
  };

  // Phân trang chỉ hiển thị tối đa 5 nút số trang
  const renderPagination = () => {
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

  // Helper: lấy token admin
  const getToken = () => {
    const userLocal = JSON.parse(localStorage.getItem("user"));
    return userLocal?.accessToken || userLocal?.token;
  };

  // Thêm user
  const handleAddUser = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");
    const form = e.target;
    const payload = {
      hoTen: form[0].value,
      email: form[1].value,
      soDt: form[2].value,
      taiKhoan: form[3].value,
      matKhau: form[4].value,
      maLoaiNguoiDung: form[5].value,
      maNhom: "GP00",
    };
    try {
      await axios.post(
        "https://movienew.cybersoft.edu.vn/api/QuanLyNguoiDung/ThemNguoiDung",
        payload,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            TokenCybersoft:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA4MyIsIkhldEhhblN0cmluZyI6IjE4LzAxLzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc2ODY5NDQwMDAwMCIsIm5iZiI6MTc0MTg4ODgwMCwiZXhwIjoxNzY4ODQ1NjAwfQ.rosAjjMuXSBmnsEQ7BQi1qmo6eVOf1g8zhTZZg6WSx4",
          },
        }
      );
      setShowAddModal(false);
      form.reset();
      // reload danh sách
      fetchUserList().then(data => setAllUsers(data));
      setPage(1);
    } catch (err) {
      setFormError(err?.response?.data?.content || "Lỗi thêm người dùng");
    } finally {
      setFormLoading(false);
    }
  };

  // Sửa user
  const handleEditUser = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");
    const form = e.target;
    const payload = {
      hoTen: form[0].value,
      email: form[1].value,
      soDt: form[2].value,
      taiKhoan: form[3].value,
      maLoaiNguoiDung: form[4].value,
      maNhom: "GP00",
    };
    try {
      await axios.put(
        "https://movienew.cybersoft.edu.vn/api/QuanLyNguoiDung/CapNhatThongTinNguoiDung",
        payload,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            TokenCybersoft:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA4MyIsIkhldEhhblN0cmluZyI6IjE4LzAxLzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc2ODY5NDQwMDAwMCIsIm5iZiI6MTc0MTg4ODgwMCwiZXhwIjoxNzY4ODQ1NjAwfQ.rosAjjMuXSBmnsEQ7BQi1qmo6eVOf1g8zhTZZg6WSx4",
          },
        }
      );
      setShowEditModal(false);
      // reload danh sách
      fetchUserList().then(data => setAllUsers(data));
    } catch (err) {
      setFormError(err?.response?.data?.content || "Lỗi cập nhật người dùng");
    } finally {
      setFormLoading(false);
    }
  };

  // Xóa user
  const handleDeleteUser = async () => {
    setFormLoading(true);
    setFormError("");
    try {
      await axios.delete(
        `https://movienew.cybersoft.edu.vn/api/QuanLyNguoiDung/XoaNguoiDung?TaiKhoan=${selectedUser.taiKhoan}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            TokenCybersoft:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA4MyIsIkhldEhhblN0cmluZyI6IjE4LzAxLzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc2ODY5NDQwMDAwMCIsIm5iZiI6MTc0MTg4ODgwMCwiZXhwIjoxNzY4ODQ1NjAwfQ.rosAjjMuXSBmnsEQ7BQi1qmo6eVOf1g8zhTZZg6WSx4",
          },
        }
      );
      setShowDeleteModal(false);
      // reload danh sách
      fetchUserList().then(data => setAllUsers(data));
    } catch (err) {
      setFormError(err?.response?.data?.content || "Lỗi xóa người dùng");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Card thống kê */}
      <div className="flex gap-6">
        <div className="flex-1 bg-white rounded-2xl shadow p-6 flex items-center gap-4 border border-neutral-100">
          <div className="bg-blue-100 rounded-full w-14 h-14 flex items-center justify-center">
            <i className="fas fa-users text-2xl text-gray-800" />
          </div>
          <div>
            <div className="text-neutral-500 text-sm font-medium">Tổng tài khoản</div>
            <div className="text-2xl font-bold text-neutral-900">{total.toLocaleString()}</div>
          </div>
        </div>
        <div className="flex-1 bg-white rounded-2xl shadow p-6 flex items-center gap-4 border border-neutral-100">
          <div className="bg-green-100 rounded-full w-14 h-14 flex items-center justify-center">
            <i className="fas fa-user text-2xl text-gray-800" />
          </div>
          <div>
            <div className="text-neutral-500 text-sm font-medium">USER</div>
            <div className="text-2xl font-bold text-neutral-900">{userCount.toLocaleString()}</div>
          </div>
        </div>
        <div className="flex-1 bg-white rounded-2xl shadow p-6 flex items-center gap-4 border border-neutral-100">
          <div className="bg-purple-100 rounded-full w-14 h-14 flex items-center justify-center">
            <i className="fas fa-user-shield text-2xl text-gray-800" />
          </div>
          <div>
            <div className="text-neutral-500 text-sm font-medium">ADMIN</div>
            <div className="text-2xl font-bold text-neutral-900">{adminCount}</div>
          </div>
        </div>
      </div>
      {/* Card danh sách tài khoản */}
      <div className="bg-white rounded-2xl shadow p-8 border border-neutral-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xl font-bold text-neutral-900">Danh sách tài khoản</div>
            <div className="text-green-500 text-sm font-medium">Active Members</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm"
                className="pl-10 pr-3 py-2 rounded-lg border border-neutral-200 bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-green-200"
                value={search}
                onChange={handleSearchChange}
              />
              <i className="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            </div>
            {/* Nút thêm người dùng */}
            <button
              className="ml-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              onClick={() => setShowAddModal(true)}
            >
              Thêm người dùng
            </button>
            {/* Bộ lọc loại tài khoản */}
            <select
              className="ml-2 px-6 py-2 rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-700"
              value={filter}
              onChange={handleFilterChange}
            >
              {FILTERS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
        {loading ? (
          <div className="text-center py-10 text-neutral-400">Đang tải danh sách...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="text-neutral-500 border-b">
                  <th className="py-3 px-4 font-semibold">Họ tên</th>
                  <th className="py-3 px-4 font-semibold">Tài khoản</th>
                  <th className="py-3 px-4 font-semibold">Điện thoại</th>
                  <th className="py-3 px-4 font-semibold">Email</th>
                  <th className="py-3 px-4 font-semibold">Mật khẩu</th>
                  <th className="py-3 px-4 font-semibold">Quyền</th>
                  <th className="py-3 px-4 font-semibold text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, idx) => (
                  <tr key={idx} className="border-b last:border-0 hover:bg-neutral-50">
                    <td className="py-3 px-4">{u.hoTen}</td>
                    <td className="py-3 px-4">{u.taiKhoan}</td>
                    <td className="py-3 px-4">{u.soDt}</td>
                    <td className="py-3 px-4">{u.email}</td>
                    <td className="py-3 px-4">********</td>
                    <td className="py-3 px-4">
                      {u.maLoaiNguoiDung === "QuanTri" ? (
                        <span className="bg-red-100 text-red-500 px-3 py-1 rounded-lg font-semibold text-xs border border-red-200">Admin</span>
                      ) : (
                        <span className="bg-green-100 text-green-600 px-3 py-1 rounded-lg font-semibold text-xs border border-green-200">User</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center relative" ref={actionMenuRef}>
                      <VerticalDots onClick={() => setActionIdx(idx === actionIdx ? null : idx)} />
                      {actionIdx === idx && (
                        <div className="absolute right-0 top-8 bg-white border border-neutral-200 rounded-lg shadow-lg z-10 min-w-[120px] animate-fade-in">
                          <button
                            className="block w-full px-4 py-2 text-left hover:bg-neutral-100"
                            onClick={() => { setShowEditModal(true); setSelectedUser(u); setActionIdx(null); }}
                          >Sửa</button>
                          <button
                            className="block w-full px-4 py-2 text-left hover:bg-neutral-100 text-red-600"
                            onClick={() => { setShowDeleteModal(true); setSelectedUser(u); setActionIdx(null); }}
                          >Xóa</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* Pagination */}
        <div className="flex justify-between items-center mt-4 text-neutral-400 text-xs">
          <div>Showing data {users.length > 0 ? (PAGE_SIZE * (page - 1) + 1) : 0} to {PAGE_SIZE * (page - 1) + users.length} of {total} entries</div>
          <div className="flex gap-1">
            {renderPagination()}
          </div>
        </div>
      </div>
      {/* Modal xác nhận xóa */}
      <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <div className="text-lg font-bold mb-4">Xác nhận xóa người dùng</div>
        <div className="mb-6">Bạn có chắc chắn muốn xóa tài khoản <span className="font-semibold">{selectedUser?.taiKhoan}</span> không?</div>
        {formError && <div className="text-red-500 mb-2 text-sm">{formError}</div>}
        <div className="flex gap-3 justify-end">
          <button className="px-4 py-2 rounded bg-neutral-200 hover:bg-neutral-300" onClick={() => setShowDeleteModal(false)} disabled={formLoading}>Hủy</button>
          <button className="px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700" onClick={handleDeleteUser} disabled={formLoading}>{formLoading ? "Đang xóa..." : "Xóa"}</button>
        </div>
      </Modal>
      {/* Modal sửa user */}
      <Modal open={showEditModal} onClose={() => setShowEditModal(false)}>
        <div className="text-lg font-bold mb-4">Sửa thông tin người dùng</div>
        <form className="space-y-4" onSubmit={handleEditUser}>
          <div>
            <label className="block font-semibold mb-1">Họ tên</label>
            <input className="w-full border px-3 py-2 rounded" defaultValue={selectedUser?.hoTen} required />
          </div>
          <div>
            <label className="block font-semibold mb-1">Email</label>
            <input className="w-full border px-3 py-2 rounded" defaultValue={selectedUser?.email} required />
          </div>
          <div>
            <label className="block font-semibold mb-1">Số điện thoại</label>
            <input className="w-full border px-3 py-2 rounded" defaultValue={selectedUser?.soDt} required />
          </div>
          <div>
            <label className="block font-semibold mb-1">Tài khoản</label>
            <input className="w-full border px-3 py-2 rounded bg-neutral-100" defaultValue={selectedUser?.taiKhoan} disabled />
          </div>
          <div>
            <label className="block font-semibold mb-1">Quyền</label>
            <select className="w-full border px-3 py-2 rounded" defaultValue={selectedUser?.maLoaiNguoiDung} required>
              <option value="KhachHang">User</option>
              <option value="QuanTri">Admin</option>
            </select>
          </div>
          {formError && <div className="text-red-500 text-sm">{formError}</div>}
          <div className="flex gap-3 justify-end">
            <button type="button" className="px-4 py-2 rounded bg-neutral-200 hover:bg-neutral-300" onClick={() => setShowEditModal(false)} disabled={formLoading}>Hủy</button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700" disabled={formLoading}>{formLoading ? "Đang lưu..." : "Lưu"}</button>
          </div>
        </form>
      </Modal>
      {/* Modal thêm user */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)}>
        <div className="text-lg font-bold mb-4">Thêm người dùng mới</div>
        <form className="space-y-4" onSubmit={handleAddUser}>
          <div>
            <label className="block font-semibold mb-1">Họ tên</label>
            <input className="w-full border px-3 py-2 rounded" required />
          </div>
          <div>
            <label className="block font-semibold mb-1">Email</label>
            <input className="w-full border px-3 py-2 rounded" required />
          </div>
          <div>
            <label className="block font-semibold mb-1">Số điện thoại</label>
            <input className="w-full border px-3 py-2 rounded" required />
          </div>
          <div>
            <label className="block font-semibold mb-1">Tài khoản</label>
            <input className="w-full border px-3 py-2 rounded" required />
          </div>
          <div>
            <label className="block font-semibold mb-1">Mật khẩu</label>
            <input className="w-full border px-3 py-2 rounded" type="password" required />
          </div>
          <div>
            <label className="block font-semibold mb-1">Quyền</label>
            <select className="w-full border px-3 py-2 rounded" defaultValue="KhachHang" required>
              <option value="KhachHang">User</option>
              <option value="QuanTri">Admin</option>
            </select>
          </div>
          {formError && <div className="text-red-500 text-sm">{formError}</div>}
          <div className="flex gap-3 justify-end">
            <button type="button" className="px-4 py-2 rounded bg-neutral-200 hover:bg-neutral-300" onClick={() => setShowAddModal(false)} disabled={formLoading}>Hủy</button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700" disabled={formLoading}>{formLoading ? "Đang thêm..." : "Thêm"}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
} 