import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../../store/authSlice";
import { useNavigate } from "react-router-dom";
import ParticlesBackground from "../../../components/ParticlesBackground";
import { Eye, EyeOff, User, Lock } from "lucide-react";

// Animated Text Component
function AnimatedText({ items, className }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
        setIsVisible(true);
      }, 300);
    }, 3500);
    return () => clearInterval(interval);
  }, [items.length]);

  return (
    <div className={`transition-all duration-600 ${className}`}>
      <h1
        className={`text-4xl font-bold text-white mb-3 leading-tight transition-all duration-300 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}
      >
        {items[currentIndex].title}
      </h1>
      <p
        className={`text-white/90 text-lg leading-relaxed transition-all duration-300 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}
      >
        {items[currentIndex].subtitle}
      </p>
    </div>
  );
}

export default function LoginPage() {
  const [form, setForm] = useState({ taiKhoan: "", matKhau: "" });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.authSlice);

  // Array of animated welcome items for movie ticket website
  const welcomeItems = [
    {
      title: "Chào mừng bạn đến với MovieTicket!",
      subtitle: "Đăng nhập để đặt vé xem phim nhanh chóng, tiện lợi và nhận nhiều ưu đãi hấp dẫn."
    },
    {
      title: "Trải nghiệm đặt vé hiện đại!",
      subtitle: "Chọn rạp, chọn ghế, thanh toán online chỉ trong vài bước đơn giản."
    },
    {
      title: "Cập nhật phim hot mỗi ngày!",
      subtitle: "Khám phá lịch chiếu, trailer và đánh giá phim mới nhất."
    },
    {
      title: "Ưu đãi thành viên cực chất!",
      subtitle: "Tích điểm đổi quà, nhận voucher giảm giá khi đăng nhập tài khoản."
    }
  ];

  useEffect(() => {
    if (user) {
      const redirect = localStorage.getItem("redirectAfterLogin");
      if (redirect) {
        localStorage.removeItem("redirectAfterLogin");
        navigate(redirect, { replace: true });
      } else if (user.maLoaiNguoiDung === "QuanTri") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(login(form));
  };

  if (user) return null;

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center relative overflow-hidden pt-32">
      <div className="absolute inset-0 z-0">
        <ParticlesBackground />
      </div>
      
      {/* Modern Card */}
      <div className="flex max-w-4xl w-full rounded-2xl shadow-2xl overflow-hidden relative z-10 mx-4">
        {/* Left side - Welcome section */}
        <div className="flex-1 p-12 flex flex-col justify-center relative" style={{
          background: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 50%, #C084FC 100%)'
        }}>
          {/* Decorative elements for left side */}
          <div className="absolute top-8 left-8 w-16 h-16 border-2 border-white/30 rounded-full"></div>
          <div className="absolute top-12 left-12 w-2 h-2 bg-white/50 rounded-full"></div>
          <div className="absolute bottom-20 left-8 text-white/40 text-3xl">+</div>
          <div className="absolute bottom-8 right-12 w-12 h-12 border border-white/30 rounded-full"></div>
          <div className="absolute top-1/2 right-8 grid grid-cols-3 gap-1">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="w-1 h-1 bg-white/40 rounded-full"></div>
            ))}
          </div>
          
          {/* Flowing background pattern */}
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
            <path
              d="M0,50 Q100,20 200,50 T400,50"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="3"
              fill="none"
            />
            <path
              d="M50,150 Q150,120 250,150 T450,150"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M-50,250 Q50,220 150,250 T350,250"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="2"
              fill="none"
            />
          </svg>

          <div className="relative z-10">
            <AnimatedText items={welcomeItems} />
          </div>
        </div>

        {/* Right side - Sign In form với độ trong suốt */}
        <div className="flex-1 px-12 py-16 flex flex-col justify-center backdrop-blur-lg">
          <div className="w-full max-w-sm mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Đăng nhập</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username field */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  name="taiKhoan"
                  value={form.taiKhoan}
                  onChange={handleChange}
                  placeholder="Tài khoản"
                  className="w-full pl-12 pr-4 py-4 bg-white/30 backdrop-blur-sm border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-500"
                  required
                />
              </div>

              {/* Password field */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="matKhau"
                  value={form.matKhau}
                  onChange={handleChange}
                  placeholder="Mật khẩu"
                  className="w-full pl-12 pr-12 py-4 bg-white/30 backdrop-blur-sm border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Remember me and Forgot password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-gray-800">
                  <input
                    type="checkbox"
                    className="mr-2 w-4 h-4 text-purple-600 bg-white/30 border-white/40 rounded focus:ring-purple-500"
                  />
                  Ghi nhớ đăng nhập
                </label>
                <button
                  type="button"
                  className="text-purple-700 hover:text-purple-800 font-medium transition-colors"
                >
                  Quên mật khẩu?
                </button>
              </div>

              {/* Error message */}
              {error && (
                <div className="text-red-700 text-sm bg-red-100/50 backdrop-blur-sm p-3 rounded-lg border border-red-200/50">
                  {error}
                </div>
              )}

              {/* Sign In button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Đang đăng nhập...
                  </div>
                ) : (
                  "Đăng nhập"
                )}
              </button>

              {/* Sign up link */}
              <div className="text-center text-gray-800">
                <span>Bạn chưa có tài khoản? </span>
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="text-purple-700 hover:text-purple-800 font-semibold hover:underline transition-colors"
                >
                  Đăng ký ngay!
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}