module.exports = async function (context, req) {
  context.res = {
    status: 200,
    body: {
      message: "GetMeasurements is alive 🚀",
      query: req.query
    }
  };
};
