import Icon from "./Icon";

export default function PageHeader({ icon, iconStyle, title, description, action }) {
  return (
    <div className="page-header">
      <div className="page-header-left">
        <div className="page-header-icon" style={iconStyle}>
          <Icon name={icon} />
        </div>
        <div>
          <h1 style={{ margin: 0, lineHeight: 1.2 }}>{title}</h1>
          <p style={{ margin: 0 }}>{description}</p>
        </div>
      </div>
      {action}
    </div>
  );
}
