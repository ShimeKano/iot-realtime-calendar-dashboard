const fetch = require("node-fetch");

global.aqiHistory = global.aqiHistory || [];

module.exports = async function (context, req) {
  try {
    const token = process.env.AQICN_API_KEY;
    const lat = req.query.lat || "21.0152";
    const lon = req.query.lon || "105.7999";

    const url = `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${token}`;
    const res = await fetch(url);
    const json = await res.json();

    if (json.status !== "ok") {
      throw new Error("AQICN error");
    }

    const data = {
      time: new Date().toISOString(),
      aqi: json.data.aqi,
      pm25: json.data.iaqi?.pm25?.v ?? null,
      temp: json.data.iaqi?.t?.v ?? null,
    };

    // 🔥 LƯU LỊCH SỬ
    global.aqiHistory.push(data);

    // giới hạn 500 điểm (tránh phình RAM)
    if (global.aqiHistory.length > 500) {
      global.aqiHistory.shift();
    }

    context.res = {
      status: 200,
      body: {
        message: "Realtime AQI fetched 🚀",
        data,
      },
    };
  } catch (err) {
    context.res = {
      status: 500,
      body: { error: err.message },
    };
  }
};
