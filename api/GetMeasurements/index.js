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

    // Lấy locationId từ query
    const locationId = req.query.locationId;

    if (!locationId) {
      context.res = {
        status: 400,
        body: { error: "Missing locationId" }
      };
      return;
    }

    // Tham số optional
    const parameter = req.query.parameter || "pm25";
    const limit = req.query.limit || 24;

    const url =
      `https://api.openaq.org/v3/measurements` +
      `?location_id=${locationId}` +
      `&parameter=${parameter}` +
      `&limit=${limit}` +
      `&sort=desc`;

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
        message: "GetMeasurements API is alive 🚀",
        locationId,
        parameter,
        count: data.results.length,
        results: data.results
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
