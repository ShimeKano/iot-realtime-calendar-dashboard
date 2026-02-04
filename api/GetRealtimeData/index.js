module.exports = async function (context, req) {
  context.res = {
    status: 200,
    body: {
      message: "GetRealtimeData API is alive 🚀",
      hasApiKey: !!process.env.OPENAQ_API_KEY
    }
  };
};
