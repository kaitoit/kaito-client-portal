const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const databaseId = "TicketsDB";
const containerId = "Replies"; // Must match your Cosmos DB
const partitionKeyField = "/ticketId"; // Update to match your container's partitionKey path

const client = new CosmosClient({ endpoint, key });
const container = client.database(databaseId).container(containerId);

module.exports = async function (context, req) {
  try {
    const { ticketId, email, author, message } = req.body;

    if (!ticketId || !email || !author || !message) {
      context.res = {
        status: 400,
        body: { error: "Missing required fields." },
      };
      return;
    }

    const reply = {
      id: `${ticketId}-${Date.now()}`, // Unique ID
      ticketId,
      email,
      author,
      message,
      timestamp: new Date().toISOString(),
    };

    await container.items.create(reply, { partitionKey: ticketId });

    context.res = {
      status: 200,
      body: { message: "Reply saved successfully." },
    };
  } catch (err) {
    context.log("Error in reply-ticket:", err.message);
    context.res = {
      status: 500,
      body: { error: "Failed to save reply." },
    };
  }
};

