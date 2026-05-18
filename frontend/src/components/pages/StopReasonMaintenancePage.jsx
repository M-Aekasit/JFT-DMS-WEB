import { useState } from "react";
import Icon from "../common/Icon";
import Modal from "../common/Modal";
import PageHeader from "../common/PageHeader";
import StatusBadge from "../common/StatusBadge";
import { useConfirm } from "../common/ConfirmDialog";

const emptyStopReasonForm = {
  code: "",
  name: "",
  color: "#CC539A",
  order: "",
  active: true,
  is_Edit: true,
  systemReason: false,
};

function isLockedReason(reason) {
  return reason?.is_Edit === false;
}

export default function StopReasonMaintenancePage({
  line,
  stopReasons,
  setStopReasons,
}) {
  const [editIndex, setEditIndex] = useState(-1);
  const [form, setForm] = useState(emptyStopReasonForm);
  const [formOpen, setFormOpen] = useState(false);
  const { confirm, alert } = useConfirm();

  const openAddForm = () => {
    setEditIndex(-1);
    setForm(emptyStopReasonForm);
    setFormOpen(true);
  };

  const openEditForm = (index) => {
    setEditIndex(index);
    setForm({ ...stopReasons[index] });
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditIndex(-1);
    setForm(emptyStopReasonForm);
  };

  const setValue = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const saveRow = async () => {
    const locked = isLockedReason(form);
    const code = form.code.trim();

    if (!code) {
      await alert({
        title: "Stop Reason Code Required",
        message: "Please enter Stop Reason Code before saving.",
        confirmText: "OK",
        variant: "danger",
      });
      return;
    }

    const duplicate = stopReasons.some(
      (item, index) => item.code === code && index !== editIndex,
    );
    if (duplicate) {
      await alert({
        title: "Duplicate Stop Reason Code",
        message: `${code} already exists.`,
        confirmText: "OK",
        variant: "danger",
      });
      return;
    }

    const oldRow = editIndex >= 0 ? stopReasons[editIndex] : null;
    const nextRow =
      locked && oldRow
        ? {
            ...oldRow,
            color: form.color || oldRow.color || "#cccccc",
          }
        : {
            ...form,
            code,
            name: form.name.trim(),
            color: form.color || "#cccccc",
            order: String(form.order).trim(),
            active: !!form.active,
            is_Edit: form.is_Edit !== false,
          };

    setStopReasons((prev) => {
      if (editIndex >= 0)
        return prev.map((item, index) =>
          index === editIndex ? nextRow : item,
        );
      return [...prev, nextRow];
    });

    closeForm();
  };

  const deleteRow = async (index) => {
    const target = stopReasons[index];
    if (!target) return;

    if (isLockedReason(target)) {
      await alert({
        title: "System Stop Reason",
        message:
          "The first 4 system stop reasons cannot be deleted. You can only edit their color.",
        confirmText: "OK",
        variant: "danger",
      });
      return;
    }

    const ok = await confirm({
      title: "Delete Stop Reason",
      message: `Do you want to delete stop reason ${target.code}?`,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger",
    });
    if (!ok) return;

    setStopReasons((prev) => prev.filter((_, rowIndex) => rowIndex !== index));
    if (formOpen && editIndex === index) closeForm();
  };

  const getUsageText = (reason) => {
    if (
      line.currentStopReasonCode === reason.code ||
      line.currentStopReason === reason.name
    ) {
      return `${line.code} is stopped`;
    }
    return "—";
  };

  const lockedForm = isLockedReason(form);

  return (
    <div className="page">
      <PageHeader
        icon="ti-alert-triangle"
        iconStyle={{ background: "#fff7ed", color: "var(--warn)" }}
        title="Stop Reason Maintenance"
        description="Active stop reason codes are displayed dynamically in Line Stop Update"
        action={
          <button
            className="btn btn-primary"
            type="button"
            onClick={openAddForm}
          >
            <Icon name="ti-plus" /> Add Stop Reason
          </button>
        }
      />

      <div className="info-note">
        <Icon name="ti-info-circle" />
        <span>
          ST1-ST4 are system reasons. Their name, code, order, and active status
          are locked. Color is editable and is used by Line Stop Update and
          Dashboard stop boxes.
        </span>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-header-left">
            <Icon name="ti-list-details" />
            <div>
              <div className="card-header-title">Stop Reason Codes</div>
              <div className="card-header-sub">
                {stopReasons.length} reasons defined ·{" "}
                {stopReasons.filter((item) => item.active).length} active
              </div>
            </div>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>
                  <Icon name="ti-hash" /> Code
                </th>
                <th>
                  <Icon name="ti-file-description" /> Stop Reason Name
                </th>
                <th>
                  <Icon name="ti-palette" /> Color
                </th>
                <th>
                  <Icon name="ti-sort-ascending" /> Display Order
                </th>
                {/* <th><Icon name="ti-lock" /> Edit</th> */}
                <th>
                  <Icon name="ti-activity" /> Status
                </th>
                {/* <th><Icon name="ti-alert-circle" /> Reason</th> */}
                <th aria-label="Action" />
              </tr>
            </thead>
            <tbody>
              {stopReasons.length === 0 ? (
                <tr>
                  <td colSpan="8">
                    <div className="empty">
                      <div className="empty-icon">
                        <Icon name="ti-alert-circle" />
                      </div>
                      <p>No stop reasons defined yet.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                stopReasons.map((row, index) => {
                  const locked = isLockedReason(row);
                  const isUsing =
                    line.currentStopReasonCode === row.code ||
                    line.currentStopReason === row.name;
                  return (
                    <tr key={`${row.code}-${index}`}>
                      <td>
                        <span
                          className={
                            locked ? "badge badge-blue" : "badge badge-orange"
                          }
                        >
                          {row.code}
                        </span>
                      </td>
                      <td>
                        <div className="table-main-text">{row.name}</div>
                        {locked ? (
                          <div className="table-sub-text locked-text">
                            <Icon name="ti-lock" />
                            Locked system reason
                          </div>
                        ) : null}
                      </td>
                      <td>
                        <span
                          className="color-chip"
                          style={{ background: row.color }}
                        />{" "}
                        <code className="ip">{row.color}</code>
                      </td>
                      <td>{row.order || "—"}</td>
                      {/* <td>{locked ? <span className="badge badge-gray">Color only</span> : <span className="badge badge-green">Editable</span>}</td> */}
                      <td>
                        <StatusBadge active={row.active} />
                      </td>
                      {/* <td>
                        {isUsing ? (
                          <span className="badge badge-red">
                            {getUsageText(row)}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td> */}
                      <td>
                        <div className="row-actions">
                          <button
                            className="edit-btn"
                            type="button"
                            onClick={() => openEditForm(index)}
                          >
                            <Icon name="ti-pencil" /> Edit
                          </button>
                          <button
                            className="delete-btn"
                            type="button"
                            disabled={locked}
                            onClick={() => deleteRow(index)}
                          >
                            <Icon name="ti-trash" /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {formOpen ? (
        <Modal
          wide
          title={
            editIndex >= 0
              ? `Edit Stop Reason — ${form.code}`
              : "Add Stop Reason"
          }
          subtitle={
            lockedForm
              ? "This system reason is locked. Only color can be changed."
              : "Maintain stop reason code, name, color, order, and active status."
          }
          onClose={closeForm}
          footer={
            <>
              <div className="row-actions">
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={saveRow}
                >
                  <Icon name="ti-device-floppy" /> Save
                </button>
                <button
                  className="btn btn-ghost"
                  type="button"
                  onClick={closeForm}
                >
                  <Icon name="ti-x" /> Cancel
                </button>
                {editIndex >= 0 && !lockedForm ? (
                  <button
                    className="btn btn-danger"
                    type="button"
                    onClick={() => deleteRow(editIndex)}
                  >
                    <Icon name="ti-trash" /> Delete
                  </button>
                ) : null}
              </div>
            </>
          }
        >
          {lockedForm ? (
            <div className="info-note compact">
              <Icon name="ti-lock" /> This is one of the first 4 system reasons.
              Only Color is editable.
            </div>
          ) : null}
          <div className="grid3">
            <div className="fg">
              <label>Stop Reason Code</label>
              <input
                type="text"
                value={form.code}
                disabled={lockedForm}
                placeholder="e.g. ST5"
                onChange={(e) => setValue("code", e.target.value)}
              />
            </div>
            <div className="fg">
              <label>Stop Reason Name</label>
              <input
                type="text"
                value={form.name}
                disabled={lockedForm}
                placeholder="e.g. Machine Breakdown"
                onChange={(e) => setValue("name", e.target.value)}
              />
            </div>
            <div className="fg">
              <label>Display Order</label>
              <input
                type="number"
                min="1"
                value={form.order}
                disabled={lockedForm}
                placeholder="1"
                onChange={(e) => setValue("order", e.target.value)}
              />
            </div>
            <div className="fg">
              <label>Color</label>

              <div className="color-picker-row">
                <label
                  className="color-picker-preview"
                  style={{ backgroundColor: form.color || "#CC539A" }}
                  title="Click to select color"
                >
                  <input
                    type="color"
                    value={form.color || "#CC539A"}
                    onChange={(event) => setValue("color", event.target.value)}
                  />
                </label>

                <input
                  className="color-code-input"
                  type="text"
                  value={form.color || ""}
                  placeholder="#CC539A"
                  onChange={(event) => setValue("color", event.target.value)}
                />
              </div>
            </div>
            <div className="fg">
              <label>Active Status</label>
              <div className="toggle-row">
                <label className="toggle">
                  <input
                    type="checkbox"
                    disabled={lockedForm}
                    checked={form.active}
                    onChange={(e) => setValue("active", e.target.checked)}
                  />
                  <span className="tsl" />
                </label>
                <span style={{ fontSize: 13, color: "var(--text2)" }}>
                  {form.active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}
