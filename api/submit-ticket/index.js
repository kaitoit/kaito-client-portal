const { CosmosClient } = require("@azure/cosmos");
const { randomUUID } = require("crypto");
const fetch = require("node-fetch");

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const client = new CosmosClient({ endpoint, key });

const databaseId = "SupportTickets";
const containerId = "Tickets";
const teamsWebhookUrl = process.env.TEAMS_WEBHOOK_URL;

async function notifyTeams(ticket) {
  if (!teamsWebhookUrl) return;

  const card = {
    "@type": "MessageCard",
    "@context": "http://schema.org/extensions",
    summary: "New Support Ticket",
    themeColor: "0076D7",
    title: "🆕 New Ticket Submitted",
    sections: [
      {
        facts: [
          { name: "Name", value: ticket.name || "N/A" },
          { name: "Email", value: ticket.email },
          { name: "Priority", value: ticket.priority || "normal" },
          { name: "Component", value: ticket.component || "general" },
          { name: "Submitted", value: new Date().toLocaleString() }
        ],
        text: ticket.description
      }
    ]
  };

  try {
    await fetch(teamsWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(card)
    });
  } catch (err) {
    console.error("Failed to send Teams notification:", err.message);
  }
}

module.exports = async function (context, req) {
  const { name, email, subject, description, component, priority, timestamp } = req.body;

  if (!description || !name || !email || !subject) {
    context.res = {
      status: 400,
      body: "Missing required fields."
    };
    return;
  }

  const safeEmail = email.toLowerCase();

  try {
    const container = client.database(databaseId).container(containerId);

    const newTicket = {
      id: randomUUID(),
      name,
      email: safeEmail,
      subject,
      description,
      component: component || "general",
      priority: priority || "normal",
      status: "open",
      submittedAt: timestamp && !isNaN(Date.parse(timestamp))
        ? new Date(timestamp).toISOString()
        : new Date().toISOString(),
      replies: []
    };

    const { resource: createdItem } = await container.items.create(newTicket, {
      partitionKey: safeEmail
    });

    await notifyTeams(newTicket);

    context.res = {
      status: 201,
      body: {
        message: "Ticket submitted successfully",
        ticketId: createdItem.id
      }
    };
  } catch (err) {
    context.log.error("Error submitting ticket:", err);
    context.res = {
      status: 500,
      body: { error: "Failed to submit ticket." }
    };
  }
};



