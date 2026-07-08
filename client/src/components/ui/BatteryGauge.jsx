import './BatteryGauge.css';

export default function BatteryGauge({ health, cycles }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (health / 100) * circumference;

  const getColor = () => {
    if (health >= 85) return '#27ae60';
    if (health >= 70) return '#d4a017';
    return '#c0392b';
  };

  return (
    <div className="battery-gauge">
      <div className="battery-gauge-chart">
        <svg width="88" height="88" viewBox="0 0 88 88">
          <circle cx="44" cy="44" r={radius} fill="none" stroke="#e0e0e0" strokeWidth="6" />
          <circle
            cx="44" cy="44" r={radius}
            fill="none"
            stroke={getColor()}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 44 44)"
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />
        </svg>
        <div className="battery-gauge-text">
          <span className="battery-gauge-value">{health}%</span>
          <span className="battery-gauge-label">Health</span>
        </div>
      </div>
      {cycles !== undefined && (
        <div className="battery-gauge-cycles">{cycles} cycles</div>
      )}
    </div>
  );
}
