import type { CSSProperties } from "react";

export default function ChargingHeroVisual() {
  return (
    <div className="relative h-[520px] w-full overflow-hidden rounded-[36px] border border-emerald-100 bg-[radial-gradient(circle_at_top,#f7fff5_0%,#eaf5e7_42%,#d9ead4_100%)] shadow-[0_24px_80px_rgba(15,95,45,0.14)]">
      <svg
        viewBox="0 0 1200 900"
        className="absolute inset-0 h-full w-full"
        role="img"
        aria-label="PlugV charging network illustration"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="road" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#dfe9dd" />
            <stop offset="100%" stopColor="#cfdcca" />
          </linearGradient>

          <linearGradient id="carBody" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="52%" stopColor="#f7fbf7" />
            <stop offset="100%" stopColor="#e7efe6" />
          </linearGradient>

          <linearGradient id="glass" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#111827" />
            <stop offset="100%" stopColor="#0b1220" />
          </linearGradient>

          <linearGradient id="charger" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e7ece7" />
          </linearGradient>

          <linearGradient id="emeraldGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#16a34a" />
            <stop offset="100%" stopColor="#0f7a37" />
          </linearGradient>

          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="18" stdDeviation="18" floodColor="#0f5132" floodOpacity="0.18" />
          </filter>

          <pattern id="grid" width="90" height="90" patternUnits="userSpaceOnUse">
            <path d="M 90 0 L 0 0 0 90" fill="none" stroke="#1f7a38" strokeOpacity="0.06" strokeWidth="1" />
          </pattern>
        </defs>

        <rect width="1200" height="900" fill="url(#grid)" />

        {/* soft ambient circles */}
        <circle cx="920" cy="170" r="210" fill="#ffffff" opacity="0.35" />
        <circle cx="260" cy="260" r="170" fill="#ffffff" opacity="0.22" />
        <circle cx="330" cy="740" r="220" fill="#ffffff" opacity="0.18" />

        {/* rear landscape */}
        <path
          d="M 0 560 C 140 500 240 490 350 520 C 470 555 560 560 670 530 C 780 500 900 470 1040 485 C 1120 494 1170 508 1200 520 L 1200 900 L 0 900 Z"
          fill="#d5e6d1"
          opacity="0.9"
        />

        {/* road */}
        <path
          d="M 0 650 C 140 610 270 600 400 630 C 520 658 640 666 770 644 C 900 622 1030 605 1200 625 L 1200 900 L 0 900 Z"
          fill="url(#road)"
        />

        {/* side bushes */}
        <g opacity="0.9">
          <circle cx="98" cy="610" r="28" fill="#2e7d45" />
          <circle cx="130" cy="592" r="34" fill="#2f8a48" />
          <circle cx="154" cy="622" r="26" fill="#2a6e3c" />
          <circle cx="113" cy="636" r="24" fill="#3a9150" />

          <circle cx="1030" cy="625" r="30" fill="#2e7d45" />
          <circle cx="1070" cy="602" r="38" fill="#2f8a48" />
          <circle cx="1100" cy="632" r="28" fill="#2a6e3c" />
        </g>

        {/* charging pedestal */}
        <g filter="url(#shadow)">
          <rect x="890" y="210" width="145" height="440" rx="28" fill="url(#charger)" />
          <rect x="890" y="210" width="145" height="64" rx="28" fill="url(#emeraldGlow)" />
          <rect x="890" y="602" width="145" height="48" rx="20" fill="#1f2937" />

          <rect x="916" y="305" width="94" height="128" rx="14" fill="#20242b" />
          <rect x="930" y="326" width="34" height="42" rx="8" fill="#dff4db" />
          <rect x="970" y="326" width="34" height="42" rx="8" fill="#cfe0ff" />
          <circle cx="962" cy="389" r="7" fill="#16a34a" />

          <rect x="928" y="456" width="18" height="90" rx="9" fill="#111827" />
          <rect x="992" y="456" width="18" height="90" rx="9" fill="#111827" />
          <path d="M 937 530 C 936 560 930 575 918 605" stroke="#111827" strokeWidth="8" strokeLinecap="round" />
          <path d="M 1001 530 C 1002 560 1008 575 1020 605" stroke="#111827" strokeWidth="8" strokeLinecap="round" />
          <path d="M 939 611 C 950 611 957 604 961 597" stroke="#111827" strokeWidth="8" strokeLinecap="round" />
          <path d="M 1003 611 C 992 611 985 604 981 597" stroke="#111827" strokeWidth="8" strokeLinecap="round" />
        </g>

        {/* wall charger */}
        <g filter="url(#shadow)">
          <rect x="82" y="250" width="114" height="160" rx="24" fill="#1f2937" />
          <rect x="92" y="258" width="94" height="130" rx="20" fill="url(#charger)" />
          <circle cx="139" cy="342" r="26" fill="none" stroke="url(#emeraldGlow)" strokeWidth="7" />
          <path d="M 150 350 C 170 360 182 374 188 396" stroke="#111827" strokeWidth="7" strokeLinecap="round" />
          <rect x="112" y="272" width="54" height="16" rx="8" fill="#d9ead4" />
          <circle cx="138" cy="282" r="5" fill="#16a34a" />
        </g>

        {/* house door / background */}
        <rect x="250" y="170" width="160" height="330" rx="12" fill="#0f172a" opacity="0.18" />
        <rect x="265" y="156" width="186" height="350" rx="18" fill="#d9e0d8" opacity="0.3" />
        <rect x="272" y="165" width="172" height="336" rx="16" fill="#111827" opacity="0.8" />
        <rect x="360" y="220" width="6" height="130" rx="3" fill="#ffffff" opacity="0.65" />
        <rect x="447" y="250" width="18" height="70" rx="9" fill="#3b3b3b" opacity="0.65" />
        <path d="M 440 238 C 450 244 455 256 455 268" stroke="#6b7280" strokeWidth="5" strokeLinecap="round" />

        {/* route / cable path */}
        <path
          d="M 188 400 C 300 398 350 446 406 472 C 466 501 548 510 632 498 C 712 486 764 455 816 430"
          fill="none"
          stroke="#1f7a38"
          strokeOpacity="0.35"
          strokeWidth="4"
          strokeDasharray="10 12"
        />

        {/* car shadow */}
        <ellipse cx="560" cy="650" rx="310" ry="40" fill="#0f5132" opacity="0.14" />

        {/* car */}
        <g filter="url(#shadow)">
          <path
            d="M 294 530
               C 315 470 360 430 428 416
               L 616 400
               C 692 392 758 412 810 454
               C 832 472 851 492 864 512
               L 883 512
               C 903 512 920 528 920 548
               C 920 568 904 584 884 584
               L 842 584
               C 830 611 804 629 774 629
               C 744 629 719 611 707 584
               L 458 584
               C 446 611 420 629 390 629
               C 360 629 335 611 323 584
               L 292 584
               C 275 584 261 570 261 553
               C 261 540 269 530 282 528
               Z"
            fill="url(#carBody)"
          />

          <path
            d="M 451 423
               L 615 410
               C 676 406 729 421 772 450
               C 789 462 804 476 816 492
               L 516 492
               C 497 462 478 440 451 423 Z"
            fill="url(#glass)"
          />

          <path
            d="M 494 422 L 577 416 L 543 492 L 462 492 Z"
            fill="#151a22"
          />

          <path
            d="M 294 529 C 364 524 441 523 524 523 L 817 523"
            fill="none"
            stroke="#111827"
            strokeOpacity="0.18"
            strokeWidth="6"
            strokeLinecap="round"
          />

          <path
            d="M 309 560 C 345 545 383 539 432 538"
            fill="none"
            stroke="#111827"
            strokeOpacity="0.35"
            strokeWidth="4"
            strokeLinecap="round"
          />

          <path
            d="M 832 560 C 856 556 872 547 887 535"
            fill="none"
            stroke="#111827"
            strokeOpacity="0.25"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* wheels */}
          <g>
            <circle cx="395" cy="588" r="58" fill="#111827" />
            <circle cx="395" cy="588" r="40" fill="#1f2937" />
            <circle cx="395" cy="588" r="18" fill="#d9ead4" />
            <circle cx="395" cy="588" r="8" fill="#111827" />
            <path d="M 395 548 V 628 M 355 588 H 435 M 368 561 L 422 615 M 368 615 L 422 561" stroke="#d9ead4" strokeWidth="4" opacity="0.8" />

            <circle cx="758" cy="588" r="58" fill="#111827" />
            <circle cx="758" cy="588" r="40" fill="#1f2937" />
            <circle cx="758" cy="588" r="18" fill="#d9ead4" />
            <circle cx="758" cy="588" r="8" fill="#111827" />
            <path d="M 758 548 V 628 M 718 588 H 798 M 731 561 L 785 615 M 731 615 L 785 561" stroke="#d9ead4" strokeWidth="4" opacity="0.8" />
          </g>

          {/* door lines and trim */}
          <path d="M 596 437 L 662 447" stroke="#111827" strokeOpacity="0.18" strokeWidth="4" />
          <path d="M 642 448 L 676 482" stroke="#111827" strokeOpacity="0.18" strokeWidth="4" />
          <path d="M 691 452 L 732 485" stroke="#111827" strokeOpacity="0.18" strokeWidth="4" />
          <path d="M 808 495 L 849 495" stroke="#d9ead4" strokeOpacity="0.6" strokeWidth="6" strokeLinecap="round" />
        </g>

        {/* badge */}
        <g filter="url(#shadow)">
          <rect x="474" y="90" width="250" height="78" rx="39" fill="#ffffff" opacity="0.88" />
          <text x="599" y="134" textAnchor="middle" fontSize="28" fontWeight="700" fill="#0f5132" fontFamily="Inter, Arial, sans-serif">
            PlugV Charging Network
          </text>
        </g>
      </svg>
    </div>
  );
}