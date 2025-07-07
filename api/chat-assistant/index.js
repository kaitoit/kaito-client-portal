if (process.env.NODE_ENV !== "production") {
  require("dotenv").config(); // only used locally
}

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

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

    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a helpful IT assistant." },
        { role: "user", content: message },
      ],
    });

    const reply = completion.data.choices?.[0]?.message?.content ?? "No response.";

    context.res = {
      status: 200,
      body: { reply },
    };
  } catch (error) {
    context.log("❌ ChatGPT Error:", error.response?.data || error.message || error);
    context.res = {
      status: 500,
      body: { error: "ChatGPT function failed: " + (error.message || "Unknown error") },
    };
  }
};
