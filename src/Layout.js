// src/Layout.js
import React from 'react';
import './App.css';

const Layout = ({ children }) => {
  return (
    <div className="app-wrapper">
      <video className="background-video" autoPlay muted loop playsInline>
        <source src="/trees.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="main-container">
        {children}
      </div>
    </div>
  );
};

export default Layout;
