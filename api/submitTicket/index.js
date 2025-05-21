const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const databaseId = "SupportTickets";
const containerId = "Tickets";

const client = new CosmosClient({ endpoint, key });

module.exports = async function (context, req) {
  const { name, email, description, component, priority } = req.body;

  if (!name || !email || !description) {
    context.res = {
      status: 400,
      body: "Missing required fields (name, email, or description)",
    };
    return;
  }

  try {
    const container = client.database(databaseId).container(containerId);

    const newTicket = {
      name,
      email,
      description,
      component: component || "general",
      priority: priority || "normal",
      status: "open",
      submittedAt: new Date().toISOString(),
    };

    const { resource: createdItem } = await container.items.create(newTicket);

    context.res = {
      status: 200,
      body: {
        message: "Ticket submitted successfully",
        ticketId: createdItem.id,
      },
    };
  } catch (err) {
    context.log.error("Error submitting ticket:", err.message);
    context.res = {
      status: 500,
      body: `Server error: ${err.message}`,
    };
  }
};

