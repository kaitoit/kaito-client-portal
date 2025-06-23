const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = async function (context, req) {
  try {
    const message = req.body?.message;
    if (!message) {
      context.res = { status: 400, body: { error: "Message is required." } };
      return;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: message },
      ],
    });

    context.res = {
      status: 200,
      body: { reply: completion.choices[0].message.content },
    };
  } catch (error) {
    context.log.error("OpenAI error:", error);
    context.res = {
      status: 500,
      body: { error: error.message },
    };
  }
};
