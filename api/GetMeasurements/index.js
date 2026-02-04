module.exports = async function (context, req) {
  try {
    const apiKey = process.env.OPENAQ_API_KEY;
    if (!apiKey) {
      context.res = { status: 500, body: { error: "Missing OPENAQ_API_KEY" } };
      return;
    }

    // Default location: Hà Nội (cái bro đang test)
    const lat = parseFloat(req.query.lat || 21.0152);
    const lon = parseFloat(req.query.lon || 105.7999);

    /* --------------------------------------------------
       1️⃣ LẤY LOCATION GẦN NHẤT
    -------------------------------------------------- */
    const locationUrl =
      `https://api.openaq.org/v3/locations` +
      `?coordinates=${lat},${lon}` +
      `&radius=10000` +
      `&limit=1`;

    const locRes = await fetch(locationUrl, {
      headers: { "X-API-Key": apiKey }
    });

    if (!locRes.ok) {
      throw new Error("Failed to fetch location");
    }

    const locData = await locRes.json();
    const location = locData.results?.[0];

    if (!location || !location.sensors?.length) {
      context.res = {
        status: 200,
        body: {
          message: "No sensors found at this location",
          location
        }
      };
      return;
    }

    /* --------------------------------------------------
       2️⃣ SCAN TẤT CẢ SENSORS → TÌM CÁI CÓ MEASUREMENTS
    -------------------------------------------------- */
    const measurements = [];

    for (const sensor of location.sensors) {
      const sensorId = sensor.id;

      const mUrl =
        `https://api.openaq.org/v3/measurements` +
        `?sensor_id=${sensorId}` +
        `&limit=1` +
        `&sort=desc`;

      try {
        const mRes = await fetch(mUrl, {
          headers: { "X-API-Key": apiKey }
        });

        if (!mRes.ok) continue;

        const mData = await mRes.json();

        if (mData.results && mData.results.length > 0) {
          measurements.push({
            sensorId,
            parameter: sensor.parameter?.name,
            unit: sensor.parameter?.units,
            value: mData.results[0].value,
            datetime: mData.results[0].datetime
          });
        }
      } catch (err) {
        // sensor này lỗi thì bỏ qua, không làm sập API
        context.log(`Sensor ${sensorId} skipped`);
      }
    }

    /* --------------------------------------------------
       3️⃣ RESPONSE
    -------------------------------------------------- */
    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: {
        message: "GetMeasurements API is alive 🚀",
        input: { lat, lon },
        location: {
          id: location.id,
          name: location.name,
          country: location.country?.code,
          coordinates: location.coordinates
        },
        measurementsFound: measurements.length,
        measurements
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
