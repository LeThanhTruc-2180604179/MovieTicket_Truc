import { useState, useEffect, useRef } from 'react';
import { Users, Award, MapPin, Calendar, Star, TrendingUp, Shield, Clock, Heart, Target, Eye, Lightbulb } from 'lucide-react';

export default function AboutPage() {
  const [counters, setCounters] = useState({
    customers: 0,
    cinemas: 0,
    cities: 0,
    years: 0
  });

  const sectionsRef = useRef({});
  const [visibleSections, setVisibleSections] = useState(new Set());

  useEffect(() => {
    const animateCounters = () => {
      const targets = {
        customers: 2500000,
        cinemas: 500,
        cities: 63,
        years: 8
      };

      const duration = 2000;
      const steps = 60;
      const interval = duration / steps;

      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        
        setCounters({
          customers: Math.floor(targets.customers * progress),
          cinemas: Math.floor(targets.cinemas * progress),
          cities: Math.floor(targets.cities * progress),
          years: Math.floor(targets.years * progress)
        });

        if (step >= steps) {
          clearInterval(timer);
          setCounters(targets);
        }
      }, interval);

      return () => clearInterval(timer);
    };

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            setVisibleSections(prev => new Set([...prev, sectionId]));
            
            // Trigger counter animation for stats section
            if (sectionId === 'stats-section') {
              animateCounters();
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    // Observe all sections
    Object.values(sectionsRef.current).forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const setRef = (id) => (el) => {
    sectionsRef.current[id] = el;
  };

  const isVisible = (sectionId) => visibleSections.has(sectionId);

  const stats = [
    {
      icon: Users,
      number: counters.customers.toLocaleString('vi-VN'),
      label: "Khách Hàng",
      suffix: "+"
    },
    {
      icon: MapPin,
      number: counters.cinemas,
      label: "Rạp Chiếu Phim",
      suffix: "+"
    },
    {
      icon: Award,
      number: counters.cities,
      label: "Tỉnh Thành",
      suffix: "/63"
    },
    {
      icon: Calendar,
      number: counters.years,
      label: "Năm Kinh Nghiệm",
      suffix: ""
    }
  ];

  const milestones = [
    {
      year: "2016",
      title: "Thành Lập Công Ty",
      desc: "Ra mắt với sứ mệnh kết nối người xem phim với các rạp chiếu"
    },
    {
      year: "2018", 
      title: "Mở Rộng Toàn Quốc",
      desc: "Kết nối với 100+ rạp chiếu phim đầu tiên trên cả nước"
    },
    {
      year: "2020",
      title: "Ứng Dụng Di Động",
      desc: "Ra mắt app mobile với giao diện thân thiện và tính năng hiện đại"
    },
    {
      year: "2022",
      title: "Đối Tác Chiến Lược",
      desc: "Hợp tác với tất cả chuỗi rạp lớn: CGV, Lotte, Galaxy, BHD Star"
    },
    {
      year: "2024",
      title: "Nền Tảng Hàng Đầu",
      desc: "Trở thành nền tảng đặt vé số 1 Việt Nam với 2.5M+ người dùng"
    }
  ];

  const partners = [
    {
      name: "CGV Cinemas",
      logo: "🎬",
      locations: "120+ rạp",
      description: "Chuỗi rạp chiếu phim hàng đầu với công nghệ hiện đại"
    },
    {
      name: "Lotte Cinema", 
      logo: "🎭",
      locations: "80+ rạp",
      description: "Thương hiệu rạp chiếu phim cao cấp từ Hàn Quốc"
    },
    {
      name: "Galaxy Cinema",
      logo: "⭐",
      locations: "60+ rạp", 
      description: "Rạp chiếu phim với không gian sang trọng và dịch vụ tốt"
    },
    {
      name: "BHD Star Cineplex",
      logo: "🌟",
      locations: "45+ rạp",
      description: "Chuỗi rạp với hệ thống âm thanh và hình ảnh chất lượng cao"
    },
    {
      name: "Cinestar",
      logo: "🎪", 
      locations: "35+ rạp",
      description: "Rạp chiếu phim với giá cả hợp lý và chất lượng tốt"
    },
    {
      name: "Megastar",
      logo: "🎯",
      locations: "30+ rạp",
      description: "Chuỗi rạp hiện đại tại các trung tâm thương mại lớn"
    }
  ];

  const values = [
    {
      icon: Target,
      title: "Sứ Mệnh",
      desc: "Kết nối mọi người với thế giới điện ảnh thông qua nền tảng công nghệ tiện lợi và hiện đại nhất."
    },
    {
      icon: Eye,
      title: "Tầm Nhìn", 
      desc: "Trở thành nền tảng đặt vé xem phim hàng đầu Đông Nam Á, mang đến trải nghiệm tốt nhất cho khách hàng."
    },
    {
      icon: Heart,
      title: "Giá Trị Cốt Lõi",
      desc: "Đặt khách hàng làm trung tâm, không ngừng đổi mới và cam kết chất lượng dịch vụ cao nhất."
    }
  ];

  const achievements = [
    {
      icon: Award,
      title: "Top 1 Ứng Dụng Giải Trí",
      desc: "App Store & Google Play 2023",
      year: "2023"
    },
    {
      icon: Star,
      title: "Thương Hiệu Tin Cậy",
      desc: "Vietnam Digital Awards",
      year: "2023"
    },
    {
      icon: TrendingUp,
      title: "Doanh Nghiệp Tăng Trưởng Nhanh",
      desc: "Fast 500 Vietnam",
      year: "2022"
    },
    {
      icon: Shield,
      title: "Chứng Nhận An Toàn",
      desc: "ISO 27001:2013",
      year: "2022"
    }
  ];

  const teamStats = [
    { icon: Users, number: "200+", label: "Nhân Viên" },
    { icon: Lightbulb, number: "50+", label: "Kỹ Sư IT" },
    { icon: Clock, number: "24/7", label: "Hỗ Trợ" },
    { icon: Heart, number: "99%", label: "Hài Lòng" }
  ];

  return (
    <div style={{ paddingTop: 72 }} className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section 
        id="hero-section" 
        ref={setRef('hero-section')}
        className={`relative bg-gradient-to-br from-gray-900 to-blue-900 text-white py-20 transition-all duration-1000 ${
          isVisible('hero-section') 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <h1 className={`text-4xl md:text-6xl font-bold mb-6 transition-all duration-1000 delay-300 ${
              isVisible('hero-section') 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}>
              Về Chúng Tôi
            </h1>
            <p className={`text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-500 ${
              isVisible('hero-section') 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}>
              Tiên phong trong việc số hóa trải nghiệm xem phim, kết nối hàng triệu khán giả 
              với thế giới điện ảnh qua nền tảng công nghệ hiện đại.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section 
        id="stats-section" 
        ref={setRef('stats-section')}
        className="py-20 bg-white"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className={`text-center group hover:scale-105 transition-all duration-500 ${
                  isVisible('stats-section')
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-20'
                }`}
                style={{ 
                  transitionDelay: `${index * 200}ms` 
                }}
              >
                <div className="bg-blue-50 hover:bg-blue-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-300">
                  <stat.icon className="w-10 h-10 text-blue-600" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {stat.number}{stat.suffix}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Vision Values */}
      <section 
        id="values-section" 
        ref={setRef('values-section')}
        className="py-20 bg-gray-50"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className={`text-center mb-16 transition-all duration-1000 ${
            isVisible('values-section') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Sứ Mệnh & Tầm Nhìn
            </h2>
            <p className="text-lg text-gray-600">
              Những giá trị định hướng hoạt động của chúng tôi
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div 
                key={index} 
                className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 text-center ${
                  isVisible('values-section')
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-20 scale-95'
                }`}
                style={{ 
                  transitionDelay: `${index * 200}ms` 
                }}
              >
                <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section 
        id="timeline-section" 
        ref={setRef('timeline-section')}
        className="py-20 bg-white"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className={`text-center mb-16 transition-all duration-1000 ${
            isVisible('timeline-section') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Hành Trình Phát Triển
            </h2>
            <p className="text-lg text-gray-600">
              Những mốc quan trọng trong quá trình xây dựng và phát triển
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className={`absolute left-1/2 transform -translate-x-1/2 w-1 bg-blue-200 transition-all duration-1500 ${
              isVisible('timeline-section') ? 'h-full' : 'h-0'
            }`}></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div 
                  key={index} 
                  className={`flex items-center transition-all duration-700 ${
                    index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                  } ${
                    isVisible('timeline-section')
                      ? 'opacity-100 translate-x-0'
                      : `opacity-0 ${index % 2 === 0 ? '-translate-x-20' : 'translate-x-20'}`
                  }`}
                  style={{ 
                    transitionDelay: `${index * 300}ms` 
                  }}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <div className="text-2xl font-bold text-blue-600 mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{milestone.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{milestone.desc}</p>
                    </div>
                  </div>
                  
                  {/* Timeline Dot */}
                  <div className={`relative z-10 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg transition-all duration-500 ${
                    isVisible('timeline-section') ? 'scale-100' : 'scale-0'
                  }`} style={{ transitionDelay: `${index * 300 + 200}ms` }}></div>
                  
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section 
        id="partners-section" 
        ref={setRef('partners-section')}
        className="py-20 bg-gray-50"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className={`text-center mb-16 transition-all duration-1000 ${
            isVisible('partners-section') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Đối Tác Chiến Lược
            </h2>
            <p className="text-lg text-gray-600">
              Hợp tác với các chuỗi rạp chiếu phim hàng đầu Việt Nam
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {partners.map((partner, index) => (
              <div 
                key={index} 
                className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-500 ${
                  isVisible('partners-section')
                    ? 'opacity-100 translate-y-0 rotate-0'
                    : 'opacity-0 translate-y-20 rotate-3'
                }`}
                style={{ 
                  transitionDelay: `${index * 150}ms` 
                }}
              >
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-4">{partner.logo}</div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{partner.name}</h3>
                    <p className="text-sm text-blue-600 font-medium">{partner.locations}</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{partner.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section 
        id="achievements-section" 
        ref={setRef('achievements-section')}
        className="py-20 bg-white"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className={`text-center mb-16 transition-all duration-1000 ${
            isVisible('achievements-section') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Thành Tựu & Giải Thưởng
            </h2>
            <p className="text-lg text-gray-600">
              Những dấu ấn quan trọng được ghi nhận bởi cộng đồng và ngành
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div 
                key={index} 
                className={`text-center group hover:scale-105 transition-all duration-500 ${
                  isVisible('achievements-section')
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-20'
                }`}
                style={{ 
                  transitionDelay: `${index * 200}ms` 
                }}
              >
                <div className="bg-yellow-50 hover:bg-yellow-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-300">
                  <achievement.icon className="w-10 h-10 text-yellow-600" />
                </div>
                <div className="bg-yellow-100 text-yellow-800 text-sm font-bold px-3 py-1 rounded-full mb-3 inline-block">
                  {achievement.year}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{achievement.title}</h3>
                <p className="text-gray-600 text-sm">{achievement.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Stats */}
      <section 
        id="team-section" 
        ref={setRef('team-section')}
        className="py-20 bg-gray-900 text-white"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className={`text-center mb-16 transition-all duration-1000 ${
            isVisible('team-section') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Đội Ngũ Của Chúng Tôi
            </h2>
            <p className="text-lg text-gray-300">
              Những con người tài năng đứng sau thành công của nền tảng
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamStats.map((stat, index) => (
              <div 
                key={index} 
                className={`text-center transition-all duration-500 ${
                  isVisible('team-section')
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-20 scale-90'
                }`}
                style={{ 
                  transitionDelay: `${index * 200}ms` 
                }}
              >
                <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 hover:bg-blue-500 transition-colors duration-300">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold mb-2">{stat.number}</div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        id="cta-section" 
        ref={setRef('cta-section')}
        className="py-20 bg-blue-600 text-white"
      >
        <div className={`max-w-4xl mx-auto text-center px-6 transition-all duration-1000 ${
          isVisible('cta-section') 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-10'
        }`}>
          <h2 className={`text-3xl md:text-4xl font-bold mb-6 transition-all duration-1000 delay-200 ${
            isVisible('cta-section') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}>
            Hợp Tác Cùng Chúng Tôi
          </h2>
          <p className={`text-lg mb-8 text-blue-100 transition-all duration-1000 delay-400 ${
            isVisible('cta-section') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}>
            Trở thành đối tác và cùng nhau phát triển hệ sinh thái giải trí số tại Việt Nam
          </p>
          <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-600 ${
            isVisible('cta-section') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}>
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300">
              Liên Hệ Hợp Tác
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-300">
              Tải Hồ Sơ Năng Lực
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}