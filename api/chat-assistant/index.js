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
      body: { error: "Message is required." }
    };
    return;
  }

  try {
    const chatResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo", // or "gpt-4" if you're subscribed
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
    context.log("ChatGPT error:", err.message);
    context.res = {
      status: 500,
      body: { error: "ChatGPT API failed. Check server logs." }
    };
  }
};
