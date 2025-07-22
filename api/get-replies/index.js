// api/get-replies/index.js
const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const client = new CosmosClient({ endpoint, key });

const databaseId = "SupportTickets";
const repliesContainerId = "Replies";

module.exports = async function (context, req) {
  const ticketId = req.query.ticketId;
  if (!ticketId) {
    context.res = { status: 400, body: "ticketId query parameter is required." };
    return;
  }

  try {
    const container = client.database(databaseId).container(repliesContainerId);
    const querySpec = {
      query: "SELECT * FROM c WHERE c.ticketId = @ticketId ORDER BY c.timestamp ASC",
      parameters: [{ name: "@ticketId", value: ticketId }],
    };

    const { resources } = await container.items
      .query(querySpec, { partitionKey: ticketId })
      .fetchAll();

    context.res = {
      status: 200,
      body: { replies: resources },
    };
  } catch (err) {
    context.log.error("Error fetching replies:", err);
    context.res = { status: 500, body: "Server error while fetching replies." };
  }
};
