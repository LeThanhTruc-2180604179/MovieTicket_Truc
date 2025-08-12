import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../../store/authSlice";
import { useState, useRef, useEffect } from "react";
import { FaUserCircle, FaCog, FaQuestionCircle, FaSignOutAlt } from "react-icons/fa";

export default function Header() {
  const { user } = useSelector((state) => state.authSlice);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const menuRef = useRef();
  const [scrolled, setScrolled] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Hiệu ứng chuyển nền khi cuộn - chỉ áp dụng cho trang không phải trang chủ
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    
    // Chỉ áp dụng hiệu ứng scroll cho trang không phải trang chủ
    const isHomePage = location.pathname === '/' || location.pathname === '';
    if (!isHomePage) {
      window.addEventListener("scroll", onScroll);
      return () => window.removeEventListener("scroll", onScroll);
    } else {
      // Ở trang chủ, luôn set scrolled = true để có màu đậm
      setScrolled(true);
    }
  }, [location.pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 px-8 py-4 flex items-center justify-between text-white transition-all duration-500
        ${scrolled ? "bg-black/80 backdrop-blur-xl shadow-2xl border-b border-white/10" : "bg-black/40 backdrop-blur-lg shadow-xl border-b border-white/5"}
      `}
      style={{backdropFilter: 'blur(20px)'}}
    >
      {/* Left side - NEW MOVIE tag */}
      <div className="flex items-center space-x-6">
        <div className="bg-yellow-400 text-black font-bold px-3 py-1 rounded text-sm">
          NEW MOVIE
        </div>
      </div>

      {/* Center - Navigation */}
      <ul className="flex space-x-8 font-semibold text-lg drop-shadow-2xl">
        <li>
          <NavLink to="" className={({ isActive }) => isActive ? "text-yellow-400" : "hover:text-yellow-400 transition-all duration-200"}>Trang chủ</NavLink>
        </li>
        <li>
          <NavLink to="list-movie" className={({ isActive }) => isActive ? "text-yellow-400" : "hover:text-yellow-400 transition-all duration-200"}>Phim</NavLink>
        </li>
        <li>
          <NavLink to="news" className={({ isActive }) => isActive ? "text-yellow-400" : "hover:text-yellow-400 transition-all duration-200"}>Lịch chiếu</NavLink>
        </li>
        <li>
          <NavLink to="about" className={({ isActive }) => isActive ? "text-yellow-400" : "hover:text-yellow-400 transition-all duration-200"}>Giới thiệu</NavLink>
        </li>
        {user && (
          <li>
            <NavLink to="/my-tickets" className={({ isActive }) => isActive ? "text-yellow-400" : "hover:text-yellow-400 transition-all duration-200"}>Vé của bạn</NavLink>
          </li>
        )}
      </ul>

      {/* Right side - Login/User */}
      <div className="flex items-center gap-4" ref={menuRef}>
        {user ? (
          <>
            <span className="font-semibold hidden md:block drop-shadow-2xl text-lg">{user.hoTen || user.taiKhoan}</span>
            <button
              className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center border-2 border-white/80 overflow-hidden focus:outline-none shadow-2xl"
              onClick={() => setOpen((v) => !v)}
              aria-label="User menu"
            >
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.hoTen || user.taiKhoan)}&background=4f46e5&color=fff&size=64`}
                alt="avatar"
                className="w-10 h-10 object-cover"
              />
            </button>
            {open && (
              <div className="absolute right-0 top-14 w-72 bg-white text-black rounded-2xl shadow-2xl py-4 z-50 animate-fade-in border border-gray-200 transition-all duration-300" style={{ minWidth: 240, borderRadius: 24 }}>
                <ul className="py-2 px-2">
                  <li>
                    <button
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-base font-semibold hover:bg-gray-100 transition"
                      onClick={() => { setOpen(false); navigate("/edit-profile"); }}
                    >
                      <FaUserCircle className="text-xl text-black" />
                      Edit Profile
                    </button>
                  </li>
                  <li>
                    <button
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-base font-semibold hover:bg-gray-100 transition"
                      onClick={() => { setOpen(false); /* navigate('/settings') */ }}
                    >
                      <FaCog className="text-xl text-black" />
                      Settings & Privacy
                    </button>
                  </li>
                  <li>
                    <button
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-base font-semibold hover:bg-gray-100 transition"
                      onClick={() => { setOpen(false); /* navigate('/help') */ }}
                    >
                      <FaQuestionCircle className="text-xl text-black" />
                      Help & Support
                    </button>
                  </li>
                  <li>
                    <button
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-base font-semibold hover:bg-gray-100 transition"
                      onClick={handleLogout}
                    >
                      <FaSignOutAlt className="text-xl text-black" />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </>
        ) : (
          <NavLink 
            to="login" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded transition-all duration-200 shadow-lg"
            onClick={() => navigate('/login', { state: { from: location.pathname } })}
          >
            Login
          </NavLink>
        )}
      </div>
    </nav>
  );
}
