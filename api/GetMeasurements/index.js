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

    // Query params
    const locationId = req.query.locationId;
    const parameter = req.query.parameter || "pm25";
    const dateFrom = req.query.date_from;
    const dateTo = req.query.date_to;

    if (!locationId) {
      context.res = {
        status: 400,
        body: { error: "Missing locationId" }
      };
      return;
    }

    const url =
      `https://api.openaq.org/v3/measurements` +
      `?location_id=${locationId}` +
      `&parameter=${parameter}` +
      `&date_from=${dateFrom}` +
      `&date_to=${dateTo}` +
      `&limit=100` +
      `&sort=desc`;

    const response = await fetch(url, {
      headers: {
        "X-API-Key": apiKey
      }
    });

    if (!response.ok) {
      const text = await response.text();
      context.log("OpenAQ error:", text);
      throw new Error("OpenAQ measurements API failed");
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
    context.log("Function error:", err.message);
    context.res = {
      status: 500,
      body: {
        error: "Internal Server Error",
        detail: err.message
      }
    };
  }
};
