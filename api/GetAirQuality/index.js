const fetch = require("node-fetch");

module.exports = async function (context, req) {
  try {
    const apiKey = process.env.OPENAQ_API_KEY;
    if (!apiKey) {
      context.res = { status: 500, body: { error: "Missing OPENAQ_API_KEY" } };
      return;
    }

    const lat = Number(req.query.lat || 21.0152);
    const lon = Number(req.query.lon || 105.7999);

    /* =============================
       1️⃣ LOCATION
    ============================== */
    const locUrl =
      `https://api.openaq.org/v3/locations` +
      `?coordinates=${lat},${lon}` +
      `&radius=10000&limit=1`;

    const locRes = await fetch(locUrl, {
      headers: { "X-API-Key": apiKey }
    });
    const locData = await locRes.json();

    if (!locData.results?.length) {
      context.res = { status: 200, body: { message: "No location found" } };
      return;
    }

    const location = locData.results[0];

    /* =============================
       2️⃣ SENSOR (PM2.5)
    ============================== */
    const sensor = location.sensors.find(
      s => s.parameter?.name === "pm25"
    );

    if (!sensor) {
      context.res = {
        status: 200,
        body: { message: "No PM2.5 sensor found", location }
      };
      return;
    }

    const sensorId = sensor.id;

    /* =============================
       3️⃣ MEASUREMENTS
    ============================== */
    const meaUrl =
      `https://api.openaq.org/v3/measurements` +
      `?sensor_id=${sensorId}` +
      `&limit=24&sort=desc`;

    const meaRes = await fetch(meaUrl, {
      headers: { "X-API-Key": apiKey }
    });

    if (!meaRes.ok) {
      const t = await meaRes.text();
      throw new Error("Measurements fetch failed: " + t);
    }

    const meaData = await meaRes.json();

    /* =============================
       4️⃣ RESPONSE
    ============================== */
    context.res = {
      status: 200,
      body: {
        message: "Air quality OK ✅",
        input: { lat, lon },
        station: {
          name: location.name,
          country: location.country.code,
          coordinates: location.coordinates
        },
        sensor: {
          id: sensorId,
          parameter: "pm25"
        },
        measurements: meaData.results
      }
    };

  } catch (err) {
    context.log("API error:", err);
    context.res = {
      status: 500,
      body: {
        error: "Internal Server Error",
        detail: err.message
      }
    };
  }
};
