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

    // mặc định location Hà Nội (bro dùng)
    const lat = req.query.lat || 21.0152;
    const lon = req.query.lon || 105.7999;

    // tìm location gần nhất
    const locationUrl =
      `https://api.openaq.org/v3/locations` +
      `?coordinates=${lat},${lon}` +
      `&radius=10000` +
      `&limit=1`;

    const locationRes = await fetch(locationUrl, {
      headers: {
        "X-API-Key": apiKey
      }
    });

    if (!locationRes.ok) {
      const text = await locationRes.text();
      context.log("Location API error:", text);
      throw new Error("Failed to fetch location");
    }

    const locationData = await locationRes.json();
    const location = locationData.results?.[0];

    if (!location) {
      context.res = {
        status: 404,
        body: { error: "No nearby location found" }
      };
      return;
    }

    // gọi measurements theo location id
    const measurementsUrl =
      `https://api.openaq.org/v3/measurements` +
      `?location_id=${location.id}` +
      `&limit=100` +
      `&sort=desc`;

    const measurementsRes = await fetch(measurementsUrl, {
      headers: {
        "X-API-Key": apiKey
      }
    });

    if (!measurementsRes.ok) {
      const text = await measurementsRes.text();
      context.log("Measurements API error:", text);
      throw new Error("Failed to fetch measurements");
    }

    const measurementsData = await measurementsRes.json();

    context.res = {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        message: "GetMeasurements API OK ✅",
        location: {
          id: location.id,
          name: location.name,
          lat: location.coordinates.latitude,
          lon: location.coordinates.longitude
        },
        measurements: measurementsData.results
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
