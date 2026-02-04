export default async function (context, req) {
  const date = req.query.date;

  if (!date) {
    context.res = {
      status: 400,
      body: { error: "Missing date parameter (YYYY-MM-DD)" }
    };
    return;
  }

  const url = `https://api.openaq.org/v3/measurements?date_from=${date}T00:00:00Z&date_to=${date}T23:59:59Z&limit=10`;

  try {
    const response = await fetch(url, {
      headers: {
        "X-API-Key": process.env.OPENAQ_API_KEY
      }
    });

    const data = await response.json();

    context.res = {
      headers: { "Content-Type": "application/json" },
      body: {
        date,
        count: data.results.length,
        samples: data.results.map(item => ({
          location: item.location?.name,
          parameter: item.parameter,
          value: item.value,
          unit: item.unit,
          time: item.date.utc
        }))
      }
    };
  } catch (err) {
    context.res = {
      status: 500,
      body: { error: "Failed to fetch OpenAQ v3 data" }
    };
  }
}
