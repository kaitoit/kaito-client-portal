// api/chat-assistant/index.js
require("dotenv").config(); // Important for local use

const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = async function (context, req) {
  context.log("🔁 Request received:", req.body);

  try {
    const message = req.body?.message;

    if (!message) {
      context.res = {
        status: 400,
        body: { error: "No message provided." },
      };
      return;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a helpful IT assistant." },
        { role: "user", content: message },
      ],
    });

    const reply = completion.choices?.[0]?.message?.content ?? "No response.";

    context.res = {
      status: 200,
      body: { reply },
    };
  } catch (error) {
    context.log("❌ ChatGPT Error:", error.response?.data || error.message);
    context.res = {
      status: 500,
      body: { error: "ChatGPT function failed: " + error.message },
    };
  }
};
