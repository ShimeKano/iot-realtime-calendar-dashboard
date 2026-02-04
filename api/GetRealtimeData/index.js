const fetch = require("node-fetch");
const { TableClient } = require("@azure/data-tables");

module.exports = async function (context, req) {
  try {
    const AQI_KEY = process.env.AQICN_API_KEY;
    const STORAGE = process.env.AZURE_STORAGE_CONNECTION_STRING;

    if (!AQI_KEY || !STORAGE) {
      context.res = {
        status: 500,
        body: { error: "Missing AQICN_API_KEY or AZURE_STORAGE_CONNECTION_STRING" }
      };
      return;
    }

    const lat = req.query.lat || "21.0152";
    const lon = req.query.lon || "105.7999";

    const url = `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${AQI_KEY}`;
    const response = await fetch(url);
    const json = await response.json();

    if (json.status !== "ok") {
      throw new Error("AQICN API returned error");
    }

    const data = json.data;

    // ===== SAVE TO TABLE STORAGE =====
    const tableClient = TableClient.fromConnectionString(
      STORAGE,
      "AQIHistory"
    );

    const timeISO = data.time.iso;              // 2026-02-04T15:00:00+07:00
    const date = timeISO.split("T")[0];         // YYYY-MM-DD

    const entity = {
      partitionKey: date,
      rowKey: timeISO,

      aqi: data.aqi,
      dominentpol: data.dominentpol ?? null,

      pm25: data.iaqi?.pm25?.v ?? null,
      temp: data.iaqi?.t?.v ?? null,
      humidity: data.iaqi?.h?.v ?? null,
      pressure: data.iaqi?.p?.v ?? null,
      wind: data.iaqi?.w?.v ?? null,
      windgust: data.iaqi?.wg?.v ?? null,
      dew: data.iaqi?.dew?.v ?? null
    };

    await tableClient.upsertEntity(entity);

    // ===== FULL RESPONSE (GIỐNG AQICN) =====
    context.res = {
      status: 200,
      body: {
        message: "Realtime AQI fetched 🚀",
        location: {
          lat,
          lon
        },
        aqi: data.aqi,
        dominentpol: data.dominentpol,
        iaqi: data.iaqi,
        time: data.time
      }
    };

  } catch (err) {
    context.log(err);
    context.res = {
      status: 500,
      body: {
        error: "Realtime AQI fetch failed",
        detail: err.message
      }
    };
  }
};
