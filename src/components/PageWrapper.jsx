// src/components/PageWrapper.jsx
import React from "react";
import "../App.css";

export default function PageWrapper({ children }) {
  return (
    <div className="app-wrapper">
      <div className="main-container">
        <div className="page-container">
          {children}
        </div>
      </div>
    </div>
  );
}
