const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const client = new CosmosClient({ endpoint, key });

const databaseId = "SupportTickets";
const containerId = "Replies";

module.exports = async function (context, req) {
  const ticketId = req.query.ticketId;

  if (!ticketId) {
    context.res = {
      status: 400,
      body: "Missing ticketId"
    };
    return;
  }

  try {
    const container = client.database(databaseId).container(containerId);

    const querySpec = {
      query: "SELECT * FROM c WHERE c.ticketId = @ticketId ORDER BY c.timestamp ASC",
      parameters: [{ name: "@ticketId", value: ticketId }]
    };

    const { resources: items } = await container.items
      .query(querySpec, { partitionKey: ticketId })
      .fetchAll();

    context.res = {
      status: 200,
      body: { replies: items }
    };
  } catch (err) {
    context.log("Fetch replies error:", err.message);
    context.res = {
      status: 500,
      body: "Failed to fetch replies"
    };
  }
};

