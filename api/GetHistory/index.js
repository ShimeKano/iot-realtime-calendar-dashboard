const { TableClient } = require("@azure/data-tables");

module.exports = async function (context, req) {
  try {
    const STORAGE_CONN = process.env.AZURE_STORAGE_CONNECTION_STRING;

    if (!STORAGE_CONN) {
      context.res = {
        status: 500,
        body: { error: "Missing AZURE_STORAGE_CONNECTION_STRING" }
      };
      return;
    }

    const tableClient = TableClient.fromConnectionString(
      STORAGE_CONN,
      "AQIHistory"
    );

    const date = req.query.date; // YYYY-MM-DD

    let entities = [];

    /* ===============================
       1️⃣ ĐỌC DATA
       =============================== */
    if (date) {
      const filter = `PartitionKey eq '${date}'`;
      for await (const e of tableClient.listEntities({
        queryOptions: { filter }
      })) {
        entities.push(e);
      }
    } else {
      // fallback: lấy 100 bản ghi gần nhất
      let count = 0;
      for await (const e of tableClient.listEntities()) {
        entities.push(e);
        count++;
        if (count >= 100) break;
      }
    }

    /* ===============================
       2️⃣ SORT AN TOÀN (THEO RowKey)
       =============================== */
    entities.sort((a, b) => {
      if (!a.rowKey || !b.rowKey) return 0;
      return a.rowKey.localeCompare(b.rowKey);
    });

    /* ===============================
       3️⃣ FORMAT CHO FRONTEND
       =============================== */
    const data = entities.map(e => ({
      time: e.rowKey?.split("_")[0] ?? null,
      aqi: e.aqi ?? null,
      pm25: e.pm25 ?? null,
      temp: e.temp ?? null,
      humidity: e.humidity ?? null,
      pressure: e.pressure ?? null,
      wind: e.wind ?? null
    }));

    context.res = {
      status: 200,
      body: {
        message: "AQI history fetched 📈",
        count: data.length,
        data
      }
    };

  } catch (err) {
    context.log(err);
    context.res = {
      status: 500,
      body: {
        error: "Failed to read history",
        detail: err.message
      }
    };
  }
};
