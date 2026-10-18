/* Build the closed-loop life-support bench for GFSSM AI Coach.
   Geometry uses the Anatomy kit (MIT, github.com/wheresryan22/anatomy). */
import { writeFileSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "./vendor/iso-kit.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const WIDTH = 760;
const HEIGHT = 540;

const {
  extrude, ringOf, lineOnTop, solidSvg, lineSvg, dotsSvg, cylinder, iso, pathOf,
  slabOf, insetPlan, planOutline, topTicks, radialTicks, sideArc, ringSeam, knurl, haloOf,
  corners, boxCorners, fitProjection, translateAlong, faceTextSvg, topMatrix, wireSvg, segment,
  groupSvg, plateHtml, figureSvg, pageHtml, ring,
} = k;

const BASE = { x: -160, y: -120, w: 320, d: 240, r: 10 };
const BASE_H = 12;
const FOOT_H = 5;
const LOOP = { x: -80, y: -45, w: 160, d: 90, r: 14 };
const LOOP_Z = 50;

const SCRUB = [-112, -68];
const SAB = [-8, -78];
const COND = [80, -68];
const WTANK = [-106, 50];
const ELEC = [30, 60];
const PYRO = [105, 48];
const ROTA = [140, -95];
const PANEL = [0, 100];

const P = fitProjection([
  ...boxCorners(BASE, -BASE_H - FOOT_H, 0),
  [ROTA[0], ROTA[1], 128], [PANEL[0] - 55, PANEL[1] + 17, 36], [PANEL[0] + 55, PANEL[1] + 17, 36],
  [SCRUB[0], SCRUB[1], 94], [COND[0], COND[1], 90], [PYRO[0], PYRO[1], 84],
  [-80, 45, LOOP_Z + 2], [80, -45, LOOP_Z + 2],
], WIDTH, HEIGHT, { pad: 32, azimuth: 42, elevation: 30 });

const S = (paths, style) => solidSvg(paths, style);
const L = (d, style) => lineSvg(d, style);
const D = (points, style) => dotsSvg(points, style);
const at = (x, y, z) => iso([x, y, z], P);
const byDepth = (points) => [...points].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));
const up = (cx, cy, r, z, h, tone = "mid", steps = 32, bevel = 0.5) => S(cylinder(cx, cy, r, z, h, P, steps, bevel), { tone });

function vessel([cx, cy], r, h, { bands = [0.35, 0.7], cap = true, ports = [], gauge = false } = {}) {
  const out = [];
  out.push(S(cylinder(cx, cy, r + 5, 0, 4, P, 40, 0.5), { tone: "lo" }));
  out.push(S(cylinder(cx, cy, r, 4, h - 4, P, 48, 0.8), { tone: "mid" }));
  for (const f of bands) {
    const bz = 4 + (h - 4) * f;
    out.push(S(cylinder(cx, cy, r + 1.2, bz, 2.4, P, 48, 0.3), { tone: "mid" }));
    out.push(L(sideArc(cx, cy, r + 1.2, bz + 2.4, P, 26), { tone: f > 0.5 ? "lo" : "faint" }));
  }
  out.push(S(cylinder(cx, cy, r + 2, h - 6, 4, P, 48, 0.4), { tone: "mid" }));
  if (cap) out.push(S(cylinder(cx, cy, r * 0.82, h, 5, P, 40, 0.6), { tone: "hi" }));
  out.push(D(Array.from({ length: 6 }, (_, i) => {
    const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
    return at(cx + Math.cos(a) * (r + 2.5), cy + Math.sin(a) * (r + 2.5), h - 6);
  }), { size: 0.45, tone: "lo" }));
  for (const [px, py, pz, pr] of ports) {
    out.push(S(cylinder(px, py, pr, pz - 3, 6, P, 20, 0.4), { tone: "mid" }));
    out.push(L(ring(px, py, pr * 0.55, pz + 3, P, 16), { tone: "lo" }));
  }
  if (gauge) {
    out.push(S(cylinder(cx, cy, 8, h + 5, 3, P, 28, 0.4), { tone: "hi" }));
    out.push(L(ring(cx, cy, 6.4, h + 8.1, P, 24), { tone: "lo" }));
    out.push(L(radialTicks(cx, cy, 5.6, 12, 3, h + 8.2, [1, 2], P).minor, { tone: "faint" }));
    out.push(D([at(cx, cy, h + 8.4)], { size: 0.4, tone: "hi" }));
  }
  return out.join("");
}

