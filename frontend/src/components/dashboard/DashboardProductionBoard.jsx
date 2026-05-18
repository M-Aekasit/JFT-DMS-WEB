// function getDisplayOrder(item) {
//   return Number(
//     item?.displayOrder ??
//       item?.display_order ??
//       item?.DisplayOrder ??
//       item?.order ??
//       item?.displayNo ??
//       0
//   );
// }

// function getReasonByDisplayOrder(stopReasons = [], displayOrder) {
//   return stopReasons
//     .filter((item) => item?.isActive !== false)
//     .find((item) => getDisplayOrder(item) === Number(displayOrder));
// }

// function getReasonColor(reason, fallbackColor) {
//   return (
//     reason?.color ||
//     reason?.stopReasonColor ||
//     reason?.reasonColor ||
//     reason?.backgroundColor ||
//     fallbackColor
//   );
// }

// function getReasonName(reason, fallbackName) {
//   return (
//     reason?.stopReasonName ||
//     reason?.reasonName ||
//     reason?.name ||
//     reason?.label ||
//     fallbackName
//   );
// }

// function cellBg(color) {
//   return {
//     "--pb-cell-bg": color,
//     background: color,
//   };
// }

// function renderReasonName(name) {
//   if (String(name).toLowerCase() === "mode change") {
//     return (
//       <>
//         Mode
//         <br />
//         Change
//       </>
//     );
//   }

//   return name;
// }

// export default function DashboardProductionBoard({ line, stopReasons = [] }) {
//   // Display Order 1-4 จาก Stop Reason Codes
//   const machineReason = getReasonByDisplayOrder(stopReasons, 1);
//   const qualityReason = getReasonByDisplayOrder(stopReasons, 2);
//   const materialReason = getReasonByDisplayOrder(stopReasons, 3);
//   const modeChangeReason = getReasonByDisplayOrder(stopReasons, 4);

//   const machineColor = getReasonColor(machineReason, "#ffff00");
//   const qualityColor = getReasonColor(qualityReason, "#ff0000");
//   const materialColor = getReasonColor(materialReason, "#00b0f0");
//   const modeChangeColor = getReasonColor(modeChangeReason, "#bdd7ee");

//   const machineName = getReasonName(machineReason, "Machine");
//   const qualityName = getReasonName(qualityReason, "Quality");
//   const materialName = getReasonName(materialReason, "Material");
//   const modeChangeName = getReasonName(modeChangeReason, "Mode Change");

//   return (
//     <div className="dashboard-production-board">
//       <table className="production-board-table">
//         <colgroup>
//           <col style={{ width: "16%" }} />
//           <col style={{ width: "21%" }} />
//           <col style={{ width: "14.5%" }} />
//           <col style={{ width: "21%" }} />
//           <col style={{ width: "14%" }} />
//           <col style={{ width: "13.5%" }} />
//         </colgroup>

//         <tbody>
//           <tr>
//             <th colSpan={6} className="pb-title">
//               {line.productionTitle || "Wire-1 Production Dash Board"}
//             </th>
//           </tr>

//           <tr>
//             <td className="pb-green pb-label">Part No.</td>
//             <td className="pb-green pb-value-product">
//               {line.currentPartCode || "-"}
//             </td>

//             <td className="pb-green pb-label">Part Name</td>
//             <td colSpan={3} className="pb-green pb-value-partname">
//               {line.partName || "REG ASSY FR RH"}
//             </td>
//           </tr>

//           <tr>
//             <td className="pb-orange pb-label">Operator</td>
//             <td className="pb-orange pb-value-big">
//               {line.operatorCount ?? 0}
//             </td>

//             <td className="pb-peach pb-label">Target/Hr.</td>
//             <td className="pb-peach pb-value-big">
//               {line.targetPerHour || 140}
//             </td>

//             <td className="pb-light-blue pb-label-dark">
//               Delay/
//               <br />
//               Advance
//               <br />
//               (pcs)
//             </td>
//             <td className="pb-light-blue pb-label-dark">Time (Hr)</td>
//           </tr>

//           <tr>
//             <td className="pb-orange pb-label">Productivity</td>
//             <td className="pb-orange pb-value">
//               <span className="pb-green-text">
//                 {line.productivity || "48.5"}
//               </span>
//               <span> / {line.productivityTarget || 35}</span>
//             </td>

