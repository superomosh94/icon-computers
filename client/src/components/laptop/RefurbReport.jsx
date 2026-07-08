import { refurbActions } from '../../data/shop';
import './RefurbReport.css';

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="7" fill="#27ae60"/>
      <path d="M5 8l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="7" fill="#c0392b"/>
      <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function RefurbReport({ actions }) {
  return (
    <div className="refurb-report">
      {refurbActions.map((item) => {
        const done = actions.includes(item.id);
        return (
          <div key={item.id} className={`refurb-item ${done ? 'done' : ''}`}>
            <span className="refurb-icon">{done ? <CheckIcon /> : <XIcon />}</span>
            <span>{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}
