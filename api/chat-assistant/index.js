const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

module.exports = async function (context, req) {
  const userMessage = req.body?.message;

  if (!userMessage) {
    context.res = {
      status: 400,
      body: { error: "Missing message in request body." }
    };
    return;
  }

  try {
    const chatResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful support assistant." },
        { role: "user", content: userMessage }
      ]
    });

    const reply = chatResponse.data.choices[0].message.content;

    context.res = {
      status: 200,
      body: { reply }
    };
  } catch (err) {
    context.log("❌ OpenAI error:", err.message);
    context.res = {
      status: 500,
      body: { error: "Failed to get response from ChatGPT." }
    };
  }
};