//             <td className="pb-peach pb-label">Actual/Hr.</td>
//             <td className="pb-peach pb-value-big">
//               {line.actualPerHour || 194}
//             </td>

//             <td className="pb-light-blue pb-value pb-red-text">
//               {line.delayAdvancePcs || 300}
//             </td>
//             <td className="pb-light-blue pb-value pb-dark-text pb-small-value">
//               {line.delayAdvanceHour || "1.1H"}
//             </td>
//           </tr>

//           <tr>
//             <td className="pb-gray pb-label">Plan</td>
//             <td className="pb-gray pb-value-big">{line.planQty || 0}</td>

//             <td className="pb-light-blue pb-label">Daily Plan</td>
//             <td className="pb-light-blue pb-value-big">
//               {line.dailyPlan || "2,500"}
//             </td>

//             <td
//               className="pb-yellow pb-label-dark"
//               style={cellBg(machineColor)}
//             >
//               {renderReasonName(machineName)}
//             </td>
//             <td
//               className="pb-yellow pb-value-big pb-blue-dark-text"
//               style={cellBg(machineColor)}
//             >
//               {line.machineLostTime || "1Hr."}
//             </td>
//           </tr>

//           <tr>
//             <td className="pb-gray pb-label">Actual</td>
//             <td className="pb-gray pb-value-big">{line.actualQty || 0}</td>

//             <td className="pb-light-blue pb-label">Actual</td>
//             <td className="pb-light-blue pb-value-big">
//               {line.dailyActual || "1,200"}
//             </td>

//             <td className="pb-red pb-label-dark" style={cellBg(qualityColor)}>
//               {renderReasonName(qualityName)}
//             </td>
//             <td className="pb-red pb-value-big" style={cellBg(qualityColor)}>
//               {line.qualityLostTime || "0.5 Hr."}
//             </td>
//           </tr>

//           <tr>
//             <td className="pb-gray pb-label">Start time</td>
//             <td className="pb-gray pb-value-big">
//               {line.productionStart || "13:50"}
//             </td>

//             <td className="pb-light-blue pb-label">Start time</td>
//             <td className="pb-light-blue pb-value-big">
//               {line.dailyStart || "08:30"}
//             </td>

//             <td className="pb-cyan pb-label-dark" style={cellBg(materialColor)}>
//               {renderReasonName(materialName)}
//             </td>
//             <td
//               className="pb-cyan pb-value-big pb-blue-dark-text"
//               style={cellBg(materialColor)}
//             >
//               {line.materialLostTime || "0 Hr."}
//             </td>
//           </tr>

//           <tr>
//             <td className="pb-gray pb-label">Finish Time</td>
//             <td className="pb-gray pb-value-big pb-green-text">
//               {line.productionCompleted || "00:00"}
//             </td>

//             <td className="pb-light-blue pb-label">Finish Time</td>
//             <td className="pb-light-blue pb-value-big pb-green-text">
//               {line.dailyFinish || "23:20"}
//             </td>

//             <td
//               className="pb-light-blue pb-label-dark pb-mode-change"
//               style={cellBg(modeChangeColor)}
//             >
//               {renderReasonName(modeChangeName)}
//             </td>
//             <td
//               className="pb-light-blue pb-value-big pb-blue-dark-text"
//               style={cellBg(modeChangeColor)}
//             >
//               {line.modeChangeLostTime || "1 Hr."}
//             </td>
//           </tr>
//         </tbody>
//       </table>
//     </div>
//   );
// }

// import React from "react";

// function getDisplayOrder(item) {
//   return Number(
//     item?.displayOrder ??
//       item?.display_order ??
//       item?.DisplayOrder ??
//       item?.order ??
//       item?.displayNo ??
//       0,
//   );
// }

// function getReasonByDisplayOrder(stopReasons = [], displayOrder) {
//   return stopReasons
//     .filter((item) => item?.isActive !== false)
//     .find((item) => getDisplayOrder(item) === Number(displayOrder));
// }

// function getReasonColor(reason, fallbackColor) {
//   return (
//     reason?.color ||
//     reason?.stopReasonColor ||
//     reason?.reasonColor ||
//     reason?.backgroundColor ||
//     fallbackColor
//   );
// }

