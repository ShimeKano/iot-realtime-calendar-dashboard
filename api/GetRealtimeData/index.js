const fetch = require("node-fetch");
const { TableClient } = require("@azure/data-tables");

module.exports = async function (context, req) {
  try {
    // ===== 1️⃣ ENV =====
    const AQICN_KEY = process.env.AQICN_API_KEY;
    const STORAGE_CONN = process.env.AZURE_STORAGE_CONNECTION_STRING;

    const lat = req.query.lat;
    const lon = req.query.lon;

    if (!AQICN_KEY || !lat || !lon) {
      context.res = {
        status: 400,
        body: { error: "Missing AQICN_API_KEY or lat/lon" }
      };
      return;
    }

    // ===== 2️⃣ FETCH AQICN REALTIME =====
    const url = `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${AQICN_KEY}`;
    const res = await fetch(url);
    const json = await res.json();

    if (json.status !== "ok") {
      throw new Error("AQICN API failed");
    }

    const d = json.data;
    const iaqi = d.iaqi || {};
    const time = d.time || {};

    // ===== 3️⃣ CHUẨN HOÁ DATA =====
    const record = {
      aqi: d.aqi ?? null,
      dominentpol: d.dominentpol ?? null,

      pm25: iaqi.pm25?.v ?? null,
      temp: iaqi.t?.v ?? null,
      humidity: iaqi.h?.v ?? null,
      pressure: iaqi.p?.v ?? null,
      dew: iaqi.dew?.v ?? null,
      wind: iaqi.w?.v ?? null,
      windgust: iaqi.wg?.v ?? null,

      timeISO: time.iso ?? new Date().toISOString(),
      timeUnix: time.v ?? Math.floor(Date.now() / 1000),
      timezone: time.tz ?? "+07:00"
    };

    // ===== 4️⃣ GHI BIG DATA TIME-SERIES =====
    if (STORAGE_CONN) {
      const tableClient = TableClient.fromConnectionString(
        STORAGE_CONN,
        "AQIHistory"
      );

      // tạo table nếu chưa có
      await tableClient.createTable().catch(() => {});

      const dateKey = record.timeISO.slice(0, 10);

      // 🔥 FIX QUAN TRỌNG: ROWKEY KHÔNG BAO GIỜ TRÙNG
      const rowKey = `${record.timeISO}_${Date.now()}`;

      await tableClient.upsertEntity(
        {
          partitionKey: dateKey,
          rowKey: rowKey,

          aqi: record.aqi,
          dominentpol: record.dominentpol,

          pm25: record.pm25,
          temp: record.temp,
          humidity: record.humidity,
          pressure: record.pressure,
          dew: record.dew,
          wind: record.wind,
          windgust: record.windgust,

          timeISO: record.timeISO,
          timeUnix: record.timeUnix,
          timezone: record.timezone
        },
        "Replace"
      );
    }

    // ===== 5️⃣ RESPONSE REALTIME =====
    context.res = {
      status: 200,
      body: {
        message: "Realtime AQI fetched & stored 🚀",
        location: { lat, lon },
        ...record
      }
    };
  } catch (err) {
    context.log(err);
    context.res = {
      status: 500,
      body: {
        error: "Internal Server Error",
        detail: err.message
      }
    };
  }
};
