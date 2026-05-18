import { createContext, useContext, useRef, useState } from "react";
import Icon from "./Icon";

const ConfirmContext = createContext(null);

const defaultDialog = {
  open: false,
  type: "confirm",
  title: "Confirm Action",
  message: "Are you sure?",
  confirmText: "Confirm",
  cancelText: "Cancel",
  variant: "primary",
};

function getIconName(variant, type) {
  if (variant === "danger") return "ti-alert-triangle";
  if (type === "alert") return "ti-circle-check";
  return "ti-help-circle";
}

export function ConfirmProvider({ children }) {
  const resolverRef = useRef(null);
  const [dialog, setDialog] = useState(defaultDialog);

  const openDialog = (config, type) => {
    setDialog({
      ...defaultDialog,
      ...config,
      type,
      open: true,
    });

    return new Promise((resolve) => {
      resolverRef.current = resolve;
    });
  };

  const confirm = (config = {}) => openDialog(config, "confirm");

  const alert = (config = {}) => openDialog({
    title: "Information",
    message: "",
    confirmText: "OK",
    variant: "primary",
    ...config,
    cancelText: "",
  }, "alert");

  const closeDialog = (result) => {
    setDialog((prev) => ({ ...prev, open: false }));

    if (resolverRef.current) {
      resolverRef.current(result);
      resolverRef.current = null;
    }
  };

  return (
    <ConfirmContext.Provider value={{ confirm, alert }}>
      {children}

      {dialog.open ? (
        <div className="confirm-backdrop" role="presentation" onClick={() => closeDialog(false)}>
          <div className="confirm-dialog" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <button className="confirm-close" type="button" aria-label="Close" onClick={() => closeDialog(false)}>
              <Icon name="ti-x" />
            </button>

            <div className={`confirm-icon confirm-icon-${dialog.variant}`}>
              <Icon name={getIconName(dialog.variant, dialog.type)} />
            </div>

            <div className="confirm-content">
              <h3>{dialog.title}</h3>
              {dialog.message ? <p>{dialog.message}</p> : null}
            </div>

            <div className="confirm-actions">
              {dialog.type === "confirm" ? (
                <button type="button" className="btn btn-ghost" onClick={() => closeDialog(false)}>
                  {dialog.cancelText}
                </button>
              ) : null}

              <button
                type="button"
                className={dialog.variant === "danger" ? "btn btn-danger-solid" : "btn btn-primary"}
                onClick={() => closeDialog(true)}
              >
                {dialog.confirmText}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmContext);

  if (!context) {
    throw new Error("useConfirm must be used inside ConfirmProvider");
  }

  return context;
}
