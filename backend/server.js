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
  patchProductionInfo,
  patchStopStatus,
} = require("./controllers/line.controller");

app.get("/getLines", getLines);
app.post("/addLine", addLine);
app.put("/editLine/:code", editLine);
app.delete("/deleteLine/:code", deleteLine);
app.patch("/patchProductionInfo/:code", patchProductionInfo);
app.patch("/patchStopStatus/:code", patchStopStatus);

// Stop Reason Maintenance
const { 
  getStopReasons,
  addStopReason,
  editStopReason,
  deleteStopReason
} = require("./controllers/stop_reason.controller");

app.get("/getStopReasons", getStopReasons);
app.post("/addStopReason", addStopReason);
app.put("/editStopReason/:code", editStopReason);
app.delete("/deleteStopReason/:code", deleteStopReason);

app.listen(process.env.PORT, () => {
  console.log("Server running");
});
