// ===============================
// Page Permission Modules
// ===============================
export const pagePermissionModules = [
  {
    moduleCode: "MASTER",
    moduleName: "Master Maintenance",
    icon: "ti-database-cog",
    description: "Master data setup and maintenance pages",
    permissions: [
      {
        slug: "line-maintenance",
        label: "Line Maintenance",
        description:
          "Maintain production line master data. This is the home page for admin users.",
        isHome: true,
      },
      {
        slug: "stop-reason-maintenance",
        label: "Stop Reason Maintenance",
        description: "Maintain stop reason code, color, and active status.",
      },
    ],
  },
  {
    moduleCode: "MES",
    moduleName: "MES Operation",
    icon: "ti-dashboard",
    description: "Production dashboard and line operation pages",
    permissions: [
      {
        slug: "dashboard",
        label: "Dashboard",
        description: "View production dashboard by line.",
      },
      {
        slug: "line-production-update",
        label: "Production Update",
        description: "Update operator count, planning time, and product image.",
      },
      {
        slug: "line-stop-update",
        label: "Line Stop Update",
        description: "Start and stop production line by reason.",
      },
    ],
  },
  {
    moduleCode: "SECURITY",
    moduleName: "Security Management",
    icon: "ti-shield-lock",
    description: "User, group, and permission management pages",
    permissions: [
      {
        slug: "user-group-management",
        label: "User Group Management",
        description: "Maintain role groups and page permissions.",
      },
      {
        slug: "user-management",
        label: "User Management",
        description: "Maintain user accounts and assigned groups.",
      },
    ],
  },
];

// ===============================
// Flatten Permission List
// ===============================

export const pagePermissions = pagePermissionModules.flatMap((module) =>
  module.permissions.map((permission) => ({
    ...permission,
    moduleCode: module.moduleCode,
    moduleName: module.moduleName,
    moduleIcon: module.icon,
  }))
);

// ===============================
// Permission Helpers
// ===============================

export function getPermission(slug) {
  return pagePermissions.find((item) => item.slug === slug) || null;
}

export function getPermissionLabel(slug) {
  return getPermission(slug)?.label || slug;
}

export function getPermissionModule(slug) {
  const permission = getPermission(slug);

  if (!permission) return null;

  return pagePermissionModules.find(
    (module) => module.moduleCode === permission.moduleCode
  );
}

export function getDefaultHomePermission(permissions = []) {
  if (!Array.isArray(permissions) || permissions.length === 0) {
    return "line-maintenance";
  }

  // ถ้ามี line-maintenance ให้ถือเป็น Home ก่อน
  if (permissions.includes("line-maintenance")) {
    return "line-maintenance";
  }

  // ถ้าไม่มี ให้หา permission ที่ marked isHome
  const homePermission = pagePermissions.find(
    (item) => item.isHome && permissions.includes(item.slug)
  );

  if (homePermission) {
    return homePermission.slug;
  }

  // ถ้าไม่มี home ให้ใช้ permission ตัวแรกของกลุ่มนั้น
  return permissions[0];
}

export function hasPagePermission(userGroup, slug) {
  if (!userGroup || !userGroup.isActive) return false;

  const permissions = userGroup.permissions || [];

  return permissions.includes(slug);
}

// ===============================
// Default User Groups
// ===============================

export const defaultUserGroups = [
  {
    id: "admin",
    groupCode: "ADMIN",
    groupName: "Administrator",
    description: "Full access to all MES functions.",
    isActive: true,
    permissions: pagePermissions.map((item) => item.slug),
  },
  {
    id: "supervisor",
    groupCode: "SUPERVISOR",
    groupName: "Production Supervisor",
    description: "Operate line update and dashboard functions.",
    isActive: true,
    permissions: [
      "line-maintenance",
      "dashboard",
      "stop-reason-maintenance",
      "line-production-update",
      "line-stop-update",
    ],
  },
  {
    id: "operator",
    groupCode: "OPERATOR",
    groupName: "Line Operator",
    description: "View dashboard and update production stop status.",
    isActive: true,
    permissions: ["dashboard", "line-production-update", "line-stop-update"],
  },
];

// ===============================
// Default Users
// ===============================

export const defaultUsers = [
  {
    id: "u-admin",
    username: "admin",
    password: "admin",
    displayName: "System Admin",
    email: "admin@jft-mes.local",
    groupId: "admin",
    isActive: true,
  },
  {
    id: "u-supervisor",
    username: "supervisor",
    password: "supervisor",
    displayName: "Production Supervisor",
    email: "supervisor@jft-mes.local",
    groupId: "supervisor",
    isActive: true,
  },
  {
    id: "u-operator",
    username: "operator",
    password: "operator",
    displayName: "Line Operator",
    email: "operator@jft-mes.local",
    groupId: "operator",
    isActive: true,
  },
];