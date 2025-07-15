const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const client = new CosmosClient({ endpoint, key });

const databaseId = "SupportTickets";
const containerId = "Tickets";

module.exports = async function (context, req) {
  // For demo, get email from query string
  const userEmail = req.query.email;

  if (!userEmail) {
    context.res = { status: 400, body: "User email is required" };
    return;
  }

  try {
    const container = client.database(databaseId).container(containerId);

    // Query tickets by email partition key
    const querySpec = {
      query: "SELECT * FROM c WHERE c.email = @userEmail",
      parameters: [{ name: "@userEmail", value: userEmail }],
    };

    const { resources: tickets } = await container.items.query(querySpec).fetchAll();

    context.res = {
      status: 200,
      body: tickets,
    };
  } catch (err) {
    context.log.error("Error fetching tickets:", err.message);
    context.res = {
      status: 500,
      body: "Server error while fetching tickets",
    };
  }
};
