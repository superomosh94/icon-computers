export default function Badge({ children, className = '' }) {
  const colorMap = {
    Mint: 'grade-mint',
    Excellent: 'grade-excellent',
    Good: 'grade-good',
    Fair: 'grade-fair',
    Available: 'status-available',
    Reserved: 'status-reserved',
    Sold: 'status-sold',
  };

  const badgeClass = colorMap[children] || 'grade-good';

  return (
    <span className={`badge ${badgeClass} ${className}`}>
      {children}
    </span>
  );
}
