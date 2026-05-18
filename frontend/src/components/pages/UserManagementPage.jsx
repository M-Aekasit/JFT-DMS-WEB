// import { useMemo, useState } from "react";
// import Icon from "../common/Icon";
// import Modal from "../common/Modal";
// import PageHeader from "../common/PageHeader";
// import StatusBadge from "../common/StatusBadge";
// import { useConfirm } from "../common/ConfirmDialog";
// import { useAuth } from "../../contexts/AuthContext";

// const emptyUserForm = {
//   username: "",
//   password: "",
//   displayName: "",
//   email: "",
//   groupId: "",
//   isActive: true,
// };

// function makeUserId(username) {
//   return `u-${
//     String(username || "")
//       .trim()
//       .toLowerCase()
//       .replace(/[^a-z0-9]+/g, "-") || crypto.randomUUID()
//   }`;
// }

// export default function UserManagementPage({ users, setUsers, userGroups }) {
//   const [formOpen, setFormOpen] = useState(false);
//   const [editIndex, setEditIndex] = useState(-1);
//   const [form, setForm] = useState(emptyUserForm);
//   const { currentUser } = useAuth();
//   const { confirm, alert } = useConfirm();

//   const activeGroups = useMemo(
//     () => userGroups.filter((group) => group.isActive),
//     [userGroups],
//   );

//   const groupNameMap = useMemo(() => {
//     const map = new Map();
//     userGroups.forEach((group) => {
//       map.set(group.id, group.groupName);
//       map.set(group.groupCode, group.groupName);
//     });
//     return map;
//   }, [userGroups]);

//   const setValue = (key, value) =>
//     setForm((prev) => ({ ...prev, [key]: value }));

//   const openAddForm = () => {
//     setEditIndex(-1);
//     setForm({ ...emptyUserForm, groupId: activeGroups[0]?.id || "" });
//     setFormOpen(true);
//   };

//   const openEditForm = (index) => {
//     setEditIndex(index);
//     setForm({ ...users[index], password: users[index].password || "" });
//     setFormOpen(true);
//   };

//   const closeForm = () => {
//     setFormOpen(false);
//     setEditIndex(-1);
//     setForm(emptyUserForm);
//   };

//   const saveUser = async () => {
//     const username = form.username.trim();
//     if (
//       !username ||
//       !form.password ||
//       !form.displayName.trim() ||
//       !form.groupId
//     ) {
//       await alert({
//         title: "Required Information",
//         message: "Please enter username, password, display name, and group.",
//         confirmText: "OK",
//         variant: "danger",
//       });
//       return;
//     }

//     const exists = users.some(
//       (user, index) =>
//         user.username.toLowerCase() === username.toLowerCase() &&
//         index !== editIndex,
//     );
//     if (exists) {
//       await alert({
//         title: "Duplicate Username",
//         message: `${username} already exists.`,
//         confirmText: "OK",
//         variant: "danger",
//       });
//       return;
//     }

//     const nextUser = {
//       ...form,
//       id: form.id || makeUserId(username),
//       username,
//       displayName: form.displayName.trim(),
//       email: form.email.trim(),
//     };

//     setUsers((prev) => {
//       if (editIndex >= 0)
//         return prev.map((item, index) =>
//           index === editIndex ? nextUser : item,
//         );
//       return [...prev, nextUser];
//     });

//     closeForm();
//   };

//   const deleteUser = async (index) => {
//     const target = users[index];
//     if (!target) return;

//     if (currentUser?.id === target.id) {
//       await alert({
//         title: "Cannot Delete Current User",
//         message: "You cannot delete the user currently logged in.",
//         confirmText: "OK",
//         variant: "danger",
//       });
//       return;
//     }

//     const ok = await confirm({
//       title: "Delete User",
//       message: `Do you want to delete user ${target.username}?`,
//       confirmText: "Delete",
//       cancelText: "Cancel",
//       variant: "danger",
//     });
//     if (!ok) return;

//     setUsers((prev) => prev.filter((_, rowIndex) => rowIndex !== index));
//     if (formOpen && editIndex === index) closeForm();
//   };

//   return (
//     <div className="page">
//       <PageHeader
//         icon="ti-user-cog"
//         title="User Management"
//         description="Maintain user login accounts and assigned permission groups"
//         action={
//           <button
//             className="btn btn-primary"
//             type="button"
//             onClick={openAddForm}
//           >
//             <Icon name="ti-user-plus" /> Add User
//           </button>
//         }
//       />

//       <div className="card">
//         <div className="card-header">
//           <div className="card-header-left">
//             <Icon name="ti-users" />
//             <div>
//               <div className="card-header-title">Users</div>
//               <div className="card-header-sub">
//                 {users.length} users configured
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="table-wrap">
//           <table>
//             <thead>
//               <tr>
//                 <th>
//                   <Icon name="ti-user" /> Username
//                 </th>
//                 <th>
//                   <Icon name="ti-id" /> Display Name
//                 </th>
//                 <th>
//                   <Icon name="ti-mail" /> Email
//                 </th>
//                 <th>
//                   <Icon name="ti-users-group" /> Group
//                 </th>
//                 <th>
//                   <Icon name="ti-activity" /> Status
//                 </th>
//                 <th aria-label="Action" />
//               </tr>
//             </thead>
//             <tbody>
//               {users.map((user, index) => (
//                 <tr key={user.id || user.username}>
//                   <td>
//                     <strong>{user.username}</strong>
//                   </td>
//                   <td>{user.displayName}</td>
//                   <td>{user.email || "—"}</td>
//                   <td>
//                     {groupNameMap.get(user.groupId) || user.groupId || "—"}
//                   </td>
//                   <td>
//                     <StatusBadge active={user.isActive} />
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
//                         onClick={() => deleteUser(index)}
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
//           title={editIndex >= 0 ? `Edit User — ${form.username}` : "Add User"}
//           subtitle="Create login account and assign a user group."
//           onClose={closeForm}
//           footer={
//             <div className="row-actions">
//               <button
//                 className="btn btn-primary"
//                 type="button"
//                 onClick={saveUser}
//               >
//                 <Icon name="ti-device-floppy" /> Save User
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
//               <label>Username</label>
//               <input
//                 type="text"
//                 value={form.username}
//                 placeholder="operator01"
//                 onChange={(event) => setValue("username", event.target.value)}
//               />
//             </div>
//             <div className="fg">
//               <label>Password</label>
//               <input
//                 type="password"
//                 value={form.password}
//                 placeholder="Password"
//                 onChange={(event) => setValue("password", event.target.value)}
//               />
//             </div>
//             <div className="fg">
//               <label>Display Name</label>
//               <input
//                 type="text"
//                 value={form.displayName}
//                 placeholder="Line Operator"
//                 onChange={(event) =>
//                   setValue("displayName", event.target.value)
//                 }
//               />
//             </div>
//             <div className="fg">
//               <label>Email</label>
//               <input
//                 type="email"
//                 value={form.email}
//                 placeholder="user@company.com"
//                 onChange={(event) => setValue("email", event.target.value)}
//               />
//             </div>
//             <div className="fg">
//               <label>User Group</label>
//               <select
//                 value={form.groupId}
//                 onChange={(event) => setValue("groupId", event.target.value)}
//               >
//                 {activeGroups.map((group) => (
//                   <option key={group.id} value={group.id}>
//                     {group.groupCode} · {group.groupName}
//                   </option>
//                 ))}
//               </select>
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
//         </Modal>
//       ) : null}
//     </div>
//   );
// }
