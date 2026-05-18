require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// const lineRoute = require("./routes/line.route");
// app.use("/lines", lineRoute);

// Line Maintenance
const {
  getLines,
  addLine,
  editLine,
  deleteLine,
} = require("./controllers/line.controller");

app.get("/getLines", getLines);
app.post("/addLine", addLine);
app.put("/editLine/:code", editLine);
app.delete("/deleteLine/:code", deleteLine);

// Stop Reason Maintenance
const { getStopReasons } = require("./controllers/stop_reason.controller");
app.get("/getStopReasons", getStopReasons);

app.listen(process.env.PORT, () => {
  console.log("Server running");
});
