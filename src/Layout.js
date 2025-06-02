import React from "react";
import "./App.css";

const Layout = ({ children }) => {
  return (
    <>
      <video className="background-video" autoPlay muted loop playsInline>
        <source src="/trees.mp4" type="video/mp4" />
      </video>
      <div className="main-container">
        {children}
      </div>
    </>
  );
};

export default Layout;
