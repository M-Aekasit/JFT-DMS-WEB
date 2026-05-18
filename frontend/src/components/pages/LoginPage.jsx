// import { useState } from "react";
// import { Navigate, useNavigate } from "react-router-dom";
// import Icon from "../common/Icon";
// import { useConfirm } from "../common/ConfirmDialog";
// import { useAuth } from "../../contexts/AuthContext";
// import { lines } from "../../data/lines";

// export default function LoginPage() {
//   const navigate = useNavigate();
//   const { alert } = useConfirm();
//   const { login, isAuthenticated, getDefaultSection } = useAuth();
//   const [form, setForm] = useState({ username: "admin", password: "admin" });
//   const [loading, setLoading] = useState(false);

//   if (isAuthenticated) {
//     return <Navigate to={`/${getDefaultSection()}/${lines[0].slug}`} replace />;
//   }

//   const setValue = (key, value) =>
//     setForm((prev) => ({ ...prev, [key]: value }));

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setLoading(true);

//     const result = await login(form.username, form.password);
//     setLoading(false);

//     if (!result.ok) {
//       await alert({
//         title: "Login Failed",
//         message: result.message,
//         confirmText: "OK",
//         variant: "danger",
//       });
//       return;
//     }

//     navigate(`/${getDefaultSection()}/${lines[0].slug}`, { replace: true });
//   };

//   return (
//     <div className="login-page">
//       <div className="login-card">
//         <div className="login-brand-icon">
//           <Icon name="ti-cpu-2" />
//         </div>
//         <h1>JFT-DMS</h1>
//         <p>Manufacturing Execution System</p>

//         <form onSubmit={handleSubmit} className="login-form">
//           <div className="fg">
//             <label>Username</label>
//             <input
//               type="text"
//               value={form.username}
//               autoComplete="username"
//               onChange={(event) => setValue("username", event.target.value)}
//               placeholder="admin"
//             />
//           </div>

//           <div className="fg">
//             <label>Password</label>
//             <input
//               type="password"
//               value={form.password}
//               autoComplete="current-password"
//               onChange={(event) => setValue("password", event.target.value)}
//               placeholder="admin"
//             />
//           </div>

//           <button
//             className="btn btn-primary login-submit"
//             type="submit"
//             disabled={loading}
//           >
//             <Icon name={loading ? "ti-loader-2" : "ti-login-2"} />
//             {loading ? "Signing in..." : "Login"}
//           </button>
//         </form>

//         <div className="login-demo-box">
//           <div className="login-demo-title">Demo users</div>
//           <div>
//             <strong>admin</strong> / admin
//           </div>
//           <div>
//             <strong>supervisor</strong> / supervisor
//           </div>
//           <div>
//             <strong>operator</strong> / operator
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
