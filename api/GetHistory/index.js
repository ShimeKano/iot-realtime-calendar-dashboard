const { TableClient } = require("@azure/data-tables");

module.exports = async function (context, req) {
  try {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    const tableName = "AQIHistory";

    if (!connectionString) {
      context.res = {
        status: 500,
        body: { error: "Missing AZURE_STORAGE_CONNECTION_STRING" }
      };
      return;
    }

    const date = req.query.date; 
    // YYYY-MM-DD (vd: 2026-02-04)

    const tableClient = TableClient.fromConnectionString(
      connectionString,
      tableName
    );

    let entities = [];

    if (date) {
      // 🔍 Query theo ngày
      const filter = `PartitionKey eq '${date}'`;

      for await (const entity of tableClient.listEntities({
        queryOptions: { filter }
      })) {
        entities.push(entity);
      }
    } else {
      // 🔁 Không truyền date → lấy tối đa 100 bản ghi gần nhất
      let count = 0;
      for await (const entity of tableClient.listEntities()) {
        entities.push(entity);
        count++;
        if (count >= 100) break;
      }
    }

    // 🕒 Sort theo thời gian (RowKey là ISO time)
    entities.sort((a, b) => a.RowKey.localeCompare(b.RowKey));

    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: {
        message: "AQI history fetched 📈",
        count: entities.length,
        data: entities.map(e => ({
          date: e.PartitionKey,
          time: e.RowKey,
          aqi: e.aqi ?? null,
          pm25: e.pm25 ?? null,
          temp: e.temp ?? null,
          humidity: e.humidity ?? null
        }))
      }
    };
  } catch (err) {
    context.log.error(err);
    context.res = {
      status: 500,
      body: {
        error: "Failed to read history",
        detail: err.message
      }
    };
  }
};
