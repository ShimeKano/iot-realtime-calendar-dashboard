export async function run(context, req) {
  return {
    status: 200,
    body: {
      message: "GetRealtimeData API is alive 🚀",
      hasApiKey: !!process.env.OPENAQ_API_KEY
    }
  };
}
