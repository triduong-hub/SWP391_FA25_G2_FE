import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

//  Import LanguageProvider
import { LanguageProvider } from "../../contexts/LanguageContext.jsx";

// Trang login & password
import LoginPage from "../login/LoginPage.jsx";
import ForgotPasswordPage from "../password/ForgotPasswordPage.jsx";
import OAuth2RedirectHandler from "../login/OAuth2RedirectHandler.jsx"; // ✅ THÊM IMPORT NÀY

// Trang Technician
import TechnicianDashboard from "../home/Technician/TechnicianDashboard.jsx";

// Trang Staff
import StaffDashboard from "../home/staff/StaffDashboard.jsx";

// Layout Admin
import AdminLayout from "../home/admin/AdminLayout.jsx";

// Xem báo giá (Customer)
import CustomerQuotationDetailPage from "../home/users/CustomerQuotationPage.jsx";

//Trang hóa đơn
import InvoicePage from "../invoice/InvoicePage.jsx";




// Trang con của Admin
import HomeAdmin from "../home/admin/HomeAdmin.jsx";
import UserManagement from "../home/UserManagement.jsx";
import HomeStaff from "../home/HomeStaff.jsx";
import ScheduleManagement from "../home/ScheduleManagement.jsx";
import CarManagement from "../home/CarManagement.jsx";
import SystemManagement from "../home/SystemManagement.jsx";
import RevenueManagement from "../home/RevenueManagement.jsx";
import TechnicianManagement from "../home/TechnicianManagement.jsx";

// Trang chủ (HomePage) và trang cá nhân (Profile)
import HomePage from "../home/users/HomePage.jsx";
import Profile from "../home/users/Profile.jsx";
// Trang đặt lịch (Booking Page)
import BookingPage from "../booking/BookingPage.jsx";

// Trang linh kiện
import Parts from "../home/components/Parts.jsx"

// Trang Thanh Toán
import PaymentPage from "../payment/PaymentPage.jsx";
import PaymentSuccess from "../payment/PaymentSuccess.jsx";

//Trang báo giá
import QuotationPage from "../home/Technician/QuotationPage.jsx";

// Xem báo giá
import QuotationDetailPage from "../home/Technician/QuotationDetailPage.jsx";

function AppRoute() {
  return (
    //  Toàn bộ Route được bao trong LanguageProvider
    <LanguageProvider>
      <Routes>
        {/* Trang chủ */}
        <Route path="/" element={<HomePage />} />

        {/* Trang cá nhân */}
        <Route path="/profile" element={<Profile />} />

        {/* Trang đăng nhập */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} /> {/* ✅ THÊM ROUTE NÀY */}

        {/* Technician */}
        <Route path="/techniciandash" element={<TechnicianDashboard />} />

        {/* Staff */}
        <Route path="/staffdash" element={<StaffDashboard />} />

        {/* Trang quên mật khẩu */}
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Trang đặt lịch bảo dưỡng */}
        <Route path="/booking" element={<BookingPage />} />

        {/* Trang linh kiện */}
        <Route path="/components" element={<Parts />} />

        {/* Trang thanh toán */}
        <Route path="/payment/:orderId" element={<PaymentPage />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancel" element={<Navigate to="/" replace />} />

        {/* Trang báo giá */}
        <Route path="/technician/quotation/:jobId" element={<QuotationPage />} />

        {/* Trang xem báo giá */}
        <Route path="/quotation/:maintenanceId" element={<QuotationDetailPage />} />


         {/* Trang xem hóa đơn*/}
         <Route path="/invoice/order/:orderId" element={<InvoicePage />} />

        {/* Trang xem báo giá customer */}
        <Route path="/customer/quotation/:orderId" element={<CustomerQuotationDetailPage />} />




        {/* Các route trong Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="home" element={<HomeAdmin />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="staff" element={<HomeStaff />} />
          <Route path="cars" element={<CarManagement />} />
          <Route path="schedule" element={<ScheduleManagement />} />
          <Route path="revenue" element={<RevenueManagement />} />
          <Route path="settings" element={<SystemManagement />} />
          <Route path="technician" element={<TechnicianManagement />} />
          {/* <Route path="assignments" element={<TechnicianManagement />} /> */}

        </Route>
      </Routes>
    </LanguageProvider>
  );
}

export default AppRoute;
