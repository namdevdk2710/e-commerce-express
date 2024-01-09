const app = require("./src/app");

const PORT = process.env.APP_PORT || 3000;

const server = app.listen(3000, () => {
  console.log(`Listening on port ${PORT}`);
});

process.on("SIGINT", () => {
  server.close(() => console.log("Exit server"));
});
