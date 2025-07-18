const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const client = new CosmosClient({ endpoint, key });

const databaseId = "SupportTickets";
const ticketsContainerId = "Tickets";
const repliesContainerId = "Replies";

module.exports = async function (context, req) {
  const ticketId = req.query.id;

  if (!ticketId) {
    context.res = { status: 400, body: "Ticket ID is required" };
    return;
  }

  try {
    const database = client.database(databaseId);
    const ticketsContainer = database.container(ticketsContainerId);
    const repliesContainer = database.container(repliesContainerId);

    // Find the ticket by ID (Cosmos requires query if you don't know the partition key)
    const ticketQuery = {
      query: "SELECT * FROM c WHERE c.id = @ticketId",
      parameters: [{ name: "@ticketId", value: ticketId }],
    };

    const { resources: ticketResults } = await ticketsContainer.items
      .query(ticketQuery)
      .fetchAll();

    if (!ticketResults || ticketResults.length === 0) {
      context.res = { status: 404, body: "Ticket not found" };
      return;
    }

    const ticket = ticketResults[0];

    // Fetch all replies for this ticket
    const repliesQuery = {
      query: "SELECT * FROM c WHERE c.ticketId = @ticketId ORDER BY c.timestamp ASC",
      parameters: [{ name: "@ticketId", value: ticketId }],
    };

    const { resources: replies } = await repliesContainer.items
      .query(repliesQuery)
      .fetchAll();

    ticket.replies = replies || [];

    context.res = {
      status: 200,
      body: ticket,
    };
  } catch (err) {
    context.log.error("Error reading ticket:", err.message);
    context.res = {
      status: 500,
      body: "Server error while fetching ticket",
    };
  }
};
