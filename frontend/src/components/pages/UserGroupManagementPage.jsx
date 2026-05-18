// import { useMemo, useState } from "react";
// import Icon from "../common/Icon";
// import Modal from "../common/Modal";
// import PageHeader from "../common/PageHeader";
// import StatusBadge from "../common/StatusBadge";
// import { useConfirm } from "../common/ConfirmDialog";
// import { getPermissionLabel } from "../../data/security";
// import PermissionModulePanel from "../security/PermissionModulePanel";

// const emptyGroupForm = {
//   groupCode: "",
//   groupName: "",
//   description: "",
//   isActive: true,
//   permissions: ["dashboard"],
// };

// function makeGroupId(groupCode) {
//   return (
//     String(groupCode || "")
//       .trim()
//       .toLowerCase()
//       .replace(/[^a-z0-9]+/g, "-") || crypto.randomUUID()
//   );
// }

// export default function UserGroupManagementPage({
//   userGroups,
//   setUserGroups,
//   users,
// }) {
//   const [formOpen, setFormOpen] = useState(false);
//   const [editIndex, setEditIndex] = useState(-1);
//   const [form, setForm] = useState(emptyGroupForm);
//   const { confirm, alert } = useConfirm();

//   const usageByGroup = useMemo(() => {
//     const map = new Map();
//     users.forEach((user) =>
//       map.set(user.groupId, (map.get(user.groupId) || 0) + 1),
//     );
//     return map;
//   }, [users]);

//   const setValue = (key, value) =>
//     setForm((prev) => ({ ...prev, [key]: value }));

//   const openAddForm = () => {
//     setEditIndex(-1);
//     setForm(emptyGroupForm);
//     setFormOpen(true);
//   };

//   const openEditForm = (index) => {
//     setEditIndex(index);
//     setForm({
//       ...userGroups[index],
//       permissions: [...(userGroups[index].permissions || [])],
//     });
//     setFormOpen(true);
//   };

//   const closeForm = () => {
//     setFormOpen(false);
//     setEditIndex(-1);
//     setForm(emptyGroupForm);
//   };

//   const togglePermission = (slug) => {
//     setForm((prev) => {
//       const next = new Set(prev.permissions || []);
//       if (next.has(slug)) next.delete(slug);
//       else next.add(slug);
//       return { ...prev, permissions: Array.from(next) };
//     });
//   };

//   const saveGroup = async () => {
//     const groupCode = form.groupCode.trim().toUpperCase();
//     if (!groupCode || !form.groupName.trim()) {
//       await alert({
//         title: "Required Information",
//         message: "Please enter Group Code and Group Name.",
//         confirmText: "OK",
//         variant: "danger",
//       });
//       return;
//     }

//     if (!form.permissions?.length) {
//       await alert({
//         title: "Permission Required",
//         message: "Please select at least one page permission.",
//         confirmText: "OK",
//         variant: "danger",
//       });
//       return;
//     }

//     const exists = userGroups.some(
//       (group, index) => group.groupCode === groupCode && index !== editIndex,
//     );
//     if (exists) {
//       await alert({
//         title: "Duplicate Group Code",
//         message: `${groupCode} already exists.`,
//         confirmText: "OK",
//         variant: "danger",
//       });
//       return;
//     }

//     const nextGroup = {
//       ...form,
//       id: form.id || makeGroupId(groupCode),
//       groupCode,
//       groupName: form.groupName.trim(),
//       description: form.description.trim(),
//       permissions: form.permissions,
//     };

//     setUserGroups((prev) => {
//       if (editIndex >= 0)
//         return prev.map((item, index) =>
//           index === editIndex ? nextGroup : item,
//         );
//       return [...prev, nextGroup];
//     });

//     closeForm();
//   };

//   const deleteGroup = async (index) => {
//     const target = userGroups[index];
//     if (!target) return;

//     const userCount =
//       usageByGroup.get(target.id) || usageByGroup.get(target.groupCode) || 0;
//     if (userCount > 0) {
//       await alert({
//         title: "Cannot Delete Group",
//         message: `This group is assigned to ${userCount} user(s). Please move users to another group first.`,
//         confirmText: "OK",
//         variant: "danger",
//       });
//       return;
//     }

//     const ok = await confirm({
//       title: "Delete User Group",
//       message: `Do you want to delete group ${target.groupCode}?`,
//       confirmText: "Delete",
//       cancelText: "Cancel",
//       variant: "danger",
//     });
//     if (!ok) return;

//     setUserGroups((prev) => prev.filter((_, rowIndex) => rowIndex !== index));
//     if (formOpen && editIndex === index) closeForm();
//   };

