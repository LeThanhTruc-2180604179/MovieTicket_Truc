import { Film, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Download } from 'lucide-react';

export default function Footer() {
  const cinemaPartners = [
    { name: "CGV", count: "120+" },
    { name: "Lotte", count: "80+" },
    { name: "Galaxy", count: "60+" },
    { name: "BHD Star", count: "45+" }
  ];

  const quickLinks = [
    "Lịch chiếu",
    "Phim đang chiếu",  
    "Phim sắp chiếu",
    "Rạp chiếu phim",
    "Tin tức điện ảnh",
    "Khuyến mãi"
  ];

  const supportLinks = [
    "Hướng dẫn đặt vé",
    "Hỗ trợ khách hàng",
    "Câu hỏi thường gặp",
    "Chính sách bảo mật",
    "Điều khoản sử dụng",
    "Thanh toán"
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <div className="bg-blue-600 p-2 rounded-lg mr-3">
                <Film className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold">MovieTicket</h3>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Nền tảng đặt vé xem phim hàng đầu Việt Nam. Kết nối bạn với hơn 500+ rạp chiếu phim trên toàn quốc.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-gray-400">
                <Phone className="w-4 h-4 mr-3" />
                <span className="text-sm">1900 6017</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Mail className="w-4 h-4 mr-3" />
                <span className="text-sm">support@movieticket.vn</span>
              </div>
              <div className="flex items-center text-gray-400">
                <MapPin className="w-4 h-4 mr-3" />
                <span className="text-sm">Tầng 5, Tòa nhà ABC, Q.1, TP.HCM</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex space-x-4">
              <div className="w-9 h-9 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center cursor-pointer transition-colors">
                <Facebook className="w-4 h-4" />
              </div>
              <div className="w-9 h-9 bg-blue-400 hover:bg-blue-500 rounded-lg flex items-center justify-center cursor-pointer transition-colors">
                <Twitter className="w-4 h-4" />
              </div>
              <div className="w-9 h-9 bg-pink-600 hover:bg-pink-700 rounded-lg flex items-center justify-center cursor-pointer transition-colors">
                <Instagram className="w-4 h-4" />
              </div>
              <div className="w-9 h-9 bg-red-600 hover:bg-red-700 rounded-lg flex items-center justify-center cursor-pointer transition-colors">
                <Youtube className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Liên Kết Nhanh</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Hỗ Trợ</h4>
            <ul className="space-y-3">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Cinema Partners & App Download */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Đối Tác Rạp</h4>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {cinemaPartners.map((partner, index) => (
                <div key={index} className="bg-gray-800 rounded-lg p-3 text-center hover:bg-gray-700 transition-colors">
                  <div className="font-semibold text-sm text-white">{partner.name}</div>
                  <div className="text-xs text-gray-400">{partner.count} rạp</div>
                </div>
              ))}
            </div>

            {/* App Download */}
            <h5 className="font-semibold mb-4">Tải Ứng Dụng</h5>
            <div className="space-y-3">
              <button className="w-full bg-gray-800 hover:bg-gray-700 rounded-lg p-3 flex items-center justify-center transition-colors">
                <Download className="w-5 h-5 mr-2" />
                <div className="text-left">
                  <div className="text-xs text-gray-400">Tải trên</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </button>
              <button className="w-full bg-gray-800 hover:bg-gray-700 rounded-lg p-3 flex items-center justify-center transition-colors">
                <Download className="w-5 h-5 mr-2" />
                <div className="text-left">
                  <div className="text-xs text-gray-400">Tải trên</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h4 className="text-lg font-semibold mb-2">Đăng Ký Nhận Tin</h4>
              <p className="text-gray-400 text-sm">Nhận thông tin phim mới và ưu đãi đặc biệt</p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="flex-1 md:w-64 px-4 py-3 bg-gray-800 border border-gray-700 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
              <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-r-lg font-semibold transition-colors">
                Đăng Ký
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
            <div className="mb-4 md:mb-0">
              <p>&copy; 2024 MovieTicket. Tất cả quyền được bảo lưu.</p>
            </div>
            <div className="flex flex-wrap items-center space-x-6">
              <a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a>
              <a href="#" className="hover:text-white transition-colors">Điều khoản dịch vụ</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
              <div className="flex items-center space-x-2">
                <span>Chấp nhận thanh toán:</span>
                <div className="flex space-x-1">
                  <div className="w-8 h-5 bg-blue-600 rounded text-xs flex items-center justify-center font-bold">
                    VISA
                  </div>
                  <div className="w-8 h-5 bg-red-600 rounded text-xs flex items-center justify-center font-bold">
                    MC
                  </div>
                  <div className="w-8 h-5 bg-blue-500 rounded text-xs flex items-center justify-center font-bold">
                    ATM
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}