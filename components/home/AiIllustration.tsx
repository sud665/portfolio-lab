export function AiIllustration() {
  const nodes: [number, number][][] = [
    [[40, 60], [40, 160]],
    [[80, 50], [90, 105], [90, 130]],
    [[120, 35], [120, 80], [120, 125], [120, 170]],
    [[150, 50], [150, 105], [150, 130]],
    [[200, 60], [200, 105], [200, 160]],
  ];

  const connections = [
    [0, 0, 1, 0], [0, 0, 1, 1], [0, 1, 1, 1], [0, 1, 1, 2],
    [1, 0, 2, 0], [1, 0, 2, 1], [1, 1, 2, 1], [1, 1, 2, 2],
    [1, 2, 2, 2], [1, 2, 2, 3], [2, 0, 3, 0], [2, 1, 3, 0],
    [2, 1, 3, 1], [2, 2, 3, 1], [2, 2, 3, 2], [2, 3, 3, 2],
    [3, 0, 4, 0], [3, 1, 4, 1], [3, 2, 4, 2],
  ];

  return (
    <svg
      viewBox="0 0 240 240"
      className="h-44 w-44 md:h-64 md:w-64"
      aria-label="AI 뉴럴 네트워크 일러스트">
      <defs>
        <filter id="ai-glow">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="ai-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8f2d56" stopOpacity="0.4" />
          <stop offset="70%" stopColor="#8f2d56" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#8f2d56" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="120" cy="110" r="80" fill="none"
        stroke="#8f2d56" strokeWidth="0.3" opacity="0.06">
        <animate attributeName="r" values="75;85;75" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="120" cy="110" r="55" fill="none"
        stroke="#8f2d56" strokeWidth="0.4" opacity="0.08">
        <animate attributeName="r" values="50;60;50" dur="3s" repeatCount="indefinite" />
      </circle>

      {connections.map(([l1, n1, l2, n2], i) => {
        const [x1, y1] = nodes[l1][n1];
        const [x2, y2] = nodes[l2][n2];
        return (
          <line key={`c-${i}`} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="#8f2d56" strokeWidth="0.5" opacity="0.12">
            <animate attributeName="opacity" values="0.06;0.2;0.06"
              dur={`${2 + i * 0.12}s`} repeatCount="indefinite" />
          </line>
        );
      })}

      {nodes.map((layer, li) =>
        layer.map(([cx, cy], ni) => {
          const isCentral = li === 2;
          const r = isCentral ? 5 : 3.5;
          const glowR = isCentral ? 14 : 9;
          return (
            <g key={`n-${li}-${ni}`}>
              <circle cx={cx} cy={cy} r={glowR} fill="url(#ai-core)" />
              <circle cx={cx} cy={cy} r={r}
                fill={li >= 3 ? "#a84e72" : "#8f2d56"}
                opacity={isCentral ? 0.85 : 0.65}
                filter={isCentral ? "url(#ai-glow)" : undefined}>
                <animate attributeName="r" values={`${r - 0.5};${r + 1};${r - 0.5}`}
                  dur={`${1.8 + li * 0.3 + ni * 0.2}s`} repeatCount="indefinite" />
              </circle>
            </g>
          );
        }),
      )}

      <circle r="1.5" fill="#8f2d56" opacity="0.8" filter="url(#ai-glow)">
        <animateMotion dur="3s" repeatCount="indefinite"
          path="M 40,60 L 90,105 L 120,80 L 150,50 L 200,60" />
      </circle>
      <circle r="1.5" fill="#a84e72" opacity="0.6">
        <animateMotion dur="3.5s" repeatCount="indefinite"
          path="M 40,160 L 90,130 L 120,125 L 150,130 L 200,160" />
      </circle>
      <circle r="1" fill="#8f2d56" opacity="0.4">
        <animateMotion dur="4s" repeatCount="indefinite"
          path="M 40,60 L 80,50 L 120,35 L 150,50 L 200,60" />
      </circle>

      <text x="120" y="215" fill="#8f2d56" fontSize="7" opacity="0.15"
        textAnchor="middle" fontFamily="monospace">
        neural network
      </text>
    </svg>
  );
}
