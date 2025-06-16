const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const databaseId = "Support";
const containerId = "Tickets";

module.exports = async function (context, req) {
  if (req.method !== "POST") {
    context.res = {
      status: 405,
      body: "Only POST requests are allowed."
    };
    return;
  }

  const { subject, description, timestamp } = req.body;

  if (!subject || !description) {
    context.res = {
      status: 400,
      body: "Missing subject or description."
    };
    return;
  }

  try {
    const client = new CosmosClient({ endpoint, key });
    const database = client.database(databaseId);
    const container = database.container(containerId);

    const ticket = {
      id: context.executionContext.invocationId, // unique ticket ID
      subject,
      description,
      timestamp: timestamp || new Date().toISOString(),
      status: "Open"
    };

    await container.items.create(ticket);

    context.res = {
      status: 201,
      body: { message: "Ticket submitted successfully.", id: ticket.id }
    };
  } catch (err) {
    console.error("Cosmos DB error:", err.message);
    context.res = {
      status: 500,
      body: "Server error while saving ticket."
    };
  }
};