function base() {
  const out = [`<path class="iso-halo" d="${haloOf(BASE, -BASE_H - FOOT_H, BASE_H, P)}"/>`];
  for (const [x, y] of byDepth(corners(BASE, 18))) {
    out.push(S(cylinder(x, y, 10, -BASE_H - FOOT_H, FOOT_H, P, 28), { tone: "lo" }));
    out.push(S(cylinder(x, y, 7.5, -BASE_H - FOOT_H + FOOT_H, 2, P, 28), { tone: "mid" }));
  }
  out.push(S(slabOf(BASE, -BASE_H, BASE_H, P, 8, 1.2), { tone: "mid" }));
  out.push(L(planOutline(insetPlan(BASE, 6), 0, P), { tone: "lo" }));
  const screws = corners(BASE, 10);
  out.push(L(screws.map(([x, y]) => ring(x, y, 2.2, 0, P, 16)).join(""), { tone: "lo" }));
  out.push(D(screws.map(([x, y]) => at(x, y, 0)), { size: 0.48 }));
  /* label plate */
  const plate = { x: -146, y: 96, w: 44, d: 14, r: 2.5 };
  out.push(S(slabOf(plate, 0, 1, P, 4, 0.3), { tone: "lo", crease: "none" }));
  out.push(L(planOutline(insetPlan(plate, 1.2), 1, P, 4), { tone: "faint" }));
  out.push(faceTextSvg(topMatrix([plate.x + 6, plate.y + 9.5], 1.05, P, "x"), "LSS", { size: 4.2, tone: "mid" }));
  return out.join("");
}

function loop() {
  const out = [];
  const path = planOutline(LOOP, LOOP_Z, P, 10);
  out.push(`<path class="iso-line" data-tone="lo" d="${path}" style="stroke-width:4.6"/>`);
  out.push(`<g transform="translate(0,-1.4)"><path class="iso-line" data-tone="hi" d="${path}" style="stroke-width:.9"/></g>`);
  out.push(`<path class="iso-line" data-tone="blue" data-flow d="${planOutline(LOOP, LOOP_Z + 0.2, P, 10)}" style="stroke-width:1.8"/>`);
  out.push(`<path class="iso-line" data-tone="faint" d="${planOutline(insetPlan(LOOP, 2.6), LOOP_Z + 0.1, P, 10)}" style="stroke-width:1"/>`);
  /* port collars around the loop */
  const ports = [[-80, -18], [-80, 30], [0, -45], [55, -45], [80, 5], [31, 45]];
  for (const [x, y] of ports) {
    out.push(S(cylinder(x, y, 6.5, LOOP_Z - 4, 8, P, 24, 0.4), { tone: "mid" }));
    out.push(L(ring(x, y, 4.6, LOOP_Z + 4, P, 20), { tone: "lo" }));
    out.push(D([at(x, y, LOOP_Z + 4.2)], { size: 0.4, tone: "lo" }));
  }
  return out.join("");
}

