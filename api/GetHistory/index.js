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
    // format: YYYY-MM-DD (vd: 2026-02-04)

    const tableClient = TableClient.fromConnectionString(
      connectionString,
      tableName
    );

    let entities = [];

    if (date) {
      const filter = `PartitionKey eq '${date}'`;
      for await (const entity of tableClient.listEntities({ queryOptions: { filter } })) {
        entities.push(entity);
      }
    } else {
      // nếu không truyền date → lấy 100 bản ghi mới nhất
      let count = 0;
      for await (const entity of tableClient.listEntities()) {
        entities.push(entity);
        count++;
        if (count >= 100) break;
      }
    }

    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: {
        count: entities.length,
        data: entities.map(e => ({
          time: e.RowKey,
          aqi: e.aqi,
          pm25: e.pm25,
          temp: e.temp,
          humidity: e.humidity
        }))
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
