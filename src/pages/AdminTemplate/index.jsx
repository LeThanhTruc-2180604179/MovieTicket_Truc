import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";

export default function AdminTemplate() {
  const { user } = useSelector((state) => state.authSlice);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.maLoaiNguoiDung !== "QuanTri") {
      navigate("/", { replace: true });
    } else if (window.location.pathname !== "/admin/dashboard") {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [user, navigate]);

  // Bảo vệ back/forward: luôn ép về dashboard nếu là admin
  useEffect(() => {
    if (!user || user.maLoaiNguoiDung !== "QuanTri") return;
    const onPopState = () => {
      if (window.location.pathname !== "/admin/dashboard") {
        navigate("/admin/dashboard", { replace: true });
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [user, navigate]);

  if (!user || user.maLoaiNguoiDung !== "QuanTri") return null;

  return (
    <div>
      <Outlet />
    </div>
  );
}
