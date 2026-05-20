const { sql, pool, poolConnect } = require("../db");

let mockStopReasons = [
  {
    code: "ST1",
    name: "Machine Malfunction",
    order: 1,
    active: true,
    color: "#CC539A",
  },
  {
    code: "ST2",
    name: "Change the Mold",
    order: 2,
    active: true,
    color: "#00A5B1",
  },
  {
    code: "ST3",
    name: "Abnormal Material",
    order: 3,
    active: true,
    color: "#3554BF",
  },
  {
    code: "ST4",
    name: "Quality Anomaly",
    order: 4,
    active: true,
    color: "#ffd700db",
  },
];

const getStopReasons = async (req, res) => {
  try {
    res.json(mockStopReasons);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

const addStopReason = async (req, res) => {
  try {
    const newData = req.body;
    console.log("Mock API received new stop reason:", newData);

    mockStopReasons.push(newData);

    res.json({
      status: "success",
      message: "Stop reason added successfully",
      data: newData,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const editStopReason = async (req, res) => {
  try {
    const code = req.params.code;
    const updatedData = req.body;
    console.log(`Mock API received update for stop reason ${code}:`, updatedData);

    const index = mockStopReasons.findIndex(r => r.code === code);
    if (index !== -1) {
      mockStopReasons[index] = { ...mockStopReasons[index], ...updatedData };
    } else {
      return res.status(404).json({ error: "Stop reason not found" });
    }

    res.json({
      status: "success",
      message: `Stop reason ${code} updated successfully`,
      data: mockStopReasons[index],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteStopReason = async (req, res) => {
  try {
    const code = req.params.code;
    console.log(`Mock API received request to delete stop reason ${code}`);

    const initialLength = mockStopReasons.length;
    mockStopReasons = mockStopReasons.filter(r => r.code !== code);

    if (mockStopReasons.length === initialLength) {
      return res.status(404).json({ error: "Stop reason not found" });
    }

    res.json({
      status: "success",
      message: `Stop reason ${code} deleted successfully`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getStopReasons,
  addStopReason,
  editStopReason,
  deleteStopReason,
};
