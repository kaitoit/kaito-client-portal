const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const client = new CosmosClient({ endpoint, key });

const databaseId = "KaitoSupportDB";
const containerId = "Tickets";

module.exports = async function (context, req) {
  const { subject, description, timestamp } = req.body;

  try {
    const { resource: createdItem } = await client
      .database(databaseId)
      .container(containerId)
      .items.create({ subject, description, timestamp });

    context.res = {
      status: 200,
      body: { message: "Ticket submitted", id: createdItem.id }
    };
  } catch (err) {
    context.log("Error:", err.message);
    context.res = {
      status: 500,
      body: { error: "Failed to submit ticket." }
    };
  }
};
