const { CosmosClient } = require("@azure/cosmos");
const fetch = require("node-fetch");

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const client = new CosmosClient({ endpoint, key });

const databaseId = "SupportTickets";
const containerId = "MeetingRequests";

const teamsWebhookUrl = process.env.TEAMS_WEBHOOK_URL;

async function notifyTeams(meetingRequest) {
  if (!teamsWebhookUrl) return;

  const card = {
    "@type": "MessageCard",
    "@context": "http://schema.org/extensions",
    summary: "New Meeting Request",
    themeColor: "0076D7",
    title: "📅 New Teams Meeting Request",
    sections: [
      {
        facts: [
          { name: "Date", value: meetingRequest.date },
          { name: "Time", value: meetingRequest.time },
          { name: "Message", value: meetingRequest.message || "N/A" },
          { name: "Requested At", value: new Date(meetingRequest.requestedAt).toLocaleString() },
        ],
      },
    ],
  };

  try {
    await fetch(teamsWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(card),
    });
  } catch (err) {
    console.error("Failed to send Teams notification:", err.message);
  }
}

module.exports = async function (context, req) {
  const { date, time, message } = req.body;

  if (!date || !time) {
    context.res = {
      status: 400,
      body: "Date and time are required.",
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
      requestedAt: new Date().toISOString(),
    };

    await container.items.create(newRequest);
    await notifyTeams(newRequest);

    context.res = {
      status: 201,
      body: { message: "Meeting request submitted successfully." },
    };
  } catch (err) {
    context.log.error("Error submitting meeting request:", err.message);
    context.res = {
      status: 500,
      body: { error: "Failed to submit meeting request." },
    };
  }
};


