import { useEffect, useRef, useState } from "react";
import Icon from "../common/Icon";
import PageHeader from "../common/PageHeader";
import { useConfirm } from "../common/ConfirmDialog";
import {
  formatPlanningHours,
  parsePlanningHours,
  percent,
} from "../../utils/format";

export default function ProductionUpdatePage({ line, onUpdateLine }) {
  const fileInputRef = useRef(null);
  const { confirm, alert } = useConfirm();

  const [operatorCount, setOperatorCount] = useState(line.operatorCount || 0);
  const [planningHours, setPlanningHours] = useState(
    parsePlanningHours(line.planningTimeHours ?? line.planningTime),
  );
  const [imageSrc, setImageSrc] = useState(line.partImageSrc || "");
  const [saved, setSaved] = useState(false);

  const progress = percent(line.actualQty, line.planQty);

  useEffect(() => {
    setOperatorCount(line.operatorCount || 0);
    setPlanningHours(
      parsePlanningHours(line.planningTimeHours ?? line.planningTime),
    );
    setImageSrc(line.partImageSrc || "");
  }, [
    line.operatorCount,
    line.planningTime,
    line.planningTimeHours,
    line.partImageSrc,
  ]);

  const handleImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      await alert({
        title: "Invalid File",
        message: "Please select image file only.",
        confirmText: "OK",
        variant: "danger",
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    const reader = new FileReader();

    reader.onload = (result) => {
      const nextImageSrc = String(result.target?.result || "");

      setImageSrc(nextImageSrc);

      onUpdateLine({
        partImageSrc: nextImageSrc,
      });
    };

    reader.readAsDataURL(file);
  };

  const removeImage = async () => {
    if (!imageSrc) return;

    const ok = await confirm({
      title: "Remove Image",
      message:
        "Do you want to remove this uploaded part image from Production Update and Dashboard?",
      confirmText: "Remove",
      cancelText: "Cancel",
      variant: "danger",
    });

    if (!ok) return;

    setImageSrc("");

    onUpdateLine({
      partImageSrc: "",
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    await alert({
      title: "Image Removed",
      message: "Part image has been removed successfully.",
      confirmText: "OK",
      variant: "primary",
    });
  };

  const saveProductionInfo = () => {
    const planningTimeHours = parsePlanningHours(planningHours);

    onUpdateLine({
      operatorCount,
      planningTimeHours,
      planningTime: formatPlanningHours(planningTimeHours),
      partImageSrc: imageSrc,
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  };

  return (
    <div className="page">
      <PageHeader
        icon="ti-chart-bar-popular"
        iconStyle={{ background: "#f0fdf4", color: "var(--success)" }}
        title="Production Update"
        description={`Line ${line.code} · Upload part image, update operator count, and planning time`}
      />

      <div className="stat-row">
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

        <div className="stat-card purple">
          <div className="stat-icon">
            <Icon name="ti-calendar-event" />
          </div>
          <div className="stat-info">
            <div className="stat-label">Production Date</div>
            <div className="stat-value" style={{ fontSize: 22 }}>
              {new Date(line.productionDate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </div>
            <div className="stat-sub">{line.shift}</div>
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
            <div className="stat-sub">{line.partName}</div>
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

      <div className="prod-grid">
        <div className="card">
          <div className="card-header">
            <div className="card-header-left">
              <Icon name="ti-photo" />
              <div>
                <div className="card-header-title">Part Reference Image</div>
                <div className="card-header-sub">
                  This image will become Dashboard mode 3
                </div>
              </div>
            </div>
          </div>

          <div className="card-body">
            <label
              className={`img-drop ${imageSrc ? "has-img" : ""}`}
              htmlFor="partImageFile"
            >
              {imageSrc ? (
                <img src={imageSrc} alt="part reference" />
              ) : (
                <>
                  <div className="img-drop-icon">
                    <Icon name="ti-cloud-upload" />
                  </div>
                  <p>Click or drag to upload image</p>
                  <span>PNG, JPG up to 10MB</span>
                </>
              )}
            </label>

            <input
              ref={fileInputRef}
              id="partImageFile"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImage}
            />

            <div className="row-actions" style={{ marginTop: 10 }}>
              <label className="upload-strip" htmlFor="partImageFile">
                <Icon name={imageSrc ? "ti-refresh" : "ti-upload"} />
                {imageSrc ? "Change Image" : "Upload Image"}
              </label>

              {imageSrc ? (
                <button
                  className="btn btn-danger"
                  type="button"
                  onClick={removeImage}
                >
                  <Icon name="ti-trash" />
                  Remove Image
                </button>
              ) : null}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-header-left">
              <Icon name="ti-users" />
              <div>
                <div className="card-header-title">Shift & Production Info</div>
                <div className="card-header-sub">
                  Save values to update Dashboard
                </div>
              </div>
            </div>
          </div>

          <div className="card-body">
            <div className="info-tiles">
              <div className="info-tile">
                <div className="lbl">
                  <Icon name="ti-clock" /> Shift
                </div>
                <div className="val">{line.shift}</div>
              </div>

              <div className="info-tile">
                <div className="lbl">
                  <Icon name="ti-user-shield" /> Supervisor
                </div>
                <div className="val">{line.supervisor}</div>
              </div>

              <div className="info-tile">
                <div className="lbl">
                  <Icon name="ti-circuit-board" /> PLC Brand
                </div>
                <div className="val">{line.plcBrand}</div>
              </div>

              <div className="info-tile">
                <div className="lbl">
                  <Icon name="ti-activity" /> Line Status
                </div>
                <div className="val" style={{ color: "var(--success)" }}>
                  <Icon name="ti-circle-filled" /> Running
                </div>
              </div>
            </div>

            <div
              style={{
                borderTop: "1px solid var(--border)",
                paddingTop: 18,
                marginTop: 4,
              }}
            >
              <div className="fg" style={{ marginBottom: 10 }}>
                <label>
                  <Icon name="ti-users" /> Operator Count
                </label>
              </div>

              <div className="op-counter">
                <button
                  className="counter-btn"
                  type="button"
                  onClick={() =>
                    setOperatorCount((value) => Math.max(0, value - 1))
                  }
                >
                  <Icon name="ti-minus" />
                </button>

                <input
                  className="counter-input"
                  type="number"
                  value={operatorCount}
                  onChange={(event) =>
                    setOperatorCount(
                      Math.max(0, Number(event.target.value) || 0),
                    )
                  }
                />

                <button
                  className="counter-btn"
                  type="button"
                  onClick={() => setOperatorCount((value) => value + 1)}
                >
                  <Icon name="ti-plus" />
                </button>

                <span
                  style={{ fontSize: 13, color: "var(--text3)", marginLeft: 4 }}
                >
                  operators on duty
                </span>
              </div>

              <div className="planning-time-control">
                <div className="fg">
                  <label>
                    <Icon name="ti-clock-hour-4" /> Production Planning Time
                  </label>
                </div>

                <div className="planning-time-row">
                  <input
                    className="counter-input planning-time-input"
                    type="number"
                    step="0.1"
                    min="0"
                    value={planningHours}
                    onChange={(event) => setPlanningHours(event.target.value)}
                  />
                  <span>Hr.</span>
                </div>
              </div>

              <button
                className="btn btn-primary"
                style={
                  saved
                    ? { marginTop: 16, background: "var(--success)" }
                    : { marginTop: 16 }
                }
                type="button"
                onClick={saveProductionInfo}
              >
                <Icon name={saved ? "ti-check" : "ti-device-floppy"} />
                {saved ? "Dashboard Updated!" : "Save Production Info"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
