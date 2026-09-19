/**
 * Generates the placeholder artwork in /public/images.
 *
 * Every file it writes is a stand-in for real photography — each one is
 * labelled "PLACEHOLDER" on the image itself so nothing fake can reach
 * production unnoticed. Replace the files with real photographs (same
 * filenames, or update the path in the content file that references them) and
 * you never need to run this script again.
 *
 *   node scripts/generate-placeholders.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { deflateSync } from "node:zlib";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, "..", "public", "images");
mkdirSync(outDir, { recursive: true });

/** Palettes, loosely: sea at different hours of the day. */
const palettes = {
  golden: ["#f6c07a", "#e08b52", "#a8542f", "#2a3f56"],
  dusk: ["#f0a98a", "#b5657a", "#4a3f6b", "#16233a"],
  noon: ["#bfe3e8", "#6fb2c2", "#2e6f7e", "#14263c"],
  night: ["#3c5f7a", "#22405c", "#16283f", "#0c1726"],
  table: ["#f3ece2", "#e3d3bd", "#c0643c", "#14263c"],
  stone: ["#efe7db", "#d9c9b2", "#a8967c", "#4a5b70"],
};

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * A horizon-and-light composition: sky wash, a brass horizon hairline, a
 * darker sea, and the label typeset over it.
 */
