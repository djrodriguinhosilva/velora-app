import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 20, ...props }: IconProps) {
  return { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, ...props };
}

export function IconSearch(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export function IconPlay(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor" stroke="none">
      <path d="M8 5.5v13l11-6.5L8 5.5Z" />
    </svg>
  );
}

export function IconPause(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor" stroke="none">
      <rect x="6" y="5" width="4.5" height="14" rx="1" />
      <rect x="13.5" y="5" width="4.5" height="14" rx="1" />
    </svg>
  );
}

export function IconHeart({ filled, size, ...props }: IconProps & { filled?: boolean }) {
  return (
    <svg {...base({ size, ...props })} fill={filled ? "currentColor" : "none"}>
      <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
    </svg>
  );
}

export function IconUser(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5 19c1.4-3 4-4.5 7-4.5S17.6 16 19 19" />
    </svg>
  );
}

export function IconMenu(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function IconClose(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

export function IconChevron({ dir, size, ...props }: IconProps & { dir?: "left" | "right" }) {
  const d = dir === "left" ? "m15 5-7 7 7 7" : "m9 5 7 7-7 7";
  return (
    <svg {...base({ size, ...props })}>
      <path d={d} />
    </svg>
  );
}

export function IconSkip({ dir, size, ...props }: IconProps & { dir?: "back" | "fwd" }) {
  return (
    <svg {...base({ size, ...props })}>
      {dir === "back" ? (
        <>
          <path d="M11 7 5 12l6 5" />
          <path d="M19 7h-3v10h3" />
        </>
      ) : (
        <>
          <path d="m13 7 6 5-6 5" />
          <path d="M5 7h3v10H5" />
        </>
      )}
    </svg>
  );
}

export function IconVolume({ muted, size, ...props }: IconProps & { muted?: boolean }) {
  return (
    <svg {...base({ size, ...props })}>
      <path d="M4 10v4h3l4 3V7L7 10H4Z" />
      {muted ? <path d="m16 10 4 4m0-4-4 4" /> : <path d="M16 9.5a4 4 0 0 1 0 5M18.5 7a7 7 0 0 1 0 10" />}
    </svg>
  );
}

export function IconFullscreen(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M8 4H4v4M16 4h4v4M8 20H4v-4M16 20h4v-4" />
    </svg>
  );
}

export function IconGear(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v2.2M12 18.8V21M3 12h2.2M18.8 12H21M5.6 5.6l1.6 1.6M16.8 16.8l1.6 1.6M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6" />
    </svg>
  );
}

export function IconInfo(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 11v5M12 8h.01" />
    </svg>
  );
}

export function IconSun(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.5 1.5M16.9 16.9l1.5 1.5M18.4 5.6l-1.5 1.5M7.1 16.9l-1.5 1.5" />
    </svg>
  );
}

export function IconHistory(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 12a8 8 0 1 0 2.3-5.6" />
      <path d="M4 5v4h4M12 8v5l3 2" />
    </svg>
  );
}
