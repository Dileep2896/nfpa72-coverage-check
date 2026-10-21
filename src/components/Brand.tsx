import { Link } from "react-router-dom";
export function Brand() {
  return (
    <Link className="brand" to="/" aria-label="Coverage Check home">
      <svg width="27" height="27" viewBox="0 0 27 27" aria-hidden="true">
        <circle
          cx="13.5"
          cy="13.5"
          r="12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="3 3"
        />
        <circle cx="13.5" cy="13.5" r="5" fill="currentColor" />
      </svg>
      coverage<span className="brand-dot">check</span>
    </Link>
  );
}
