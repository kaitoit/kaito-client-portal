// src/Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import './App.css';

const Layout = () => {
  return (
    <>
      {/* Fixed Header */}
      <header className="header">
        <div className="header-content">
          <img src="/logo512.png" alt="Kaito IT Logo" />
          <h1>Kaito IT</h1>
          <img src="/cleverit.png" alt="Clever IT Slogan" className="slogan-image" />
        </div>
      </header>

      {/* Background video and page content */}
      <div className="app-wrapper">
        <video className="background-video" autoPlay muted loop playsInline>
          <source src={process.env.PUBLIC_URL + "/trees.mp4"} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="main-container">
          <Outlet /> {/* This renders the nested route content */}
        </div>
      </div>
    </>
  );
};

export default Layout;
