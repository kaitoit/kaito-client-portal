module.exports = async function (context, req) {
  const userMessage = req.body?.message;

  if (!userMessage) {
    context.res = {
      status: 400,
      body: { error: "Message is required." }
    };
    return;
  }

  // Simulated ChatGPT response
  const reply = `You said: ${userMessage}`;

  context.res = {
    status: 200,
    body: { reply }
  };
};
