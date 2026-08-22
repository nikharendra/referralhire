const STATUS_MAP = {
  submitted: { label: 'Submitted', className: 'badge-info' },
  under_review: { label: 'Under Review', className: 'badge-warning' },
  interview: { label: 'Interview', className: 'badge-primary' },
  hired: { label: 'Hired', className: 'badge-success' },
  rejected: { label: 'Rejected', className: 'badge-danger' },
};

export default function StatusBadge({ status }) {
  const info = STATUS_MAP[status] || { label: status, className: 'badge-info' };
  return <span className={`badge ${info.className}`}>{info.label}</span>;
}