function pipes() {
  const out = [];
  const W = (a, b, opts = {}) => {
    const { cls, w = 3.0, flow, flowTone = "blue", ...rest } = opts;
    let markup = wireSvg(at(a[0], a[1], a[2]), at(b[0], b[1], b[2]), { tone: "mid", size: 2.2, ...rest });
    markup = markup.replace('<path class="iso-line"', '<path class="iso-line" style="stroke-width:' + w + '"');
    if (flow) {
      const d = (markup.match(/ d="([^"]+)"/) || [])[1];
      if (d) markup += `<path class="iso-line ${cls}-flow" data-tone="${flowTone}" data-flow style="stroke-width:2.0;stroke-dasharray:4 6" d="${d}"/>`;
    }
    out.push(markup);
  };
  /* scrubber -> loop */
  W([-96, -58, LOOP_Z], [-80, -22, LOOP_Z]);
  /* sabatier -> loop */
  W([-8, -78, LOOP_Z], [-8, -45, LOOP_Z]);
  /* condenser -> loop */
  W([80, -68, LOOP_Z], [55, -45, LOOP_Z]);
  /* water tank -> loop */
  W([-106, 32, LOOP_Z], [-80, 30, LOOP_Z]);
  /* electrolyzer -> loop */
  W([30, 60, LOOP_Z], [31, 45, LOOP_Z]);
  /* pyrolyzer -> loop (with a valve) */
  W([105, 48, LOOP_Z], [80, 5, LOOP_Z]);
  /* CH4 branch condenser -> pyrolyzer, above the loop */
  W([80, -68, 88], [80, -68, 96], { tone: "mid" });
  W([80, -68, 96], [105, 8, 96], { cls: "lss-ch4", flow: true, flowTone: "red" });
  W([105, 8, 96], [105, 48, 84], { cls: "lss-ch4", flow: true, flowTone: "red" });
  /* H2 return pyrolyzer -> sabatier, high line */
  W([105, 48, 84], [105, 48, 102], { tone: "mid" });
  W([105, 48, 102], [-8, -78, 102], { cls: "lss-h2", flow: true, flowTone: "blue" });
  W([-8, -78, 102], [-8, -78, 82], { cls: "lss-h2", flow: true, flowTone: "blue" });
  /* make-up H2 branch -> rotameter */
  W([80, 48, 102], [140, -95, 118], { cls: "lss-makeup", flow: true, flowTone: "blue" });
  W([140, -95, 118], [140, -95, 120], { tone: "blue", cls: "lss-makeup" });
  /* O2 out */
  W([30, 60, 58], [30, 60, 70], { tone: "green" });
  W([30, 60, 70], [60, 80, 62], { tone: "green" });
  W([60, 80, 62], [60, 80, 48], { tone: "green" });
  out.push(S(cylinder(60, 80, 5, 0, 46, P, 24, 0.4), { tone: "mid" }));
  out.push(S(cylinder(60, 80, 7, 46, 4, P, 24, 0.4), { tone: "green" }));
  out.push(`<circle cx="${at(60, 80, 51)[0]}" cy="${at(60, 80, 51)[1]}" r="2.2" fill="var(--anatomy-green)"/>`);
  /* water return condenser -> tank */
  W([80, -68, 18], [80, 80, 18], { tone: "lo" });
  W([80, 80, 18], [-106, 80, 18], { tone: "lo" });
  W([-106, 80, 18], [-106, 50, 28], { tone: "lo" });
  /* manual isolation valves on the two gas branches */
  for (const [vx, vy, vz] of [[92, -28, 96], [30, 12, 102]]) {
    out.push(S(cylinder(vx, vy, 5, vz - 3, 6, P, 20, 0.3), { tone: "mid" }));
    out.push(S(cylinder(vx, vy, 8, vz + 3, 3, P, 24, 0.4), { tone: "mid" }));
    out.push(L(knurl(vx, vy, 8, vz + 3, vz + 6, 28, P, 0.4), { tone: "lo" }));
    out.push(L(ring(vx, vy, 2, vz + 6.1, P, 16), { tone: "lo" }));
  }
  /* flanges at the vessel ports */
  for (const [x, y, z] of [[-96, -58, LOOP_Z], [-8, -78, LOOP_Z], [80, -68, LOOP_Z], [-106, 32, LOOP_Z], [30, 60, LOOP_Z], [105, 48, LOOP_Z], [80, -68, 88], [105, 48, 82], [105, 48, 84], [-8, -78, 82], [30, 60, 70], [80, -68, 18]]) {
    out.push(S(cylinder(x, y, 5.5, z - 2, 4, P, 20, 0.3), { tone: "mid" }));
    out.push(D([at(x, y, z + 2)], { size: 0.38, tone: "lo" }));
  }
  return out.join("");
}

