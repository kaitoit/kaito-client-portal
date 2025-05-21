import React, { useState } from "react";

function TicketForm() {
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    email: "",
  });

  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const res = await fetch("/api/submitTicket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setFormData({ subject: "", description: "", email: "" });
      } else {
        setStatus("error");
        console.error(data);
      }
    } catch (err) {
      console.error("Submission error:", err);
      setStatus("error");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Submit a Support Ticket</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="text"
          name="subject"
          placeholder="Ticket Subject"
          value={formData.subject}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <textarea
          name="description"
          placeholder="Describe your issue"
          value={formData.description}
          onChange={handleChange}
          required
          style={styles.textarea}
        ></textarea>
        <button type="submit" style={styles.button}>
          Submit Ticket
        </button>
        {status === "submitting" && <p style={styles.info}>Submitting...</p>}
        {status === "success" && <p style={styles.success}>Ticket submitted!</p>}
        {status === "error" && <p style={styles.error}>Error submitting ticket.</p>}
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "2rem auto",
    backgroundColor: "#1e1e1e",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
    color: "#fff",
  },
  heading: {
    marginBottom: "1rem",
    fontSize: "1.8rem",
    textAlign: "center",
    color: "#00aaff",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  input: {
    padding: "0.75rem",
    borderRadius: "4px",
    border: "1px solid #444",
    backgroundColor: "#2b2b2b",
    color: "#fff",
    fontSize: "1rem",
  },
  textarea: {
    padding: "0.75rem",
    height: "120px",
    borderRadius: "4px",
    border: "1px solid #444",
    backgroundColor: "#2b2b2b",
    color: "#fff",
    fontSize: "1rem",
    resize: "vertical",
  },
  button: {
    padding: "0.75rem",
    backgroundColor: "#00aaff",
    color: "#fff",
    fontSize: "1rem",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  info: {
    textAlign: "center",
    color: "#ccc",
  },
  success: {
    textAlign: "center",
    color: "#00ff99",
  },
  error: {
    textAlign: "center",
    color: "#ff5555",
  },
};

export default TicketForm;
