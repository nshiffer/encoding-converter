interface LogoProps {
  size?: number
}

export const Logo: React.FC<LogoProps> = ({ size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ flexShrink: 0 }}
  >
    <defs>
      <linearGradient id="logo-g1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#a855f7" />
        <stop offset="100%" stopColor="#4f91ff" />
      </linearGradient>
      <linearGradient id="logo-g2" x1="1" y1="1" x2="0" y2="0">
        <stop offset="0%" stopColor="#4f91ff" />
        <stop offset="100%" stopColor="#a855f7" />
      </linearGradient>
    </defs>
    <rect x="1" y="1" width="30" height="30" rx="7" fill="#0d0918" />
    {/* Top arc */}
    <path
      d="M 10.5 13.5 A 6.5 6.5 0 0 1 21.5 13.5"
      stroke="url(#logo-g1)"
      strokeWidth="2.8"
      fill="none"
      strokeLinecap="round"
    />
    {/* Top arrowhead */}
    <polygon points="21.5,11.2 21.5,15.8 24.5,13.5" fill="#4f91ff" />
    {/* Bottom arc */}
    <path
      d="M 21.5 18.5 A 6.5 6.5 0 0 1 10.5 18.5"
      stroke="url(#logo-g2)"
      strokeWidth="2.8"
      fill="none"
      strokeLinecap="round"
    />
    {/* Bottom arrowhead */}
    <polygon points="10.5,16.2 10.5,20.8 7.5,18.5" fill="#a855f7" />
    {/* Brackets */}
    <path d="M 6.5 9 L 4.5 9 L 4.5 23 L 6.5 23" stroke="#9080b8" strokeWidth="0.8" fill="none" opacity="0.5" />
    <path d="M 25.5 9 L 27.5 9 L 27.5 23 L 25.5 23" stroke="#9080b8" strokeWidth="0.8" fill="none" opacity="0.5" />
  </svg>
)
