const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = async function (context, req) {
  const message = req.body?.message;

  if (!message) {
    context.res = {
      status: 400,
      body: { error: "Message is required." },
    };
    return;
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // or "gpt-4" if you're using GPT-4
      messages: [
        { role: "system", content: "You are a helpful assistant that helps users write better support tickets." },
        { role: "user", content: message },
      ],
    });

    context.res = {
      status: 200,
      body: {
        reply: response.choices[0].message.content,
      },
    };
  } catch (err) {
    context.log("OpenAI error:", err.message);
    context.res = {
      status: 500,
      body: { error: "Failed to communicate with ChatGPT." },
    };
  }
};
