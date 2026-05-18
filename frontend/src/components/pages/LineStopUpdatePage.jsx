import Icon from "../common/Icon";
import PageHeader from "../common/PageHeader";
import { percent } from "../../utils/format";
import { useConfirm } from "../common/ConfirmDialog";

export default function LineStopUpdatePage({
  line,
  stopReasons,
  onUpdateLine,
}) {
  const activeReasons = stopReasons
    .filter((item) => item.active)
    .sort((a, b) => Number(a.order || 999) - Number(b.order || 999));
  const currentStopCode = line.currentStopReasonCode || "";
  const currentStopName = line.currentStopReason || "";
  const progress = percent(line.actualQty, line.planQty);
  const { confirm } = useConfirm();

  const handleToggle = async (reason) => {
    const isCurrentReason =
      currentStopCode === reason.code || currentStopName === reason.name;

    if (isCurrentReason) {
      const ok = await confirm({
        title: "Start Line",
        message: `Do you want to start ${line.code}?`,
        confirmText: "Start",
        cancelText: "Cancel",
      });
      if (!ok) return;
      onUpdateLine({ currentStopReason: "", currentStopReasonCode: "" });
      return;
    }

    if (currentStopName !== "" || currentStopCode !== "") return;

    const ok = await confirm({
      title: "Stop Line",
      message: `Do you want to stop ${line.code} by reason: ${reason.name}?`,
      confirmText: "Stop",
      cancelText: "Cancel",
      variant: "danger",
    });
    if (!ok) return;
    onUpdateLine({
      currentStopReason: reason.name,
      currentStopReasonCode: reason.code,
    });
  };

  return (
    <div className="page line-stop-page">
      <PageHeader
        icon="ti-player-stop-filled"
        iconStyle={{ background: "#fef2f2", color: "var(--danger)" }}
        title="Line Stop Update"
        description={`${line.code} · Active Stop Reason Codes are loaded dynamically from Stop Reason Maintenance`}
      />

      <div className="stat-row line-stop-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <Icon name="ti-cpu-2" />
          </div>
          <div className="stat-info">
            <div className="stat-label">Line Name</div>
            <div className="stat-value" style={{ color: "var(--accent)" }}>
              {line.name}
            </div>
            <div className="stat-sub">{line.displayName}</div>
          </div>
        </div>
        <div className="stat-card warn">
          <div className="stat-icon">
            <Icon name="ti-barcode" />
          </div>
          <div className="stat-info">
            <div className="stat-label">Current Part Code</div>
            <div
              className="stat-value"
              style={{ fontSize: 22, color: "var(--warn)" }}
            >
              {line.currentPartCode}
            </div>
          </div>
        </div>
        <div className="stat-card success">
          <div className="stat-icon">
            <Icon name="ti-box" />
          </div>
          <div className="stat-info" style={{ flex: 1, width: "100%" }}>
            <div className="stat-label">Actual / Plan Qty</div>
            <div
              className="stat-value"
              style={{ display: "flex", alignItems: "baseline", gap: 8 }}
            >
              <span style={{ color: "var(--success)" }}>{line.actualQty}</span>
              <span style={{ fontSize: 16, color: "var(--text3)" }}>
                / {line.planQty}
              </span>
            </div>
            <div className="prog-bg">
              <div className="prog-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </div>

      {activeReasons.length === 0 ? (
        <div className="empty line-stop-empty">
          <div className="empty-icon">
            <Icon name="ti-alert-circle" />
          </div>
          <p>
            No active stop reasons. Please activate reason codes in Stop Reason
            Maintenance.
          </p>
        </div>
      ) : (
        <div className="reason-button-grid dynamic-reason-grid">
          {activeReasons.map((reason) => {
            const isStopped =
              currentStopCode === reason.code ||
              currentStopName === reason.name;
            const isDisabled =
              (currentStopCode !== "" || currentStopName !== "") && !isStopped;
            const activeColor = reason.color || "var(--danger)";
            const textColor = [
              "#ffff00",
              "#ffd700",
              "#bbd3f2",
              "#00b5e2",
            ].includes(String(activeColor).toLowerCase())
              ? "#0f172a"
              : "#ffffff";

            return (
              <button
                key={reason.code}
                className={`reason-stop-button ${isStopped ? "is-stopped" : ""}`}
                type="button"
                onClick={() => handleToggle(reason)}
                disabled={isDisabled}
                style={
                  isStopped
                    ? {
                        backgroundColor: activeColor,
                        borderColor: activeColor,
                        color: textColor,
                      }
                    : { borderTopColor: activeColor }
                }
              >
                <div className="reason-stop-code">{reason.code}</div>
                <div className="reason-stop-icon">
                  <Icon
                    name={
                      isStopped ? "ti-alert-octagon-filled" : "ti-hand-stop"
                    }
                  />
                </div>
                <div className="reason-stop-title">{reason.name}</div>
                <div className="reason-stop-badge">
                  {isStopped
                    ? "🔴 STOPPED (TAP TO START)"
                    : isDisabled
                      ? "LOCKED"
                      : "PRESS TO STOP"}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
