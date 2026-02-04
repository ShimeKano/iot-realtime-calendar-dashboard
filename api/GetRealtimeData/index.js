const fetch = require("node-fetch");

module.exports = async function (context, req) {
  try {
    const date = req.query.date || "2024-01-01";
    const apiKey = process.env.OPENAQ_API_KEY;

    if (!apiKey) {
      context.res = {
        status: 500,
        body: { error: "Missing OPENAQ_API_KEY" }
      };
      return;
    }

    const url =
      "https://api.openaq.org/v3/measurements" +
      "?country=VN" +
      "&parameter=pm25" +
      "&limit=5";

    const response = await fetch(url, {
      headers: {
        "X-API-Key": apiKey
      }
    });

    const data = await response.json();

    context.res = {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        date,
        count: data.results?.length || 0,
        samples: data.results || []
      }
    };
  } catch (err) {
    context.res = {
      status: 500,
      body: {
        error: "Server error",
        message: err.message
      }
    };
  }
};