// function getReasonName(reason, fallbackName) {
//   return (
//     reason?.stopReasonName ||
//     reason?.reasonName ||
//     reason?.name ||
//     reason?.label ||
//     fallbackName
//   );
// }

// // ใช้เทคนิค CSS color-mix เพื่อสร้างพื้นหลังโปร่งแสง 8% จากสีหลักที่ส่งมา
// function cellBg(color) {
//   const safeColor = color || "transparent";
//   return {
//     "--reason-color": safeColor,
//     background: `color-mix(in srgb, ${safeColor} 8%, transparent)`,
//   };
// }

// function renderReasonName(name) {
//   if (String(name).toLowerCase() === "mode change") {
//     return (
//       <>
//         Mode
//         <br />
//         Change
//       </>
//     );
//   }
//   return name;
// }

// export default function DashboardProductionBoard({ line, stopReasons = [] }) {
//   // Display Order 1-4 จาก Stop Reason Codes
//   const machineReason = getReasonByDisplayOrder(stopReasons, 1);
//   const qualityReason = getReasonByDisplayOrder(stopReasons, 2);
//   const materialReason = getReasonByDisplayOrder(stopReasons, 3);
//   const modeChangeReason = getReasonByDisplayOrder(stopReasons, 4);

//   const machineColor = getReasonColor(machineReason, "#facc15"); // Yellow
//   const qualityColor = getReasonColor(qualityReason, "#ef4444"); // Red
//   const materialColor = getReasonColor(materialReason, "#06b6d4"); // Cyan
//   const modeChangeColor = getReasonColor(modeChangeReason, "#a855f7"); // Purple

//   const machineName = getReasonName(machineReason, "Machine");
//   const qualityName = getReasonName(qualityReason, "Quality");
//   const materialName = getReasonName(materialReason, "Material");
//   const modeChangeName = getReasonName(modeChangeReason, "Mode Change");

//   return (
//     <div className="dashboard-production-board">
//       <table className="production-board-table">
//         <colgroup>
//           <col style={{ width: "16%" }} />
//           <col style={{ width: "21%" }} />
//           <col style={{ width: "14.5%" }} />
//           <col style={{ width: "21%" }} />
//           <col style={{ width: "14%" }} />
//           <col style={{ width: "13.5%" }} />
//         </colgroup>

//         <tbody>
//           {/* Header Row */}
//           <tr>
//             <td className="pb-green pb-label">Part No.</td>
//             <td className="pb-green pb-value-product pb-val-cyan">
//               {line.currentPartCode || "-"}
//             </td>
//             <td className="pb-green pb-label">Part Name</td>
//             <td
//               colSpan={3}
//               className="pb-green pb-value-partname pb-val-white"
//               style={{ textAlign: "left", paddingLeft: "32px" }}
//             >
//               {line.partName || "REG ASSY FR RH"}
//             </td>
//           </tr>

//           {/* Row 1: Operator / Target / Delay Header */}
//           <tr>
//             <td className="pb-orange pb-label">Operator</td>
//             <td className="pb-orange pb-value-big pb-val-cyan">
//               {line.operatorCount ?? 0}
//             </td>

//             <td className="pb-peach pb-label">Target / Hr.</td>
//             <td className="pb-peach pb-value-big pb-val-cyan">
//               {line.targetPerHour || 140}
//             </td>

//             <td className="pb-delay-box pb-label">
//               Delay /<br />
//               Advance
//             </td>
//             <td className="pb-delay-box pb-label">Time (Hr)</td>
//           </tr>

//           {/* Row 2: Productivity / Actual Hr / Delay Value */}
//           <tr>
//             <td className="pb-orange pb-label">Productivity</td>
//             <td className="pb-orange pb-value-big">
//               <span className="pb-val-green">
//                 {line.productivity || "48.5"}
//               </span>
//               <span
//                 className="pb-label"
//                 style={{ fontSize: "0.65em", margin: "0 8px" }}
//               >
//                 {" "}
//                 / {line.productivityTarget || 35}
//               </span>
//             </td>

//             <td className="pb-peach pb-label">Actual / Hr.</td>
//             <td className="pb-peach pb-value-big pb-val-green">
//               {line.actualPerHour || 194}
//             </td>

//             <td
//               className="pb-delay-box pb-value-big"
//               style={{ fontSize: "clamp(36px, 4.5vw, 76px)" }}
//             >
//               {line.delayAdvancePcs || "+300"}
//             </td>
//             <td className="pb-delay-box pb-value-big">
//               {line.delayAdvanceHour || "1.5 Hr"}
//             </td>
//           </tr>

