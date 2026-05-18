import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { ConfirmProvider } from "./components/common/ConfirmDialog.jsx";
// import { AuthProvider } from "./contexts/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ConfirmProvider>
      {/* <AuthProvider> */}
      <App />
      {/* </AuthProvider> */}
    </ConfirmProvider>
  </StrictMode>,
);
