import { useMemo } from "react";
import { lines, stopReasonSeed } from "../../data/lines";
import { usePersistentState } from "../../hooks/usePersistentState";
// import { useAuth } from "../../contexts/AuthContext";
import TopBar from "./TopBar";
import DashboardPage from "../dashboard/DashboardPage";
import LineMaintenancePage from "../pages/LineMaintenancePage";
import StopReasonMaintenancePage from "../pages/StopReasonMaintenancePage";
import ProductionUpdatePage from "../pages/ProductionUpdatePage";
import LineStopUpdatePage from "../pages/LineStopUpdatePage";
// import UserGroupManagementPage from "../pages/UserGroupManagementPage";
// import UserManagementPage from "../pages/UserManagementPage";

const STORAGE_KEYS = {
  lineOverrides: "jft-mes-line-overrides-v2",
  stopReasons: "jft-mes-stop-reasons-v3",
};

function mergeSystemReasons(source) {
  const byCode = new Map(source.map((item) => [item.code, item]));
  const mergedSeed = stopReasonSeed.map((seed) => ({
    ...seed,
    ...(byCode.get(seed.code) || {}),
    code: seed.code,
    name: seed.name,
    order: seed.order,
    active: seed.active,
    is_Edit: false,
    systemReason: true,
  }));

  const customRows = source.filter(
    (item) => !stopReasonSeed.some((seed) => seed.code === item.code),
  );
  return [...mergedSeed, ...customRows];
}

export default function MesShell({ line, activeSection, lineList = lines }) {
  const [stopReasonsRaw, setStopReasonsRaw] = usePersistentState(
    STORAGE_KEYS.stopReasons,
    stopReasonSeed,
  );
  const [lineOverrides, setLineOverrides] = usePersistentState(
    STORAGE_KEYS.lineOverrides,
    {},
  );
  // const { users, setUsers, userGroups, setUserGroups } = useAuth();

  const stopReasons = useMemo(
    () => mergeSystemReasons(stopReasonsRaw),
    [stopReasonsRaw],
  );
  const setStopReasons = (updater) => {
    setStopReasonsRaw((prev) => {
      const next =
        typeof updater === "function"
          ? updater(mergeSystemReasons(prev))
          : updater;
      return mergeSystemReasons(next);
    });
  };

  const liveLine = useMemo(
    () => ({
      ...line,
      ...(lineOverrides[line.slug] || {}),
    }),
    [line, lineOverrides],
  );

  const liveLineList = useMemo(
    () =>
      lineList.map((item) => ({
        ...item,
        ...(lineOverrides[item.slug] || {}),
      })),
    [lineList, lineOverrides],
  );

  const updateCurrentLine = (patch) => {
    setLineOverrides((prev) => ({
      ...prev,
      [line.slug]: {
        ...(prev[line.slug] || {}),
        ...patch,
      },
    }));
  };

  // Dashboard is a monitor/display page, so it must stay fullscreen and must not render TopBar/pages wrapper.
  if (activeSection === "dashboard") {
    return (
      <main className="dashboard-fullscreen-shell">
        <DashboardPage line={liveLine} stopReasons={stopReasons} />
      </main>
    );
  }

  return (
    <>
      <TopBar
        line={liveLine}
        activeSection={activeSection}
        lineList={liveLineList}
      />

      <main className="pages">
        {activeSection === "line-maintenance" ? (
          <LineMaintenancePage
            line={liveLine}
            lineList={liveLineList}
            onUpdateLine={updateCurrentLine}
          />
        ) : null}
        {activeSection === "stop-reason-maintenance" ? (
          <StopReasonMaintenancePage
            line={liveLine}
            stopReasons={stopReasons}
            setStopReasons={setStopReasons}
          />
        ) : null}
        {activeSection === "line-production-update" ? (
          <ProductionUpdatePage
            line={liveLine}
            onUpdateLine={updateCurrentLine}
          />
        ) : null}
        {activeSection === "line-stop-update" ? (
          <LineStopUpdatePage
            line={liveLine}
            stopReasons={stopReasons}
            onUpdateLine={updateCurrentLine}
          />
        ) : null}
        {/* {activeSection === "user-group-management" ? (
          <UserGroupManagementPage
            userGroups={userGroups}
            setUserGroups={setUserGroups}
            users={users}
          />
        ) : null}
        {activeSection === "user-management" ? (
          <UserManagementPage
            userGroups={userGroups}
            users={users}
            setUsers={setUsers}
          />
        ) : null} */}
      </main>
    </>
  );
}
