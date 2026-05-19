/**
 * Decorative inline SVG shapes for the home hero.
 * Restrained palette: terracotta variants + olive + warm cream.
 * No external image assets required.
 */
export default function HeroShapes() {
  return (
    <>
      {/* Top-left blob */}
      <svg
        aria-hidden="true"
        className="absolute pointer-events-none select-none"
        style={{ top: '8%', left: '4%', width: '180px', height: '180px', opacity: 0.9 }}
        viewBox="0 0 200 200"
      >
        <path
          fill="oklch(55% 0.18 35)"
          d="M44.6,-58.3C57.6,-49.5,67.7,-35.4,71.5,-19.7C75.3,-4,72.7,13.4,64.1,26.7C55.4,40,40.6,49.4,25.1,55.5C9.5,61.6,-6.8,64.4,-21.3,60.1C-35.8,55.8,-48.5,44.4,-57.4,30.3C-66.2,16.2,-71.2,-0.7,-67.6,-15.5C-64,-30.4,-51.7,-43.2,-37.7,-52C-23.7,-60.8,-7.9,-65.6,5.9,-66.5C19.7,-67.4,31.6,-67.1,44.6,-58.3Z"
          transform="translate(100 100)"
        />
      </svg>

      {/* Top-right wedge */}
      <svg
        aria-hidden="true"
        className="absolute pointer-events-none select-none"
        style={{ top: '14%', right: '8%', width: '120px', height: '120px' }}
        viewBox="0 0 120 120"
      >
        <polygon points="10,110 60,15 110,110" fill="oklch(45% 0.15 25)" />
      </svg>

      {/* Bottom-left clover */}
      <svg
        aria-hidden="true"
        className="absolute pointer-events-none select-none"
        style={{ bottom: '6%', left: '10%', width: '160px', height: '160px', opacity: 0.85 }}
        viewBox="0 0 200 200"
      >
        <path
          fill="oklch(58% 0.12 110)"
          d="M52.8,-58.3C66.4,-46.8,73.5,-27.5,72.4,-9.4C71.3,8.7,62,25.5,49.6,38.5C37.2,51.4,21.7,60.4,4.5,57.7C-12.7,55,-25.4,40.6,-39.5,28.3C-53.6,16.1,-69.1,6,-73.3,-8.5C-77.5,-23,-70.5,-41.9,-57.2,-53.7C-43.8,-65.5,-24,-70.2,-3.3,-66.4C17.4,-62.6,39.2,-69.8,52.8,-58.3Z"
          transform="translate(100 100)"
        />
      </svg>

      {/* Bottom-right ring */}
      <svg
        aria-hidden="true"
        className="absolute pointer-events-none select-none"
        style={{ bottom: '10%', right: '6%', width: '140px', height: '140px' }}
        viewBox="0 0 140 140"
      >
        <circle
          cx="70"
          cy="70"
          r="58"
          fill="none"
          stroke="oklch(35% 0.12 15)"
          strokeWidth="14"
        />
      </svg>

      {/* Mid-right small dot */}
      <svg
        aria-hidden="true"
        className="absolute pointer-events-none select-none hidden md:block"
        style={{ top: '38%', right: '22%', width: '36px', height: '36px' }}
        viewBox="0 0 36 36"
      >
        <circle cx="18" cy="18" r="14" fill="oklch(70% 0.14 75)" />
      </svg>
    </>
  )
}
