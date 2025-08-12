import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function AdminOnlyRoute({ children }) {
  const { user } = useSelector((state) => state.authSlice);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      if (window.location.pathname.startsWith("/admin")) {
        navigate("/login", { replace: true });
      }
    } else if (user.maLoaiNguoiDung === "QuanTri" && window.location.pathname !== "/admin/dashboard") {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [user, navigate]);
  if (!user && window.location.pathname.startsWith("/admin")) return null;
  // children có thể là array hoặc element
  return Array.isArray(children) ? children[0] : children;
} 