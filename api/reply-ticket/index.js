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

  context.log("Received reply-ticket request:", { ticketId, sender, message, email });

  if (!ticketId || !sender || !message || !email) {
    context.res = {
      status: 400,
      body: "Missing required fields: ticketId, sender, message, email",
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

    context.log("Creating reply document:", reply);
    await repliesContainer.items.create(reply, { partitionKey: ticketId });

    const ticketsContainer = client.database(databaseId).container(ticketsContainerId);

    // Read the ticket item directly by id and partition key (email)
    context.log(`Reading ticket by id=${ticketId} and partitionKey(email)=${email}`);
    const ticketResponse = await ticketsContainer.item(ticketId, email).read();

    if (!ticketResponse.resource) {
      context.log("Ticket not found for update");
      context.res = { status: 404, body: "Ticket not found" };
      return;
    }

    const ticket = ticketResponse.resource;
    ticket.status = "responded";

    context.log("Updating ticket status to responded");
    await ticketsContainer.items.upsert(ticket, { partitionKey: email });

    // Optional: Notify Teams
    if (teamsWebhookUrl) {
      await fetch(teamsWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `💬 New reply on ticket **${ticketId}** from **${sender}**:\n\n${message}`,
        }),
      });
      context.log("Teams notification sent");
    }

    context.res = {
      status: 201,
      body: {
        message: "Reply posted successfully",
        replyId: reply.id,
      },
    };
  } catch (err) {
    context.log.error("Error saving reply or updating ticket:", err);
    context.res = {
      status: 500,
      body: { error: "Server error while posting reply", details: err.message },
    };
  }
};

