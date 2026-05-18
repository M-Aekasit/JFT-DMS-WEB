import Icon from "../common/Icon";
import { pagePermissionModules } from "../../data/security";

export default function PermissionModulePanel({ value = [], onChange }) {
  const selectedPermissions = new Set(value);

  const togglePermission = (slug) => {
    const next = new Set(selectedPermissions);

    if (next.has(slug)) {
      next.delete(slug);
    } else {
      next.add(slug);
    }

    onChange(Array.from(next));
  };

  const toggleModule = (module) => {
    const moduleSlugs = module.permissions.map((item) => item.slug);
    const isAllSelected = moduleSlugs.every((slug) =>
      selectedPermissions.has(slug),
    );

    const next = new Set(selectedPermissions);

    moduleSlugs.forEach((slug) => {
      if (isAllSelected) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
    });

    onChange(Array.from(next));
  };

  return (
    <div className="permission-panel">
      <div className="permission-panel-title">
        <Icon name="ti-lock-access" />
        Page Permissions
      </div>

      <div className="permission-module-list">
        {pagePermissionModules.map((module) => {
          const moduleSlugs = module.permissions.map((item) => item.slug);
          const selectedCount = moduleSlugs.filter((slug) =>
            selectedPermissions.has(slug),
          ).length;
          const isAllSelected = selectedCount === moduleSlugs.length;

          return (
            <div className="permission-module-card" key={module.moduleCode}>
              <div className="permission-module-header">
                <div className="permission-module-title">
                  <span className="permission-module-icon">
                    <Icon name={module.icon} />
                  </span>

                  <div>
                    <strong>{module.moduleName}</strong>
                    <small>{module.description}</small>
                  </div>
                </div>

                <button
                  type="button"
                  className={
                    isAllSelected
                      ? "permission-module-toggle selected"
                      : "permission-module-toggle"
                  }
                  onClick={() => toggleModule(module)}
                >
                  {isAllSelected ? "Clear Module" : "Select Module"}
                </button>
              </div>

              <div className="permission-module-count">
                {selectedCount} / {module.permissions.length} selected
              </div>

              <div className="permission-grid">
                {module.permissions.map((permission) => {
                  const checked = selectedPermissions.has(permission.slug);

                  return (
                    <label
                      key={permission.slug}
                      className={
                        checked ? "permission-card selected" : "permission-card"
                      }
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => togglePermission(permission.slug)}
                      />

                      <span className="permission-check">
                        <Icon name="ti-check" />
                      </span>

                      <span>
                        <strong>{permission.label}</strong>
                        <small>{permission.description}</small>
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
