import * as React from "react";

type Props = React.SVGProps<SVGSVGElement> & { 
  title?: string;
  gradient?: boolean;
};

/**
 * Coquinate Q Logo Component
 * Represents a stylized Q with a spoon handle
 * 
 * Colors:
 * - Teal: #2AA6A0
 * - Coral: #E96E68  
 * - Ink: #0F1B1A
 */
export default function LogoQ({ 
  title = "Coquinate", 
  gradient = true, 
  ...props 
}: Props) {
  const teal = "#2AA6A0";
  const coral = "#E96E68";
  const ink = "#0F1B1A";
  
  return (
    <svg viewBox="0 0 64 64" role="img" aria-label={title} {...props}>
      {gradient && (
        <defs>
          <linearGradient id="cq-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={teal} />
            <stop offset="100%" stopColor={coral} />
          </linearGradient>
        </defs>
      )}
      <g fill="none" stroke={gradient ? "url(#cq-g)" : ink} strokeWidth={5} strokeLinecap="round">
        <circle cx={28} cy={28} r={18} />
        <path d="M38.5 38.5 L54 54" />
      </g>
      <circle cx={56} cy={56} r={5} fill={gradient ? "url(#cq-g)" : ink} />
    </svg>
  );
}