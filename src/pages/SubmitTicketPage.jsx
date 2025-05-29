import React, { useState } from "react";
import "./SubmitTicketPage.css";

function SubmitTicketPage() {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // TODO: Replace with actual backend API call
    console.log("Ticket submitted:", { subject, description });
    setSubmitted(true);
    setSubject("");
    setDescription("");
  };

  return (
    <div className="page-container">
      <h2>Submit a Support Ticket</h2>
      {submitted ? (
        <p className="confirmation">Your ticket has been submitted. 🎉</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
          <textarea
            placeholder="Describe your issue"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="6"
            required
          />
          <button type="submit">Submit Ticket</button>
        </form>
      )}
    </div>
  );
}

export default SubmitTicketPage;
