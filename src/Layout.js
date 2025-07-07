// src/Layout.js
import React from 'react';
import './App.css';

const Layout = ({ children }) => {
  return (
    <>
      <header className="header">
        <div className="logo-title">
          <img src={process.env.PUBLIC_URL + "/logo512.png"} alt="Kaito Logo" />
          <span>Kaito IT</span>
        </div>
        <img
          src={process.env.PUBLIC_URL + "/cleverit.png"}
          alt="Clever IT"
          className="cleverit"
        />
      </header>

      <div className="app-wrapper">
        <video className="background-video" autoPlay muted loop playsInline>
          <source src={process.env.PUBLIC_URL + "/trees.mp4"} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="main-container">
          {children}
        </div>
      </div>
    </>
  );
};

export default Layout;
