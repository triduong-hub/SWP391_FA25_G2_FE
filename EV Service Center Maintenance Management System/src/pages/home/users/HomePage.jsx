import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Target, ArrowLeft, } from "lucide-react";
import API from "../../../../api";
import { motion, AnimatePresence } from "framer-motion";
import ChatBot from "../../chatbot/ChatBot.jsx";
import { statusMapServerToUI } from "../../../utils/statusHelpers";
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
  Cpu,
  Coins,
  ShieldCheck, CalendarCheck2, ClipboardCheck, CheckCircle2, Zap

} from "lucide-react";

const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // trạng thái mute/unmute
  const [user, setUser] = useState(null);
  const [selected, setSelected] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [bookings, setBookings] = useState([]);
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const customerId = storedUser.userID || null;
  const videoRef = useRef(null);
  const navigate = useNavigate();

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   // if (!token) return;
  //   if (!token) {
  //   console.log("❌ No token found");
  //   setIsLoggedIn(false);
  //   return;
  // }

  //   API.get("http://localhost:8080/api/auth/getUserInfo")
  //     .then((res) => {
  //       const userData = res.data?.data || res.data; // ← điều chỉnh theo backend
  //       setUser(userData);
  //       setIsLoggedIn(true);
  //     })
  //     .catch((err) => {
  //       console.error("Lỗi lấy thông tin người dùng:", err);
  //       localStorage.removeItem("token");
  //       setIsLoggedIn(false);
  //     });
  // }, []);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const role = storedUser.role?.toUpperCase().trim();

    // Nếu có user, nhưng KHÔNG PHẢI CUSTOMER, thì điều phối ngay lập tức
    if (role && role !== "CUSTOMER") {
        console.warn(`⚠️ User không phải Customer! Điều phối về Dashboard: ${role}`);
        
        if (role === "ADMIN") navigate("/admin/home");
        else if (role === "STAFF") navigate("/staff/dashboard");
        else if (role === "TECHNICIAN") navigate("/technician/dashboard"); 
        // Không cần else navigate("/login"), vì logic check token ở dưới sẽ lo.
    }
  }, [navigate]);

  useEffect(() => {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  
  console.log("🔍 HomePage useEffect triggered");
  console.log("🔑 Token:", token ? "exists" : "missing");
  console.log("👤 Stored user:", storedUser);
  
  if (token && storedUser) {
    try {
      const userData = JSON.parse(storedUser);
      
      // Decode name nếu cần
      if (userData.name) {
        userData.name = decodeURIComponent(userData.name);
      }
      if (userData.fullName) {
        userData.fullName = decodeURIComponent(userData.fullName);
      }
      
      setUser(userData);
      setIsLoggedIn(true);
      
      console.log("✅ User logged in:", userData);
    } catch (error) {
      console.error("❌ Error parsing user:", error);
      setIsLoggedIn(false);
    }
  } else if (token && !storedUser) {
    // ✅ Nếu có token nhưng không có user → gọi API
    console.log("📡 Calling API /auth/getUserInfo...");
    
    API.get("http://localhost:8080/api/auth/getUserInfo")
      .then((res) => {
        const userData = res.data?.data || res.data;
        console.log("✅ User from API:", userData);
        
        setUser(userData);
        setIsLoggedIn(true);
        
        // Lưu lại vào localStorage
        localStorage.setItem('user', JSON.stringify(userData));
      })
      .catch((err) => {
        console.error("❌ API Error:", err);
        localStorage.removeItem("token");
        setIsLoggedIn(false);
      });
  } else {
    setIsLoggedIn(false);
  }
}, []);

  //  Lấy danh sách đơn đặt lịch của khách
  useEffect(() => {
    if (!customerId) return;

    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("❌ Chưa có Token, không thể gọi API!");
            return; 
        }
        console.log("📦 Lấy đơn đặt lịch theo CustomerId:", customerId);        
        const response = await API.get(`/bookings/customer/${customerId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const bookingList = response.data?.data || response.data || [];
        console.log("✅ Booking data:", bookingList);
        const bookingData = response.data?.data || response.data || {};
        setBookings(bookingData.bookings || []);

      } catch (error) {
        console.error("❌ Lỗi khi lấy đơn đặt lịch:", error);
      }
    };

    fetchBookings();
  }, [customerId]);

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
      img: "/baoduong.gif",
      desc: "Kiểm tra định kỳ, thay dầu, lọc gió và các linh kiện quan trọng giúp xe hoạt động ổn định lâu dài.",
      direction: "right",
    },
    {
      title: "Kiểm tra pin",
      icon: <Battery className="w-12 h-12" />,
      img: "/battery.gif",
      desc: "Đo dung lượng, kiểm tra hiệu suất sạc/xả và đảm bảo pin luôn an toàn khi vận hành.",
      direction: "left",
    },
    {
      title: "Sửa chữa động cơ",
      icon: <Car className="w-12 h-12" />,
      img: "/fixing.gif",
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

  const handleBookingClick = () => {
    navigate("/booking"); // 👉 Chuyển sang trang booking
  };


  return (

    <div className="min-h-screen bg-gray-50">

      {/* ====== THANH MENU ====== */}
      <header className="w-full bg-white/80 backdrop-blur-md shadow-md fixed top-0 left-0 z-50">
        <div className="max-w-7xl mx-auto px-3 py-3 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer">
            <div className="bg-gradient-to-r from-emerald-500 to-blue-500 p-2.5 rounded-xl shadow-md hover:scale-105 transition-transform">
              <Car className="w-9 h-9 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-2xl text-gray-800 leading-tight">
                EV Care Pro
              </h1>
              <p className="text-sm text-gray-500 -mt-1">
                Bảo dưỡng xe điện
              </p>

            </div>
          </div>

          {/* Menu */}
          <nav>
            <ul className="flex space-x-8 text-gray-700 font-semibold text-2xl">
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
                onClick={() => scrollToSection("lien-he")}
                className="hover:text-blue-600 cursor-pointer"
              >
                Liên hệ
              </li>
              {/* <li
                onClick={() => scrollToSection("dat-lich")}
                className="hover:text-blue-600 cursor-pointer"
              >
                Đặt lịch
              </li> */}
            </ul>
          </nav>

          {/* Góc phải */}
          {/* Góc phải */}
          <div className="flex items-center space-x-3 relative">
            {isLoggedIn && user ? (
              <>
                <span className="font-semibold text-gray-800 order-1">
                  {user.name || user.fullName || "Người dùng"}
                </span>
                <img
                  src={user.avatar || "avatar.jpg"}
                  alt="User Avatar"
                  className="w-9 h-9 rounded-full border border-gray-300 cursor-pointer order-2 "
                  onClick={() => setShowMenu((prev) => !prev)}
                />


                {showMenu && (
                  <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-md shadow-md w-32 py-2 z-50">
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setShowMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Hồ sơ
                    </button>
                    <button
                      onClick={() => {
                        setIsLoggedIn(false);
                        setUser(null);
                        localStorage.removeItem("token");
                        
                        // Cập nhật Logout để xóa sạch ID định danh
                        localStorage.removeItem("user");
                        localStorage.removeItem("customerId");
                        localStorage.removeItem("employeeId");
                        localStorage.removeItem("adminId");

                        navigate("/login");
                        setShowMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Đăng nhập
              </button>
            )}
          </div>

        </div>
      </header>

      {/* ====== NỘI DUNG ====== */}
      <main className="pt-24">
        {/* HERO Glassmorphism với video nền + CTA */}
        <section className="relative max-w-7xl mx-auto h-[500px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
          {/* Video nền */}
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

          {/* Overlay gradient để video không bị chói */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-black/30 to-transparent"></div>

          {/* Glassmorphism box */}
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className=" border-white/30 rounded-3xl p-6 md:p-12 text-center max-w-3xl mx-6">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">
                Bắt đầu ngay hôm nay!
              </h1>
              <p className="text-base md:text-lg text-gray-200 mb-8 leading-relaxed">
                Đặt lịch bảo dưỡng để xe điện của bạn luôn hoạt động{" "}
                <span className="font-semibold text-white">bền bỉ</span>,{" "}
                <span className="font-semibold text-white">an toàn</span> và{" "}
                <span className="font-semibold text-white">hiệu quả</span>.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleBookingClick}
                  className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:opacity-90 text-white px-10 py-4 rounded-full font-semibold shadow-lg transition-all"
                >
                  Đặt lịch ngay
                </button>
                <button
                  onClick={() => scrollToSection('gioi-thieu')}
                  className="bg-white/90 text-blue-600 px-10 py-4 rounded-full font-semibold shadow-md hover:bg-white transition-all"
                >
                  Tìm hiểu thêm
                </button>
              </div>
            </div>
          </div>
        </section>

        {/*  💼 Danh sách đơn đặt lịch của khách */}
        <section className="py-20 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              Đơn đặt lịch của bạn
            </h2>

            {bookings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 bg-white shadow-lg rounded-xl">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Mã đơn</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Ngày đặt</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Lịch hẹn</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Dịch vụ</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Xe</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Trung tâm</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Trạng thái</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {bookings.map((order) => {
                      const statusLower = order.status?.toLowerCase();
                      let statusColor =
                        "bg-gray-100 text-gray-800";
                      if (statusLower === "awaiting_customer_approval") statusColor = "bg-yellow-100 text-yellow-800";
                      if (statusLower === "waiting for payment") statusColor = "bg-green-100 text-green-800";
                      if (statusLower === "completed") statusColor = "bg-blue-100 text-blue-800";

                      return (
                        <tr
                          key={order.orderId}
                          className="hover:bg-gray-50 transition"
                        >
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">#{order.orderId}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                            {new Date(order.orderDate).toLocaleDateString("vi-VN")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                            {order.appointmentDate} – {order.appointmentTime?.slice(0, 5)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                            {Array.isArray(order.serviceNames)
                              ? order.serviceNames.join(", ")
                              : "Chưa có"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                            {order.vehicleModel || "Không rõ"} – {order.vehiclePlateNumber || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                            {order.serviceCenterName || "Chưa xác định"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
                              {statusMapServerToUI[statusLower] || order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-wrap gap-2">
                              {statusLower === "awaiting_customer_approval" && (
                                <button
                                  onClick={() => navigate(`/customer/quotation/${order.orderId}`)}
                                  className="bg-yellow-500 text-white px-4 py-1.5 rounded-lg hover:bg-yellow-600 transition text-sm font-medium"
                                >
                                  Xem báo giá
                                </button>
                              )}
                              {statusLower === "waiting for payment" && (
                                <button
                                  onClick={() => navigate(`/payment/${order.orderId}`)}
                                  className="bg-green-600 text-white px-4 py-1.5 rounded-lg hover:bg-green-700 transition text-sm font-medium"
                                >
                                  Thanh toán
                                </button>
                              )}
                              {statusLower === "completed" && (
                                <button
                                  onClick={() => navigate(`/invoice/order/${order.orderId}`)}
                                  className="bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                                >
                                  Xem hóa đơn
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-500 text-lg mt-10">
                Bạn chưa có đơn đặt lịch nào.
              </p>
            )}
          </div>
        </section>





        {/* 2. Giới thiệu */}
        <section id="gioi-thieu" className="py-20 px-6 max-w-6xl mx-auto space-y-32">
          {/* Phần 1: Giới thiệu */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Hình ảnh */}
            <motion.div
              initial={{ opacity: 0, x: -80 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <img
                src="/p1.jpg"
                alt="EV Care Pro"
                className="rounded-3xl shadow-2xl max-h-[420px] w-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </motion.div>

            {/* Nội dung */}
            <motion.div
              initial={{ opacity: 0, x: 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center md:text-left space-y-6"
            >
              <h2 className="text-4xl font-bold text-gray-800">Về Chúng Tôi</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                <strong>EV Care Pro</strong> là đơn vị tiên phong tại Việt Nam trong lĩnh vực bảo dưỡng và chăm sóc xe điện.
                Với hệ thống trung tâm hiện đại trải dài khắp cả nước, chúng tôi mang đến dịch vụ{" "}
                <span className="font-semibold text-gray-800">chuyên nghiệp</span>,{" "}
                <span className="font-semibold text-gray-800">uy tín</span> và{" "}
                <span className="font-semibold text-gray-800">tận tâm</span>.
              </p>
              <p className="text-gray-600 leading-relaxed text-lg">
                Đội ngũ kỹ thuật viên được đào tạo bài bản, kết hợp cùng{" "}
                <span className="font-semibold text-gray-800">công nghệ tiên tiến</span> giúp xe điện của bạn
                luôn hoạt động <span className="font-semibold text-gray-800">bền bỉ</span>,{" "}
                <span className="font-semibold text-gray-800">an toàn</span> và{" "}
                <span className="font-semibold text-gray-800">hiệu quả</span>.
              </p>
            </motion.div>
          </div>

          {/* Phần 2: Sứ mệnh & Tầm nhìn */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Nội dung */}
            <motion.div
              initial={{ opacity: 0, x: -80 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-12"
            >
              {/* Sứ mệnh */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Target className="w-7 h-7 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Sứ mệnh</h3>
                </div>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Mang đến dịch vụ bảo dưỡng xe điện toàn diện, đảm bảo{" "}
                  <span className="font-semibold text-gray-800">an toàn</span>,{" "}
                  <span className="font-semibold text-gray-800">bền bỉ</span> và{" "}
                  <span className="font-semibold text-gray-800">thân thiện với môi trường</span>.
                </p>
              </div>

              {/* Tầm nhìn */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Eye className="w-7 h-7 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Tầm nhìn</h3>
                </div>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Trở thành <span className="font-semibold text-gray-800">thương hiệu số 1</span>
                  tại Việt Nam trong lĩnh vực chăm sóc xe điện, hướng tới{" "}
                  <span className="font-semibold text-gray-800">chuẩn quốc tế</span>.
                </p>
              </div>
            </motion.div>

            {/* Hình ảnh */}
            <motion.div
              initial={{ opacity: 0, x: 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <img
                src="/p2.jpg"
                alt="Sứ mệnh & Tầm nhìn"
                className="rounded-3xl shadow-2xl max-h-[420px] w-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </motion.div>
          </div>
        </section>


        {/* 3. Dịch vụ */}
        <section id="dich-vu" className="bg-gray-50 py-20 px-6 relative">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-14 text-gray-800">
              Dịch vụ của chúng tôi
            </h2>

            {/* Grid card */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Cột trái - ảnh lớn */}
              <div
                className="relative rounded-2xl overflow-hidden shadow-xl group cursor-pointer"
                onClick={() => setSelected(services[0])}
              >
                <img
                  src="/p3.jpg"
                  alt={services[0].title}
                  className="w-full h-[500px] object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                  <h3 className="text-2xl font-semibold text-white">
                    {services[0].title}
                  </h3>
                </div>
              </div>

              {/* Cột phải - 2 ảnh nhỏ */}
              <div className="grid grid-rows-2 gap-6">
                {services.slice(1, 3).map((s, i) => {
                  // gán ảnh cứng theo index
                  const images = ["/p4.jpg", "/p5.jpg"];
                  return (
                    <div
                      key={i}
                      className="relative rounded-2xl overflow-hidden shadow-xl group cursor-pointer"
                      onClick={() => setSelected(s)}
                    >
                      <img
                        src={images[i]} // lấy ảnh cứng theo thứ tự
                        alt={s.title}
                        className="w-full h-[240px] object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <h3 className="text-lg font-semibold text-white">{s.title}</h3>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Overlay info khi click */}
          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
                onClick={() => setSelected(null)}
              >
                <motion.div
                  onClick={(e) => e.stopPropagation()}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white flex flex-col md:flex-row items-center text-center md:text-left p-8 md:p-12 shadow-2xl rounded-2xl relative max-w-4xl"
                >
                  {/* Nút Back */}
                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    className="absolute top-6 left-6 flex items-center gap-2 text-gray-500 hover:text-gray-800 transition"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Quay lại
                  </button>

                  {/* Nội dung dịch vụ */}
                  <img
                    src={selected.img}
                    alt={selected.title}
                    className="w-64 h-64 object-contain mb-6 md:mb-0 md:mr-10 rounded-xl shadow"
                  />
                  <div>
                    <h3 className="text-3xl font-bold mb-4 text-gray-800">{selected.title}</h3>
                    <p className="text-gray-600 leading-relaxed max-w-xl">
                      {selected.desc}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>


        {/* 4. Lợi ích */}
        <section className="bg-gradient-to-b from-gray-50 to-white w-full py-20 px-6">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
            Tại sao chọn <span className="text-blue-600">EV Care Pro</span>?
          </h2>
          <p className="text-center text-gray-500 mb-12">
            Dịch vụ chuyên nghiệp – minh bạch – tận tâm.
          </p>

          <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-8 max-w-6xl mx-auto text-center">
            {[
              { title: "Công nghệ hiện đại", icon: <Cpu className="w-10 h-10 text-blue-600 mx-auto" /> },
              { title: "Kỹ thuật viên chuyên nghiệp", icon: <Wrench className="w-10 h-10 text-blue-600 mx-auto" /> },
              { title: "Giá cả minh bạch", icon: <Coins className="w-10 h-10 text-blue-600 mx-auto" /> },
              { title: "Bảo hành uy tín", icon: <ShieldCheck className="w-10 h-10 text-blue-600 mx-auto" /> },
            ].map((b, i) => (
              <div
                key={i}
                className="p-8 bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="mb-4">{b.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {b.title}
                </h3>
                <p className="text-gray-600">Cam kết mang lại giá trị thật.</p>
              </div>
            ))}
          </div>
        </section>
        {/* 5. Quy trình */}
        <section className="bg-gradient-to-b from-white to-gray-50 py-20 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Quy trình <span className="text-blue-600">dịch vụ</span>
            </h2>
            <p className="text-gray-500 mb-16">
              Chúng tôi đảm bảo trải nghiệm chuyên nghiệp – nhanh chóng – minh bạch.
            </p>

            <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-10">
              {[
                {
                  title: "Đặt lịch",
                  desc: "Đặt lịch trực tuyến hoặc qua hotline, nhanh chóng và tiện lợi.",
                  icon: <CalendarCheck2 className="w-12 h-12 text-blue-600 mx-auto" />,
                },
                {
                  title: "Tiếp nhận",
                  desc: "Nhân viên tiếp nhận và ghi nhận yêu cầu dịch vụ của bạn.",
                  icon: <ClipboardCheck className="w-12 h-12 text-blue-600 mx-auto" />,
                },
                {
                  title: "Kiểm tra",
                  desc: "Kỹ thuật viên kiểm tra, tư vấn và tiến hành bảo dưỡng.",
                  icon: <Wrench className="w-12 h-12 text-blue-600 mx-auto" />,
                },
                {
                  title: "Hoàn tất",
                  desc: "Bàn giao xe, kiểm tra chất lượng và bảo hành minh bạch.",
                  icon: <CheckCircle2 className="w-12 h-12 text-blue-600 mx-auto" />,
                },
              ].map((step, i) => (
                <div
                  key={i}
                  className="relative p-10 bg-white rounded-2xl shadow-md border border-gray-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  <div className="flex flex-col items-center">
                    <div className="mb-4">{step.icon}</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600 text-sm">{step.desc}</p>
                  </div>

                  {/* số thứ tự tròn ở góc trên */}
                  <span className="absolute -top-4 -left-4 bg-blue-600 text-white font-semibold w-10 h-10 flex items-center justify-center rounded-full shadow-md">
                    {i + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. Gallery */}
        <section className="py-20 px-6 bg-gray">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Hình ảnh trung tâm
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {["/coso1.jpg", "/coso2.jpg", "/coso.jpg"].map((img, i) => (
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
        <section className="bg-gray-50 py-24 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Đội ngũ kỹ thuật viên
            </h2>
            <p className="text-gray-500 mb-16 text-lg">
              Những chuyên gia tận tâm và được đào tạo bài bản, luôn sẵn sàng hỗ trợ bạn.
            </p>

            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10">
              {[
                { name: "Anh Tuấn", role: "Kỹ thuật viên trưởng", img: "/vinfast1.jpg" },
                { name: "Minh Khoa", role: "Chuyên viên điện – pin", img: "/vinfast2.jpg" },
                { name: "Hữu Phúc", role: "Chuyên viên bảo dưỡng", img: "/vin3.jpg" },
                { name: "Văn Nam", role: "Kỹ thuật viên cơ khí", img: "/vin4.jpg" },
              ].map((member, i) => (
                <div
                  key={i}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-8 flex flex-col items-center"
                >
                  <div className="relative">
                    <img
                      src={member.img}
                      alt={member.name}
                      className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 rounded-full bg-blue-100 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </div>
                  <h3 className="text-xl font-semibold mt-5 text-gray-900">
                    {member.name}
                  </h3>
                  <p className="text-gray-500 text-sm">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* 10. Testimonials */}
        <section className="py-24 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Khách hàng nói gì?
            </h2>
            <p className="text-gray-500 mb-16 text-lg">
              Cảm nhận từ những khách hàng đã tin tưởng và sử dụng dịch vụ của chúng tôi.
            </p>

            <div className="grid md:grid-cols-3 gap-10">
              {[
                {
                  quote: "Xe tôi luôn trong tình trạng tốt nhờ EV Care Pro!",
                  name: "Anh Dương Đình Trí",
                  role: "Chủ xe VinFast VF8",
                  img: "/customer1.jpg",
                },
                {
                  quote: "Dịch vụ tận tâm và nhanh chóng, rất hài lòng.",
                  name: "Chị Phan Thị Như Ngọc",
                  role: "Khách hàng thân thiết",
                  img: "/customer2.jpg",
                },
                {
                  quote: "Kỹ thuật viên chuyên nghiệp, giải thích rõ ràng từng bước.",
                  name: "Anh Trần Ngọc Thành",
                  role: "Chủ xe EV CityCar",
                  img: "/customer3.jpg",
                },
              ].map((t, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-8 flex flex-col items-center text-center relative"
                >
                  <div className="absolute -top-5 bg-blue-100 text-blue-500 w-10 h-10 rounded-full flex items-center justify-center text-2xl font-serif">
                    “
                  </div>
                  <p className="italic text-gray-700 mt-6 mb-8 leading-relaxed">
                    {t.quote}
                  </p>
                  <div className="flex flex-col items-center">
                    <img
                      src={t.img}
                      alt={t.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-blue-100 shadow-sm mb-3"
                    />
                    <h4 className="font-semibold text-gray-900">{t.name}</h4>
                    <p className="text-sm text-gray-500">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 17. Thống kê */}
        <section className="py-24 px-6 bg-gradient-to-br from-gray-50 to-gray-100 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.06)_0%,_transparent_70%)]"></div>

          <h2 className="text-4xl font-bold mb-16 text-gray-900 relative z-10">
            Thống kê nổi bật
          </h2>

          {/* Logic đếm số */}
          {(() => {
            const stats = [
              { label: "Khách hàng", value: 50000, suffix: "+" },
              { label: "Trung tâm", value: 10, suffix: "+" },
              { label: "Kỹ thuật viên", value: 250, suffix: "+" },
              { label: "Năm kinh nghiệm", value: 10, suffix: "+" },
            ];

            const [counts, setCounts] = useState(stats.map(() => 0));

            useEffect(() => {
              const duration = 2000;
              const interval = 20;
              const steps = duration / interval;

              stats.forEach((stat, index) => {
                let current = 0;
                const increment = stat.value / steps;

                const counter = setInterval(() => {
                  current += increment;
                  if (current >= stat.value) {
                    current = stat.value;
                    clearInterval(counter);
                  }
                  setCounts((prev) => {
                    const updated = [...prev];
                    updated[index] = Math.floor(current);
                    return updated;
                  });
                }, interval);
              });
            }, []);

            return (
              <div className="grid md:grid-cols-4 gap-10 max-w-6xl mx-auto relative z-10">
                {stats.map((item, i) => (
                  <div
                    key={i}
                    className="p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300"
                  >
                    <h3 className="text-5xl font-extrabold text-blue-600 drop-shadow-sm transition-transform duration-300 hover:scale-110">
                      {counts[i].toLocaleString()}
                      {item.suffix}
                    </h3>
                    <p className="text-gray-600 mt-3 text-lg font-medium">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            );
          })()}
        </section>

        {/* 18. Chi nhánh & Bản đồ */}
        <section className="bg-gray-50 py-24 px-6 text-center relative overflow-hidden">
          <div className="max-w-6xl mx-auto relative z-10">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Hệ thống chi nhánh
            </h2>
            <p className="text-gray-600 mb-12 text-lg">
              Trải dài khắp cả nước với hơn <span className="font-semibold text-blue-600">120 chi nhánh</span> sẵn sàng phục vụ bạn.
            </p>

            {/* Danh sách chi nhánh đại diện */}
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {[
                {
                  city: "Hà Nội",
                  center: "EV Care Pro - Thanh Liệt (Km 2+500, đường Phan Trọng Tuệ, Xã Thanh Liệt, Huyện Thanh Trì)",
                },
                {
                  city: "Hà Nội",
                  center: "EV Care Pro - Vinhomes Riverside (Tầng 1, TTTM Vincom Plaza, KĐT Vinhomes Riverside, Phường Phúc Lợi, Quận Long Biên)",
                },
                {
                  city: "Hà Nội",
                  center: "EV Care Pro - Vinhomes Ocean Park (TTTM Vincom Ocean Park, KĐT Vinhomes Ocean Park, Cổng số 9 – Khu Kiêu Kỵ, Gia Lâm)",
                },
                {
                  city: "Hà Nội",
                  center: "EV Care Pro - Vinhomes Smart City (TTTM Vincom Smart City, KĐT Vinhomes Smart City, Phường Tây Mỗ, Quận Nam Từ Liêm)",
                },
                {
                  city: "TP. Hồ Chí Minh",
                  center: "EV Care Pro - Đồng Khởi (Tầng 1, TTTM Vincom Center Đồng Khởi, 72 Lê Thánh Tôn, Quận 1)",
                },
                {
                  city: "TP. Hồ Chí Minh",
                  center: "EV Care Pro - Landmark 81 (Tầng L1, Vincom Center Landmark 81, 208 Nguyễn Hữu Cảnh, Quận Bình Thạnh)",
                },
                {
                  city: "TP. Hồ Chí Minh",
                  center: "EV Care Pro - Quận 7 (54 Nguyễn Thị Thập, Phường Bình Thuận, Quận 7)",
                },
                {
                  city: "Cần Thơ",
                  center: "EV Care Pro - Xuân Khánh (Tầng L1, TTTM Vincom Plaza Xuân Khánh, Số 209 Đường 30 Tháng 4, Phường Xuân Khánh, Quận Ninh Kiều)",
                },
                {
                  city: "Đà Nẵng",
                  center: "EV Care Pro - Sơn Trà (Tầng 1, TTTM Vincom Plaza Đà Nẵng, Số 910A Ngô Quyền, P. An Hải Bắc, Quận Sơn Trà)",
                },
                {
                  city: "Cà Mau",
                  center: "EV Care Pro - Phường 8 (Số 139 Nguyễn Tất Thành, Phường 8, TP. Cà Mau)",
                },
              ].map((branch, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all p-6 cursor-pointer border border-gray-100"
                >
                  <h3 className="text-xl font-bold text-gray-900">{branch.city}</h3>
                  <p className="text-gray-500 mt-2 text-sm">{branch.center}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 25. Footer */}
        <footer className="bg-gray-900 text-gray-300 py-16">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 text-left">
            {/* Cột 1 - Logo & Giới thiệu */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">EV Care Pro</h3>
              <p className="text-sm leading-relaxed">
                Hệ thống dịch vụ bảo dưỡng và sửa chữa xe điện hàng đầu Việt Nam.
                Uy tín - Minh bạch - Chuyên nghiệp.
              </p>
            </div>

            {/* Cột 2 - Chính sách */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Chính sách</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-400">Chính sách bảo mật</a></li>
                <li><a href="#" className="hover:text-blue-400">Điều khoản dịch vụ</a></li>
                <li><a href="#" className="hover:text-blue-400">Chính sách bảo hành</a></li>
                <li><a href="#" className="hover:text-blue-400">Hỏi đáp (FAQ)</a></li>
              </ul>
            </div>

            {/* Cột 3 - Đối tác */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Đối tác</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-400">VinFast</a></li>
              </ul>
            </div>

            {/* Cột 4 - Liên hệ */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Liên hệ</h4>
              <ul className="space-y-2 text-sm">
                <li>📍 1084 Nguyễn Duy Trinh, Hồ Chí Minh</li>
                <li>📞 0906791084</li>
                <li>📧 dinhtri11012005@gmail.com</li>
              </ul>
            </div>
          </div>
          {/* Dòng cuối */}
          <div className="border-t border-gray-700 mt-12 pt-6 text-center text-sm text-gray-500">
            <p>© 2025 EV Care Pro. Mọi quyền được bảo lưu.</p>
            <p className="mt-1">Designed by <span className="text-gray-300 font-semibold">RTY</span></p>
          </div>
          {/* ChatBot*/}
          <div className="">
            {/* existing content */}
            <ChatBot bookings={bookings} />
          </div>
        </footer>
      </main>
    </div>
  );
};

export default HomePage;
