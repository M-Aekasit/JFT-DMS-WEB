import Icon from "./Icon";

export default function Modal({
  title,
  subtitle,
  children,
  footer,
  onClose,
  wide = false,
}) {
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div
        className={wide ? "modal-card modal-card-wide" : "modal-card"}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2>{title}</h2>
            {subtitle ? <p>{subtitle}</p> : null}
          </div>

          <button className="modal-close" type="button" onClick={onClose}>
            <Icon name="ti-x" />
          </button>
        </div>

        <div className="modal-body">{children}</div>

        {footer ? <div className="modal-footer">{footer}</div> : null}
      </div>
    </div>
  );
}