function rotameter() {
  const out = [];
  const [cx, cy] = ROTA;
  out.push(S(cylinder(cx, cy, 11, 0, 18, P, 32, 0.6), { tone: "mid" }));
  out.push(S(cylinder(cx, cy, 8, 18, 5, P, 28, 0.4), { tone: "mid" }));
  out.push(S(cylinder(cx, cy, 7, 23, 100, P, 32, 0.2), { tone: "lo" }));
  /* glass tube outline over the solid: keep the float readable */
  out.push(L(segment([cx - 7, cy, 24], [cx - 7, cy, 122], P), { tone: "lo" }));
  out.push(L(segment([cx + 7, cy, 24], [cx + 7, cy, 122], P), { tone: "lo" }));
  out.push(L(ring(cx, cy, 7, 24, P, 28), { tone: "mid" }));
  out.push(L(ring(cx, cy, 7, 122, P, 28), { tone: "mid" }));
  /* scale strip */
  out.push(L(segment([cx - 13, cy, 28], [cx - 13, cy, 118], P), { tone: "lo" }));
  const ticks = [];
  for (let z = 30; z <= 118; z += 8) {
    const major = (z - 30) % 24 === 0;
    ticks.push(segment([cx - (major ? 16 : 15), cy, z], [cx - 12, cy, z], P));
  }
  out.push(L(ticks.join(""), { tone: "lo" }));
  /* outlet / inlet pipes */
  out.push(wireSvg(at(cx, cy, 122), at(cx, cy - 18, 122), { tone: "lo", size: 1.5 }));
  out.push(wireSvg(at(cx, cy, 20), at(cx + 20, cy, 20), { tone: "lo", size: 1.5 }));
  out.push(S(cylinder(cx, cy, 8.5, 122, 4, P, 28, 0.4), { tone: "mid" }));
  out.push(D([at(cx, cy, 126)], { size: 0.45, tone: "mid" }));
  out.push(`<g data-part="float" transform="${translateAlong(P, [0, 0, 0])}">` +
    S(cylinder(cx, cy, 5.4, 45, 7, P, 28, 0.5), { tone: "hi", lit: true }) +
    L(ring(cx, cy, 4, 52, P, 20), { tone: "lo" }) +
    D([at(cx, cy, 52.3)], { size: 0.4, tone: "hi" }) +
    `</g>`);
  return out.join("");
}

