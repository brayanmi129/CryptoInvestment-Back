const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cron = require("node-cron");
const { actualizarCriptosEnDB } = require("./services/cryptoService.js");
const app = express();
dotenv.config();

const routes = require("./routers/routes.js");

const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://cryptoinvestment.azurewebsites.net",
      "http://localhost:3000",
    ],

    credentials: true,
  })
);

app.use("/api", routes);

app.use(express.static("dist"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/dist/index.html");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
