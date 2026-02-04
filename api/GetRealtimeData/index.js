module.exports = async function (context, req) {
  try {
    const apiKey = process.env.OPENAQ_API_KEY;

    if (!apiKey) {
      context.res = {
        status: 500,
        body: { error: "Missing OPENAQ_API_KEY" }
      };
      return;
    }

    // 📍 Hà Nội – Cầu Giấy / Mỹ Đình
    const lat = 21.0152;
    const lon = 105.7999;

    const url =
      `https://api.openaq.org/v3/locations` +
      `?coordinates=${lat},${lon}` +
      `&radius=25000` +
      `&limit=1`;

    const response = await fetch(url, {
      headers: {
        "X-API-Key": apiKey
      }
    });

    if (!response.ok) {
      const text = await response.text();
      context.log("OpenAQ error:", text);
      throw new Error("OpenAQ API failed");
    }

    const data = await response.json();

    context.res = {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        message: "GetRealtimeData API is alive 🚀",
        location: {
          lat,
          lon
        },
        result: data.results[0] || null
      }
    };

  } catch (err) {
    context.log("Function error:", err);
    context.res = {
      status: 500,
      body: {
        error: "Internal Server Error",
        detail: err.message
      }
    };
  }
};
