const { CosmosClient } = require("@azure/cosmos");
const { v4: uuidv4 } = require("uuid");
const fetch = require("node-fetch"); // For Teams webhook notification if needed

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const client = new CosmosClient({ endpoint, key });

const databaseId = "SupportTickets";
const repliesContainerId = "Replies";
const ticketsContainerId = "Tickets";

const teamsWebhookUrl = process.env.TEAMS_WEBHOOK_URL;

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

    // Optional: update ticket status to "responded"
    const ticketsContainer = client.database(databaseId).container(ticketsContainerId);
    const ticketQuery = {
      query: "SELECT * FROM c WHERE c.id = @ticketId",
      parameters: [{ name: "@ticketId", value: ticketId }],
    };

    const { resources: tickets } = await ticketsContainer.items.query(ticketQuery).fetchAll();
    if (tickets.length > 0) {
      const ticket = tickets[0];
      ticket.status = "responded";
      await ticketsContainer.item(ticket.id, ticket.email).replace(ticket);
    }

    // Notify Teams if webhook URL configured
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


