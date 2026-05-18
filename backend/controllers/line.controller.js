const { sql, pool, poolConnect } = require("../db");

const getLines = async (req, res) => {
  try {
    // await poolConnect

    // const result = await pool.request()
    //   .query('SELECT * FROM tbm_Metal')

    // res.json(result.recordset)

    const result = [
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
        // dashboardTitle: "X2 MAIN LINE PRODUCTION",
        // productCode: "69830-0A140",
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
      },
    ];

    res.json(result);
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

    res.json({
      status: "success",
      message: "Line added successfully (mock response)",
      data: newData,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

const editLine = async (req, res) => {
  try {
    const code = req.params.code;
    const updatedData = req.body;
    console.log(`Mock API received update for line ${code}:`, updatedData);

    res.json({
      status: "success",
      message: `Line ${code} updated successfully (mock response)`,
      data: updatedData,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

const deleteLine = async (req, res) => {
  try {
    const code = req.params.code;
    console.log(`Mock API received request to delete line ${code}`);

    res.json({
      status: "success",
      message: `Line ${code} deleted successfully (mock response)`,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

module.exports = {
  getLines,
  addLine,
  editLine,
  deleteLine,
};
