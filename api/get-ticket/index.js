// api/get-ticket/index.js
const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const databaseId = "KaitoTickets";
const containerId = "Tickets";

module.exports = async function (context, req) {
  const ticketId = req.query.id;
  const email = req.query.email;

  if (!ticketId || !email) {
    context.res = {
      status: 400,
      body: "Missing ticket ID or email in query parameters.",
    };
    return;
  }

  const client = new CosmosClient({ endpoint, key });

  try {
    const { resource: ticket } = await client
      .database(databaseId)
      .container(containerId)
      .item(ticketId, email)
      .read();

    context.res = {
      status: 200,
      body: ticket,
    };
  } catch (error) {
    context.log("Error reading ticket:", error.message);
    context.res = {
      status: 404,
      body: "Ticket not found.",
    };
  }
};

