const { sql, pool, poolConnect } = require("../db");

let mockLines = [
  {
    slug: "ARM1",
    code: "ARM1",
    name: "ARM1",
    displayName: "Assembly Line 1",
    ipAddress: "192.168.1.101",
    plcBrand: "Omron",
    displayOrder: 1,
    isActive: true,
    dashboardSwitchSeconds: 10,
    graphSwitchSeconds: 10,
    imageSwitchSeconds: 5,
    productionDate: "2026-05-06",
    currentPartCode: "8978348640",
    planQty: 500,
    actualQty: 120,
    operatorCount: 4,
    shift: "Morning 06:00–14:00",
    supervisor: "Somchai W.",
    dashboardTitle: "ARM1",
    productCode: "8978348640",
    productionStart: "13:50",
    productionCompleted: "00:00",
    planningTime: "4.9H",
    actualTimeTaken: "1.1H",
    productiveTarget: 245,
    productiveActual: 256,
    stopSummary: [
      { name: "Machine Malfunction", hours: "0H", color: "pink" },
      { name: "Change the Mold", hours: "0.2H", color: "cyan" },
      { name: "Abnormal Material", hours: "0H", color: "blue" },
      { name: "Quality Anomaly", hours: "0H", color: "yellow" },
    ],
    partImageSrc: "",
    currentStopReasonCode: "",
    currentStopReason: "",
  },
  {
    slug: "ARM2",
    code: "ARM2",
    name: "ARM2",
    displayName: "Assembly Line 2",
    ipAddress: "192.168.1.102",
    plcBrand: "Omron",
    displayOrder: 2,
    isActive: true,
    dashboardSwitchSeconds: 10,
    graphSwitchSeconds: 10,
    imageSwitchSeconds: 5,
    productionDate: "2026-05-06",
    currentPartCode: "8978348650",
    planQty: 450,
    actualQty: 210,
    operatorCount: 5,
    shift: "Morning 06:00–14:00",
    supervisor: "Suda K.",
    dashboardTitle: "ARM2",
    productCode: "8978348640",
    productionStart: "14:20",
    productionCompleted: "00:00",
    planningTime: "5.2H",
    actualTimeTaken: "2.0H",
    productiveTarget: 220,
    productiveActual: 214,
    stopSummary: [
      { name: "Machine Malfunction", hours: "0.3H", color: "pink" },
      { name: "Change the Mold", hours: "0H", color: "cyan" },
      { name: "Abnormal Material", hours: "0.1H", color: "blue" },
      { name: "Quality Anomaly", hours: "0H", color: "yellow" },
    ],
    partImageSrc: "",
    currentStopReasonCode: "",
    currentStopReason: "",
  },
];

const getLines = async (req, res) => {
  try {
    res.json(mockLines);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

const addLine = async (req, res) => {
  try {
    const newData = req.body;
    console.log("Mock API received new line data:", newData);

    // Default values if missing
    if (!newData.slug) newData.slug = newData.code;
    mockLines.push(newData);

    res.json({
      status: "success",
      message: "Line added successfully (mock response)",
      data: newData,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const editLine = async (req, res) => {
  try {
    const code = req.params.code;
    const updatedData = req.body;
    console.log(`Mock API received update for line ${code}:`, updatedData);

    const index = mockLines.findIndex(
      (line) => line.code === code || line.slug === code,
    );
    if (index !== -1) {
      mockLines[index] = { ...mockLines[index], ...updatedData };
    } else {
      return res.status(404).json({ error: "Line not found" });
    }

    res.json({
      status: "success",
      message: `Line ${code} updated successfully (mock response)`,
      data: mockLines[index],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteLine = async (req, res) => {
  try {
    const code = req.params.code;
    console.log(`Mock API received request to delete line ${code}`);

    const initialLength = mockLines.length;
    mockLines = mockLines.filter(
      (line) => line.code !== code && line.slug !== code,
    );

    if (mockLines.length === initialLength) {
      return res.status(404).json({ error: "Line not found" });
    }

    res.json({
      status: "success",
      message: `Line ${code} deleted successfully (mock response)`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const patchProductionInfo = async (req, res) => {
  try {
    const code = req.params.code;
    const { operatorCount, planningTimeHours, planningTime, partImageSrc } =
      req.body;
    console.log(`Mock API received production info update for line ${code}`);

    const line = mockLines.find((l) => l.code === code || l.slug === code);
    if (!line) {
      return res.status(404).json({ error: "Line not found" });
    }

    if (operatorCount !== undefined) line.operatorCount = operatorCount;
    if (planningTimeHours !== undefined)
      line.planningTimeHours = planningTimeHours;
    if (planningTime !== undefined) line.planningTime = planningTime;
    if (partImageSrc !== undefined) line.partImageSrc = partImageSrc;

    res.json({
      status: "success",
      message: `Production info for ${code} updated successfully`,
      data: line,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const patchStopStatus = async (req, res) => {
  try {
    const code = req.params.code;
    const { currentStopReasonCode, currentStopReason } = req.body;
    console.log(
      `Mock API received stop status update for line ${code} -> ${currentStopReasonCode || "RUNNING"}`,
    );

    const line = mockLines.find((l) => l.code === code || l.slug === code);
    if (!line) {
      return res.status(404).json({ error: "Line not found" });
    }

    line.currentStopReasonCode = currentStopReasonCode || "";
    line.currentStopReason = currentStopReason || "";

    res.json({
      status: "success",
      message: `Stop status for ${code} updated successfully`,
      data: line,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getLines,
  addLine,
  editLine,
  deleteLine,
  patchProductionInfo,
  patchStopStatus,
};
