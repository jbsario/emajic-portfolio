type LogoMarkProps = {
  className?: string;
};

/**
 * Vector recreation of the Ethereal Majic mark: a blueprint house with the
 * mirrored-E + M monogram and architectural construction lines. Drawn with
 * currentColor so it inherits the brand gold (or any text color) from its parent.
 */
export const LogoMark = ({ className }: LogoMarkProps) => (
  <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    {/* Blueprint construction lines */}
    <g stroke="currentColor" strokeWidth="1" opacity="0.65">
      <line x1="22" y1="41" x2="68" y2="4" />
      <line x1="98" y1="43" x2="50" y2="6" />
      <line x1="16" y1="84" x2="104" y2="84" />
      <line x1="24" y1="77" x2="24" y2="91" />
      <line x1="96" y1="77" x2="96" y2="91" />
    </g>

    {/* House outline, double-lined */}
    <path d="M28 84 V36 L58 12 L92 38 V84 Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="miter" />
    <path d="M34 80 V40 L58 20 L86 42 V80 Z" stroke="currentColor" strokeWidth="1.5" />

    {/* Monogram: mirrored E */}
    <g fill="currentColor">
      <rect x="50" y="46" width="4" height="30" />
      <rect x="39" y="46" width="11" height="4" />
      <rect x="41" y="59" width="9" height="4" />
      <rect x="39" y="72" width="11" height="4" />
    </g>

    {/* Monogram: M */}
    <g fill="currentColor">
      <rect x="60" y="46" width="4" height="30" />
      <rect x="69" y="46" width="4" height="24" />
      <rect x="78" y="46" width="4" height="30" />
      <rect x="60" y="46" width="22" height="4" />
    </g>
  </svg>
);

export default LogoMark;
