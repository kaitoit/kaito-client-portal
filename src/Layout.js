// src/Layout.js
import React from 'react';
import './App.css';

const Layout = ({ children }) => {
  return (
    <>
      {/* Fixed Header */}
      <header className="header">
        <div className="header-content">
          <img src="/logo512.png" alt="Kaito IT Logo" />
          <h1>Kaito IT</h1>
          {/* Add the clever slogan PNG here */}
          <img src="/cleverit.png" alt="Clever IT Slogan" className="slogan-image" />
        </div>
      </header>

      {/* Background video */}
      <div className="app-wrapper">
        <video className="background-video" autoPlay muted loop playsInline>
          <source src={process.env.PUBLIC_URL + "/trees.mp4"} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Main content */}
        <div className="main-container">{children}</div>
      </div>
    </>
  );
};

export default Layout;
