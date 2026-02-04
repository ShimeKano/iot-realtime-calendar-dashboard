const fetch = require("node-fetch");

module.exports = async function (context, req) {
  try {
    const apiKey = process.env.OPENAQ_API_KEY;
    if (!apiKey) {
      context.res = { status: 500, body: { error: "Missing OPENAQ_API_KEY" } };
      return;
    }

    // Mặc định Hà Nội
    const lat = Number(req.query.lat || 21.0152);
    const lon = Number(req.query.lon || 105.7999);

    /* =============================
       1️⃣ LẤY LOCATION GẦN NHẤT
    ============================== */
    const locationUrl =
      `https://api.openaq.org/v3/locations` +
      `?coordinates=${lat},${lon}` +
      `&radius=10000` +
      `&limit=1`;

    const locRes = await fetch(locationUrl, {
      headers: { "X-API-Key": apiKey }
    });

    if (!locRes.ok) {
      const t = await locRes.text();
      throw new Error("Location fetch failed: " + t);
    }

    const locData = await locRes.json();
    if (!locData.results || locData.results.length === 0) {
      context.res = {
        status: 200,
        body: { message: "No nearby location found" }
      };
      return;
    }

    const location = locData.results[0];
    const locationId = location.id;

    /* =============================
       2️⃣ LẤY MEASUREMENTS
    ============================== */
    const measureUrl =
      `https://api.openaq.org/v3/measurements` +
      `?location_id=${locationId}` +
      `&parameter=pm25` +
      `&limit=24` +
      `&sort=desc`;

    const meaRes = await fetch(measureUrl, {
      headers: { "X-API-Key": apiKey }
    });

    if (!meaRes.ok) {
      const t = await meaRes.text();
      throw new Error("Measurements fetch failed: " + t);
    }

    const meaData = await meaRes.json();

    /* =============================
       3️⃣ RESPONSE GỘP
    ============================== */
    context.res = {
      status: 200,
      body: {
        message: "Air quality data OK ✅",
        inputLocation: { lat, lon },
        station: {
          id: location.id,
          name: location.name,
          country: location.country.code,
          coordinates: location.coordinates
        },
        measurements: meaData.results
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
