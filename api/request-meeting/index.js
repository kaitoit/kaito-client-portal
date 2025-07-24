const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const client = new CosmosClient({ endpoint, key });

const databaseId = "SupportTickets";
const containerId = "MeetingRequests";

module.exports = async function (context, req) {
  const { date, time, message } = req.body || {};

  if (!date || !time) {
    context.res = {
      status: 400,
      body: { error: "Date and time are required." }
    };
    return;
  }

  try {
    const container = client.database(databaseId).container(containerId);

    const newRequest = {
      id: Date.now().toString(),
      date,
      time,
      message: message || "",
      status: "pending",
      requestedAt: new Date().toISOString()
    };

    await container.items.create(newRequest);
    context.log("✅ Meeting request saved to Cosmos DB:", newRequest);

    context.res = {
      status: 201,
      body: { message: "Meeting request submitted successfully." }
    };
  } catch (err) {
    context.log.error("❌ Error saving meeting request:", err.message);
    context.res = {
      status: 500,
      body: { error: "Failed to submit meeting request." }
    };
  }
};


