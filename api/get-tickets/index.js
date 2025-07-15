const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const client = new CosmosClient({ endpoint, key });

const databaseId = "SupportTickets";
const containerId = "Tickets";

module.exports = async function (context, req) {
  try {
    const container = client.database(databaseId).container(containerId);

    const querySpec = {
      query: "SELECT * FROM c ORDER BY c.submittedAt DESC"
    };

    const { resources: tickets } = await container.items.query(querySpec).fetchAll();

    context.res = {
      status: 200,
      body: tickets
    };
  } catch (err) {
    context.log.error("Error retrieving tickets:", err.message);
    context.res = {
      status: 500,
      body: { error: "Failed to retrieve tickets" }
    };
  }
};
