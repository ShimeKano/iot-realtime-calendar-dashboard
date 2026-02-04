const fetch = require("node-fetch");

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

    const lat = req.query.lat || 21.0152;
    const lon = req.query.lon || 105.7999;

    const url =
      `https://api.openaq.org/v3/measurements` +
      `?coordinates=${lat},${lon}` +
      `&radius=10000` +
      `&parameter=pm25` +
      `&limit=20` +
      `&sort=desc`;

    const response = await fetch(url, {
      headers: {
        "X-API-Key": apiKey,
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      const text = await response.text();
      context.log("OpenAQ error:", text);
      throw new Error("Failed to fetch measurements");
    }

    const data = await response.json();

    context.res = {
      status: 200,
      body: {
        message: "GetMeasurements OK ✅",
        location: { lat, lon },
        count: data.results.length,
        measurements: data.results
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