function controls() {
  const out = [];
  const [cx, cy] = PANEL;
  const plan = { x: cx - 55, y: cy - 17, w: 110, d: 34, r: 4 };
  out.push(S(slabOf(plan, 0, 4, P, 5, 0.4), { tone: "mid" }));
  out.push(S(slabOf(plan, 4, 9, P, 5, 0.6), { tone: "mid" }));
  out.push(S(slabOf(insetPlan(plan, 3), 13, 13, P, 5, 0.7), { tone: "mid" }));
  out.push(L(planOutline(insetPlan(plan, 5), 26, P, 5), { tone: "lo" }));
  out.push(L(k.sideSeam(plan, 9, P, 5), { tone: "faint" }));
  /* H2 balance gauge at -22 */
  const gx = cx - 22, gy = cy;
  out.push(S(cylinder(gx, gy, 15, 26, 4, P, 48, 0.6), { tone: "hi" }));
  out.push(L(ring(gx, gy, 13, 30.1, P, 48), { tone: "lo" }));
  out.push(L(ring(gx, gy, 2.2, 30.1, P, 18), { tone: "lo" }));
  const ticks = radialTicks(gx, gy, 11.5, 18, 3, 30.2, [1.6, 3], P, -Math.PI / 2, Math.PI * 2);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  /* green/red arcs around the zero at the top */
  const arc = (from, to, tone) => {
    const pts = [];
    for (let i = 0; i <= 12; i++) {
      const a = from + (to - from) * (i / 12);
      pts.push(iso([gx + Math.sin(a) * 13.5, gy - Math.cos(a) * 13.5, 30.3], P));
    }
    out.push(L(pathOf(pts), { tone }));
  };
  arc(-Math.PI / 2, -Math.PI / 2 + 0.62, "green");
  arc(-Math.PI / 2 - 1.0, -Math.PI / 2, "red");
  out.push(D([at(gx, gy, 30.4)], { size: 0.5, tone: "hi" }));
  /* O2 gauge at 12 */
  const ox = cx + 12, oy = cy;
  out.push(S(cylinder(ox, oy, 9, 26, 4, P, 32, 0.5), { tone: "hi" }));
  out.push(L(ring(ox, oy, 7.4, 30.1, P, 32), { tone: "lo" }));
  out.push(L(ring(ox, oy, 1.6, 30.1, P, 14), { tone: "lo" }));
  out.push(L(radialTicks(ox, oy, 6.6, 12, 3, 30.2, [1, 2], P).minor, { tone: "faint" }));
  out.push(D([at(ox, oy, 30.4)], { size: 0.45, tone: "hi" }));
  /* valve handwheel at 40 */
  const vx = cx + 40, vy = cy;
  out.push(S(cylinder(vx, vy, 11, 26, 2, P, 32, 0.4), { tone: "lo" }));
  out.push(S(cylinder(vx, vy, 9, 28, 5, P, 32, 0.5), { tone: "mid" }));
  out.push(L(knurl(vx, vy, 9, 28, 33, 30, P, 0.4), { tone: "lo" }));
  out.push(S(cylinder(vx, vy, 3.5, 33, 2, P, 18, 0.3), { tone: "hi" }));
  /* emergency stop */
  const ex = cx + 52, ey = cy;
  const estop = cylinder(ex, ey, 3.6, 26, 3, P, 20, 0.3);
  out.push(S(estop, { tone: "mid" }));
  out.push(`<path d="${estop.top}" fill="var(--anatomy-red)"/>`);
  /* panel face: label rules, vents and a key switch */
  for (const z of [9, 12, 15]) out.push(L(segment([cx - 44, cy + 17, z], [cx - 12, cy + 17, z], P), { tone: "faint" }));
  out.push(L(segment([cx - 44, cy + 17, 18], [cx - 44, cy + 17, 7], P), { tone: "faint" }));
  out.push(S(cylinder(cx + 20, cy + 13, 3, 14, 3, P, 18, 0.3), { tone: "mid" }));
  out.push(S(cylinder(cx - 48, cy + 10, 2.4, 8, 6, P, 16, 0.2), { tone: "mid" }));
  /* status lamps on the panel face */
  for (let i = 0; i < 3; i++) {
    out.push(`<circle cx="${at(cx - 44 + i * 8, cy + 16.2, 22)[0]}" cy="${at(cx - 44 + i * 8, cy + 16.2, 22)[1]}" r="1.7" fill="var(--anatomy-faint)"/>`);
  }
  /* live needles and valve lever */
  out.push(`<path data-part="h2-needle" class="iso-line" data-tone="hi" style="stroke-width:1.3" d="${lineOnTop([gx, gy], [gx + Math.sin((14 / 90) * (Math.PI / 3)) * 11.5, gy - Math.cos((14 / 90) * (Math.PI / 3)) * 11.5], 30.6, P)}"/>`);
  out.push(`<path data-part="o2-needle" class="iso-line" data-tone="hi" style="stroke-width:1" d="${lineOnTop([ox, oy], [ox + Math.sin(1.0) * 6.6, oy - Math.cos(1.0) * 6.6], 30.4, P)}"/>`);
  out.push(`<path data-part="valve-lever" class="iso-line" data-tone="hi" style="stroke-width:2" d="${lineOnTop([vx, vy], [vx, vy - 9], 33.8, P)}"/>`);
  out.push(D([at(vx, vy, 33.8)], { size: 0.55, tone: "hi" }));
  /* valve hit area */
  const [sx, sy] = at(vx, vy, 30);
  out.push(`<circle data-control="valve" cx="${sx}" cy="${sy}" r="34" fill="transparent" pointer-events="all" style="cursor:pointer"/>`);
  return out.join("");
}

