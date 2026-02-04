const fetch = require("node-fetch");

module.exports = async function (context, req) {
  try {
    const apiKey = process.env.OPENAQ_API_KEY;
    const city = req.query.city;
    const date = req.query.date;

    if (!city || !date) {
      context.res = {
        status: 400,
        body: { error: "Missing city or date parameter" }
      };
      return;
    }

    // Form query for OpenAQ v3
    const url = `https://api.openaq.org/v3/measurements?city=${encodeURIComponent(
      city
    )}&date_from=${date}T00:00:00Z&date_to=${date}T23:59:59Z&limit=1000`;

    const response = await fetch(url, {
      headers: {
        "X-API-Key": apiKey
      }
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error("OpenAQ API failed: " + text);
    }

    const data = await response.json();

    // Return only "results" array
    context.res = {
      status: 200,
      body: data.results
    };
  } catch (err) {
    context.res = {
      status: 500,
      body: {
        error: err.message
      }
    };
  }
};
