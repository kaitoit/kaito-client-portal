// src/components/StatusBadge.jsx
import React from "react";
import "../App.css";

export default function StatusBadge({ status }) {
  const className =
    status === "OK" ? "status-badge status-ok" : "status-badge status-issue";
  const label = status === "OK" ? "✅ Operational" : "⚠️ Issue";

  return <span className={className}>{label}</span>;
}
