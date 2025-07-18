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
      body: "Missing ticketId query parameter"
    };
    return;
  }

  try {
    const container = client.database(databaseId).container(containerId);

    // Query all replies for this ticketId (partition key)
    const querySpec = {
      query: "SELECT * FROM c WHERE c.ticketId = @ticketId ORDER BY c.timestamp ASC",
      parameters: [{ name: "@ticketId", value: ticketId }],
    };

    const { resources: replies } = await container.items.query(querySpec).fetchAll();

    context.res = {
      status: 200,
      body: replies,
    };
  } catch (err) {
    context.log.error("Error fetching replies:", err.message);
    context.res = {
      status: 500,
      body: "Server error while fetching replies",
    };
  }
};


