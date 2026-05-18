import { useEffect, useMemo, useState } from "react";
import DashboardProductionBoard from "./DashboardProductionBoard";
import DashboardGraphBoard from "./DashboardGraphBoard";
import DashboardImageBoard from "./DashboardImageBoard";

export default function DashboardPage({ line, stopReasons = [] }) {
  const [now, setNow] = useState(new Date());
  const [viewMode, setViewMode] = useState("graph");

  const hasImage = Boolean(String(line?.partImageSrc || "").trim());

  const sequence = useMemo(() => {
    if (hasImage) {
      return ["data", "graph", "image"];
    }

    // return ["data", "graph"];
    return ["graph"];
  }, [hasImage]);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ถ้าลบรูปแล้ว viewMode ยังเป็น image อยู่ ให้กลับไปหน้า data
  useEffect(() => {
    if (!sequence.includes(viewMode)) {
      setViewMode("data");
    }
  }, [sequence, viewMode]);

  useEffect(() => {
    const delays = {
      data: Number(line?.dashboardSwitchSeconds) || 10,
      graph: Number(line?.graphSwitchSeconds) || 10,
      image: Number(line?.imageSwitchSeconds) || 10,
    };

    const timer = setTimeout(
      () => {
        setViewMode((current) => {
          const currentIndex = sequence.indexOf(current);

          if (currentIndex < 0) {
            return sequence[0] || "data";
          }

          return sequence[(currentIndex + 1) % sequence.length];
        });
      },
      (delays[viewMode] || 10) * 1000,
    );

    return () => clearTimeout(timer);
  }, [
    line?.dashboardSwitchSeconds,
    line?.graphSwitchSeconds,
    line?.imageSwitchSeconds,
    sequence,
    viewMode,
  ]);

  if (viewMode === "graph") {
    return (
      <DashboardGraphBoard line={line} now={now} stopReasons={stopReasons} />
    );
  }

  if (viewMode === "image" && hasImage) {
    return <DashboardImageBoard line={line} />;
  }

  return (
    <DashboardProductionBoard line={line} now={now} stopReasons={stopReasons} />
  );
}
