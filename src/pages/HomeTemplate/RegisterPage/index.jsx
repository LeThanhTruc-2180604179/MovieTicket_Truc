import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../../store/authSlice";
import { useNavigate } from "react-router-dom";
import ParticlesBackground from "../../../components/ParticlesBackground";
import { Eye, EyeOff, User, Lock, Mail, Phone, UserCheck } from "lucide-react";

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

export default function RegisterPage() {
  const [form, setForm] = useState({
    taiKhoan: "",
    matKhau: "",
    email: "",
    soDt: "",
    hoTen: "",
    maNhom: "GP00",
  });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.authSlice);

  // Array of animated welcome items for movie ticket website (register)
  const welcomeItems = [
    {
      title: "Đăng ký tài khoản MovieTicket!",
      subtitle: "Tham gia cộng đồng yêu điện ảnh, đặt vé nhanh, nhận ưu đãi hấp dẫn."
    },
    {
      title: "Khám phá phim hot dễ dàng!",
      subtitle: "Đăng ký để xem lịch chiếu, trailer, đánh giá phim mới nhất."
    },
    {
      title: "Đặt vé mọi lúc, mọi nơi!",
      subtitle: "Chỉ cần vài bước, bạn đã có vé xem phim trong tay."
    },
    {
      title: "Tích điểm đổi quà cực chất!",
      subtitle: "Đăng ký thành viên để nhận voucher, quà tặng và nhiều ưu đãi."
    }
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const action = await dispatch(register(form));
    if (register.fulfilled.match(action)) {
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center relative overflow-hidden pt-32">
      <div className="absolute inset-0 z-0">
        <ParticlesBackground />
      </div>
      
      {/* Modern Card */}
      <div className="flex max-w-5xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden relative z-10 mx-4">
        {/* Left side - Welcome section */}
        <div className="flex-1 p-12 flex flex-col justify-center relative" style={{
          background: 'linear-gradient(135deg, #10B981 0%, #059669 50%, #047857 100%)'
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

        {/* Right side - Sign Up form */}
        <div className="flex-1 px-12 py-8 flex flex-col justify-center bg-white/5 backdrop-blur-md border border-white/30 shadow-xl">
          <div className="w-full max-w-sm mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Đăng ký</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name field */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <UserCheck size={20} />
                </div>
                <input
                  type="text"
                  name="hoTen"
                  value={form.hoTen}
                  onChange={handleChange}
                  placeholder="Họ và tên"
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
                  required
                />
              </div>

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
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
                  required
                />
              </div>

              {/* Email field */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
                  required
                />
              </div>

              {/* Phone field */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Phone size={20} />
                </div>
                <input
                  type="text"
                  name="soDt"
                  value={form.soDt}
                  onChange={handleChange}
                  placeholder="Số điện thoại"
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
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
                  className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
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

              {/* Terms checkbox */}
              <div className="flex items-start text-sm">
                <input
                  type="checkbox"
                  required
                  className="mr-3 mt-1 w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                />
                <span className="text-gray-600 leading-relaxed">
                  Tôi đồng ý với{" "}
                  <button
                    type="button"
                    className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                  >
                    Điều khoản dịch vụ
                  </button>{" "}
                  và{" "}
                  <button
                    type="button"
                    className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                  >
                    Chính sách bảo mật
                  </button>
                </span>
              </div>

              {/* Error message */}
              {error && (
                <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                  {error}
                </div>
              )}

              {/* Sign Up button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Đang đăng ký...
                  </div>
                ) : (
                  "Đăng ký"
                )}
              </button>

              {/* Sign in link */}
              <div className="text-center text-gray-600">
                <span>Đã có tài khoản? </span>
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline transition-colors"
                >
                  Đăng nhập ngay!
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}