//           {/* Row 3: Plan / Daily Plan / Machine */}
//           <tr>
//             <td className="pb-gray pb-label">Plan</td>
//             <td className="pb-gray pb-value-big pb-val-cyan">
//               {line.planQty || 0}
//             </td>

//             <td className="pb-light-blue pb-label">Daily Plan</td>
//             <td className="pb-light-blue pb-value-big pb-val-cyan">
//               {line.dailyPlan || "2,500"}
//             </td>

//             <td className="pb-reason-label" style={cellBg(machineColor)}>
//               {renderReasonName(machineName)}
//             </td>
//             <td className="pb-reason-value" style={cellBg(machineColor)}>
//               {line.machineLostTime || "1 Hr"}
//             </td>
//           </tr>

//           {/* Row 4: Actual / Daily Actual / Quality */}
//           <tr>
//             <td className="pb-gray pb-label">Actual</td>
//             <td className="pb-gray pb-value-big pb-val-green">
//               {line.actualQty || 0}
//             </td>

//             <td className="pb-light-blue pb-label">Actual</td>
//             <td className="pb-light-blue pb-value-big pb-val-green">
//               {line.dailyActual || "1,200"}
//             </td>

//             <td className="pb-reason-label" style={cellBg(qualityColor)}>
//               {renderReasonName(qualityName)}
//             </td>
//             <td className="pb-reason-value" style={cellBg(qualityColor)}>
//               {line.qualityLostTime || "0.5 Hr"}
//             </td>
//           </tr>

//           {/* Row 5: Start Time / Daily Start / Material */}
//           <tr>
//             <td className="pb-gray pb-label">Start Time</td>
//             <td className="pb-gray pb-value-big pb-val-white">
//               {line.productionStart || "13:50"}
//             </td>

//             <td className="pb-light-blue pb-label">Start Time</td>
//             <td className="pb-light-blue pb-value-big pb-val-white">
//               {line.dailyStart || "08:30"}
//             </td>

//             <td className="pb-reason-label" style={cellBg(materialColor)}>
//               {renderReasonName(materialName)}
//             </td>
//             <td className="pb-reason-value" style={cellBg(materialColor)}>
//               {line.materialLostTime || "0 Hr"}
//             </td>
//           </tr>

//           {/* Row 6: Finish Time / Daily Finish / Mode Change */}
//           <tr>
//             <td className="pb-gray pb-label">Finish Time</td>
//             <td className="pb-gray pb-value-big pb-val-green">
//               {line.productionCompleted || "00:00"}
//             </td>

//             <td className="pb-light-blue pb-label">Finish Time</td>
//             <td className="pb-light-blue pb-value-big pb-val-green">
//               {line.dailyFinish || "23:20"}
//             </td>

//             <td className="pb-reason-label" style={cellBg(modeChangeColor)}>
//               {renderReasonName(modeChangeName)}
//             </td>
//             <td className="pb-reason-value" style={cellBg(modeChangeColor)}>
//               {line.modeChangeLostTime || "1 Hr"}
//             </td>
//           </tr>
//         </tbody>
//       </table>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";

// --- Helper Functions ---
function getDisplayOrder(item) {
  return Number(
    item?.displayOrder ??
      item?.display_order ??
      item?.DisplayOrder ??
      item?.order ??
      item?.displayNo ??
      0,
  );
}

function getReasonByDisplayOrder(stopReasons = [], displayOrder) {
  return stopReasons
    .filter((item) => item?.isActive !== false)
    .find((item) => getDisplayOrder(item) === Number(displayOrder));
}

function getReasonColor(reason, fallbackColor) {
  return (
    reason?.color ||
    reason?.stopReasonColor ||
    reason?.reasonColor ||
    reason?.backgroundColor ||
    fallbackColor
  );
}

function getReasonName(reason, fallbackName) {
  return (
    reason?.stopReasonName ||
    reason?.reasonName ||
    reason?.name ||
    reason?.label ||
    fallbackName
  );
}

