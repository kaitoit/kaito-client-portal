// src/components/Toast.jsx
import React from "react";

export default function Toast({ message, type = "info" }) {
  const color = {
    success: "#4caf50",
    error: "#f44336",
    info: "#2196f3",
  }[type];

  return (
    <div style={{
      backgroundColor: color,
      color: "white",
      padding: "0.75rem 1.25rem",
      borderRadius: "6px",
      marginTop: "1rem",
      fontWeight: "bold"
    }}>
      {message}
    </div>
  );
}
