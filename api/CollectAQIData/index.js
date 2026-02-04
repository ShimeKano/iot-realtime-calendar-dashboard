const fetch = require("node-fetch");
const { TableClient } = require("@azure/data-tables");

module.exports = async function (context, myTimer) {
  const AQI_KEY = process.env.AQICN_API_KEY;
  const STORAGE = process.env.STORAGE_CONNECTION_STRING;

  if (!AQI_KEY || !STORAGE) {
    context.log("❌ Missing environment variables");
    return;
  }

  // 📍 Hà Nội (UNIS)
  const lat = 21.0152;
  const lon = 105.7999;

  const url = `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${AQI_KEY}`;

  try {
    const res = await fetch(url);
    const json = await res.json();

    if (json.status !== "ok") {
      throw new Error("AQICN API failed");
    }

    const data = json.data;
    const time = data.time.iso;

    // 🗄️ Azure Table Storage
    const tableClient = TableClient.fromConnectionString(
      STORAGE,
      "AQIHistory"
    );

    await tableClient.createTable().catch(() => {});

    const entity = {
      partitionKey: "HANOI",
      rowKey: new Date(time).getTime().toString(),

      lat,
      lon,
      aqi: data.aqi,
      dominentpol: data.dominentpol || "",

      pm25: data.iaqi?.pm25?.v ?? null,
      pm10: data.iaqi?.pm10?.v ?? null,
      temp: data.iaqi?.t?.v ?? null,
      humidity: data.iaqi?.h?.v ?? null,

      timestamp: time
    };

    await tableClient.createEntity(entity);

    context.log("✅ AQI stored:", entity);
  } catch (err) {
    context.log("❌ Timer error:", err.message);
  }
};
