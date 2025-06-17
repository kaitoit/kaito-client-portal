const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");

const endpoint = process.env.OPENAI_ENDPOINT;
const apiKey = process.env.OPENAI_KEY;
const deployment = process.env.OPENAI_DEPLOYMENT_ID; // e.g., "gpt-35-turbo"

const client = new OpenAIClient(endpoint, new AzureKeyCredential(apiKey));

module.exports = async function (context, req) {
  const { message } = req.body;

  if (!message) {
    context.res = {
      status: 400,
      body: { error: "Message is required" },
    };
    return;
  }

  try {
    const chatCompletion = await client.getChatCompletions(deployment, [
      { role: "system", content: "You are a helpful support assistant." },
      { role: "user", content: message },
    ]);

    const reply = chatCompletion.choices[0].message.content;

    context.res = {
      status: 200,
      body: { reply },
    };
  } catch (err) {
    context.log("OpenAI error:", err.message);
    context.res = {
      status: 500,
      body: { error: "Chat assistant failed." },
    };
  }
};
