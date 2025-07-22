// src/components/BackgroundVideo.js
import React from "react";

export default function BackgroundVideo() {
  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      style={{
        position: "fixed",
        right: 0,
        bottom: 0,
        minWidth: "100%",
        minHeight: "100%",
        objectFit: "cover",
        zIndex: -1,
      }}
    >
      <source src="/trees.mp4" type="video/mp4" />
    </video>
  );
}