function pump() {
  const out = [];
  const [cx, cy] = [0, 44];
  out.push(S(cylinder(cx, cy, 11, LOOP_Z - 10, 6, P, 32, 0.4), { tone: "mid" }));
  out.push(S(cylinder(cx, cy, 8, LOOP_Z - 4, 12, P, 32, 0.5), { tone: "mid" }));
  out.push(L(knurl(cx, cy, 8, LOOP_Z + 1, LOOP_Z + 8, 26, P, 0.4), { tone: "lo" }));
  out.push(L(ring(cx, cy, 6, LOOP_Z + 2, P, 24), { tone: "faint" }));
  out.push(S(cylinder(cx + 16, cy, 9, 0, 24, P, 32, 0.6), { tone: "mid" }));
  out.push(L(sideArc(cx + 16, cy, 9, 12, P, 20), { tone: "faint" }));
  out.push(wireSvg(at(cx + 7, cy, LOOP_Z + 2), at(cx + 13, cy, 22), { tone: "lo", size: 1.4 }));
  out.push(D([at(cx, cy, LOOP_Z + 8.2)], { size: 0.45, tone: "hi" }));
  out.push(`<path data-part="pump-rotor" class="iso-line" data-tone="hi" style="stroke-width:1.2" d="${lineOnTop([cx - 6, cy], [cx + 6, cy], LOOP_Z + 7.2, P)}"/>`);
  return out.join("");
}

function pyrolyzer() {
  const [cx, cy] = PYRO;
  const out = [];
  out.push(vessel([cx, cy], 14, 82, { bands: [0.3, 0.62], ports: [[cx, cy - 14, 50, 4], [cx, cy, 82, 4]] }));
  out.push(S(cylinder(cx, cy, 17, 30, 20, P, 40, 0.6), { tone: "mid" }));
  out.push(L(sideArc(cx, cy, 17, 35, P, 24), { tone: "lo" }));
  out.push(L(sideArc(cx, cy, 17, 45, P, 24), { tone: "lo" }));
  out.push(S(slabOf({ x: cx - 12, y: cy + 12, w: 24, d: 14, r: 2 }, 0, 10, P, 4, 0.4), { tone: "mid" }));
  out.push(S(cylinder(cx, cy + 19, 4, 0, 6, P, 20, 0.3), { tone: "mid" }));
  out.push(D([at(cx - 8, cy + 24, 10), at(cx + 8, cy + 24, 10)], { size: 0.4, tone: "lo" }));
  return out.join("");
}

function electrolyzer() {
  const [cx, cy] = ELEC;
  const out = [];
  const plan = { x: cx - 23, y: cy - 17, w: 46, d: 34, r: 3 };
  out.push(S(slabOf(plan, 0, 5, P, 4, 0.4), { tone: "mid" }));
  out.push(S(slabOf(plan, 5, 46, P, 4, 0.6), { tone: "mid" }));
  out.push(S(slabOf(insetPlan(plan, 2), 51, 5, P, 4, 0.5), { tone: "mid" }));
  for (let i = 1; i < 7; i++) {
    out.push(L(segment([cx - 23, cy - 17 + i * 4.8, 51.2], [cx + 23, cy - 17 + i * 4.8, 51.2], P), { tone: "faint" }));
  }
  for (const [x, y] of [[cx - 19, cy - 14], [cx + 19, cy - 14], [cx - 19, cy + 14], [cx + 19, cy + 14]]) {
    out.push(S(cylinder(x, y, 2.2, 5, 48, P, 16, 0.2), { tone: "lo" }));
    out.push(D([at(x, y, 53.2)], { size: 0.38, tone: "mid" }));
  }
  out.push(S(cylinder(cx - 14, cy - 10, 5, 56, 5, P, 20, 0.4), { tone: "hi" }));
  out.push(S(cylinder(cx + 14, cy - 10, 5, 56, 5, P, 20, 0.4), { tone: "hi" }));
  out.push(wireSvg(at(cx - 14, cy - 10, 61), at(cx - 25, cy + 24, 4), { via: [at(cx - 30, cy + 24, 30)], tone: "lo", size: 1.6 }));
  out.push(S(cylinder(cx + 14, cy + 10, 7, 56, 8, P, 24, 0.4), { tone: "mid" }));
  out.push(L(ring(cx + 14, cy + 10, 5, 64, P, 20), { tone: "lo" }));
  return out.join("");
}

