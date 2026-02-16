export function CodeIllustration() {
  return (
    <svg
      viewBox="0 0 240 240"
      className="h-44 w-44 md:h-64 md:w-64"
      aria-label="코드 에디터 일러스트">
      <defs>
        <linearGradient id="code-g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#657ed4" />
          <stop offset="100%" stopColor="#8a9de0" />
        </linearGradient>
        <filter id="code-glow">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect x="28" y="38" width="184" height="125" rx="10"
        fill="none" stroke="#657ed4" strokeWidth="0.6" opacity="0.1" />
      <rect x="35" y="45" width="170" height="115" rx="8"
        fill="none" stroke="url(#code-g)" strokeWidth="1.5" opacity="0.7" />

      <rect x="35" y="45" width="170" height="16" rx="8" fill="#657ed4" opacity="0.08" />
      <circle cx="49" cy="53" r="2.5" fill="#ff331f" opacity="0.5" />
      <circle cx="58" cy="53" r="2.5" fill="#d47070" opacity="0.5" />
      <circle cx="67" cy="53" r="2.5" fill="#8a7dd8" opacity="0.5" />

      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <text key={i} x="47" y={78 + i * 12} fill="#657ed4" fontSize="7"
          opacity="0.2" textAnchor="end" fontFamily="monospace">
          {i + 1}
        </text>
      ))}

      <rect x="62" y="70" width="42" height="4" rx="2" fill="#3626a7" opacity="0.6" />
      <rect x="108" y="70" width="28" height="4" rx="2" fill="#8a9de0" opacity="0.3" />
      <rect x="62" y="82" width="56" height="4" rx="2" fill="#8a9de0" opacity="0.4" />
      <rect x="122" y="82" width="20" height="4" rx="2" fill="#ff331f" opacity="0.3" />
      <rect x="72" y="94" width="35" height="4" rx="2" fill="#3626a7" opacity="0.5" />
      <rect x="111" y="94" width="45" height="4" rx="2" fill="#8a7dd8" opacity="0.25" />
      <rect x="72" y="106" width="50" height="4" rx="2" fill="#8a9de0" opacity="0.35" />
      <rect x="72" y="118" width="25" height="4" rx="2" fill="#3626a7" opacity="0.5" />
      <rect x="101" y="118" width="38" height="4" rx="2" fill="#ff331f" opacity="0.25" />
      <rect x="62" y="130" width="30" height="4" rx="2" fill="#657ed4" opacity="0.55" />
      <rect x="62" y="142" width="18" height="4" rx="2" fill="#8a9de0" opacity="0.3" />

      <rect x="84" y="141" width="2" height="10" fill="#657ed4" filter="url(#code-glow)">
        <animate attributeName="opacity" values="1;0;1" dur="1.1s" repeatCount="indefinite" />
      </rect>

      <text x="30" y="195" fill="#3626a7" fontSize="16" opacity="0.1" fontFamily="monospace">
        {"{"}
      </text>
      <text x="170" y="200" fill="#8a9de0" fontSize="14" opacity="0.08" fontFamily="monospace">
        {"</>"}
      </text>
      <text x="58" y="212" fill="#8a9de0" fontSize="11" opacity="0.06" fontFamily="monospace">
        {"=>"}
      </text>

      <rect x="35" y="170" width="70" height="18" rx="4"
        fill="none" stroke="#657ed4" strokeWidth="0.5" opacity="0.12" />
      <text x="42" y="182" fill="#ff331f" fontSize="7" opacity="0.3" fontFamily="monospace">
        $ deploy
      </text>
    </svg>
  );
}
