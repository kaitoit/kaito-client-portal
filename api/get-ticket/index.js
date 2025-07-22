const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const client = new CosmosClient({ endpoint, key });

const databaseId = "SupportTickets";
const containerId = "Tickets";

module.exports = async function (context, req) {
  const ticketId = req.query.id;
  const rawEmail = req.query.email;

  if (!ticketId || !rawEmail) {
    context.res = {
      status: 400,
      body: "Missing ticket ID or email.",
    };
    return;
  }

  const email = decodeURIComponent(rawEmail).trim().toLowerCase();

  try {
    const container = client.database(databaseId).container(containerId);
    const { resource } = await container.item(ticketId, email).read();

    if (!resource) {
      context.res = {
        status: 404,
        body: "Ticket not found.",
      };
      return;
    }

    context.res = {
      status: 200,
      body: resource,
    };
  } catch (err) {
    context.log.error("Error fetching ticket:", err.message);
    context.res = {
      status: 500,
      body: { error: "Failed to fetch ticket." },
    };
  }
};
