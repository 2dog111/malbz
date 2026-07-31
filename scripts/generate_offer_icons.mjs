import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const outDir = new URL("../assets/", import.meta.url);
mkdirSync(outDir, { recursive: true });

const palette = {
  ink: "#151C2A",
  teal: "#09BEA8",
  blue: "#09A5ED",
  yellow: "#F7CE38",
  coral: "#FF6A4A",
};

const base = (body) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320">
  <rect x="24" y="24" width="272" height="272" rx="34" fill="${palette.yellow}" opacity=".12"/>
  <rect x="31" y="31" width="258" height="258" rx="29" fill="${palette.blue}" opacity=".08"/>
  <g opacity=".18">
    <circle cx="260" cy="65" r="18" fill="${palette.coral}"/>
    <circle cx="58" cy="246" r="14" fill="${palette.teal}"/>
    <path d="M48 86h35M237 244h42" stroke="${palette.ink}" stroke-width="7" stroke-linecap="round"/>
  </g>
  ${body}
</svg>
`;

const icons = {
  "chatgpt-pro-icon": base(`
  <g stroke-linecap="round" stroke-linejoin="round">
    <rect x="72" y="70" width="176" height="180" rx="28" fill="${palette.ink}" opacity=".12"/>
    <rect x="60" y="58" width="176" height="180" rx="28" fill="${palette.blue}" opacity=".26" stroke="${palette.ink}" stroke-width="8"/>
    <path d="M60 108h176" stroke="${palette.ink}" stroke-width="8"/>
    <circle cx="88" cy="84" r="7" fill="${palette.coral}"/>
    <circle cx="111" cy="84" r="7" fill="${palette.yellow}"/>
    <circle cx="134" cy="84" r="7" fill="${palette.teal}"/>
    <rect x="88" y="132" width="118" height="66" rx="14" fill="${palette.yellow}" opacity=".42" stroke="${palette.ink}" stroke-width="7"/>
    <path d="M112 161h68M112 181h48" stroke="${palette.ink}" stroke-width="7"/>
    <path d="M216 151l36-17-14 40 26 27-42 2-22 36-14-40-41-10 34-25 1-43z" fill="${palette.teal}" opacity=".86" stroke="${palette.ink}" stroke-width="7"/>
    <path d="M213 184l13 13 31-39" fill="none" stroke="${palette.yellow}" stroke-width="9"/>
    <path d="M100 226h92" stroke="${palette.coral}" stroke-width="10"/>
  </g>`),
  "chatgpt-api-icon": base(`
  <g stroke-linecap="round" stroke-linejoin="round">
    <rect x="74" y="70" width="172" height="178" rx="24" fill="${palette.ink}" opacity=".12"/>
    <rect x="64" y="60" width="172" height="178" rx="24" fill="${palette.teal}" opacity=".36"/>
    <rect x="78" y="86" width="144" height="130" rx="13" fill="${palette.yellow}" opacity=".2" stroke="${palette.ink}" stroke-width="8"/>
    <path d="M78 104h144" stroke="${palette.ink}" stroke-width="8"/>
    <circle cx="98" cy="83" r="6" fill="${palette.coral}"/>
    <circle cx="118" cy="83" r="6" fill="${palette.blue}"/>
    <circle cx="138" cy="83" r="6" fill="${palette.yellow}"/>
    <path d="M110 145l-18 17 18 17M190 145l18 17-18 17" fill="none" stroke="${palette.blue}" stroke-width="10"/>
    <path d="M162 136l-24 56" stroke="${palette.coral}" stroke-width="10"/>
    <path d="M102 224h96" stroke="${palette.ink}" stroke-width="8"/>
    <circle cx="218" cy="218" r="34" fill="${palette.blue}" opacity=".3" stroke="${palette.ink}" stroke-width="8"/>
    <path d="M203 217h30M218 202v30" stroke="${palette.teal}" stroke-width="9"/>
  </g>`),
  "direct-icon": base(`
  <g stroke-linecap="round" stroke-linejoin="round">
    <rect x="70" y="82" width="180" height="132" rx="20" fill="${palette.yellow}" opacity=".28" stroke="${palette.ink}" stroke-width="8"/>
    <path d="M70 112h180" stroke="${palette.ink}" stroke-width="8"/>
    <circle cx="94" cy="98" r="6" fill="${palette.coral}"/>
    <circle cx="114" cy="98" r="6" fill="${palette.blue}"/>
    <rect x="92" y="132" width="82" height="16" rx="8" fill="${palette.teal}"/>
    <rect x="92" y="162" width="118" height="13" rx="7" fill="${palette.blue}" opacity=".72"/>
    <path d="M88 228l42-62 42 62" fill="${palette.coral}" opacity=".78" stroke="${palette.ink}" stroke-width="8"/>
    <path d="M130 184v44" stroke="${palette.yellow}" stroke-width="10"/>
    <circle cx="222" cy="224" r="31" fill="${palette.teal}" opacity=".35" stroke="${palette.ink}" stroke-width="8"/>
    <path d="M207 224h30" stroke="${palette.blue}" stroke-width="9"/>
  </g>`),
  "topup-icon": base(`
  <g stroke-linecap="round" stroke-linejoin="round">
    <rect x="74" y="104" width="172" height="108" rx="22" fill="${palette.teal}" opacity=".34" stroke="${palette.ink}" stroke-width="8"/>
    <path d="M74 135h172" stroke="${palette.ink}" stroke-width="8"/>
    <circle cx="218" cy="174" r="12" fill="${palette.yellow}" stroke="${palette.ink}" stroke-width="6"/>
    <path d="M111 88c22-24 74-24 98 0" fill="none" stroke="${palette.blue}" stroke-width="11"/>
    <path d="M208 89l-4-25 25 5" fill="none" stroke="${palette.blue}" stroke-width="9"/>
    <path d="M210 232c-22 24-74 24-98 0" fill="none" stroke="${palette.coral}" stroke-width="11"/>
    <path d="M112 231l4 25-25-5" fill="none" stroke="${palette.coral}" stroke-width="9"/>
    <circle cx="118" cy="174" r="28" fill="${palette.yellow}" opacity=".72" stroke="${palette.ink}" stroke-width="8"/>
    <path d="M108 174h20M118 164v20" stroke="${palette.ink}" stroke-width="7"/>
  </g>`),
  "ads-analytics-icon": base(`
  <g stroke-linecap="round" stroke-linejoin="round">
    <rect x="62" y="68" width="184" height="168" rx="23" fill="${palette.blue}" opacity=".22" stroke="${palette.ink}" stroke-width="8"/>
    <path d="M62 104h184" stroke="${palette.ink}" stroke-width="8"/>
    <circle cx="88" cy="86" r="6" fill="${palette.coral}"/>
    <circle cx="108" cy="86" r="6" fill="${palette.yellow}"/>
    <circle cx="128" cy="86" r="6" fill="${palette.teal}"/>
    <path d="M91 196l38-38 35 23 47-57" fill="none" stroke="${palette.teal}" stroke-width="11"/>
    <path d="M202 124h29v29" fill="none" stroke="${palette.teal}" stroke-width="9"/>
    <circle cx="112" cy="198" r="10" fill="${palette.coral}"/>
    <circle cx="164" cy="181" r="10" fill="${palette.yellow}"/>
    <circle cx="211" cy="125" r="10" fill="${palette.teal}"/>
    <path d="M216 212l18 42 11-20 21-9-42-18z" fill="${palette.coral}" opacity=".86" stroke="${palette.ink}" stroke-width="7"/>
  </g>`),
  "landing-icon": base(`
  <g stroke-linecap="round" stroke-linejoin="round">
    <rect x="64" y="62" width="190" height="176" rx="23" fill="${palette.teal}" opacity=".32" stroke="${palette.ink}" stroke-width="8"/>
    <path d="M64 100h190" stroke="${palette.ink}" stroke-width="8"/>
    <circle cx="90" cy="82" r="7" fill="${palette.coral}"/>
    <circle cx="112" cy="82" r="7" fill="${palette.yellow}"/>
    <circle cx="134" cy="82" r="7" fill="${palette.blue}"/>
    <rect x="88" y="120" width="132" height="24" rx="8" fill="${palette.yellow}" opacity=".48" stroke="${palette.ink}" stroke-width="6"/>
    <path d="M92 165h72M92 187h58M92 209h86" stroke="${palette.ink}" stroke-width="8"/>
    <rect x="172" y="160" width="56" height="48" rx="9" fill="${palette.blue}" opacity=".72" stroke="${palette.ink}" stroke-width="7"/>
    <path d="M178 199l17-17 13 11 12-14" fill="none" stroke="${palette.yellow}" stroke-width="7"/>
    <circle cx="194" cy="176" r="6" fill="${palette.teal}"/>
    <path d="M225 218l20 48 12-23 24-10-48-21z" fill="${palette.coral}" opacity=".86" stroke="${palette.ink}" stroke-width="7"/>
  </g>`),
  "video-icon": base(`
  <g stroke-linecap="round" stroke-linejoin="round">
    <rect x="60" y="80" width="200" height="132" rx="24" fill="${palette.coral}" opacity=".24" stroke="${palette.ink}" stroke-width="8"/>
    <path d="M60 112h200" stroke="${palette.ink}" stroke-width="8"/>
    <path d="M141 139l54 32-54 32z" fill="${palette.yellow}" stroke="${palette.ink}" stroke-width="8"/>
    <path d="M92 232h136" stroke="${palette.blue}" stroke-width="10"/>
    <path d="M121 232h45" stroke="${palette.teal}" stroke-width="10"/>
    <circle cx="226" cy="88" r="32" fill="${palette.teal}" opacity=".4" stroke="${palette.ink}" stroke-width="8"/>
    <path d="M211 88l10 11 20-25" fill="none" stroke="${palette.yellow}" stroke-width="9"/>
    <path d="M85 88h24M124 88h24" stroke="${palette.ink}" stroke-width="7"/>
  </g>`),
  "sendfox-icon": base(`
  <g stroke-linecap="round" stroke-linejoin="round">
    <rect x="62" y="94" width="188" height="126" rx="22" fill="${palette.yellow}" opacity=".34" stroke="${palette.ink}" stroke-width="8"/>
    <path d="M72 106l84 64 84-64" fill="none" stroke="${palette.ink}" stroke-width="8"/>
    <path d="M78 209l55-49M242 209l-55-49" stroke="${palette.teal}" stroke-width="8"/>
    <circle cx="244" cy="84" r="24" fill="${palette.coral}" opacity=".86" stroke="${palette.ink}" stroke-width="7"/>
    <path d="M235 84h18M244 75v18" stroke="${palette.yellow}" stroke-width="7"/>
    <path d="M104 244h104" stroke="${palette.blue}" stroke-width="10"/>
    <path d="M156 220v24M116 244v22M196 244v22" stroke="${palette.blue}" stroke-width="8"/>
    <circle cx="116" cy="270" r="9" fill="${palette.teal}" stroke="${palette.ink}" stroke-width="5"/>
    <circle cx="196" cy="270" r="9" fill="${palette.coral}" stroke="${palette.ink}" stroke-width="5"/>
  </g>`),
};

for (const [name, svg] of Object.entries(icons)) {
  const svgPath = join(outDir.pathname, `${name}.svg`);
  const webpPath = join(outDir.pathname, `${name}.webp`);
  writeFileSync(svgPath, svg);
  execFileSync("magick", [svgPath, "-resize", "320x320", "-quality", "92", webpPath], {
    stdio: "inherit",
  });
}
