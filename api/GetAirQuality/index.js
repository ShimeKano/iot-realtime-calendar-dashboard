module.exports = async function (context, req) {
  const date = req.query.date;
  const city = req.query.city || "Hanoi";

  if (!date) {
    context.res = {
      status: 400,
      body: {
        error: "Missing required parameter: date (YYYY-MM-DD)"
      }
    };
    return;
  }

  const url =
    `https://api.openaq.org/v2/measurements` +
    `?city=${encodeURIComponent(city)}` +
    `&date_from=${date}` +
    `&date_to=${date}` +
    `&limit=100`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    // Simplify data for frontend
    const results = data.results.map(item => ({
      date: item.date.utc.split("T")[0],
      hour: new Date(item.date.utc).getUTCHours(),
      parameter: item.parameter,
      value: item.value,
      unit: item.unit,
      location: item.location
    }));

    context.res = {
      headers: {
        "Content-Type": "application/json"
      },
      body: results
    };

  } catch (error) {
    context.res = {
      status: 500,
      body: {
        error: "Failed to fetch OpenAQ data",
        detail: error.message
      }
    };
  }
};
