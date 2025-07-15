const { CosmosClient } = require("@azure/cosmos");
const { v4: uuidv4 } = require("uuid");
const fetch = require("node-fetch");

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const databaseId = "SupportTickets";
const ticketsContainerId = "Tickets";
const repliesContainerId = "Replies";
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

    await repliesContainer.items.create(reply, { partitionKey: ticketId });

    // Optionally update ticket status
    const ticketsContainer = client.database(databaseId).container(ticketsContainerId);
    const { resources: tickets } = await ticketsContainer
      .items.query({
        query: "SELECT * FROM c WHERE c.id = @id",
        parameters: [{ name: "@id", value: ticketId }],
      })
      .fetchAll();

    if (tickets.length > 0) {
      const ticket = tickets[0];
      ticket.status = "responded";
      await ticketsContainer.items.upsert(ticket);
    }

    // Optional: Notify Teams
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


