const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const client = new CosmosClient({ endpoint, key });

const databaseId = "SupportTickets";
const containerId = "Tickets";

module.exports = async function (context, req) {
  const { ticketId, email, author, message } = req.body;

  if (!ticketId || !email || !author || !message) {
    context.res = {
      status: 400,
      body: "Missing required fields."
    };
    return;
  }

  try {
    const container = client.database(databaseId).container(containerId);
    const { resource: ticket } = await container.item(ticketId, email).read();

    if (!ticket) {
      context.res = {
        status: 404,
        body: "Ticket not found."
      };
      return;
    }

    const reply = {
      author,
      message,
      timestamp: new Date().toISOString()
    };

    ticket.replies = [...(ticket.replies || []), reply];

    await container.item(ticketId, email).replace(ticket);

    context.res = {
      status: 200,
      body: { message: "Reply added." }
    };
  } catch (err) {
    context.log("Reply error:", err.message);
    context.res = {
      status: 500,
      body: { error: "Failed to add reply." }
    };
  }
};

