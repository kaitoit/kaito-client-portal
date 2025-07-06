return (
  <div className="app-wrapper">
    <div className="main-container">
      <div className="page-container">
        <h1>Submit a Support Ticket</h1>
        <p>Fill out the form below to create a new support request.</p>

        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="email" placeholder="Your Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <textarea placeholder="Describe your issue..." rows="5" value={description} onChange={(e) => setDescription(e.target.value)} required />
          <input type="text" placeholder="Component (optional)" value={component} onChange={(e) => setComponent(e.target.value)} />
          <label htmlFor="priority">Priority:</label>
          <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="normal">Normal</option>
            <option value="high">High</option>
          </select>
          <button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Ticket"}
          </button>
        </form>

        {message && <p style={{ marginTop: "1rem", fontWeight: "bold" }}>{message}</p>}

        <hr style={{ margin: "2rem 0" }} />

        <h2>Describe your issue here to get suggestions</h2>
        <p>Kaito IT Chat Assistant</p>

        <div style={{ background: "#f1f1f1", padding: "1rem", borderRadius: "8px" }}>
          <div style={{ maxHeight: "200px", overflowY: "auto", marginBottom: "1rem" }}>
            {chatHistory.map((msg, i) => (
              <div key={i} style={{ marginBottom: "0.5rem" }}>
                <strong>{msg.role === "user" ? "You" : "Assistant"}:</strong> {msg.content}
              </div>
            ))}
            {chatLoading && <div><em>Assistant is typing...</em></div>}
          </div>

          <form onSubmit={handleChatSubmit} style={{ display: "flex", gap: "0.5rem" }}>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="What can we help you with?"
              style={{ flex: 1 }}
            />
            <button type="submit" disabled={chatLoading} style={{ backgroundColor: "#06d6a0", color: "white" }}>
              {chatLoading ? "..." : "Ask"}
            </button>
          </form>
        </div>

        <footer style={{ marginTop: "2rem" }}>© 2025 Kaito IT</footer>
      </div>
    </div>
  </div>
);

