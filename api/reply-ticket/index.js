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
  const { ticketId, sender, message, email } = req.body;

  if (!ticketId || !sender || !message || !email) {
    context.res = {
      status: 400,
      body: "Missing required fields: ticketId, sender, message, email",
    };
    return;
  }

  try {
    const repliesContainer = client.database(databaseId).container(repliesContainerId);

    // Create the reply document
    const reply = {
      id: uuidv4(),
      ticketId,
      sender,
      message,
      timestamp: new Date().toISOString(),
    };

    // Insert reply with partitionKey = ticketId (correct for Replies container)
    await repliesContainer.items.create(reply, { partitionKey: ticketId });

    // Now update ticket status - must provide partitionKey = email for Tickets container
    const ticketsContainer = client.database(databaseId).container(ticketsContainerId);

    // Query ticket by id using partitionKey email
    const { resources: tickets } = await ticketsContainer
      .items.query(
        {
          query: "SELECT * FROM c WHERE c.id = @id",
          parameters: [{ name: "@id", value: ticketId }],
        },
        { partitionKey: email }
      )
      .fetchAll();

    if (tickets.length > 0) {
      const ticket = tickets[0];
      ticket.status = "responded";

      // Upsert ticket with partitionKey = email
      await ticketsContainer.items.upsert(ticket, { partitionKey: email });
    }

    // Optional: Send notification to Teams
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


