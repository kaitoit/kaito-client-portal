// api/get-ticket/index.js
const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const client = new CosmosClient({ endpoint, key });

const databaseId = "SupportTickets";
const containerId = "Tickets";

module.exports = async function (context, req) {
  const ticketId = req.query.id;
  if (!ticketId) {
    context.res = { status: 400, body: "Ticket ID is required" };
    return;
  }

  try {
    const container = client.database(databaseId).container(containerId);

    // Query using ticket ID, because partitionKey is 'email'
    const query = {
      query: "SELECT * FROM c WHERE c.id = @id",
      parameters: [{ name: "@id", value: ticketId }],
    };

    const { resources } = await container.items.query(query).fetchAll();

    if (!resources || resources.length === 0) {
      context.res = { status: 404, body: "Ticket not found" };
      return;
    }

    context.res = {
      status: 200,
      body: resources[0],
    };
  } catch (err) {
    context.log("Error reading ticket:", err.message);
    context.res = { status: 500, body: "Server error while fetching ticket" };
  }
};
