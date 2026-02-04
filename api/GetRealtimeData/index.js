module.exports = async function (context, req) {
  try {
    const token = process.env.AQICN_API_KEY;
    if (!token) {
      context.res = { status: 500, body: { error: "Missing AQICN_API_KEY" } };
      return;
    }

    const lat = req.query.lat || 21.0152;
    const lon = req.query.lon || 105.7999;

    const url = `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${token}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.status !== "ok") {
      throw new Error(JSON.stringify(data));
    }

    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: {
        message: "Realtime AQI fetched 🚀",
        location: { lat, lon },
        aqi: data.data.aqi,
        dominentpol: data.data.dominentpol,
        iaqi: data.data.iaqi,
        time: data.data.time
      }
    };
  } catch (err) {
    context.log("Realtime error:", err);
    context.res = {
      status: 500,
      body: { error: "Internal Server Error", detail: err.message }
    };
  }
};