const body = [
  base(),
  pipes(),
  loop(),
  vessel(SCRUB, 20, 92, { bands: [0.3, 0.58, 0.82], gauge: true, ports: [[SCRUB[0], SCRUB[1] + 20, 50, 5]] }),
  vessel(SAB, 17, 78, { bands: [0.4, 0.72], gauge: true, ports: [[SAB[0] + 17, SAB[1], 50, 5]] }),
  vessel(COND, 18, 88, { bands: [0.26, 0.52, 0.78], ports: [[COND[0], COND[1] + 18, 50, 5]] }),
  (() => {
    const coil = [];
    for (let i = 0; i <= 140; i++) {
      const u = i / 140, a = u * Math.PI * 2 * 5;
      coil.push(iso([COND[0] + Math.cos(a) * 20, COND[1] + Math.sin(a) * 20, 20 + u * 45], P));
    }
    return `<path class="iso-line" data-tone="lo" style="stroke-width:1.6" d="${pathOf(coil)}"/>`;
  })(),
  vessel(WTANK, 22, 70, { bands: [0.3, 0.6], ports: [[WTANK[0] + 22, WTANK[1], 50, 5]] }),
  (() => {
    const gx = WTANK[0] + 16, gy = WTANK[1] + 16;
    const out = [S(cylinder(gx, gy, 3.2, 6, 58, P, 20, 0.3), { tone: "hi" })];
    out.push(L(segment([gx - 6, gy, 10], [gx - 6, gy, 62], P), { tone: "lo" }));
    for (let z = 12; z <= 60; z += 6) out.push(L(segment([gx - 8, gy, z], [gx - 6, gy, z], P), { tone: "faint" }));
    out.push(D([at(gx, gy, 64)], { size: 0.4, tone: "mid" }));
    return out.join("");
  })(),
  electrolyzer(),
  pyrolyzer(),
  rotameter(),
  controls(),
  pump(),
].join("");

const svg = figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label: "A closed-loop life-support pilot bench. Six process vessels stand around a ring main: a CO2 scrubber, a Sabatier reactor, a condenser, an electrolyser stack, a water tank and a methane pyrolyser, with a hydrogen make-up rotameter and a control panel. A three-way valve sends the methane to the pyrolyser to close the hydrogen loop, or to storage to open it. The panel shows the hydrogen balance and the oxygen production; the rotameter shows the hydrogen make-up flow.",
  body,
});

const html = plateHtml({
  fig: "图 6-1",
  title: "闭环生保试验台",
  hint: "点击阀门 · 空格切换",
  readout: "闭环 · H₂ +14 · O₂ 840 kg/天",
  body: `<div class="iso-stage" tabindex="0" role="switch" aria-checked="true" aria-label="闭环生保试验台：点击阀门或按空格切换甲烷热解，观察氢平衡">${svg}</div>`,
});

const kitScript = readFileSync(join(HERE, "vendor/iso-kit.mjs"), "utf8").replace(/^export /gm, "");
const themeCss = readFileSync(join(HERE, "theme.css"), "utf8");

