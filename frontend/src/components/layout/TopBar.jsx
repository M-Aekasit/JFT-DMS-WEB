import { Link, useNavigate } from "react-router-dom";
import Icon from "../common/Icon";
import { sectionList } from "../../data/lines";
// import { useAuth } from "../../contexts/AuthContext";
// import { useConfirm } from "../common/ConfirmDialog";

export default function TopBar({ line, activeSection, lineList }) {
  const navigate = useNavigate();
  // const { confirm } = useConfirm();
  // const {
  //   currentUser,
  //   currentGroup,
  //   hasPermission,
  //   logout,
  //   getDefaultSection,
  // } = useAuth();
  // const allowedSections = sectionList.filter((item) =>
  //   hasPermission(item.slug),
  // );

  const handleLineChange = (event) => {
    navigate(`/${activeSection}/${event.target.value}`);
  };

  const handleLogout = async () => {
    const ok = await confirm({
      title: "Logout",
      message: "Do you want to logout from JFT-DMS?",
      confirmText: "Logout",
      cancelText: "Cancel",
      variant: "danger",
    });
    if (!ok) return;
    logout();
    navigate("/login", { replace: true });
  };

  const defaultSection = "line-maintenance";

  return (
    <header className="topbar">
      <Link
        className="brand"
        to={`/${defaultSection}/${line.slug}`}
        title="Go to home page"
      >
        <div className="brand-icon">
          <Icon name="ti-cpu-2" />
        </div>
        <div>
          <div className="brand-name">JFT-DMS</div>
          <div className="brand-sub">Manufacturing Execution System</div>
        </div>
      </Link>

      <nav className="nav-tabs">
        <div className="nav-divider" />
        {sectionList.map((item, index) => (
          <div
            key={item.slug}
            style={{ display: "flex", alignItems: "center" }}
          >
            {index > 0 &&
            [
              "stop-reason-maintenance",
              "line-production-update",
              "user-group-management",
            ].includes(item.slug) ? (
              <div className="nav-divider" />
            ) : null}
            <Link
              className={`nav-tab ${activeSection === item.slug ? "active" : ""}`}
              to={`/${item.slug}/${line.slug}`}
            >
              <Icon name={item.icon} />
              {item.label}
            </Link>
          </div>
        ))}
      </nav>

      <div className="topbar-right">
        <div className="line-select" title="Switch line path">
          <Icon name="ti-route" />
          <select value={line.slug} onChange={handleLineChange}>
            {lineList.map((item) => (
              <option key={item.slug} value={item.slug}>
                /{item.slug} · {item.code}
              </option>
            ))}
          </select>
        </div>
        {/* <div className="user-pill" title={currentGroup?.groupName || "User"}>
          <Icon name="ti-user-shield" />
          <span>{currentUser?.displayName || currentUser?.username}</span>
        </div>
        <button
          className="icon-btn"
          title="Logout"
          type="button"
          onClick={handleLogout}
        >
          <Icon name="ti-logout-2" />
        </button> */}
        {/* <div className="avatar" title={currentUser?.displayName || "User"}>
          {(currentUser?.displayName || currentUser?.username || "AD")
            .slice(0, 2)
            .toUpperCase()}
        </div> */}
      </div>
    </header>
  );
}
