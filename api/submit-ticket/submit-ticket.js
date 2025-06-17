const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const client = new CosmosClient({ endpoint, key });

const databaseId = "Support";
const containerId = "Tickets";

module.exports = async function (context, req) {
  context.log("Received ticket:", req.body);

  const { subject, description, timestamp } = req.body;

  if (!subject || !description) {
    context.res = {
      status: 400,
      body: "Missing required fields: subject and description are required."
    };
    return;
  }

  try {
    const createdItem = await client
      .database(databaseId)
      .container(containerId)
      .items.create({
        subject,
        description,
        timestamp: timestamp || new Date().toISOString()
      });

    context.res = {
      status: 200,
      body: { message: "Ticket submitted", id: createdItem.resource.id }
    };
  } catch (err) {
    context.log("Error:", err.message);
    context.res = {
      status: 500,
      body: { error: "Failed to submit ticket." }
    };
  }
};
