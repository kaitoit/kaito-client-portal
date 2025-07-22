// api/reply-ticket/index.js
const { CosmosClient } = require("@azure/cosmos");
const { v4: uuidv4 } = require("uuid");

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const client = new CosmosClient({ endpoint, key });

const databaseId = "SupportTickets";
const repliesContainerId = "Replies";

module.exports = async function (context, req) {
  context.log("Reply request:", req.body);

  const { ticketId, sender, message } = req.body;
  if (!ticketId || !sender || !message) {
    context.res = {
      status: 400,
      body: "ticketId, sender, and message are required.",
    };
    return;
  }

  try {
    const container = client.database(databaseId).container(repliesContainerId);

    const newReply = {
      id: uuidv4(),
      ticketId,
      sender,
      message,
      timestamp: new Date().toISOString(),
    };

    context.log("Creating reply:", newReply);
    await container.items.create(newReply, { partitionKey: ticketId });

    context.res = {
      status: 201,
      body: { message: "Reply added.", replyId: newReply.id },
    };
  } catch (err) {
    context.log.error("Error saving reply:", err);
    context.res = {
      status: 500,
      body: { error: "Server error while posting reply." },
    };
  }
};

