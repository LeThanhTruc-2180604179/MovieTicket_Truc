import api from "./api";

export const loginApi = async (payload) => {
  const res = await api.post("QuanLyNguoiDung/DangNhap", payload);
  return res.data.content;
};

export const registerApi = async (payload) => {
  const res = await api.post("QuanLyNguoiDung/DangKy", payload);
  return res.data.content;
};

export const fetchUserList = async () => {
  const res = await api.get("QuanLyNguoiDung/LayDanhSachNguoiDung?MaNhom=GP00");
  return res.data.content;
};

export const fetchUserListPaging = async (page = 1, pageSize = 8) => {
  const res = await api.get(`QuanLyNguoiDung/LayDanhSachNguoiDungPhanTrang?MaNhom=GP00&soTrang=${page}&soPhanTuTrenTrang=${pageSize}`);
  return res.data.content;
};

export const searchUserListPaging = async (keyword = "", page = 1, pageSize = 8) => {
  const res = await api.get(`QuanLyNguoiDung/TimKiemNguoiDungPhanTrang?MaNhom=GP00&tuKhoa=${encodeURIComponent(keyword)}&soTrang=${page}&soPhanTuTrenTrang=${pageSize}`);
  return res.data.content;
}; 