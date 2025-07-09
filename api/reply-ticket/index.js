const { CosmosClient } = require("@azure/cosmos");
const { v4: uuidv4 } = require("uuid");
const fetch = require("node-fetch"); // Needed for Teams webhook

// Cosmos DB setup
const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const databaseId = "SupportTickets";
const ticketsContainerId = "Tickets";
const repliesContainerId = "Replies";

// Teams webhook (stored as environment variable)
const teamsWebhookUrl = process.env.TEAMS_WEBHOOK_URL;

const client = new CosmosClient({ endpoint, key });

module.exports = async function (context, req) {
  const { ticketId, sender, message } = req.body;

  if (!ticketId || !sender || !message) {
    context.res = {
      status: 400,
      body: "Missing required fields: ticketId, sender, message",
    };
    return;
  }

  try {
    const repliesContainer = client.database(databaseId).container(repliesContainerId);

    const reply = {
      id: uuidv4(),
      ticketId,
      sender,
      message,
      timestamp: new Date().toISOString(),
    };

    await repliesContainer.items.create(reply, {
      partitionKey: ticketId,
    });

    // Optional: Update ticket status to 'responded'
    const ticketsContainer = client.database(databaseId).container(ticketsContainerId);
    const { resource: ticket } = await ticketsContainer.item(ticketId, reply.ticketId).read();

    if (ticket) {
      ticket.status = "responded";
      await ticketsContainer.item(ticketId, ticket.component || "general").replace(ticket);
    }

    // Notify Microsoft Teams
    if (teamsWebhookUrl) {
      await fetch(teamsWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `💬 New reply on ticket **${ticketId}** from **${sender}**:\n\n${message}`,
        }),
      });
    }

    context.res = {
      status: 201,
      body: {
        message: "Reply posted successfully",
        replyId: reply.id,
      },
    };
  } catch (err) {
    context.log.error("Error saving reply:", err.message);
    context.res = {
      status: 500,
      body: { error: "Server error while posting reply" },
    };
  }
};

