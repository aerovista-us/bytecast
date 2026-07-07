/**
 * Inline SVG illustrations for ByteCast episode slides (EP-001 … EP-004).
 * Consumed by: welcome_to_bytecast, aerovista_7_division_overview, the_main_doors, current_truth_basics.
 * Lookup: slide `id` in bytecast_ep_profile.json → ep001 / ep002 / ep003 / ep004.
 * prefers-reduced-motion: SMIL tags stripped via ByteCastSlideArt.applyReducedMotion(root).
 * Inactive slides: pages hide animate/animateTransform with CSS visibility (saves paint).
 */
(function (global) {
  "use strict";

  const vb = 'viewBox="0 0 360 220" width="360" height="220" role="img"';

  const ep001 = {
    s1: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Packs connect into a loop">
      <defs>
        <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#22a7ff"/><stop offset="100%" stop-color="#a66bff"/></linearGradient>
      </defs>
      <rect x="8" y="70" width="56" height="40" rx="10" fill="rgba(34,167,255,0.15)" stroke="#22a7ff" stroke-width="1.5"/>
      <rect x="8" y="120" width="56" height="40" rx="10" fill="rgba(166,107,255,0.12)" stroke="#a66bff" stroke-width="1.5"/>
      <rect x="8" y="20" width="56" height="40" rx="10" fill="rgba(255,106,42,0.12)" stroke="#ff6a2a" stroke-width="1.5"/>
      <path d="M64 40 H120 Q200 40 240 90" fill="none" stroke="url(#g1)" stroke-width="2" stroke-dasharray="6 4" opacity="0.7">
        <animate attributeName="stroke-dashoffset" from="0" to="40" dur="2s" repeatCount="indefinite"/>
      </path>
      <path d="M64 90 H130 Q210 90 250 110" fill="none" stroke="url(#g1)" stroke-width="2" stroke-dasharray="6 4" opacity="0.6">
        <animate attributeName="stroke-dashoffset" from="0" to="-40" dur="2.4s" repeatCount="indefinite"/>
      </path>
      <path d="M64 140 H125 Q200 140 245 115" fill="none" stroke="url(#g1)" stroke-width="2" stroke-dasharray="6 4" opacity="0.5">
        <animate attributeName="stroke-dashoffset" from="0" to="40" dur="2.8s" repeatCount="indefinite"/>
      </path>
      <circle cx="280" cy="110" r="48" fill="none" stroke="#22a7ff" stroke-width="2.5" opacity="0.9">
        <animate attributeName="r" values="46;52;46" dur="3s" repeatCount="indefinite"/>
      </circle>
      <circle cx="280" cy="110" r="32" fill="rgba(34,167,255,0.08)" stroke="#a66bff" stroke-width="1.5" opacity="0.85"/>
      <text x="280" y="114" text-anchor="middle" fill="rgba(255,255,255,0.9)" font-size="11" font-family="ui-monospace,monospace">LOOP</text>
    </svg>`,

    s2: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Six journey steps">
      <text x="180" y="22" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="10" font-family="ui-sans-serif">Listen → Slide → Engage → Training → Seed → Badge</text>
      ${["Listen","Slide","Engage","Train","Seed","Badge"].map((t,i)=>{
        const x = 18 + i * 56;
        return `<g transform="translate(${x},40)">
          <rect width="50" height="140" rx="8" fill="rgba(34,167,255,${0.08 + i*0.04})" stroke="#22a7ff" stroke-width="1.2" opacity="0.95">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="${2.2+i*0.15}s" repeatCount="indefinite"/>
          </rect>
          <text x="25" y="78" text-anchor="middle" fill="rgba(255,255,255,0.88)" font-size="9" font-family="ui-monospace,monospace">${t}</text>
        </g>`;
      }).join("")}
    </svg>`,

    s3: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Path versus pile">
      <path d="M20 160 C 80 40, 160 40, 220 100 S 320 80, 340 120" fill="none" stroke="#22a7ff" stroke-width="3" stroke-linecap="round" stroke-dasharray="400" pathLength="400">
        <animate attributeName="stroke-dashoffset" values="400;0;400" dur="5s" repeatCount="indefinite"/>
      </path>
      <text x="180" y="200" text-anchor="middle" fill="#22a7ff" font-size="11" font-weight="700">PATH</text>
      ${[[28,22],[48,38],[32,52],[58,28],[42,68],[22,48],[55,58],[38,42]].map(([x,y],i)=>
        `<circle cx="${x}" cy="${y}" r="5" fill="rgba(255,255,255,0.25)">
          <animate attributeName="opacity" values="0.2;0.55;0.2" dur="${1.5+i*0.15}s" repeatCount="indefinite"/>
        </circle>`
      ).join("")}
      <text x="52" y="92" fill="rgba(255,255,255,0.4)" font-size="10">pile</text>
    </svg>`,

    s4: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Five doors">
      ${[
        {l:"Entry",x:30},{l:"Playlist",x:95},{l:"Training",x:160},{l:"Seed",x:225},{l:"Docs",x:290}
      ].map((d,i)=>
        `<g transform="translate(${d.x-28},55)">
          <rect width="56" height="100" rx="10" fill="rgba(0,0,0,0.35)" stroke="#22a7ff" stroke-width="1.5" opacity="0.9">
            <animateTransform attributeName="transform" type="translate" values="0,0; 0,-4; 0,0" dur="${2.5+i*0.3}s" repeatCount="indefinite" additive="sum"/>
          </rect>
          <text x="28" y="58" text-anchor="middle" fill="rgba(255,255,255,0.9)" font-size="9" font-family="ui-monospace,monospace">${d.l}</text>
        </g>`
      ).join("")}
      <text x="180" y="200" text-anchor="middle" fill="rgba(255,255,255,0.45)" font-size="10">Public doors — use in order of your task</text>
    </svg>`,

    s5: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Learner versus internal">
      <rect x="12" y="40" width="155" height="150" rx="14" fill="rgba(34,167,255,0.08)" stroke="#22a7ff" stroke-width="2"/>
      <text x="90" y="70" text-anchor="middle" fill="#22a7ff" font-size="12" font-weight="700">Learner-facing</text>
      <text x="90" y="100" text-anchor="middle" fill="rgba(255,255,255,0.75)" font-size="10">Playlist • Episodes</text>
      <rect x="193" y="40" width="155" height="150" rx="14" fill="rgba(166,107,255,0.06)" stroke="#a66bff" stroke-width="2"/>
      <text x="270" y="70" text-anchor="middle" fill="#a66bff" font-size="12" font-weight="700">Internal</text>
      <text x="270" y="100" text-anchor="middle" fill="rgba(255,255,255,0.65)" font-size="10">Raw • Maintainers</text>
      <line x1="180" y1="55" x2="180" y2="175" stroke="rgba(255,255,255,0.2)" stroke-width="2" stroke-dasharray="4 4"/>
    </svg>`,

    s6: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Canonical starts">
      <rect x="40" y="50" width="130" height="120" rx="16" fill="rgba(34,167,255,0.12)" stroke="#22a7ff" stroke-width="2"/>
      <text x="105" y="95" text-anchor="middle" fill="#fff" font-size="13" font-weight="800">EP-001</text>
      <text x="105" y="118" text-anchor="middle" fill="rgba(255,255,255,0.65)" font-size="10">ByteCast</text>
      <rect x="190" y="50" width="130" height="120" rx="16" fill="rgba(166,107,255,0.1)" stroke="#a66bff" stroke-width="2"/>
      <text x="255" y="95" text-anchor="middle" fill="#fff" font-size="13" font-weight="800">EP-002</text>
      <text x="255" y="118" text-anchor="middle" fill="rgba(255,255,255,0.65)" font-size="10">AeroVista</text>
      <path d="M170 110 L190 110" stroke="#ffc45a" stroke-width="2" marker-end="url(#arr1)"/>
      <defs><marker id="arr1" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#ffc45a"/></marker></defs>
      <text x="180" y="195" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="10">Context first — then ecosystem</text>
    </svg>`,

    s7: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Sequential gates">
      ${["Listen","Slide","Engage","Train","Seed"].map((t,i)=>{
        const x = 20 + i * 68;
        const locked = i >= 3;
        return `<g transform="translate(${x},70)">
          <rect width="60" height="72" rx="8" fill="${locked?"rgba(0,0,0,0.4)":"rgba(34,167,255,0.15)"}" stroke="${locked?"#555":"#22a7ff"}" stroke-width="1.5"/>
          <text x="30" y="42" text-anchor="middle" fill="rgba(255,255,255,0.85)" font-size="9">${t}</text>
          ${locked?`<g transform="translate(22,52)"><rect x="4" y="10" width="20" height="14" rx="2" fill="none" stroke="#ffc45a" stroke-width="1.5"/><path d="M8 10 V6 Q14 2 20 6 V10" fill="none" stroke="#ffc45a" stroke-width="1.5"/></g>`:""}
        </g>`;
      }).join("")}
      <text x="180" y="200" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="10">Early steps unlock what comes next</text>
    </svg>`,

    s8: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Success checklist">
      ${["Loop","Doors","Resume","Ignore noise"].map((t,i)=>{
        const y = 48 + i * 38;
        return `<g transform="translate(40,${y})">
          <circle cx="14" cy="14" r="12" fill="none" stroke="#22a7ff" stroke-width="2">
            <animate attributeName="stroke-opacity" values="0.4;1;0.4" dur="${1.8+i*0.2}s" repeatCount="indefinite"/>
          </circle>
          <path d="M8 14 L12 18 L20 10" fill="none" stroke="#89f1c8" stroke-width="2" stroke-linecap="round"/>
          <text x="36" y="19" fill="rgba(255,255,255,0.88)" font-size="12">${t}</text>
        </g>`;
      }).join("")}
    </svg>`,

    s9: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Beginner promise">
      <text x="180" y="100" text-anchor="middle" fill="rgba(255,255,255,0.92)" font-size="15" font-weight="600">You do not need</text>
      <text x="180" y="128" text-anchor="middle" fill="rgba(34,167,255,0.95)" font-size="18" font-weight="800">everything today</text>
      <ellipse cx="180" cy="115" rx="140" ry="36" fill="none" stroke="#22a7ff" stroke-width="1" opacity="0.35">
        <animate attributeName="rx" values="130;150;130" dur="4s" repeatCount="indefinite"/>
      </ellipse>
    </svg>`,

    s10: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Recap orbit">
      <circle cx="180" cy="110" r="70" fill="none" stroke="rgba(34,167,255,0.25)" stroke-width="1" stroke-dasharray="8 6">
        <animateTransform attributeName="transform" type="rotate" from="0 180 110" to="360 180 110" dur="24s" repeatCount="indefinite"/>
      </circle>
      ${["Packs","Loop","Doors","Path"].map((t,i)=>{
        const a = (i/4)*Math.PI*2 - Math.PI/2;
        const cx = 180 + Math.cos(a)*52;
        const cy = 110 + Math.sin(a)*52;
        const tx = 180 + Math.cos(a)*78;
        const ty = 110 + Math.sin(a)*78;
        return `<circle cx="${cx}" cy="${cy}" r="16" fill="rgba(34,167,255,0.2)" stroke="#22a7ff">
          <animate attributeName="r" values="14;18;14" dur="${2+i*0.3}s" repeatCount="indefinite"/>
        </circle>
        <text x="${tx}" y="${ty+4}" text-anchor="middle" fill="rgba(255,255,255,0.9)" font-size="9" font-family="ui-monospace,monospace">${t}</text>`;
      }).join("")}
    </svg>`,
  };

  const ep002 = {
    s_open: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="EP-002 title">
      <text x="180" y="88" text-anchor="middle" fill="#fff" font-size="20" font-weight="800">AeroVista</text>
      <text x="180" y="118" text-anchor="middle" fill="#22a7ff" font-size="13" font-weight="700">7 divisions · one ecosystem</text>
      <text x="180" y="150" text-anchor="middle" fill="rgba(255,255,255,0.55)" font-size="11">Shared direction · HQ at the center</text>
    </svg>`,

    s1: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Unified platform">
      <rect x="90" y="60" width="180" height="100" rx="16" fill="rgba(34,167,255,0.08)" stroke="#22a7ff" stroke-width="2"/>
      <text x="180" y="100" text-anchor="middle" fill="#fff" font-size="14" font-weight="700">AeroVista LLC</text>
      <text x="180" y="122" text-anchor="middle" fill="rgba(255,255,255,0.65)" font-size="10">multimedia · tech · AI · story-first</text>
    </svg>`,

    s2: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Mission vision philosophy">
      ${[{t:"Mission",c:"#22a7ff",x:30},{t:"Vision",c:"#a66bff",x:135},{t:"Philosophy",c:"#ff6a2a",x:240}].map(d=>
        `<g transform="translate(${d.x},45)">
          <rect width="90" height="130" rx="12" fill="rgba(0,0,0,0.35)" stroke="${d.c}" stroke-width="1.5">
            <animate attributeName="opacity" values="0.75;1;0.75" dur="3s" repeatCount="indefinite"/>
          </rect>
          <text x="45" y="28" text-anchor="middle" fill="${d.c}" font-size="11" font-weight="800">${d.t}</text>
        </g>`
      ).join("")}
    </svg>`,

    s3: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Seven peers around HQ">
      <circle cx="180" cy="110" r="22" fill="rgba(255,196,90,0.25)" stroke="#ffc45a" stroke-width="2"/>
      <text x="180" y="115" text-anchor="middle" fill="#ffc45a" font-size="9" font-weight="800">HQ</text>
      ${["Nx","Ev","Sf","Sm","Lu","Ve","Hz"].map((abbr,i)=>{
        const a = (i/7)*Math.PI*2 - Math.PI/2;
        const cx = 180 + Math.cos(a)*88;
        const cy = 110 + Math.sin(a)*72;
        return `<g>
          <circle cx="${cx}" cy="${cy}" r="20" fill="rgba(34,167,255,0.15)" stroke="#22a7ff" stroke-width="1.2">
            <animate attributeName="r" values="18;22;18" dur="${2.2+i*0.15}s" repeatCount="indefinite"/>
          </circle>
          <text x="${cx}" y="${cy+4}" text-anchor="middle" fill="#fff" font-size="9" font-family="monospace">${abbr}</text>
        </g>`;
      }).join("")}
    </svg>`,

    s4: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Nexus technology">
      <rect x="60" y="40" width="240" height="140" rx="14" fill="rgba(34,167,255,0.1)" stroke="#22a7ff" stroke-width="2"/>
      <path d="M80 160 L100 80 L140 120 L180 70 L220 130 L280 90" fill="none" stroke="#22a7ff" stroke-width="2" stroke-dasharray="300" pathLength="300">
        <animate attributeName="stroke-dashoffset" values="0;-60;0" dur="3s" repeatCount="indefinite"/>
      </path>
      <text x="180" y="35" text-anchor="middle" fill="#22a7ff" font-size="13" font-weight="800">Nexus TechWorks</text>
    </svg>`,

    s5: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="EchoVerse audio">
      <path d="M40 110 Q90 40 140 110 T240 110 T320 110" fill="none" stroke="#a66bff" stroke-width="2.5">
        <animate attributeName="d" values="M40 110 Q90 40 140 110 T240 110 T320 110;M40 110 Q90 180 140 110 T240 110 T320 110;M40 110 Q90 40 140 110 T240 110 T320 110" dur="3s" repeatCount="indefinite"/>
      </path>
      <text x="180" y="195" text-anchor="middle" fill="#a66bff" font-size="12" font-weight="800">EchoVerse Audio</text>
    </svg>`,

    s6: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="SkyForge worlds">
      <polygon points="180,35 240,180 120,180" fill="rgba(255,106,42,0.12)" stroke="#ff6a2a" stroke-width="2"/>
      <rect x="150" y="95" width="60" height="50" rx="6" fill="rgba(34,167,255,0.2)" stroke="#22a7ff"/>
      <text x="180" y="205" text-anchor="middle" fill="#ff6a2a" font-size="12" font-weight="800">SkyForge</text>
    </svg>`,

    s7: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Summit learning">
      <path d="M70 150 L120 60 L170 120 L220 50 L270 150 Z" fill="none" stroke="#22a7ff" stroke-width="2" stroke-linejoin="round"/>
      <circle cx="120" cy="60" r="6" fill="#ffc45a"><animate attributeName="cy" values="60;55;60" dur="2s" repeatCount="indefinite"/></circle>
      <text x="180" y="200" text-anchor="middle" fill="#22a7ff" font-size="12" font-weight="800">Summit Learning</text>
    </svg>`,

    s8: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Lumina brand">
      <circle cx="120" cy="110" r="50" fill="none" stroke="#a66bff" stroke-width="2" stroke-dasharray="10 6">
        <animateTransform attributeName="transform" type="rotate" from="0 120 110" to="360 120 110" dur="12s" repeatCount="indefinite"/>
      </circle>
      <rect x="200" y="70" width="100" height="80" rx="8" fill="rgba(166,107,255,0.15)" stroke="#a66bff"/>
      <text x="180" y="200" text-anchor="middle" fill="#a66bff" font-size="12" font-weight="800">Lumina Creative</text>
    </svg>`,

    s9: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Vespera publishing">
      <rect x="100" y="50" width="160" height="110" rx="6" fill="rgba(0,0,0,0.4)" stroke="#fff" stroke-width="1"/>
      <line x1="115" y1="75" x2="245" y2="75" stroke="rgba(255,255,255,0.3)"/>
      <line x1="115" y1="95" x2="220" y2="95" stroke="rgba(255,255,255,0.2)"/>
      <line x1="115" y1="115" x2="235" y2="115" stroke="rgba(255,255,255,0.2)"/>
      <text x="180" y="190" text-anchor="middle" fill="#fff" font-size="12" font-weight="800">Vespera Publishing</text>
    </svg>`,

    s10: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Horizon aerial">
      <path d="M80 140 L180 50 L280 140" fill="none" stroke="#22a7ff" stroke-width="2" stroke-dasharray="6 4"/>
      <circle cx="180" cy="75" r="8" fill="#ff6a2a">
        <animate attributeName="cy" values="75;65;75" dur="2.5s" repeatCount="indefinite"/>
      </circle>
      <text x="180" y="195" text-anchor="middle" fill="#22a7ff" font-size="12" font-weight="800">Horizon Aerial</text>
    </svg>`,

    s11: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="HQ hub">
      <circle cx="180" cy="110" r="55" fill="rgba(255,196,90,0.12)" stroke="#ffc45a" stroke-width="2.5"/>
      <text x="180" y="105" text-anchor="middle" fill="#ffc45a" font-size="14" font-weight="800">HQ</text>
      <text x="180" y="128" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-size="9">strategy · brand · ops</text>
    </svg>`,

    s12: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Cross division links">
      ${[[80,60],[280,60],[180,160]].map(([x,y],i)=>
        `<circle cx="${x}" cy="${y}" r="24" fill="rgba(34,167,255,0.2)" stroke="#22a7ff">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="${2+i*0.4}s" repeatCount="indefinite"/>
        </circle>`
      ).join("")}
      <line x1="104" y1="72" x2="256" y2="72" stroke="#a66bff" stroke-width="1.5" opacity="0.7"/>
      <line x1="180" y1="84" x2="180" y2="136" stroke="#a66bff" stroke-width="1.5" opacity="0.7"/>
    </svg>`,

    s13: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Mental map">
      <text x="180" y="40" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">Home</text>
      <line x1="180" y1="48" x2="180" y2="75" stroke="rgba(255,255,255,0.3)"/>
      <rect x="100" y="78" width="160" height="36" rx="8" fill="rgba(34,167,255,0.12)" stroke="#22a7ff"/>
      <text x="180" y="100" text-anchor="middle" fill="#fff" font-size="10">Divisions (peers)</text>
      <line x1="180" y1="114" x2="180" y2="138" stroke="rgba(255,255,255,0.3)"/>
      <rect x="70" y="142" width="220" height="44" rx="8" fill="rgba(0,0,0,0.35)" stroke="rgba(255,255,255,0.2)"/>
      <text x="180" y="168" text-anchor="middle" fill="rgba(255,255,255,0.75)" font-size="10">Apps · projects · status by division</text>
    </svg>`,

    s14: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Learner focus">
      ${[{t:"Structure",x:35,y:70},{t:"Roles",x:135,y:85},{t:"Detail",x:235,y:100}].map((d,i)=>
        `<g>
          <rect x="${d.x}" y="${d.y}" width="90" height="44" rx="8" fill="rgba(34,167,255,${0.1+i*0.06})" stroke="#22a7ff">
            <animate attributeName="opacity" values="0.65;1;0.65" dur="${2.2+i*0.3}s" repeatCount="indefinite"/>
          </rect>
          <text x="${d.x+45}" y="${d.y+28}" text-anchor="middle" fill="#fff" font-size="11" font-weight="600">${d.t}</text>
        </g>`
      ).join("")}
      <text x="180" y="195" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="10">Context before complexity</text>
    </svg>`,

    s15: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Recap">
      <text x="180" y="100" text-anchor="middle" fill="rgba(255,255,255,0.9)" font-size="11">7 peers · HQ · integration</text>
      <circle cx="180" cy="120" r="3" fill="#22a7ff"><animate attributeName="r" values="2;5;2" dur="1.5s" repeatCount="indefinite"/></circle>
    </svg>`,

    s16: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Self check">
      <text x="180" y="90" text-anchor="middle" fill="#ffc45a" font-size="12" font-weight="700">Before you continue</text>
      <text x="180" y="120" text-anchor="middle" fill="rgba(255,255,255,0.75)" font-size="10">Can you answer the five checks?</text>
      <text x="180" y="185" text-anchor="middle" fill="#22a7ff" font-size="11" font-weight="700">→ EP-003 The Main Doors</text>
    </svg>`,
  };

  const ep003 = {
    s_open: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Five doors around learner">
      <defs>
        <radialGradient id="ep3soGlow" cx="50%" cy="48%" r="58%"><stop offset="0%" stop-color="#22a7ff" stop-opacity="0.22"/><stop offset="55%" stop-color="#a66bff" stop-opacity="0.06"/><stop offset="100%" stop-color="#050607" stop-opacity="0"/></radialGradient>
        <filter id="ep3soF" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <rect width="360" height="220" fill="url(#ep3soGlow)"/>
      ${[
        { x: 40, y: 88 },
        { x: 118, y: 36 },
        { x: 196, y: 36 },
        { x: 274, y: 88 },
        { x: 180, y: 150 },
      ]
        .map(
          (p) => `<line x1="180" y1="102" x2="${p.x}" y2="${p.y}" stroke="rgba(34,167,255,0.2)" stroke-width="1" stroke-dasharray="3 5">
        <animate attributeName="stroke-opacity" values="0.2;0.55;0.2" dur="3.2s" repeatCount="indefinite"/>
      </line>`
        )
        .join("")}
      ${[
        { x: 40, y: 88, c: "#22a7ff", t: "Entry" },
        { x: 118, y: 36, c: "#ffc45a", t: "List" },
        { x: 196, y: 36, c: "#a66bff", t: "Hub" },
        { x: 274, y: 88, c: "#ff6a2a", t: "Seed" },
        { x: 180, y: 150, c: "#8fd9ff", t: "Docs" },
      ].map(
        (d, i) => `<g>
        <rect x="${d.x - 28}" y="${d.y - 22}" width="56" height="44" rx="10" fill="rgba(255,255,255,0.06)" stroke="${d.c}" stroke-width="1.5">
          <animate attributeName="opacity" values="0.55;1;0.55" dur="${2.4 + i * 0.2}s" repeatCount="indefinite"/>
        </rect>
        <text x="${d.x}" y="${d.y + 4}" text-anchor="middle" fill="rgba(255,255,255,0.88)" font-size="9" font-weight="700">${d.t}</text>
      </g>`
      ).join("")}
      <circle cx="180" cy="102" r="7" fill="#22a7ff" filter="url(#ep3soF)"><animate attributeName="r" values="6;9;6" dur="2s" repeatCount="indefinite"/></circle>
      <text x="180" y="208" text-anchor="middle" fill="rgba(255,255,255,0.45)" font-size="9">You are here → pick the door</text>
    </svg>`,

    s1: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Front door opens">
      <rect x="120" y="48" width="120" height="140" rx="8" fill="rgba(34,167,255,0.08)" stroke="#22a7ff" stroke-width="2"/>
      <path d="M120 48 V188 H240 V48" fill="none" stroke="rgba(255,255,255,0.2)"/>
      <path d="M120 48 L180 48 L180 188 L120 188 Z" fill="rgba(34,167,255,0.15)" stroke="#22a7ff">
        <animateTransform attributeName="transform" type="rotate" values="0 120 118;-18 120 118;0 120 118" dur="3s" repeatCount="indefinite" keyTimes="0;0.45;1"/>
      </path>
      <circle cx="228" cy="118" r="4" fill="#ffc45a"/>
      <text x="180" y="210" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="10">Orientation first</text>
    </svg>`,

    s2: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Playlist progress">
      ${[0, 1, 2, 3, 4].map(
        (i) => `<rect x="48" y="${36 + i * 26}" width="264" height="18" rx="6" fill="rgba(0,0,0,0.35)" stroke="rgba(255,255,255,0.1)">
        <animate attributeName="opacity" values="0.35;0.85;0.35" dur="${2.2 + i * 0.2}s" repeatCount="indefinite"/>
      </rect>`
      ).join("")}
      <rect x="48" y="88" width="220" height="18" rx="6" fill="rgba(34,167,255,0.28)" stroke="#22a7ff" stroke-width="1.2">
        <animate attributeName="opacity" values="0.65;1;0.65" dur="1.8s" repeatCount="indefinite"/>
      </rect>
      <text x="58" y="101" fill="#fff" font-size="8" font-weight="700">EP-003</text>
      <rect x="276" y="90" width="36" height="14" rx="5" fill="#ffc45a" opacity="0.9">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="1.4s" repeatCount="indefinite"/>
      </rect>
      <text x="294" y="100" text-anchor="middle" fill="#0a0c10" font-size="7" font-weight="800">NEXT</text>
      <text x="180" y="200" text-anchor="middle" fill="#22a7ff" font-size="10" font-weight="700">Golden Path state lives here</text>
    </svg>`,

    s3: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Router hub">
      <rect x="150" y="78" width="60" height="60" rx="12" fill="rgba(166,107,255,0.2)" stroke="#a66bff" stroke-width="2"/>
      <text x="180" y="114" text-anchor="middle" fill="#fff" font-size="10" font-weight="700">HUB</text>
      ${[
        { x1: 180, y1: 78, x2: 60, y2: 40 },
        { x1: 210, y1: 108, x2: 300, y2: 108 },
        { x1: 180, y1: 138, x2: 180, y2: 190 },
        { x1: 150, y1: 108, x2: 48, y2: 108 },
      ]
        .map(
          (L) => `<line x1="${L.x1}" y1="${L.y1}" x2="${L.x2}" y2="${L.y2}" stroke="rgba(34,167,255,0.45)" stroke-width="1.5" stroke-dasharray="4 4">
        <animate attributeName="stroke-dashoffset" from="0" to="16" dur="2s" repeatCount="indefinite"/>
      </line>`
        )
        .join("")}
      <text x="180" y="208" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="9">Routes, not every lesson paragraph</text>
    </svg>`,

    s4: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Templates stack">
      ${[0, 1, 2].map(
        (i) => `<g transform="translate(${130 + i * 12},${52 + i * 14})">
        <rect width="100" height="56" rx="8" fill="rgba(255,106,42,${0.12 + i * 0.06})" stroke="#ff6a2a" stroke-width="1.2">
          <animate attributeName="opacity" values="0.65;1;0.65" dur="${2.2 + i * 0.3}s" repeatCount="indefinite"/>
        </rect>
        <text x="50" y="33" text-anchor="middle" fill="rgba(255,255,255,0.75)" font-size="9">template</text>
      </g>`
      ).join("")}
      <text x="180" y="188" text-anchor="middle" fill="#ff6a2a" font-size="10" font-weight="700">Repeatable builds — later</text>
    </svg>`,

    s5: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Governed docs">
      <rect x="100" y="52" width="160" height="110" rx="10" fill="rgba(143,217,255,0.08)" stroke="#8fd9ff" stroke-width="1.5"/>
      <path d="M120 78 H220 M120 98 H200 M120 118 H210 M120 138 H190" stroke="rgba(255,255,255,0.25)" stroke-width="2"/>
      <rect x="100" y="52" width="36" height="14" rx="4" fill="#22a7ff">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite"/>
      </rect>
      <text x="180" y="182" text-anchor="middle" fill="#8fd9ff" font-size="10" font-weight="700">Standards + governed answers</text>
    </svg>`,

    s6: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Public versus internal">
      <rect x="48" y="62" width="120" height="96" rx="10" fill="rgba(34,167,255,0.1)" stroke="#22a7ff" stroke-width="1.5"/>
      <text x="108" y="108" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">Learner path</text>
      <text x="108" y="128" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="8">Day 1 contract</text>
      <rect x="196" y="62" width="124" height="96" rx="10" fill="rgba(0,0,0,0.4)" stroke="rgba(255,255,255,0.18)" stroke-dasharray="5 4"/>
      <text x="258" y="102" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-size="9">Internal</text>
      <g transform="translate(258,124)">
        <rect x="-12" y="-8" width="24" height="20" rx="3" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1.8"/>
        <path d="M-6 -8 V-14 Q-6 -20 0 -20 Q6 -20 6 -14 V-8" fill="none" stroke="rgba(255,255,255,0.45)" stroke-width="1.8" stroke-linecap="round"/>
        <circle cx="0" cy="-2" r="2" fill="rgba(255,196,90,0.8)"><animate attributeName="opacity" values="0.4;1;0.4" dur="1.6s" repeatCount="indefinite"/></circle>
      </g>
      <text x="180" y="195" text-anchor="middle" fill="rgba(255,255,255,0.55)" font-size="9">Earn depth after the map</text>
    </svg>`,

    s7: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Next episode">
      <text x="180" y="88" text-anchor="middle" fill="#ffc45a" font-size="11" font-weight="700">Checklist</text>
      ${[0, 1, 2].map(
        (i) => `<circle cx="120" cy="${118 + i * 22}" r="6" fill="none" stroke="#22a7ff" stroke-width="1.5">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="${1.8 + i * 0.2}s" repeatCount="indefinite"/>
      </circle><path d="M116 ${115 + i * 22} l3 4 l6 -8" stroke="#22a7ff" fill="none" stroke-width="1.5" opacity="0.9"/>`
      ).join("")}
      <text x="180" y="185" text-anchor="middle" fill="#22a7ff" font-size="11" font-weight="700">→ EP-004 Current Truth</text>
    </svg>`,
  };

  const ep004 = {
    s_open: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Three layers">
      <defs>
        <linearGradient id="ep4soBand" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#22a7ff" stop-opacity="0.5"/><stop offset="50%" stop-color="#a66bff" stop-opacity="0.4"/><stop offset="100%" stop-color="#ffc45a" stop-opacity="0.5"/></linearGradient>
      </defs>
      <path d="M30 178 Q180 155 330 178" fill="none" stroke="url(#ep4soBand)" stroke-width="2" stroke-linecap="round" opacity="0.55" stroke-dasharray="6 10" pathLength="100">
        <animate attributeName="stroke-dashoffset" values="0;-32;0" dur="4s" repeatCount="indefinite"/>
      </path>
      <rect x="40" y="52" width="86" height="108" rx="10" fill="rgba(34,167,255,0.1)" stroke="#22a7ff" stroke-width="1.5">
        <animate attributeName="stroke-opacity" values="0.5;1;0.5" dur="2.4s" repeatCount="indefinite"/>
      </rect>
      <text x="83" y="108" text-anchor="middle" fill="#fff" font-size="10" font-weight="800">ACOS</text>
      <text x="83" y="124" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="8">see</text>
      <rect x="137" y="52" width="86" height="108" rx="10" fill="rgba(166,107,255,0.1)" stroke="#a66bff" stroke-width="1.5">
        <animate attributeName="stroke-opacity" values="0.5;1;0.5" dur="2.4s" begin="0.4s" repeatCount="indefinite"/>
      </rect>
      <text x="180" y="108" text-anchor="middle" fill="#fff" font-size="10" font-weight="800">Domain</text>
      <text x="180" y="124" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="8">own</text>
      <rect x="234" y="52" width="86" height="108" rx="10" fill="rgba(255,196,90,0.08)" stroke="#ffc45a" stroke-width="1.5">
        <animate attributeName="stroke-opacity" values="0.5;1;0.5" dur="2.4s" begin="0.8s" repeatCount="indefinite"/>
      </rect>
      <text x="277" y="108" text-anchor="middle" fill="#fff" font-size="10" font-weight="800">SOT</text>
      <text x="277" y="124" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="8">trust</text>
      <text x="180" y="200" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="9">Stack the layers — don’t collapse them</text>
    </svg>`,

    s1: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="From fog to focus">
      <g opacity="0.35">
        ${[0, 1, 2, 3, 4, 5].map(
          (i) => `<circle cx="${40 + (i % 3) * 30}" cy="${50 + Math.floor(i / 3) * 35}" r="8" fill="rgba(255,255,255,0.2)">
          <animate attributeName="cx" values="${40 + (i % 3) * 30};${45 + (i % 3) * 30};${40 + (i % 3) * 30}" dur="${3 + i * 0.2}s" repeatCount="indefinite"/>
        </circle>`
        ).join("")}
      </g>
      <path d="M200 160 L280 60" fill="none" stroke="#22a7ff" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="130" pathLength="130">
        <animate attributeName="stroke-dashoffset" values="130;0;130" dur="3s" repeatCount="indefinite"/>
      </path>
      <circle cx="280" cy="60" r="14" fill="rgba(34,167,255,0.25)" stroke="#22a7ff">
        <animate attributeName="r" values="12;16;12" dur="2s" repeatCount="indefinite"/>
      </circle>
      <text x="280" y="64" text-anchor="middle" fill="#fff" font-size="9" font-weight="700">1</text>
    </svg>`,

    s2: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Cockpit gauges">
      <rect x="70" y="48" width="220" height="120" rx="12" fill="rgba(0,0,0,0.35)" stroke="#22a7ff"/>
      ${[
        { cx: 120, cy: 108 },
        { cx: 180, cy: 88 },
        { cx: 240, cy: 108 },
      ]
        .map(
          (g, i) => `<g transform="translate(${g.cx},${g.cy})">
        <circle r="28" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="4"/>
        <line x1="0" y1="0" x2="0" y2="-22" stroke="#22a7ff" stroke-width="2" stroke-linecap="round">
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="${4 + i}s" repeatCount="indefinite" additive="sum"/>
        </line>
      </g>`
        )
        .join("")}
      <text x="180" y="188" text-anchor="middle" fill="#22a7ff" font-size="10" font-weight="700">Unified visibility</text>
    </svg>`,

    s3: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="System of record">
      <ellipse cx="180" cy="200" rx="70" ry="18" fill="rgba(166,107,255,0.15)"/>
      <path d="M110 100 V160 C110 175 250 175 250 160 V100 C250 85 110 85 110 100Z" fill="rgba(166,107,255,0.2)" stroke="#a66bff" stroke-width="2"/>
      <text x="180" y="130" text-anchor="middle" fill="#fff" font-size="10" font-weight="700">RECORD</text>
      <text x="180" y="148" text-anchor="middle" fill="rgba(255,255,255,0.55)" font-size="8">domain-owned</text>
      <circle cx="180" cy="72" r="5" fill="#ffc45a"><animate attributeName="opacity" values="0.4;1;0.4" dur="1.8s" repeatCount="indefinite"/></circle>
    </svg>`,

    s4: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Canon stamp">
      <rect x="90" y="58" width="180" height="100" rx="8" fill="rgba(0,0,0,0.4)" stroke="rgba(255,255,255,0.15)"/>
      <g transform="translate(180,108)">
        <rect x="-52" y="-32" width="104" height="64" rx="6" fill="none" stroke="#ffc45a" stroke-width="3" transform="rotate(-12)">
          <animate attributeName="opacity" values="0.65;1;0.65" dur="2.2s" repeatCount="indefinite"/>
        </rect>
        <text x="0" y="6" text-anchor="middle" fill="#ffc45a" font-size="13" font-weight="800" transform="rotate(-12)">SOT</text>
      </g>
      <text x="180" y="188" text-anchor="middle" fill="rgba(255,255,255,0.55)" font-size="9">Active vs legacy — labeled</text>
    </svg>`,

    s5: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Five buckets">
      ${[
        { y: 36, w: 210, c: "#22a7ff", t: "ACOS — visibility" },
        { y: 62, w: 198, c: "#ffc45a", t: "SOT — trust labels" },
        { y: 88, w: 186, c: "#8fd9ff", t: "Reporting — signals" },
        { y: 114, w: 174, c: "#a66bff", t: "Work orders — execution" },
        { y: 140, w: 162, c: "#ff6a2a", t: "Domain DB — record" },
      ]
        .map(
          (r, i) => `<rect x="${180 - r.w / 2}" y="${r.y}" width="${r.w}" height="22" rx="5" fill="rgba(255,255,255,0.03)" stroke="${r.c}" stroke-width="1.2">
        <animate attributeName="opacity" values="0.55;1;0.55" dur="${2.5 + i * 0.12}s" repeatCount="indefinite"/>
      </rect>
      <text x="180" y="${r.y + 15}" text-anchor="middle" fill="rgba(255,255,255,0.88)" font-size="8" font-weight="700">${r.t}</text>`
        )
        .join("")}
      <text x="180" y="188" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-size="8">Sort before you ship</text>
    </svg>`,

    s6: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Newest file trap">
      <defs><marker id="ep4s6mk" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#ff6a2a"/></marker></defs>
      <rect x="60" y="50" width="100" height="72" rx="6" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)"/>
      <text x="110" y="82" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="8">old_canon.md</text>
      <rect x="200" y="50" width="100" height="72" rx="6" fill="rgba(34,167,255,0.15)" stroke="#22a7ff" stroke-width="2"/>
      <text x="250" y="82" text-anchor="middle" fill="#fff" font-size="8" font-weight="700">draft_notes.md</text>
      <text x="250" y="98" text-anchor="middle" fill="#22a7ff" font-size="7">edited 2m ago</text>
      <path d="M170 86 L190 86" stroke="#ff6a2a" stroke-width="2" marker-end="url(#ep4s6mk)"/>
      <text x="180" y="168" text-anchor="middle" fill="#ff6a2a" font-size="10" font-weight="700">Newest ≠ official</text>
    </svg>`,

    s7: `<svg class="bc-art" ${vb} xmlns="http://www.w3.org/2000/svg" aria-label="Handoff">
      <text x="180" y="88" text-anchor="middle" fill="#ffc45a" font-size="11" font-weight="700">Day 1 check</text>
      <rect x="100" y="108" width="160" height="44" rx="10" fill="rgba(34,167,255,0.12)" stroke="#22a7ff">
        <animate attributeName="stroke-opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite"/>
      </rect>
      <text x="180" y="136" text-anchor="middle" fill="#fff" font-size="10" font-weight="700">TR-001A</text>
      <text x="180" y="182" text-anchor="middle" fill="rgba(255,255,255,0.55)" font-size="9">Prove it in writing + MC</text>
    </svg>`,
  };

  function applyReducedMotion(root) {
    var mq = global.matchMedia && global.matchMedia("(prefers-reduced-motion: reduce)");
    if (!mq || !mq.matches || !root || !root.querySelectorAll) return;
    root.querySelectorAll(".bc-art animate, .bc-art animateTransform").forEach(function (el) {
      try {
        el.remove();
      } catch (e) {}
    });
  }

  global.ByteCastSlideArt = {
    ep001: function (slideId) {
      return ep001[slideId] || "";
    },
    ep002: function (slideId) {
      return ep002[slideId] || "";
    },
    ep003: function (slideId) {
      return ep003[slideId] || "";
    },
    ep004: function (slideId) {
      return ep004[slideId] || "";
    },
    applyReducedMotion: applyReducedMotion,
  };
})(typeof window !== "undefined" ? window : globalThis);
