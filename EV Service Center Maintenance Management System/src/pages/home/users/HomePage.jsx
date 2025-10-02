import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Target, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Car,
  Wrench,
  Shield,
  Users,
  Phone,
  Star,
  Award,
  Battery,
  MapPin,
  Globe,
  Briefcase,
  MessageCircle,
  Mail,
  CheckCircle,
  Volume2,
  VolumeX,
  Eye,

} from "lucide-react";

const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // trạng thái mute/unmute
  const [selected, setSelected] = useState(null);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  const user = {
    name: "Nguyễn Văn A",
    avatar: "/user-avatar.png",
  };

  // Hàm scroll đến section
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };


  const services = [
    {
      title: "Bảo dưỡng định kỳ",
      icon: <Wrench className="w-12 h-12" />,
      img: "/images/bao-duong.gif",
      desc: "Kiểm tra định kỳ, thay dầu, lọc gió và các linh kiện quan trọng giúp xe hoạt động ổn định lâu dài.",
      direction: "right",
    },
    {
      title: "Kiểm tra pin",
      icon: <Battery className="w-12 h-12" />,
      img: "/images/pin-animation.gif",
      desc: "Đo dung lượng, kiểm tra hiệu suất sạc/xả và đảm bảo pin luôn an toàn khi vận hành.",
      direction: "left",
    },
    {
      title: "Sửa chữa động cơ",
      icon: <Car className="w-12 h-12" />,
      img: "/images/sua-chua.gif",
      desc: "Sửa chữa, bảo trì và tối ưu động cơ điện giúp xe vận hành mạnh mẽ và tiết kiệm năng lượng.",
      direction: "left",
    },
  ];

  // Toggle mute/unmute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* ====== THANH MENU ====== */}
      <header className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer">
            <div className="bg-gradient-to-r from-emerald-500 to-blue-500 p-2.5 rounded-xl shadow-md hover:scale-105 transition-transform">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-800 leading-tight">
                EV Care Pro
              </h1>
              <p className="text-xs text-gray-500 -mt-1">Bảo dưỡng xe điện</p>
            </div>
          </div>

          {/* Menu */}
          <nav>
            <ul className="flex space-x-8 text-gray-700 font-medium">
              <li
                onClick={() => scrollToSection("gioi-thieu")}
                className="hover:text-blue-600 cursor-pointer"
              >
                Giới thiệu
              </li>
              <li
                onClick={() => scrollToSection("dich-vu")}
                className="hover:text-blue-600 cursor-pointer"
              >
                Dịch vụ
              </li>
              <li
                onClick={() => scrollToSection("bang-gia")}
                className="hover:text-blue-600 cursor-pointer"
              >
                Bảng giá
              </li>
              <li
                onClick={() => scrollToSection("dat-lich")}
                className="hover:text-blue-600 cursor-pointer"
              >
                Đặt lịch
              </li>
              <li
                onClick={() => scrollToSection("lien-he")}
                className="hover:text-blue-600 cursor-pointer"
              >
                Liên hệ
              </li>
            </ul>
          </nav>

          {/* Góc phải */}
          <div className="flex items-center space-x-3">
            {isLoggedIn ? (
              <>
                <img
                  src={user.avatar}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full border border-gray-300"
                />
                <span className="font-semibold text-gray-800">{user.name}</span>
                <button
                  onClick={() => setIsLoggedIn(false)}
                  className="text-red-500 hover:underline text-sm ml-2"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Đăng nhập
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ====== NỘI DUNG ====== */}
      <main className="pt-24">
        {/* 1. Hero với video nền toàn màn hình, chạy liên tục */}
        <section className="relative h-screen w-full">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/video.mp4" type="video/mp4" />
            Trình duyệt của bạn không hỗ trợ video.
          </video>
          {/* Nút bật/tắt tiếng */}
          <button
            onClick={toggleMute}
            className="absolute bottom-6 right-6 bg-black/50 p-3 rounded-full text-white hover:bg-black/70 transition"
          >
            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </button>
        </section>


        {/* 2. Giới thiệu */}
        <section id="gioi-thieu" className="py-20 px-6 max-w-6xl mx-auto space-y-32">
          {/* Phần 1: Giới thiệu */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Hình ảnh */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <img
                src="https://images.unsplash.com/photo-1621570077346-82d49f683e4f"
                alt="EV Care Pro"
                className="rounded-2xl shadow-lg max-h-[400px] object-cover"
              />
            </motion.div>

            {/* Nội dung */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center md:text-left"
            >
              <h2 className="text-4xl font-bold mb-6 text-gray-800">
                Về Chúng Tôi
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                <strong>EV Care Pro</strong> là đơn vị tiên phong tại Việt Nam trong
                lĩnh vực bảo dưỡng và chăm sóc xe điện. Với hệ thống trung tâm hiện
                đại trải dài khắp cả nước, chúng tôi mang đến dịch vụ chuyên nghiệp,
                uy tín và tận tâm.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Đội ngũ kỹ thuật viên được đào tạo bài bản, kết hợp cùng công nghệ
                tiên tiến giúp xe điện của bạn luôn hoạt động bền bỉ, an toàn và hiệu
                quả.
              </p>
            </motion.div>
          </div>

          {/* Phần 2: Sứ mệnh & Tầm nhìn */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Nội dung */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Target className="w-8 h-8 text-blue-600" />
                  <h3 className="text-2xl font-semibold text-gray-800">Sứ mệnh</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Mang đến dịch vụ bảo dưỡng xe điện toàn diện, đảm bảo an toàn, bền
                  bỉ và thân thiện với môi trường.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Eye className="w-8 h-8 text-green-600" />
                  <h3 className="text-2xl font-semibold text-gray-800">Tầm nhìn</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Trở thành thương hiệu số 1 tại Việt Nam trong lĩnh vực chăm sóc xe
                  điện, hướng tới chuẩn quốc tế.
                </p>
              </div>
            </motion.div>

            {/* Hình ảnh */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <img
                src="https://images.unsplash.com/photo-1619018388851-9e1e8b44a78d"
                alt="Sứ mệnh & Tầm nhìn"
                className="rounded-2xl shadow-lg max-h-[400px] object-cover"
              />
            </motion.div>
          </div>
        </section>

        {/* 3. Dịch vụ */}
        <section id="dich-vu" className="bg-gray-50 w-full min-h-screen py-20 px-6 relative">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Dịch vụ của chúng tôi
          </h2>

          {/* Grid card */}
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
            {/* Cột trái */}
            <div
              className="relative rounded-xl overflow-hidden shadow-lg cursor-pointer"
              onClick={() => setSelected(services[0])}
            >
              <img
                src={services[0].img}
                alt={services[0].title}
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-black/60 text-white px-4 py-2 rounded-lg">
                {services[0].title}
              </div>
            </div>

            {/* Cột phải */}
            <div className="grid grid-rows-2 gap-6">
              {services.slice(1).map((s, i) => (
                <div
                  key={i}
                  className="relative rounded-xl overflow-hidden shadow-lg cursor-pointer"
                  onClick={() => setSelected(s)}
                >
                  <img
                    src={s.img}
                    alt={s.title}
                    className="w-full h-[240px] object-cover"
                  />
                  <div className="absolute bottom-4 left-4 bg-black/60 text-white px-4 py-2 rounded-lg">
                    {s.title}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Overlay info khi click */}
          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{
                  x: selected.direction === "right" ? "-100%" : "100%",
                }}
                animate={{ x: 0 }}
                exit={{
                  x: selected.direction === "right" ? "-100%" : "100%",
                }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex items-center justify-center z-50"
                onClick={() => setSelected(null)} // click ngoài overlay để đóng
              >
                {/* Nội dung chính của overlay */}
                <motion.div
                  onClick={(e) => e.stopPropagation()} // ngăn click bên trong bị đóng
                  className="bg-white flex flex-col md:flex-row items-center justify-center text-center p-10 shadow-2xl rounded-xl relative max-w-4xl"
                >
                  {/* Nút Back */}
                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    className="absolute top-6 left-6 flex items-center gap-2 text-gray-700 hover:text-black transition"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Quay lại
                  </button>

                  {/* Nội dung dịch vụ */}
                  <img
                    src={selected.img}
                    alt={selected.title}
                    className="w-72 h-72 object-contain mb-6 md:mb-0 md:mr-8"
                  />
                  <div>
                    <h3 className="text-2xl font-bold mb-4">{selected.title}</h3>
                    <p className="text-gray-700 max-w-xl">{selected.desc}</p>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* 4. Lợi ích */}
        <section className="py-20 px-6 bg-white">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Tại sao chọn EV Care Pro?
          </h2>
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto text-center">
            {[
              "Công nghệ hiện đại",
              "Kỹ thuật viên chuyên nghiệp",
              "Giá cả minh bạch",
              "Bảo hành uy tín",
            ].map((b, i) => (
              <div
                key={i}
                className="p-6 bg-gray-100 rounded-lg shadow hover:shadow-lg"
              >
                <h3 className="text-xl font-semibold mb-2">{b}</h3>
                <p className="text-gray-600">Cam kết mang lại giá trị thật.</p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Quy trình */}
        <section className="bg-gray-50 py-20 px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Quy trình dịch vụ
          </h2>
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto text-center">
            {["Đặt lịch", "Tiếp nhận", "Kiểm tra", "Hoàn tất"].map((step, i) => (
              <div key={i} className="p-6 bg-white rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-2">{step}</h3>
                <p className="text-gray-600">
                  Nhanh chóng, minh bạch và hiệu quả.
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Bảng giá */}
        <section id="bang-gia" className="py-20 px-6 bg-white">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Bảng giá dịch vụ
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { name: "Cơ bản", price: "500.000₫" },
              { name: "Nâng cao", price: "800.000₫" },
              { name: "Toàn diện", price: "1.200.000₫" },
            ].map((p, i) => (
              <div
                key={i}
                className="p-8 bg-gray-50 rounded-lg shadow hover:shadow-lg text-center"
              >
                <h3 className="text-xl font-semibold mb-4">{p.name}</h3>
                <p className="text-2xl font-bold text-blue-600 mb-6">
                  {p.price}
                </p>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                  Chọn gói
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Ưu đãi */}
        <section className="bg-gradient-to-r from-green-400 to-blue-500 text-white py-20 text-center">
          <h2 className="text-3xl font-bold mb-6">Ưu đãi tháng này</h2>
          <p className="mb-6">Giảm 20% cho khách hàng đặt lịch online lần đầu.</p>
          <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
            Nhận ưu đãi
          </button>
        </section>

        {/* 8. Gallery */}
        <section className="py-20 px-6 bg-white">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Hình ảnh trung tâm
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {["/garage1.jpg", "/garage2.jpg", "/garage3.jpg"].map((img, i) => (
              <img
                key={i}
                src={img}
                alt="Garage"
                className="rounded-lg shadow hover:scale-105 transition-transform"
              />
            ))}
          </div>
        </section>

        {/* 9. Đội ngũ */}
        <section className="bg-gray-50 py-20 px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Đội ngũ kỹ thuật viên
          </h2>
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto text-center">
            {["Anh Tuấn", "Minh Khoa", "Hữu Phúc", "Văn Nam"].map((name, i) => (
              <div
                key={i}
                className="p-6 bg-white rounded-lg shadow hover:shadow-lg"
              >
                <img
                  src="/user-avatar.png"
                  alt={name}
                  className="w-24 h-24 rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold">{name}</h3>
                <p className="text-gray-600">Kỹ thuật viên</p>
              </div>
            ))}
          </div>
        </section>

        {/* 10. Testimonials */}
        <section className="py-20 px-6 bg-white">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Khách hàng nói gì?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              "Xe tôi luôn trong tình trạng tốt nhờ EV Care Pro!",
              "Dịch vụ tận tâm và nhanh chóng.",
              "Kỹ thuật viên rất chuyên nghiệp và thân thiện.",
            ].map((quote, i) => (
              <div
                key={i}
                className="p-6 bg-gray-50 rounded-lg shadow hover:shadow-lg"
              >
                <p className="italic text-gray-700">“{quote}”</p>
              </div>
            ))}
          </div>
        </section>

        {/* 11. Blog */}
        <section className="bg-gray-50 py-20 px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Tin tức & Blog
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              "Mẹo tiết kiệm pin xe điện",
              "5 bước bảo dưỡng xe định kỳ",
              "Cập nhật công nghệ mới",
            ].map((title, i) => (
              <div
                key={i}
                className="p-6 bg-white rounded-lg shadow hover:shadow-lg"
              >
                <h3 className="text-xl font-semibold mb-3">{title}</h3>
                <p className="text-gray-600">
                  Đọc thêm các bài viết hữu ích về xe điện.
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 12. Đối tác */}
        <section className="py-20 px-6 bg-white text-center">
          <h2 className="text-3xl font-bold mb-12 text-gray-800">
            Đối tác & Chứng nhận
          </h2>
          <div className="flex flex-wrap justify-center gap-12">
            {["Tesla", "VinFast", "BYD", "Toyota EV"].map((p, i) => (
              <div key={i} className="text-gray-600 text-lg font-medium">
                {p}
              </div>
            ))}
          </div>
        </section>

        {/* 15. FAQ */}
        <section className="bg-gray-50 py-20 px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Câu hỏi thường gặp
          </h2>
          <div className="max-w-4xl mx-auto space-y-6">
            {[
              {
                q: "Bao lâu nên bảo dưỡng xe?",
                a: "6 tháng hoặc sau 5.000 km.",
              },
              {
                q: "Có cứu hộ tận nơi không?",
                a: "Có, chúng tôi hỗ trợ 24/7.",
              },
              {
                q: "Có bảo hành dịch vụ không?",
                a: "Bảo hành từ 3–12 tháng.",
              },
            ].map((item, i) => (
              <div key={i} className="p-6 bg-white rounded-lg shadow">
                <h3 className="font-semibold text-lg mb-2">{item.q}</h3>
                <p className="text-gray-600">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 16. Contact */}
        <section
          id="lien-he"
          className="py-20 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center"
        >
          <h2 className="text-3xl font-bold mb-6">Liên hệ ngay</h2>
          <p className="mb-6">Đặt lịch bảo dưỡng hoặc cần hỗ trợ?</p>
          <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
            Gọi: 1900 1234
          </button>
        </section>

        {/* 17. Thống kê */}
        <section className="py-20 px-6 bg-white text-center">
          <h2 className="text-3xl font-bold mb-12 text-gray-800">
            Thống kê nổi bật
          </h2>
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { label: "Khách hàng", value: "50.000+" },
              { label: "Trung tâm", value: "120+" },
              { label: "Kỹ thuật viên", value: "500+" },
              { label: "Năm kinh nghiệm", value: "10+" },
            ].map((item, i) => (
              <div
                key={i}
                className="p-6 bg-gray-100 rounded-lg shadow hover:shadow-lg"
              >
                <h3 className="text-3xl font-bold text-blue-600">
                  {item.value}
                </h3>
                <p className="text-gray-600 mt-2">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 18. Chi nhánh & Bản đồ */}
        <section className="bg-gray-50 py-20 px-6 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            Hệ thống chi nhánh
          </h2>
          <p className="text-gray-600 mb-8">
            Trải dài khắp cả nước với hơn 120 chi nhánh.
          </p>
          <iframe
            className="w-full h-96 max-w-6xl mx-auto rounded-lg shadow"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919..."
            title="Google Maps"
          ></iframe>
        </section>

        {/* 19. Chính sách bảo mật */}
        <section className="py-20 px-6 bg-white max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
            Chính sách bảo mật
          </h2>
          <p className="text-gray-600 leading-relaxed text-center">
            Chúng tôi cam kết bảo vệ thông tin cá nhân và dữ liệu khách hàng theo
            chuẩn quốc tế ISO 27001.
          </p>
        </section>

        {/* 20. Tuyển dụng
        <section className="bg-gray-50 py-20 px-6 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Tuyển dụng</h2>
          <p className="text-gray-600 mb-8">
            Tham gia đội ngũ EV Care Pro – cơ hội nghề nghiệp rộng mở.
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Ứng tuyển ngay
          </button>
        </section> */}

        {/* 21. Newsletter */}
        <section className="py-20 px-6 bg-gradient-to-r from-indigo-500 to-blue-600 text-white text-center">
          <h2 className="text-3xl font-bold mb-6">Đăng ký nhận tin</h2>
          <p className="mb-6">Nhận ngay ưu đãi và tin tức mới nhất từ EV Care.</p>
          <div className="flex justify-center">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="px-4 py-2 rounded-l-lg text-gray-800 w-64"
            />
            <button className="bg-green-500 px-6 py-2 rounded-r-lg font-semibold">
              Đăng ký
            </button>
          </div>
        </section>

        {/* 22. Loyalty */}
        <section className="py-20 px-6 bg-white text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            Khách hàng thân thiết
          </h2>
          <p className="text-gray-600 mb-8">
            Tích điểm mỗi lần sử dụng dịch vụ để nhận nhiều ưu đãi hấp dẫn.
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg">
            Tham gia ngay
          </button>
        </section>

        {/* 23. Chatbot hỗ trợ */}
        <section className="bg-gray-50 py-20 px-6 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            Hỗ trợ trực tuyến
          </h2>
          <p className="text-gray-600 mb-6">
            Chat trực tiếp với nhân viên để được tư vấn ngay lập tức.
          </p>
          <button className="bg-green-600 text-white px-6 py-3 rounded-lg">
            Bắt đầu trò chuyện
          </button>
        </section>

        {/* 24. CTA cuối (Đặt lịch) */}
        <section
          id="dat-lich"
          className="py-20 px-6 bg-gradient-to-r from-green-400 to-blue-600 text-white text-center"
        >
          <h2 className="text-4xl font-bold mb-6">Bắt đầu ngay hôm nay!</h2>
          <p className="mb-8">
            Đặt lịch bảo dưỡng để xe của bạn luôn hoạt động tốt nhất.
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">
            Đặt lịch ngay
          </button>
        </section>

        {/* 25. Footer */}
        <footer className="bg-gray-800 text-white py-10 text-center">
          <p>© 2025 EV Care Pro. Mọi quyền được bảo lưu.</p>
          <p className="text-sm mt-2">Designed by RTY</p>
        </footer>
      </main>
    </div>
  );
};

export default HomePage;
