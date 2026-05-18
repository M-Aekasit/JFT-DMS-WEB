export default function Icon({ name, className = "" }) {
  return <i className={`ti ${name} ${className}`} />;
}
