const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const client = new CosmosClient({ endpoint, key });

const databaseId = "SupportTickets";
const containerId = "Tickets";

module.exports = async function (context, req) {
  try {
    const container = client.database(databaseId).container(containerId);

    const query = {
      query: "SELECT * FROM c ORDER BY c.submittedAt DESC"
    };

    const { resources: tickets } = await container.items.query(query).fetchAll();

    context.res = {
      status: 200,
      body: tickets
    };
  } catch (err) {
    context.log("Error fetching tickets:", err.message);
    context.res = {
      status: 500,
      body: "Server error while fetching tickets"
    };
  }
};
