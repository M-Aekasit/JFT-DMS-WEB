const { sql, pool, poolConnect } = require("../db");

const getStopReasons = async (req, res) => {
  try {
    // await poolConnect

    // const result = await pool.request()
    //   .query('SELECT * FROM tbm_Metal')

    // res.json(result.recordset)

    const result = [
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

    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

module.exports = {
  getStopReasons,
};
