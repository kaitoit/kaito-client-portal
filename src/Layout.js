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

      <div className="header-container">
        <div className="header-inner">
          <div className="logo-header horizontal">
            <img
              src={process.env.PUBLIC_URL + "/logo512.png"}
              alt="Logo"
              className="site-logo"
            />
            <div className="logo-text full-width">Kaito IT</div>
          </div>
        </div>
      </div>

      <div className="main-container">
        {children}
      </div>
    </div>
  );
};

export default Layout;
