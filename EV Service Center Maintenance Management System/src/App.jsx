import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google"; // ✅ Thêm dòng này
import AppRoute from "./pages/routers/AppRoute.jsx";

function App() {
  return (
    // ✅ Bọc toàn bộ ứng dụng bằng GoogleOAuthProvider
     <GoogleOAuthProvider clientId="361505380119-qeakq8e54al6hn7os2plfm8uo608fdtd.apps.googleusercontent.com">
      <Router>
        <div className="min-h-screen">
          <AppRoute />
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
