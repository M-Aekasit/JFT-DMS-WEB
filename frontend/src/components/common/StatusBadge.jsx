export default function StatusBadge({ active }) {
  return (
    <span className={`badge ${active ? "badge-green" : "badge-gray"}`}>
      {active ? "● Active" : "○ Inactive"}
    </span>
  );
}
