const { CosmosClient } = require("@azure/cosmos");
const { randomUUID } = require("crypto");

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const client = new CosmosClient({ endpoint, key });

const databaseId = "SupportTickets";  // Make sure this matches your Cosmos DB
const containerId = "Tickets";        // Make sure this matches your Cosmos DB

module.exports = async function (context, req) {
  context.log("Received ticket:", req.body);

  const { name, email, subject, description, component, priority, timestamp } = req.body;

  // Validate required fields
  if (!( (name && email && description) || (subject && description) )) {
    context.res = {
      status: 400,
      body: "Missing required fields. Please provide either name, email, and description OR subject and description."
    };
    return;
  }

  try {
    const container = client.database(databaseId).container(containerId);

    // Construct ticket data, use provided fields
    const newTicket = {
      id: randomUUID(),
      name: name || null,
      email: email || null,
      subject: subject || null,
      description,
      component: component || "general",
      priority: priority || "normal",
      status: "open",
      submittedAt: timestamp || new Date().toISOString(),
    };

    const { resource: createdItem } = await container.items.create(newTicket, {
      partitionKey: newTicket.email,
    });

    context.res = {
      status: 201,
      body: {
        message: "Ticket submitted successfully",
        ticketId: createdItem.id,
      },
    };
  } catch (err) {
    context.log.error("Error submitting ticket:", err);
    context.res = {
      status: 500,
      body: { error: "Failed to submit ticket." },
    };
  }
};