// ใช้เทคนิค CSS color-mix เพื่อสร้างพื้นหลังโปร่งแสง 8% จากสีหลักที่ส่งมา
function cellBg(color) {
  const safeColor = color || "transparent";
  return {
    "--reason-color": safeColor,
    background: `color-mix(in srgb, ${safeColor} 8%, transparent)`,
  };
}

function renderReasonName(name) {
  if (String(name).toLowerCase() === "mode change") {
    return (
      <>
        Mode
        <br />
        Change
      </>
    );
  }
  return name;
}

// --- Main Component ---
export default function DashboardProductionBoard({ line, stopReasons = [] }) {
  // สร้าง State สำหรับนาฬิกา Real-time
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // ดึงข้อมูล Stop Reasons ตามลำดับ 1-4
  const machineReason = getReasonByDisplayOrder(stopReasons, 1);
  const qualityReason = getReasonByDisplayOrder(stopReasons, 2);
  const materialReason = getReasonByDisplayOrder(stopReasons, 3);
  const modeChangeReason = getReasonByDisplayOrder(stopReasons, 4);

  // กำหนดสี (ถ้าไม่มีให้ใช้สี Default ตามภาพ)
  const machineColor = getReasonColor(machineReason, "#facc15"); // Yellow
  const qualityColor = getReasonColor(qualityReason, "#ef4444"); // Red
  const materialColor = getReasonColor(materialReason, "#06b6d4"); // Cyan
  const modeChangeColor = getReasonColor(modeChangeReason, "#a855f7"); // Purple

  // กำหนดชื่อ (ถ้าไม่มีให้ใช้ชื่อ Default)
  const machineName = getReasonName(machineReason, "Machine");
  const qualityName = getReasonName(qualityReason, "Quality");
  const materialName = getReasonName(materialReason, "Material");
  const modeChangeName = getReasonName(modeChangeReason, "Mode Change");

  return (
    <div className="dashboard-production-board">
      <div className="pb-main-container">
        {/* ── HEADER SECTION ── */}
        <div className="pb-header">
          <div className="pb-header-left">
            <h1 className="pb-line-title">
              {line.dashboardTitle || "WIRE-1 PRODUCTION DASHBOARD"}
            </h1>
            <div className="pb-line-subtitle">
              {/* <span>{line.partName || "REG ASSY FR RH"}</span> */}
              {/* <span className="pb-sub-divider">|</span> */}
              {/* <span>{line.shift || "SHIFT A"}</span> */}
            </div>
          </div>

          <div className="pb-header-right">
            {/* กล่องวันที่และเวลาแบบใหม่ */}
            <div className="pb-datetime-box">
              <div className="pb-date">
                {now.toLocaleDateString("en-US", { weekday: "long" })},{" "}
                {now.toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </div>
              <div className="pb-time">
                {now.toLocaleTimeString("en-GB", { hour12: false })}
              </div>
            </div>
          </div>
        </div>

        {/* ── TABLE SECTION ── */}
        <table className="production-board-table">
          <colgroup>
            <col style={{ width: "16%" }} />
            <col style={{ width: "21%" }} />
            <col style={{ width: "14.5%" }} />
            <col style={{ width: "21%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "13.5%" }} />
          </colgroup>

          <tbody>
            {/* Row 1: Part No / Part Name */}
            <tr>
              <td className="pb-green pb-label">PART NO.</td>
              {/* ขยาย Part No ให้กินพื้นที่ 2 ช่อง (ตรงกับ 4 และ TARGET / HR.) */}
              <td colSpan={2} className="pb-green pb-value-product pb-val-cyan">
                {line.currentPartCode || "8978348640"}
              </td>

              {/* PART NAME จะถูกดันมาอยู่คอลัมน์ที่ 4 (ตรงกับ 140 พอดี) */}
              <td className="pb-green pb-label">PART NAME</td>
              {/* ค่า Part Name จะกินพื้นที่ 2 ช่องสุดท้าย (ตรงกับกล่องส้ม Delay/Advance) */}
              <td
                colSpan={2}
                className="pb-green pb-value-partname pb-val-white"
              >
                {line.partName || "REG ASSY FR RH"}
              </td>
            </tr>

            {/* Row 2: Operator / Target / Delay Header */}
            <tr>
              <td className="pb-orange pb-label">OPERATOR</td>
              <td className="pb-orange pb-value-big pb-val-cyan">
                {line.operatorCount ?? 4}
              </td>

              <td className="pb-peach pb-label">TARGET / HR.</td>
              <td className="pb-peach pb-value-big pb-val-cyan">
                {line.targetPerHour || 140}
              </td>

              <td className="pb-delay-box pb-label">
                DELAY /<br />
                ADVANCE
              </td>
              <td className="pb-delay-box pb-label">TIME (HR)</td>
            </tr>

            {/* Row 3: Productivity / Actual Hr / Delay Value */}
            <tr>
              <td className="pb-orange pb-label">PRODUCTIVITY</td>
              <td className="pb-orange pb-value-big">
                <span className="pb-val-green">
                  {line.productivity || "48.5"}
                </span>
                <span
                  className="pb-label"
                  style={{ fontSize: "0.65em", margin: "0 8px" }}
                >
                  / {line.productivityTarget || 35}
                </span>
              </td>

              <td className="pb-peach pb-label">ACTUAL / HR.</td>
              <td className="pb-peach pb-value-big pb-val-green">
                {line.actualPerHour || 194}
              </td>

              <td
                className="pb-delay-box pb-value-big"
                style={{ fontSize: "clamp(36px, 4.5vw, 76px)" }}
              >
                {line.delayAdvancePcs || "+300"}
              </td>
              <td className="pb-delay-box pb-value-big">
                {line.delayAdvanceHour || "1.5 Hr"}
              </td>
            </tr>

            {/* Row 4: Plan / Daily Plan / Machine */}
            <tr>
              <td className="pb-gray pb-label">PLAN</td>
              <td className="pb-gray pb-value-big pb-val-cyan">
                {line.planQty?.toLocaleString() || "1,476"}
              </td>

              <td className="pb-light-blue pb-label">DAILY PLAN</td>
              <td className="pb-light-blue pb-value-big pb-val-cyan">
                {line.dailyPlan?.toLocaleString() || "2,500"}
              </td>

              <td className="pb-reason-label" style={cellBg(machineColor)}>
                {renderReasonName(machineName)}
              </td>
              <td className="pb-reason-value" style={cellBg(machineColor)}>
                {line.machineLostTime || "1 Hr"}
              </td>
            </tr>

            {/* Row 5: Actual / Daily Actual / Quality */}
            <tr>
              <td className="pb-gray pb-label">ACTUAL</td>
              <td className="pb-gray pb-value-big pb-val-green">
                {line.actualQty?.toLocaleString() || "76"}
              </td>

              <td className="pb-light-blue pb-label">ACTUAL</td>
              <td className="pb-light-blue pb-value-big pb-val-green">
                {line.dailyActual?.toLocaleString() || "1,200"}
              </td>

              <td className="pb-reason-label" style={cellBg(qualityColor)}>
                {renderReasonName(qualityName)}
              </td>
              <td className="pb-reason-value" style={cellBg(qualityColor)}>
                {line.qualityLostTime || "0.5 Hr"}
              </td>
            </tr>

            {/* Row 6: Start Time / Daily Start / Material */}
            <tr>
              <td className="pb-gray pb-label">START TIME</td>
              <td className="pb-gray pb-value-big pb-val-white">
                {line.productionStart || "09:30"}
              </td>

              <td className="pb-light-blue pb-label">START TIME</td>
              <td className="pb-light-blue pb-value-big pb-val-white">
                {line.dailyStart || "08:30"}
              </td>

              <td className="pb-reason-label" style={cellBg(materialColor)}>
                {renderReasonName(materialName)}
              </td>
              <td className="pb-reason-value" style={cellBg(materialColor)}>
                {line.materialLostTime || "0 Hr"}
              </td>
            </tr>

            {/* Row 7: Finish Time / Daily Finish / Mode Change */}
            <tr>
              <td className="pb-gray pb-label">FINISH TIME</td>
              <td className="pb-gray pb-value-big pb-val-green">
                {line.productionCompleted || "19:00"}
              </td>

              <td className="pb-light-blue pb-label">FINISH TIME</td>
              <td className="pb-light-blue pb-value-big pb-val-green">
                {line.dailyFinish || "23:20"}
              </td>

              <td className="pb-reason-label" style={cellBg(modeChangeColor)}>
                {renderReasonName(modeChangeName)}
              </td>
              <td className="pb-reason-value" style={cellBg(modeChangeColor)}>
                {line.modeChangeLostTime || "1 Hr"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
