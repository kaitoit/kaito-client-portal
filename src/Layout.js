// src/Layout.js
import React from 'react';
import './App.css';

const Layout = ({ children }) => {
  return (
    <div className="app-wrapper">
      <video className="background-video" autoPlay muted loop playsInline>
        <source src={process.env.PUBLIC_URL + "/trees.mp4"} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="main-container">
        {/* Logo */}
<div className="logo-header">
  <img
    src={process.env.PUBLIC_URL + "/logo512.png"}
    alt="Kaito IT Logo"
    className="site-logo"
    onClick={() => window.location.href = "/"}
  />
  <span className="logo-text" onClick={() => window.location.href = "/"}>
    Kaito IT
  </span>
</div>


        {/* Page content */}
        {children}
      </div>
    </div>
  );
};

export default Layout;