const live = `
const P = ${JSON.stringify(P)};
const PANEL = ${JSON.stringify(PANEL)};
const ROTA = ${JSON.stringify(ROTA)};
const stage = root.querySelector(".iso-stage");
const svg = stage.querySelector("svg");
const narrow = matchMedia("(max-width: 560px)");
const setFrame = () => svg.setAttribute("viewBox", narrow.matches ? "60 30 650 470" : "0 0 760 540");
setFrame();
if (narrow.addEventListener) narrow.addEventListener("change", setFrame);
const h2 = svg.querySelector('[data-part="h2-needle"]');
const o2 = svg.querySelector('[data-part="o2-needle"]');
const valve = svg.querySelector('[data-part="valve-lever"]');
const float = svg.querySelector('[data-part="float"]');
const pumpRotor = svg.querySelector('[data-part="pump-rotor"]');
const ch4 = Array.from(svg.querySelectorAll(".lss-ch4-flow"));
const h2line = Array.from(svg.querySelectorAll(".lss-h2-flow"));
const makeup = Array.from(svg.querySelectorAll(".lss-makeup-flow"));
const readout = root.querySelector("[data-readout]");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
let closed = true, angle = 0, lever = 0, floatZ = 45, needle = (14 / 90) * (Math.PI / 3);
let last = 0, clock = 0, touring = true, visible = false, frame = 0, idleTimer = 0, drag = false;
const h2Angle = (b) => (clamp(b, -90, 30) / 90) * (Math.PI / 3);
const targetLever = () => closed ? 0 : Math.PI / 2;
const targetFloat = () => closed ? 45 : 100;
const targetNeedle = () => h2Angle(closed ? 14 : -78);
function draw() {
  h2.setAttribute("d", lineOnTop([PANEL[0] - 22, PANEL[1]], [PANEL[0] - 22 + Math.sin(needle) * 11.5, PANEL[1] - Math.cos(needle) * 11.5], 30.6, P));
  valve.setAttribute("d", lineOnTop([PANEL[0] + 40, PANEL[1]], [PANEL[0] + 40 + Math.sin(lever) * 9, PANEL[1] - Math.cos(lever) * 9], 33.8, P));
  float.setAttribute("transform", translateAlong(P, [0, 0, floatZ - 45]));
  pumpRotor.setAttribute("d", lineOnTop([-6 * Math.cos(angle), 44 - 6 * Math.sin(angle)], [6 * Math.cos(angle), 44 + 6 * Math.sin(angle)], 57.2, P));
  const text = closed ? "闭环 · H₂ +14 · O₂ 840 kg/天" : "开环 · H₂ −78 · O₂ 840 kg/天";
  stage.setAttribute("aria-checked", String(closed));
  if (readout.textContent !== text) readout.textContent = text;
  ch4.forEach((el) => { el.style.opacity = closed ? 1 : 0.18; });
  h2line.forEach((el) => { el.style.opacity = closed ? 1 : 0.18; });
  makeup.forEach((el) => { el.style.opacity = closed ? 0.18 : 1; });
  stage.setAttribute("aria-label", "闭环生保试验台：" + (closed ? "甲烷热解开启，氢收支为正 14 千克每天" : "甲烷热解关闭，氢收支为负 78 千克每天") + "。按空格切换。");
}
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 24) : 1 / 60;
  last = now;
  if (touring) { clock += dt; const want = (Math.floor(clock / 6) % 2) === 0; closed = want; }
  const calm = still.matches;
  lever += (targetLever() - lever) * (calm ? 1 : 1 - Math.exp(-dt / 0.22));
  floatZ += (targetFloat() - floatZ) * (calm ? 1 : 1 - Math.exp(-dt / 0.4));
  needle += (targetNeedle() - needle) * (calm ? 1 : 1 - Math.exp(-dt / 0.5));
  angle += dt * 3;
  draw();
  frame = visible && root.isConnected && !calm ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible && root.isConnected && !still.matches) { last = 0; frame = requestAnimationFrame(tick); } };
const toggle = () => { closed = !closed; touring = false; clearTimeout(idleTimer); idleTimer = setTimeout(() => { if (!root.isConnected) return; touring = !still.matches; clock = 0; run(); }, 8000); if (still.matches) { lever = targetLever(); floatZ = targetFloat(); needle = targetNeedle(); draw(); } run(); };
new IntersectionObserver((entries) => { visible = entries[entries.length - 1].isIntersecting; if (visible) run(); }, { rootMargin: "120px 0px" }).observe(stage);
if (still.matches) touring = false;
stage.addEventListener("keydown", (event) => { if (event.key === " " || event.key === "Enter") { event.preventDefault(); toggle(); } });
stage.addEventListener("click", (event) => { const hit = event.target.closest("[data-control=valve]"); if (hit) { event.preventDefault(); toggle(); } });
stage.addEventListener("pointerdown", (event) => { if (event.target.closest("[data-control=valve]")) drag = true; });
stage.addEventListener("pointerup", () => { drag = false; });
draw();
`;

const browserLib = kitScript;
const siteScript = `(function(){\n${browserLib}\nwindow.ANATOMY_FIGURES = window.ANATOMY_FIGURES || {};\nwindow.ANATOMY_FIGURES.life = { html: ${JSON.stringify(html)}, init: function(root){\n${live}\n} };\n})();`;

writeFileSync(join(HERE, "life.js"), siteScript);
writeFileSync(join(HERE, "life.html"), pageHtml({
  title: "闭环生保试验台",
  theme: "light",
  width: 760,
  body: html,
  script: `const root = document.querySelector(".iso-page");\n` + browserLib + live,
}).replace("</head>", `<style>${themeCss}</style></head>`));
console.log("wrote life.js and life.html");
