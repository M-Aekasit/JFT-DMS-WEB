import { useEffect, useMemo, useState } from "react";
import { percent } from "../../utils/format";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const DEFAULT_TARGET = 140;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, Number(value) || 0));
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString();
}

// สร้างแกนเวลาและโครงสร้างข้อมูลว่างๆ ไว้รอรับข้อมูล Real-time
function generateBaseData(intervalMin) {
  const data = [];
  const startMinutes = 8 * 60 + 30; // เริ่ม 08:30
  const endMinutes = startMinutes + 23 * 60; // จบ 07:30 วันถัดไป

  for (let m = startMinutes; m <= endMinutes; m += intervalMin) {
    const h = Math.floor(m / 60) % 24;
    const min = m % 60;
    const timeLabel = `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;

    data.push({
      time: timeLabel,
      target: DEFAULT_TARGET,
      actual: null, // ค่าเริ่มต้นเป็น null เพื่อไม่ให้กราฟวาดไปถึงอนาคต
      lossTime: null,
    });
  }
  return data;
}

// ─── KPI COMPONENTS (เหมือนเดิม แต่ปรับแต่งสีให้เข้า Theme) ───

function RingKpi({ value, title, lines, color = "#00c8ff" }) {
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const safeValue = clamp(value, 0, 200);
  const offset = circumference - (safeValue / 200) * circumference;

  return (
    <div className="daily-kpi-card">
      <div className="daily-donut-wrap">
        <svg width="140" height="140" viewBox="0 0 140 140">
          <circle cx="70" cy="70" r={radius} className="daily-donut-bg" />
          <circle
            cx="70"
            cy="70"
            r={radius}
            className="daily-donut-fg"
            style={{
              stroke: color,
              strokeDasharray: circumference,
              strokeDashoffset: offset,
            }}
          />
        </svg>
        <div className="daily-donut-label" style={{ color }}>
          {Math.round(value || 0)}%
        </div>
      </div>
      <div className="daily-kpi-info">
        <div className="daily-kpi-title">{title}</div>
        {lines.map((line) => (
          <div className="daily-kpi-line" key={line}>
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}

function LossTimeKpi({ line, stopReasons = [] }) {
  const items = [
    { name: "Machine", value: line.machineLossHr || "1Hr.", color: "#00c8ff" },
    {
      name: "Model Change",
      value: line.modeChangeLossHr || "1 Hr.",
      color: "#ff4444",
    },
    {
      name: "Quality",
      value: line.qualityLossHr || "0.5 Hr.",
      color: "#ffd700",
    },
    {
      name: "Part/Package",
      value: line.materialLossHr || "0 Hr.",
      color: "#ff8c00",
    },
  ];

  return (
    <div className="daily-loss-kpi-card">
      <div className="daily-loss-title">LOSS TIME</div>
      <div className="daily-loss-row">
        <div className="daily-loss-donut">
          <svg width="110" height="110" viewBox="0 0 110 110">
            <circle cx="55" cy="55" r="45" className="daily-loss-bg" />
            <circle
              cx="55"
              cy="55"
              r="45"
              className="daily-loss-seg"
              style={{
                stroke: items[0].color,
                strokeDasharray: "108 283",
                strokeDashoffset: "0",
              }}
            />
            <circle
              cx="55"
              cy="55"
              r="45"
              className="daily-loss-seg"
              style={{
                stroke: items[1].color,
                strokeDasharray: "108 283",
                strokeDashoffset: "-113",
              }}
            />
            <circle
              cx="55"
              cy="55"
              r="45"
              className="daily-loss-seg"
              style={{
                stroke: items[2].color,
                strokeDasharray: "30 283",
                strokeDashoffset: "-226",
              }}
            />
            <circle
              cx="55"
              cy="55"
              r="45"
              className="daily-loss-seg"
              style={{
                stroke: items[3].color,
                strokeDasharray: "20 283",
                strokeDashoffset: "-260",
              }}
            />
          </svg>
          <div className="daily-loss-center">{line.totalLossHr || "2.5Hr"}</div>
        </div>
        <div className="daily-loss-legend">
          {items.map((item) => (
            <div className="daily-legend-item" key={item.name}>
              <span style={{ background: item.color }} />
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN DASHBOARD COMPONENT ───

export default function DashboardGraphBoard({ line, stopReasons = [] }) {
  const [intervalMin, setIntervalMin] = useState(30);
  const [target, setTarget] = useState(
    Number(line.targetPerHour) || DEFAULT_TARGET,
  );
  const [clock, setClock] = useState(new Date());

  // State สำหรับเก็บข้อมูลกราฟ
  const [chartData, setChartData] = useState([]);
  const [isSimulating, setIsSimulating] = useState(true);

  // คำนวณค่า KPI
  const actualQty = Number(line.actualQty || 120);
  const planQty = Number(line.planQty || 500);
  const planRate = percent(actualQty, planQty) || 24;
  const avgPcsHr = 110;
  const productiveRate = Math.round((avgPcsHr / target) * 100) || 79;

  // 1. นาฬิกาเดิน
  useEffect(() => {
    const timer = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. การสร้างข้อมูลกราฟ & จำลอง Real-time
  useEffect(() => {
    // โหลดโครงสร้างข้อมูลแกนเวลาเปล่าๆ
    const baseData = generateBaseData(intervalMin);

    // จำลองว่ามีข้อมูลมาแล้วบางส่วน (ช่วงแรกๆ)
    for (let i = 0; i < 6; i++) {
      baseData[i].actual = Math.floor(Math.random() * 80) + 60; // สุ่ม 60-140
      baseData[i].lossTime = parseFloat((Math.random() * 0.4).toFixed(1)); // สุ่ม 0.0 - 0.4
    }

    // ตั้งค่าเป้าหมายให้เท่ากันทุกจุด
    baseData.forEach((d) => (d.target = target));
    setChartData(baseData);

    if (!isSimulating) return;

    // จำลองข้อมูลวิ่งเข้ามาแบบ Real-time ทุกๆ 2.5 วินาที
    const realTimeInterval = setInterval(() => {
      setChartData((prev) => {
        const newData = [...prev];
        // หาจุดแรกที่ค่ายังว่างอยู่ (null) เพื่อเติมข้อมูลเข้าไป
        const nextIndex = newData.findIndex((d) => d.actual === null);

        if (nextIndex !== -1) {
          newData[nextIndex] = {
            ...newData[nextIndex],
            actual: Math.floor(Math.random() * 100) + 50,
            lossTime: parseFloat((Math.random() * 0.5).toFixed(1)),
          };
        } else {
          // ถ้าข้อมูลเต็มแล้ว ให้หยุดจำลอง
          setIsSimulating(false);
        }
        return newData;
      });
    }, 2500);

    return () => clearInterval(realTimeInterval);
  }, [intervalMin, target, isSimulating]);

  const clockText = clock.toLocaleTimeString("en-GB", { hour12: false });

  // Custom Tooltip สำหรับกราฟ (เวลาเอาเมาส์ชี้)
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            background: "#0d1226",
            border: "1px solid #1a2a4a",
            padding: "12px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
          }}
        >
          <p
            style={{
              color: "#60a5fa",
              margin: "0 0 8px 0",
              fontWeight: "bold",
            }}
          >
            Time: {label}
          </p>
          {payload.map((entry, index) => (
            <p
              key={index}
              style={{
                color: entry.color,
                margin: "4px 0",
                fontWeight: "bold",
              }}
            >
              {entry.name}: {entry.value}{" "}
              {entry.name === "Loss Time" ? "Hr" : "Pcs"}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="dashboard-page daily-dashboard-page">
      <div className="daily-html-board">
        <div className="daily-html-controls">
          <div className="daily-html-ctrl-group">
            <label>INTERVAL:</label>
            <select
              value={intervalMin}
              onChange={(e) => setIntervalMin(Number(e.target.value))}
            >
              <option value={60}>60 min</option>
              <option value={30}>30 min</option>
              <option value={15}>15 min</option>
            </select>
          </div>

          <div className="daily-html-ctrl-group">
            <label>TARGET:</label>
            <input
              type="range"
              min="50"
              max="300"
              value={target}
              onChange={(e) => setTarget(Number(e.target.value))}
            />
            <span>{target} pcs</span>
          </div>

          <div className="daily-html-controls-spacer" />

          <button
            type="button"
            className="daily-html-btn blue"
            onClick={() => {
              setChartData([]);
              setIsSimulating(true);
            }}
          >
            ⟳ RESTART DATA
          </button>
          <div className="daily-html-clock">{clockText}</div>
        </div>

        <div className="daily-html-kpi-row">
          <RingKpi
            value={planRate}
            color="#00c8ff"
            title="Plan Achievement Rate"
            lines={[
              `Planned: ${formatNumber(planQty)} pcs`,
              `Actual: ${formatNumber(actualQty)} pcs`,
            ]}
          />
          <RingKpi
            value={productiveRate}
            color="#00ff88"
            title="Productivity Achievement"
            lines={[`Target: ${target} pcs/hr`, `Actual: ${avgPcsHr} pcs/hr`]}
          />
          <LossTimeKpi line={line} stopReasons={stopReasons} />
        </div>

        <div className="daily-html-chart-card">
          <div className="daily-html-chart-header">
            <div className="daily-html-chart-title">
              PRODUCTION RATE CHART (REAL-TIME)
            </div>
          </div>

          <div className="daily-html-chart-wrap" style={{ minHeight: "400px" }}>
            {/* นำ Recharts มาแทน Canvas */}
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
              >
                {/* เส้นตารางพื้นหลังบางๆ */}
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                  vertical={false}
                />

                {/* แกน X (เวลา) */}
                <XAxis
                  dataKey="time"
                  stroke="#60a5fa"
                  tick={{ fill: "#60a5fa", fontSize: 13, fontWeight: "bold" }}
                  tickMargin={10}
                />

                {/* แกน Y ซ้าย (Pcs/Hour) */}
                <YAxis
                  yAxisId="left"
                  stroke="#00c8ff"
                  tick={{ fill: "#00c8ff", fontSize: 14, fontWeight: "bold" }}
                  label={{
                    value: "Rate (Pcs/Hour)",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#00c8ff",
                    fontWeight: "bold",
                    offset: 15,
                  }}
                />

                {/* แกน Y ขวา (Loss Time) */}
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#ff4444"
                  tick={{ fill: "#ff4444", fontSize: 14, fontWeight: "bold" }}
                  label={{
                    value: "Loss Time (Hours)",
                    angle: 90,
                    position: "insideRight",
                    fill: "#ff4444",
                    fontWeight: "bold",
                    offset: 15,
                  }}
                />

                <Tooltip content={<CustomTooltip />} />

                <Legend
                  verticalAlign="top"
                  height={36}
                  wrapperStyle={{ fontWeight: "bold" }}
                />

                {/* เส้น Target (ตรงๆ ทื่อๆ) */}
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="target"
                  stroke="#0064ff"
                  strokeWidth={3}
                  dot={false}
                  name="Target"
                  isAnimationActive={false}
                />

                {/* เส้น Actual (วิ่งขึ้นลง อิงแกนซ้าย) */}
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="actual"
                  stroke="#facc15"
                  strokeWidth={4}
                  dot={{
                    r: 4,
                    fill: "#facc15",
                    strokeWidth: 2,
                    stroke: "#0d1226",
                  }}
                  name="Actual (Pcs/Hr)"
                  isAnimationActive={true}
                />

                {/* เส้น Loss Time (อิงแกนขวา สีแดง) */}
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="lossTime"
                  stroke="#ff4444"
                  strokeWidth={3}
                  dot={{ r: 3, fill: "#ff4444" }}
                  name="Loss Time"
                  isAnimationActive={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
