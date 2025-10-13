import React from "react";
import { useLanguage } from "../contexts/LanguageContext.jsx";

const LanguageSwitcher = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
    >
      {language === "vi" ? "EN" : "VI"}
    </button>
  );
};

export default LanguageSwitcher;
