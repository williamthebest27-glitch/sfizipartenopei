/* ===========================================================================
   Iconcine condivise fra piu pagine.
   Disegnate a mano invece che prese da una libreria: stesso peso di tratto su
   tutte, nessun pacchetto in piu, e scalano col testo perche ereditano
   currentColor. Quelle usate da una pagina sola restano nel suo file.
   =========================================================================== */

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function Svg({ size = 16, box = 24, children, className }) {
  return (
    <svg
      viewBox={`0 0 ${box} ${box}`}
      width={size}
      height={size}
      fill="none"
      aria-hidden="true"
      className={`shrink-0 ${className || ""}`}
    >
      {children}
    </svg>
  );
}

export function PhoneGlyph({ size = 15 }) {
  return (
    <Svg size={size}>
      <path
        d="M5.2 3.8h3.1l1.5 3.8-1.9 1.4a11.4 11.4 0 0 0 5.1 5.1l1.4-1.9 3.8 1.5v3.1a1.6 1.6 0 0 1-1.8 1.6A15.4 15.4 0 0 1 3.6 5.6a1.6 1.6 0 0 1 1.6-1.8Z"
        {...stroke}
        strokeWidth="1.5"
      />
    </Svg>
  );
}

export function CalendarGlyph({ size = 15 }) {
  return (
    <Svg size={size}>
      <rect x="3.2" y="5.2" width="17.6" height="15.6" rx="3" {...stroke} />
      <path d="M3.2 10h17.6M8 3.2v3.6M16 3.2v3.6" {...stroke} />
    </Svg>
  );
}

export function ArrowGlyph({ size = 16 }) {
  return (
    <Svg size={size}>
      <path d="M4 12h15m0 0-5.5-5.5M19 12l-5.5 5.5" {...stroke} strokeWidth="1.8" />
    </Svg>
  );
}

export function PinGlyph({ size = 16 }) {
  return (
    <Svg size={size}>
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" {...stroke} strokeWidth="1.7" />
      <circle cx="12" cy="10" r="2.6" {...stroke} strokeWidth="1.7" />
    </Svg>
  );
}

export function MailGlyph({ size = 16 }) {
  return (
    <Svg size={size}>
      <rect x="2.8" y="5" width="18.4" height="14" rx="3" {...stroke} />
      <path d="m4.4 7.6 6.5 4.6a2 2 0 0 0 2.2 0l6.5-4.6" {...stroke} />
    </Svg>
  );
}

export function ClockGlyph({ size = 16 }) {
  return (
    <Svg size={size}>
      <circle cx="12" cy="12" r="8.6" {...stroke} />
      <path d="M12 7.2V12l3.2 2" {...stroke} />
    </Svg>
  );
}

export function SendGlyph({ size = 16 }) {
  return (
    <Svg size={size}>
      <path d="M20.4 3.6 10.8 13.2M20.4 3.6l-6.2 16.8-3.4-7.2-7.2-3.4Z" {...stroke} />
    </Svg>
  );
}

export function CheckGlyph({ size = 16 }) {
  return (
    <Svg size={size}>
      <path d="m4.8 12.6 4.6 4.6 9.8-10.4" {...stroke} strokeWidth="2" />
    </Svg>
  );
}

export function TruckGlyph({ size = 16 }) {
  return (
    <Svg size={size}>
      <path d="M2.8 6.6h10.4v10H2.8zM13.2 10h3.9l3.1 3.2v3.4h-7z" {...stroke} />
      <circle cx="7" cy="18.2" r="1.8" {...stroke} />
      <circle cx="16.8" cy="18.2" r="1.8" {...stroke} />
    </Svg>
  );
}

export function InstagramGlyph({ size = 16 }) {
  return (
    <Svg size={size}>
      <rect x="3.4" y="3.4" width="17.2" height="17.2" rx="5" {...stroke} />
      <circle cx="12" cy="12" r="4" {...stroke} />
      <circle cx="17" cy="7" r="1.1" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function FacebookGlyph({ size = 16 }) {
  return (
    <Svg size={size}>
      <path d="M14.4 21v-7.4h2.5l.5-3h-3V8.8c0-.9.3-1.5 1.6-1.5H17.5V4.6A20 20 0 0 0 15.1 4.5c-2.4 0-4 1.5-4 4.1v2.9H8.5v3h2.6V21Z" {...stroke} />
    </Svg>
  );
}

/* --------------------------------------------------------------------------
   Marchi di categoria. Vivono grandi e sbiaditi dentro le card senza foto:
   riempiono lo slot con qualcosa di disegnato invece di lasciarlo vuoto.
   -------------------------------------------------------------------------- */
export function CategoryGlyph({ kind, className, weight = 1.15 }) {
  const s = { ...stroke, strokeWidth: weight };
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      {kind === "pot" && (
        <>
          <path d="M4.4 9.4h15.2v5.8a4 4 0 0 1-4 4H8.4a4 4 0 0 1-4-4Z" {...s} />
          <path d="M3 9.4h18M6.6 9.4 5.4 6.2M17.4 9.4l1.2-3.2M12 9.4V5.8" {...s} />
        </>
      )}
      {kind === "fry" && (
        <>
          <path d="M5.6 9h12.8l-1.3 8.2a2.6 2.6 0 0 1-2.6 2.2H9.5a2.6 2.6 0 0 1-2.6-2.2Z" {...s} />
          <path d="M9.4 9V5.2M12 9V4.2M14.6 9V5.6M4.2 9h15.6" {...s} />
        </>
      )}
      {kind === "sandwich" && (
        <>
          <path d="M3.6 10.2c0-2.4 3.8-4.2 8.4-4.2s8.4 1.8 8.4 4.2" {...s} />
          <path d="M3.6 10.2h16.8M4.6 13.4h14.8M3.6 16.2h16.8c0 1.8-3.8 2.8-8.4 2.8s-8.4-1-8.4-2.8Z" {...s} />
        </>
      )}
    </svg>
  );
}
