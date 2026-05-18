import { useEffect, useState } from "react";
import Icon from "../common/Icon";
import Modal from "../common/Modal";
import PageHeader from "../common/PageHeader";
import StatusBadge from "../common/StatusBadge";
import { useConfirm } from "../common/ConfirmDialog";

const emptyLineForm = {
  code: "",
  name: "",
  ip: "",
  plc: "Omron",
  order: "",
  dashboardSwitchSeconds: "10",
  graphSwitchSeconds: "10",
  imageSwitchSeconds: "10",
  active: false,
};

function buildRows(lineList) {
  return lineList.map((item) => ({
    code: item.code,
    slug: item.slug,
    name: item.name,
    ip: item.ipAddress,
    plc: item.plcBrand,
    order: String(item.displayOrder ?? ""),
    dashboardSwitchSeconds: String(item.dashboardSwitchSeconds || 10),
    graphSwitchSeconds: String(item.graphSwitchSeconds || 10),
    imageSwitchSeconds: String(item.imageSwitchSeconds || 10),
    active: item.isActive,
  }));
}

export default function LineMaintenancePage({ line, lineList, onUpdateLine }) {
  const [lineRows, setLineRows] = useState(() => buildRows(lineList));
  const [editIndex, setEditIndex] = useState(-1);
  const [form, setForm] = useState(emptyLineForm);
  const [formOpen, setFormOpen] = useState(false);
  const { confirm, alert } = useConfirm();

  useEffect(() => {
    setLineRows(buildRows(lineList));
  }, [lineList]);

  const openAddForm = () => {
    setEditIndex(-1);
    setForm(emptyLineForm);
    setFormOpen(true);
  };

  const openEditForm = (index) => {
    setEditIndex(index);
    setForm({ ...lineRows[index] });
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditIndex(-1);
    setForm(emptyLineForm);
  };

  const setValue = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const saveRow = async () => {
    const code = form.code.trim();
    if (!code) {
      await alert({
        title: "Line Code Required",
        message: "Please enter Line Code before saving.",
        confirmText: "OK",
      });
      return;
    }

    const nextRow = {
      ...form,
      code,
      name: form.name.trim(),
      ip: form.ip.trim(),
      order: String(form.order).trim(),
      dashboardSwitchSeconds: String(
        Math.max(1, Number(form.dashboardSwitchSeconds) || 10),
      ),
      graphSwitchSeconds: String(
        Math.max(1, Number(form.graphSwitchSeconds) || 10),
      ),
      imageSwitchSeconds: String(
        Math.max(1, Number(form.imageSwitchSeconds) || 10),
      ),
    };

    setLineRows((prev) => {
      if (editIndex >= 0)
        return prev.map((item, index) =>
          index === editIndex ? nextRow : item,
        );
      return [...prev, nextRow];
    });

    if (nextRow.code === line.code || nextRow.slug === line.slug) {
      onUpdateLine({
        name: nextRow.name || nextRow.code,
        ipAddress: nextRow.ip,
        plcBrand: nextRow.plc,
        displayOrder: Number(nextRow.order) || 1,
        dashboardSwitchSeconds: Number(nextRow.dashboardSwitchSeconds),
        graphSwitchSeconds: Number(nextRow.graphSwitchSeconds),
        imageSwitchSeconds: Number(nextRow.imageSwitchSeconds),
        isActive: nextRow.active,
      });
    }

    closeForm();
  };

  const deleteRow = async (index) => {
    const target = lineRows[index];
    if (!target) return;
    const ok = await confirm({
      title: "Delete Line",
      message: `Do you want to delete line ${target.code}?`,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger",
    });
    if (!ok) return;
    setLineRows((prev) => prev.filter((_, rowIndex) => rowIndex !== index));
    if (formOpen && editIndex === index) closeForm();
  };

  return (
    <div className="page">
      <PageHeader
        icon="ti-layout-list"
        title="Line Maintenance"
        description="Configure production lines, PLC connections, and dashboard switching time"
        action={
          <button
            className="btn btn-primary"
            type="button"
            onClick={openAddForm}
          >
            <Icon name="ti-plus" /> Add New Line
          </button>
        }
      />

      <div className="card">
        <div className="card-header">
          <div className="card-header-left">
            <Icon name="ti-table" />
            <div>
              <div className="card-header-title">Production Lines</div>
              <div className="card-header-sub">
                {lineRows.length} lines configured
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
                  <Icon name="ti-tag" /> Line Name
                </th>
                <th>
                  <Icon name="ti-network" /> IP Address
                </th>
                <th>
                  <Icon name="ti-circuit-board" /> PLC Brand
                </th>
                <th>
                  <Icon name="ti-sort-ascending" /> Order
                </th>
                <th>
                  <Icon name="ti-clock" /> Dashboard Sec.
                </th>
                <th>
                  <Icon name="ti-clock" /> Graph Sec.
                </th>
                <th>
                  <Icon name="ti-photo" /> Image Sec.
                </th>
                <th>
                  <Icon name="ti-activity" /> Status
                </th>
                <th aria-label="Action" />
              </tr>
            </thead>
            <tbody>
              {lineRows.length === 0 ? (
                <tr>
                  <td colSpan="10">
                    <div className="empty">
                      <div className="empty-icon">
                        <Icon name="ti-database-off" />
                      </div>
                      <p>No lines configured yet.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                lineRows.map((row, index) => (
                  <tr key={`${row.code}-${index}`}>
                    <td>
                      <strong>{row.code}</strong>
                    </td>
                    <td>{row.name || "—"}</td>
                    <td>
                      <code className="ip">{row.ip || "—"}</code>
                    </td>
                    <td>{row.plc}</td>
                    <td>{row.order || "—"}</td>
                    <td>{row.dashboardSwitchSeconds}</td>
                    <td>{row.graphSwitchSeconds}</td>
                    <td>{row.imageSwitchSeconds}</td>
                    <td>
                      <StatusBadge active={row.active} />
                    </td>
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
                          onClick={() => deleteRow(index)}
                        >
                          <Icon name="ti-trash" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {formOpen ? (
        <Modal
          wide
          title={editIndex >= 0 ? `Edit Line — ${form.code}` : "Add New Line"}
          subtitle="Enter production line, PLC, and display configuration."
          onClose={closeForm}
          footer={
            <>
              <div className="row-actions">
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={saveRow}
                >
                  <Icon name="ti-device-floppy" /> Save Line
                </button>
                <button
                  className="btn btn-ghost"
                  type="button"
                  onClick={closeForm}
                >
                  <Icon name="ti-x" /> Cancel
                </button>
                {editIndex >= 0 ? (
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
          <div className="grid3">
            <div className="fg">
              <label>Line Code</label>
              <input
                type="text"
                value={form.code}
                placeholder="e.g. ARM1"
                onChange={(e) => setValue("code", e.target.value)}
              />
            </div>
            <div className="fg">
              <label>Line Name</label>
              <input
                type="text"
                value={form.name}
                placeholder="e.g. Assembly Line 1"
                onChange={(e) => setValue("name", e.target.value)}
              />
            </div>
            <div className="fg">
              <label>IP Address</label>
              <input
                type="text"
                value={form.ip}
                placeholder="192.168.1.100"
                onChange={(e) => setValue("ip", e.target.value)}
              />
            </div>
            <div className="fg">
              <label>PLC Brand</label>
              <select
                value={form.plc}
                onChange={(e) => setValue("plc", e.target.value)}
              >
                <option>Omron</option>
                <option>Keyence</option>
                {/* <option>Mitsubishi</option>
                <option>Siemens</option> */}
              </select>
            </div>
            <div className="fg">
              <label>Display Order</label>
              <input
                type="number"
                min="1"
                value={form.order}
                placeholder="1"
                onChange={(e) => setValue("order", e.target.value)}
              />
            </div>
            <div className="fg">
              <label>Dashboard Switch Time (sec.)</label>
              <input
                type="number"
                min="1"
                value={form.dashboardSwitchSeconds}
                onChange={(e) =>
                  setValue("dashboardSwitchSeconds", e.target.value)
                }
              />
            </div>
            <div className="fg">
              <label>Graph Switch Time (sec.)</label>
              <input
                type="number"
                min="1"
                value={form.graphSwitchSeconds}
                onChange={(e) => setValue("graphSwitchSeconds", e.target.value)}
              />
            </div>
            <div className="fg">
              <label>Image Switch Time (sec.)</label>
              <input
                type="number"
                min="1"
                value={form.imageSwitchSeconds}
                onChange={(e) => setValue("imageSwitchSeconds", e.target.value)}
              />
            </div>
            <div className="fg">
              <label>Active Status</label>
              <div className="toggle-row">
                <label className="toggle">
                  <input
                    type="checkbox"
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