function svg({ width, height, palette, label, caption }) {
  const [a, b, c, d] = palettes[palette];
  const horizon = Math.round(height * 0.62);
  const unit = Math.min(width, height);
  const labelSize = Math.round(unit * 0.052);
  const captionSize = Math.round(unit * 0.036);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(label)} placeholder">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${a}"/>
      <stop offset="100%" stop-color="${b}"/>
    </linearGradient>
    <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${c}"/>
      <stop offset="100%" stop-color="${d}"/>
    </linearGradient>
    <radialGradient id="sun" cx="0.72" cy="0.38" r="0.42">
      <stop offset="0%" stop-color="#fff" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${width}" height="${horizon}" fill="url(#sky)"/>
  <rect y="${horizon}" width="${width}" height="${height - horizon}" fill="url(#sea)"/>
  <rect width="${width}" height="${height}" fill="url(#sun)"/>
  <rect y="${horizon - 1}" width="${width}" height="2" fill="#b08d57" opacity="0.8"/>
  <g fill="#fbf8f3" opacity="0.14">
    <rect x="0" y="${horizon + height * 0.09}" width="${width}" height="${Math.max(1, height * 0.004)}"/>
    <rect x="0" y="${horizon + height * 0.17}" width="${width}" height="${Math.max(1, height * 0.004)}"/>
    <rect x="0" y="${horizon + height * 0.27}" width="${width}" height="${Math.max(1, height * 0.004)}"/>
  </g>
  <g font-family="Georgia, 'Times New Roman', serif" text-anchor="middle">
    <text x="${width / 2}" y="${height / 2}" font-size="${labelSize}" fill="#fbf8f3" letter-spacing="${labelSize * 0.04}">${esc(label)}</text>
    <text x="${width / 2}" y="${height / 2 + captionSize * 1.9}" font-size="${captionSize}" fill="#fbf8f3" opacity="0.85" font-family="system-ui, sans-serif" letter-spacing="${captionSize * 0.18}">PLACEHOLDER — ${esc(caption)}</text>
  </g>
</svg>
`;
}

// --- PNG writer (used for the Open Graph card, which must be a raster) ------
function crc32(buf) {
  let c,
    table = [];
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  let crc = 0xffffffff;
  for (const byte of buf) crc = table[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function writePng(path, width, height, pixel) {
  const raw = Buffer.alloc((width * 3 + 1) * height);
  let o = 0;
  for (let y = 0; y < height; y++) {
    raw[o++] = 0; // filter: none
    for (let x = 0; x < width; x++) {
      const [r, g, b] = pixel(x, y);
      raw[o++] = r;
      raw[o++] = g;
      raw[o++] = b;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // truecolour
  writeFileSync(
    path,
    Buffer.concat([
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      chunk("IHDR", ihdr),
      chunk("IDAT", deflateSync(raw, { level: 9 })),
      chunk("IEND", Buffer.alloc(0)),
    ]),
  );
}

const hex = (h) => [
  parseInt(h.slice(1, 3), 16),
  parseInt(h.slice(3, 5), 16),
  parseInt(h.slice(5, 7), 16),
];
const mix = (p, q, t) => p.map((v, i) => Math.round(v + (q[i] - v) * t));

// --- The manifest ----------------------------------------------------------
const images = [
  // Home
  { file: "hero-sea-golden-hour", w: 2400, h: 1350, palette: "golden", label: "Hero", caption: "sea at golden hour, full-bleed" },
  { file: "story-dining-room", w: 1400, h: 1050, palette: "table", label: "Our story", caption: "the dining room" },
  { file: "dish-vongole", w: 1200, h: 1500, palette: "table", label: "Spaghetti alle Vongole", caption: "signature dish" },
  { file: "dish-pesce-del-giorno", w: 1200, h: 1500, palette: "stone", label: "Pesce del Giorno", caption: "signature dish" },
  { file: "dish-tiramisu", w: 1200, h: 1500, palette: "table", label: "Tiramisù", caption: "signature dish" },
  { file: "terrace-dusk", w: 1800, h: 1200, palette: "dusk", label: "The terrace", caption: "beachfront terrace at dusk" },
  { file: "live-music", w: 1600, h: 1200, palette: "night", label: "Live music", caption: "weekend performers" },
  // About
  { file: "about-origins", w: 1400, h: 1050, palette: "stone", label: "How it started", caption: "archival, the first dining room" },
  { file: "about-chef", w: 1200, h: 1500, palette: "table", label: "The kitchen", caption: "portrait of the chef" },
  { file: "about-terrace", w: 1600, h: 1000, palette: "noon", label: "The terrace and the sea", caption: "terrace looking out" },
  // Gallery — mixed ratios so the masonry column has something to work with
  { file: "gallery-01", w: 1200, h: 1600, palette: "golden", label: "Sunset service", caption: "gallery 01" },
  { file: "gallery-02", w: 1600, h: 1100, palette: "noon", label: "The bay at noon", caption: "gallery 02" },
  { file: "gallery-03", w: 1200, h: 1200, palette: "table", label: "Burrata", caption: "gallery 03" },
  { file: "gallery-04", w: 1200, h: 1500, palette: "stone", label: "The wood oven", caption: "gallery 04" },
  { file: "gallery-05", w: 1600, h: 1000, palette: "dusk", label: "Lanterns", caption: "gallery 05" },
  { file: "gallery-06", w: 1200, h: 1500, palette: "night", label: "The trio", caption: "gallery 06" },
  { file: "gallery-07", w: 1400, h: 1400, palette: "table", label: "Pasta, by hand", caption: "gallery 07" },
  { file: "gallery-08", w: 1600, h: 1067, palette: "noon", label: "Front row", caption: "gallery 08" },
  { file: "gallery-09", w: 1200, h: 1600, palette: "golden", label: "Aperitivo", caption: "gallery 09" },
  { file: "gallery-10", w: 1500, h: 1000, palette: "stone", label: "The morning catch", caption: "gallery 10" },
  { file: "gallery-11", w: 1200, h: 1500, palette: "dusk", label: "Dessert", caption: "gallery 11" },
  { file: "gallery-12", w: 1600, h: 1100, palette: "night", label: "Last table", caption: "gallery 12" },
];

for (const img of images) {
  writeFileSync(
    resolve(outDir, `${img.file}.svg`),
    svg({ width: img.w, height: img.h, palette: img.palette, label: img.label, caption: img.caption }),
  );
}

// Open Graph card: 1200x630 raster, golden-hour wash with a navy band.
{
  const [w, h] = [1200, 630];
  const sky = [hex("#f6c07a"), hex("#e08b52")];
  const sea = [hex("#2e6f7e"), hex("#14263c")];
  const horizon = Math.round(h * 0.62);
  writePng(resolve(outDir, "og-default.png"), w, h, (x, y) => {
    if (y < horizon) {
      const base = mix(sky[0], sky[1], y / horizon);
      // Soft sun bloom, upper right.
      const dx = (x - w * 0.72) / (w * 0.45);
      const dy = (y - h * 0.3) / (h * 0.45);
      const glow = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy)) * 0.5;
      return mix(base, [255, 255, 255], glow);
    }
    if (y < horizon + 3) return hex("#b08d57");
    return mix(sea[0], sea[1], (y - horizon) / (h - horizon));
  });
}

console.log(`Wrote ${images.length} SVG placeholders + og-default.png to ${outDir}`);
