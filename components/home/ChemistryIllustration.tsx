export function ChemistryIllustration() {
  return (
    <svg
      viewBox="0 0 240 240"
      className="h-44 w-44 md:h-64 md:w-64"
      aria-label="분자 구조 일러스트">
      <defs>
        <linearGradient id="chem-g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d81159" />
          <stop offset="100%" stopColor="#e0447a" />
        </linearGradient>
        <filter id="chem-glow">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="chem-atom" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#d81159" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#d81159" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="120" cy="120" rx="100" ry="32" fill="none"
        stroke="#d81159" strokeWidth="0.4" opacity="0.12" strokeDasharray="3 5">
        <animateTransform attributeName="transform" type="rotate"
          from="0 120 120" to="360 120 120" dur="20s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="120" cy="120" rx="88" ry="38" fill="none"
        stroke="#e0447a" strokeWidth="0.3" opacity="0.08">
        <animateTransform attributeName="transform" type="rotate"
          from="90 120 120" to="-270 120 120" dur="25s" repeatCount="indefinite" />
      </ellipse>

      <polygon points="120,56 163,81 163,131 120,156 77,131 77,81"
        fill="none" stroke="url(#chem-g)" strokeWidth="1.5" opacity="0.8" filter="url(#chem-glow)" />
      <polygon points="120,74 149,89 149,119 120,134 91,119 91,89"
        fill="none" stroke="#d81159" strokeWidth="0.8" opacity="0.25" />

      <line x1="120" y1="59" x2="160" y2="83" stroke="#d81159" strokeWidth="0.4" opacity="0.2" />
      <line x1="160" y1="129" x2="120" y2="153" stroke="#d81159" strokeWidth="0.4" opacity="0.2" />
      <line x1="80" y1="83" x2="80" y2="129" stroke="#d81159" strokeWidth="0.4" opacity="0.2" />

      {([
        [120, 56], [163, 81], [163, 131], [120, 156], [77, 131], [77, 81],
      ] as const).map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="10" fill="url(#chem-atom)" />
          <circle cx={cx} cy={cy} r="3.5" fill="#d81159" opacity="0.9">
            <animate attributeName="r" values="3;4.5;3" dur={`${2 + i * 0.25}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}

      {([
        [120, 56, 120, 28], [163, 81, 192, 66], [77, 81, 48, 66], [120, 156, 120, 184],
      ] as const).map(([x1, y1, x2, y2], i) => (
        <g key={`bond-${i}`}>
          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#d81159" strokeWidth="1" opacity="0.35" />
          <circle cx={x2} cy={y2} r="2.5" fill="#e0447a" opacity="0.5" />
        </g>
      ))}

      <circle r="2" fill="#d81159" opacity="0.7" filter="url(#chem-glow)">
        <animateMotion dur="6s" repeatCount="indefinite"
          path="M 20,120 Q 120,50 220,120 Q 120,190 20,120 Z" />
      </circle>
      <circle r="1.5" fill="#e0447a" opacity="0.5">
        <animateMotion dur="8s" repeatCount="indefinite"
          path="M 120,20 Q 200,120 120,220 Q 40,120 120,20 Z" />
      </circle>
    </svg>
  );
}
