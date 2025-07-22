const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const client = new CosmosClient({ endpoint, key });

const databaseId = "SupportTickets";
const containerId = "Replies";

module.exports = async function (context, req) {
  const { ticketId, from, message } = req.body;

  if (!ticketId || !from || !message) {
    context.res = {
      status: 400,
      body: "Missing ticketId, from, or message"
    };
    return;
  }

  try {
    const container = client.database(databaseId).container(containerId);

    const replyItem = {
      id: crypto.randomUUID(),
      ticketId,
      from,
      message,
      timestamp: new Date().toISOString()
    };

    await container.items.create(replyItem, {
      partitionKey: ticketId
    });

    context.res = {
      status: 201,
      body: { message: "Reply added" }
    };
  } catch (err) {
    context.log("Reply error:", err.message);
    context.res = {
      status: 500,
      body: "Failed to add reply"
    };
  }
};