//   return (
//     <div className="page">
//       <PageHeader
//         icon="ti-users-group"
//         title="User Group Management"
//         description="Manage role groups and page-level permissions"
//         action={
//           <button
//             className="btn btn-primary"
//             type="button"
//             onClick={openAddForm}
//           >
//             <Icon name="ti-plus" /> Add User Group
//           </button>
//         }
//       />

//       <div className="card">
//         <div className="card-header">
//           <div className="card-header-left">
//             <Icon name="ti-shield-lock" />
//             <div>
//               <div className="card-header-title">User Groups</div>
//               <div className="card-header-sub">
//                 {userGroups.length} groups configured
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="table-wrap">
//           <table>
//             <thead>
//               <tr>
//                 <th>
//                   <Icon name="ti-hash" /> Group Code
//                 </th>
//                 <th>
//                   <Icon name="ti-tag" /> Group Name
//                 </th>
//                 <th>
//                   <Icon name="ti-list-check" /> Permissions
//                 </th>
//                 <th>
//                   <Icon name="ti-users" /> Users
//                 </th>
//                 <th>
//                   <Icon name="ti-activity" /> Status
//                 </th>
//                 <th aria-label="Action" />
//               </tr>
//             </thead>
//             <tbody>
//               {userGroups.map((group, index) => (
//                 <tr key={group.id || group.groupCode}>
//                   <td>
//                     <strong>{group.groupCode}</strong>
//                   </td>
//                   <td>
//                     <div className="table-main-text">{group.groupName}</div>
//                     <div className="table-sub-text">
//                       {group.description || "—"}
//                     </div>
//                   </td>
//                   <td>
//                     <div className="permission-chip-wrap">
//                       {(group.permissions || []).map((slug) => (
//                         <span key={slug} className="permission-chip">
//                           {getPermissionLabel(slug)}
//                         </span>
//                       ))}
//                     </div>
//                   </td>
//                   <td>
//                     {usageByGroup.get(group.id) ||
//                       usageByGroup.get(group.groupCode) ||
//                       0}
//                   </td>
//                   <td>
//                     <StatusBadge active={group.isActive} />
//                   </td>
//                   <td>
//                     <div className="row-actions">
//                       <button
//                         className="edit-btn"
//                         type="button"
//                         onClick={() => openEditForm(index)}
//                       >
//                         <Icon name="ti-pencil" /> Edit
//                       </button>
//                       <button
//                         className="delete-btn"
//                         type="button"
//                         onClick={() => deleteGroup(index)}
//                       >
//                         <Icon name="ti-trash" /> Delete
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {formOpen ? (
//         <Modal
//           wide
//           title={
//             editIndex >= 0 ? `Edit Group — ${form.groupCode}` : "Add User Group"
//           }
//           subtitle="Select which pages this group can access."
//           onClose={closeForm}
//           footer={
//             <div className="row-actions">
//               <button
//                 className="btn btn-primary"
//                 type="button"
//                 onClick={saveGroup}
//               >
//                 <Icon name="ti-device-floppy" /> Save Group
//               </button>
//               <button
//                 className="btn btn-ghost"
//                 type="button"
//                 onClick={closeForm}
//               >
//                 <Icon name="ti-x" /> Cancel
//               </button>
//             </div>
//           }
//         >
//           <div className="grid2">
//             <div className="fg">
//               <label>Group Code</label>
//               <input
//                 type="text"
//                 value={form.groupCode}
//                 placeholder="ADMIN"
//                 onChange={(event) => setValue("groupCode", event.target.value)}
//               />
//             </div>
//             <div className="fg">
//               <label>Group Name</label>
//               <input
//                 type="text"
//                 value={form.groupName}
//                 placeholder="Administrator"
//                 onChange={(event) => setValue("groupName", event.target.value)}
//               />
//             </div>
//             <div className="fg grid-span-2">
//               <label>Description</label>
//               <input
//                 type="text"
//                 value={form.description}
//                 placeholder="Group description"
//                 onChange={(event) =>
//                   setValue("description", event.target.value)
//                 }
//               />
//             </div>
//             <div className="fg">
//               <label>Active Status</label>
//               <div className="toggle-row">
//                 <label className="toggle">
//                   <input
//                     type="checkbox"
//                     checked={form.isActive}
//                     onChange={(event) =>
//                       setValue("isActive", event.target.checked)
//                     }
//                   />
//                   <span className="tsl" />
//                 </label>
//                 <span>{form.isActive ? "Active" : "Inactive"}</span>
//               </div>
//             </div>
//           </div>

//           <PermissionModulePanel
//             value={form.permissions}
//             onChange={(nextPermissions) =>
//               setValue("permissions", nextPermissions)
//             }
//           />
//         </Modal>
//       ) : null}
//     </div>
//   );
// }
