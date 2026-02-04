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

    // 🔥 KHÁC REALTIME Ở ĐÂY
    const locationId = req.query.locationId;
    const date = req.query.date; // yyyy-mm-dd

    if (!locationId || !date) {
      context.res = {
        status: 400,
        body: { error: "Missing locationId or date" }
      };
      return;
    }

    const url =
      `https://api.openaq.org/v3/measurements` +
      `?location_id=${locationId}` +
      `&date_from=${date}` +
      `&date_to=${date}` +
      `&limit=100`;

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
      body: data
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
