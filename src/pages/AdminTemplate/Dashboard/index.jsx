import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../store/authSlice";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import UserManagement from "./UserManagement";
import ScheduleManagement from "./ScheduleManagement";
import MovieManagement from "./MovieManagement";

const MENU = [
  { 
    key: "users", 
    label: "Quản lý người dùng",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      </svg>
    )
  },
  { 
    key: "movies", 
    label: "Quản lý phim",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m4 0H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zM8 8h8M8 12h8M8 16h4" />
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" fill="none"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    )
  },
  { 
    key: "schedules", 
    label: "Quản lý lịch chiếu",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  },
];

export default function Dashboard() {
  const { user } = useSelector((state) => state.authSlice);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selected, setSelected] = useState("users");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    setDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getMenuTitle = () => {
    return MENU.find(item => item.key === selected)?.label || "";
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className={`${sidebarCollapsed ? 'w-20' : 'w-72'} bg-white border-r border-gray-200 flex flex-col shadow-lg transition-all duration-300 ease-in-out`}>
        <div className={`${sidebarCollapsed ? 'p-4' : 'p-8'} border-b border-gray-100 transition-all duration-300`}>
          {!sidebarCollapsed ? (
            <>
              <div className="font-black text-3xl text-black mb-1 tracking-tight">
                ADMIN
              </div>
              <div className="text-gray-400 text-sm font-medium uppercase tracking-wider">
                Dashboard
              </div>
            </>
          ) : (
            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mx-auto">
              <span className="text-white font-black text-lg">A</span>
            </div>
          )}
        </div>
        
        <nav className="flex-1 py-6">
          {MENU.map((item, index) => (
            <div key={item.key} className="relative group">
              <button
                className={`w-full text-left ${sidebarCollapsed ? 'px-4 py-4' : 'px-8 py-4'} font-medium transition-all duration-200 flex items-center ${
                  selected === item.key
                    ? "bg-black text-white"
                    : "text-gray-700 hover:bg-gray-50 hover:text-black"
                }`}
                onClick={() => setSelected(item.key)}
              >
                <div className={`${selected === item.key ? "text-white" : "text-gray-500 group-hover:text-gray-700"} transition-colors duration-200`}>
                  {item.icon}
                </div>
                {!sidebarCollapsed && (
                  <>
                    <span className="ml-4">{item.label}</span>
                    <span className={`w-2 h-2 rounded-full ml-auto transition-all duration-200 ${
                      selected === item.key ? "bg-white" : "bg-gray-300 group-hover:bg-gray-500"
                    }`} />
                  </>
                )}
                {selected === item.key && (
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-white" />
                )}
              </button>
              
              {/* Tooltip for collapsed state */}
              {sidebarCollapsed && (
                <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-2 bg-black text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  {item.label}
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-black"></div>
                </div>
              )}
            </div>
          ))}
        </nav>
        
        {!sidebarCollapsed && (
          <div className="p-8 border-t border-gray-100">
            <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
              Admin Panel v2.0
            </div>
          </div>
        )}
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {/* Toggle button in main header */}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors duration-200 mr-4 group"
                title={sidebarCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
              >
                <svg 
                  className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors duration-200" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  {sidebarCollapsed ? (
                    // Icon mở rộng - sidebar với arrow pointing right
                    <>
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <line x1="9" y1="3" x2="9" y2="21"/>
                      <path d="m14 8 3 3-3 3"/>
                    </>
                  ) : (
                    // Icon thu gọn - sidebar với arrow pointing left  
                    <>
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <line x1="9" y1="3" x2="9" y2="21"/>
                      <path d="m16 8-3 3 3 3"/>
                    </>
                  )}
                </svg>
              </button>
              
              <div>
                <h1 className="text-2xl font-bold text-black tracking-tight">
                  {getMenuTitle()}
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  Quản lý và điều hành hệ thống
                </p>
              </div>
            </div>
            
            {/* User dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-3 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 rounded-xl px-4 py-3 border border-gray-200"
              >
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {(user?.hoTen || user?.taiKhoan || "A").charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-black text-sm">
                    {user?.hoTen || user?.taiKhoan || "Admin"}
                  </div>
                  <div className="text-gray-500 text-xs">
                    Quản trị viên
                  </div>
                </div>
                <svg
                  className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-black">
                      {user?.hoTen || user?.taiKhoan || "Admin"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user?.email || "admin@system.com"}
                    </p>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 p-8 bg-gray-50 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {selected === "users" && <UserManagement />}
            {selected === "movies" && <MovieManagement />}
            {selected === "schedules" && <ScheduleManagement />}
          </div>
        </main>
      </div>
    </div>
  );
}