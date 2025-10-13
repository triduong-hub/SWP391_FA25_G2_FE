import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoute from "./pages/routers/AppRoute.jsx";

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <AppRoute />
      </div>
    </Router>
  );
}

export default App;

