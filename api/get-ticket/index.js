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
    const { resource } = await container.item(ticketId, ticketId).read(); // assuming /id as partitionKey
    context.res = { status: 200, body: resource };
  } catch (err) {
    context.log("Error reading ticket:", err.message);
    context.res = { status: 404, body: "Ticket not found" };
  }
};
