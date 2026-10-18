/* Build the artificial-gravity spin rig for GFSSM AI Coach.
   Geometry uses the Anatomy kit (MIT, github.com/wheresryan22/anatomy). */
import { writeFileSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "./vendor/iso-kit.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const WIDTH = 760;
const HEIGHT = 540;
const G0 = 9.80665;

/* kit functions used by the serialised rotor builder */
const {
  extrude, ringOf, lineOnTop, solidSvg, lineSvg, dotsSvg, cylinder, iso, pathOf,
  slabOf, insetPlan, planOutline, topTicks, radialTicks, sideArc, ringSeam, knurl, haloOf,
  corners, boxCorners, fitProjection, translateAlong, faceTextSvg, topMatrix, wireSvg, segment,
  groupSvg, plateHtml, figureSvg, pageHtml,
} = k;

const BASE = { x: -190, y: -170, w: 380, d: 340, r: 16 };
const BASE_H = 13;
const FOOT_H = 5;
const MOTOR = [-85, -150];
const TACH = [-92, 152];
const KNOB = [138, 132];
const CRANK = [-145, 138];
const HUB_Z = 42;
const HUB_TOP = 64;
const RAIL_TOP = 54;

const P = fitProjection([
  ...boxCorners(BASE, -BASE_H - FOOT_H, 0),
  [150, 0, RAIL_TOP], [-150, 0, RAIL_TOP],
  [168, 0, 94], [-168, 0, 94],
  [TACH[0], TACH[1], 100],
  [KNOB[0], KNOB[1], 20],
  [CRANK[0], CRANK[1], 34],
], WIDTH, HEIGHT, { pad: 34, azimuth: 45, elevation: 31 });

const S = (paths, style) => solidSvg(paths, style);
const L = (d, style) => lineSvg(d, style);
const D = (points, style) => dotsSvg(points, style);
const at = (x, y, z) => iso([x, y, z], P);
const byDepth = (points) => [...points].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));

/* ---------- the rotating part, rebuilt for every frame ---------- */
function rotorAt(theta, radiusM, gTarget, P) {
  const c = Math.cos(theta), s = Math.sin(theta);
  const R = radiusM * 0.5;
  const comp = 6 * gTarget;
  const out = [];
  const Sf = (paths, style) => solidSvg(paths, style);
  const Lf = (d, style) => lineSvg(d, style);
  const Df = (points, style) => dotsSvg(points, style);
  const rot = ([x, y]) => [x * c - y * s, x * s + y * c];
  const ringAt = (plan, steps) => ringOf(plan, steps).map(rot);
  const atf = (x, y, z) => iso([...rot([x, y]), z], P);
  const ARM_Z = 40, ARM_H = 20, ARM_TOP = ARM_Z + ARM_H;
  const CARR_Z = ARM_TOP, CARR_TOP = CARR_Z + 12;
  const MASS_Z = CARR_TOP + 2, MASS_TOP = MASS_Z + 17;
  const SPRING_Z = ARM_TOP + 6;

  for (const sgn of [-1, 1]) {
    /* arm: a deep box beam, not a rail */
    const armPlan = { x: sgn > 0 ? 26 : -150, y: -12, w: 124, d: 24, r: 5 };
    out.push(Sf(extrude(ringAt(armPlan, 6), ARM_Z, ARM_H, P, { bevel: 0.8 }), {
      tone: "mid",
      inner: Lf(ringSeam(ringAt(armPlan, 6), ARM_Z + 6, P), { tone: "faint" }) +
        Lf(ringSeam(ringAt(armPlan, 6), ARM_TOP - 4, P), { tone: "faint" }),
    }));
    out.push(Sf(extrude(ringAt({ x: sgn > 0 ? 24 : -40, y: -15, w: 16, d: 30, r: 3 }, 4), ARM_Z, 24, P, { bevel: 0.4 }), { tone: "mid" }));
    out.push(Sf(extrude(ringAt({ x: sgn > 0 ? 145 : -153, y: -14, w: 8, d: 28, r: 2.5 }, 4), ARM_Z, 18, P, { bevel: 0.4 }), { tone: "mid" }));
    /* top groove and ruler ticks */
    out.push(Lf(lineOnTop(rot([sgn * 30, 0]), rot([sgn * 148, 0]), ARM_TOP + 0.15, P), { tone: "faint" }));
    for (let rr = 60; rr <= 150; rr += 10) {
      const major = rr % 50 === 0;
      out.push(Lf(lineOnTop(rot([sgn * rr, -8]), rot([sgn * rr, 8]), ARM_TOP + 0.2, P), { tone: major ? "mid" : "lo" }));
    }
    out.push(Df([atf(sgn * 146, -8.5, ARM_TOP + 0.2), atf(sgn * 146, 8.5, ARM_TOP + 0.2)], { size: 0.45 }));
    out.push(Df([atf(sgn * 120, -8.5, ARM_TOP + 0.2), atf(sgn * 120, 8.5, ARM_TOP + 0.2), atf(sgn * 80, -8.5, ARM_TOP + 0.2), atf(sgn * 80, 8.5, ARM_TOP + 0.2)], { size: 0.4, tone: "lo" }));

    const rc = R + comp;
    const rs = R + 38;
    /* sensor cable along the near face of the arm, with clips */
    out.push(wireSvg(iso([sgn * 30, -13.5, ARM_Z + 11], P), iso([sgn * (rs - 5), -13.5, ARM_Z + 11], P), { tone: "lo", size: 1.1 }));
    for (const rr of [58, 82, 106]) {
      if (rr < rs - 6) out.push(Sf(extrude(ringAt({ x: sgn * rr - 4, y: -15.5, w: 8, d: 5, r: 1.5 }, 3), ARM_Z + 9, 4, P, { bevel: 0.2 }), { tone: "mid" }));
    }

    const x0 = sgn * (rc + 13);
    const x1 = sgn * (rs - 5);
    const spring = [];
    const turns = 8, steps = turns * 16, coilR = 5.0;
    for (let i = 0; i <= steps; i++) {
      const u = i / steps;
      const a = u * turns * Math.PI * 2;
      const along = x0 + (x1 - x0) * u;
      const off = coilR * Math.cos(a);
      const rise = coilR * Math.sin(a);
      spring.push(iso([along * c - off * s, along * s + off * c, SPRING_Z + rise], P));
    }
    out.push(Lf(pathOf(spring), { tone: "lo" }));

    /* carriage */
    out.push(Sf(extrude(ringAt({ x: sgn * rc - 11, y: -18, w: 22, d: 5, r: 2 }, 3), ARM_Z + 8, 12, P, { bevel: 0.4 }), { tone: "mid" }));
    out.push(Sf(extrude(ringAt({ x: sgn * rc - 11, y: 13, w: 22, d: 5, r: 2 }, 3), ARM_Z + 8, 12, P, { bevel: 0.4 }), { tone: "mid" }));
    out.push(Sf(extrude(ringAt({ x: sgn * rc - 13, y: -18, w: 26, d: 36, r: 5 }, 6), CARR_Z, 12, P, { bevel: 0.8 }), { tone: "mid" }));
    out.push(Lf(pathOf(ringAt({ x: sgn * rc - 10, y: -15, w: 20, d: 30, r: 3 }, 5).map(([x, y]) => iso([x, y, CARR_TOP + 0.1], P)), true), { tone: "faint" }));
    out.push(Df([atf(sgn * rc - 7, -14, CARR_TOP + 0.2), atf(sgn * rc - 7, 14, CARR_TOP + 0.2), atf(sgn * rc + 7, -14, CARR_TOP + 0.2), atf(sgn * rc + 7, 14, CARR_TOP + 0.2)], { size: 0.42, tone: "lo" }));

    /* outer stop and spring seat */
    out.push(Sf(extrude(ringAt({ x: sgn * rs - 5, y: -18, w: 10, d: 36, r: 3 }, 5), ARM_Z, 32, P, { bevel: 0.5 }), { tone: "mid" }));
    out.push(Sf(extrude(ringAt({ x: sgn > 0 ? rs - 9 : -rs + 5, y: -9, w: 4, d: 18, r: 2 }, 4), ARM_TOP + 2, 9, P, { bevel: 0.3 }), { tone: "mid" }));
    out.push(Df([atf(sgn * rs, -14, 72.2), atf(sgn * rs, 14, 72.2)], { size: 0.45, tone: "lo" }));
    out.push(Lf(lineOnTop(rot([sgn * rs, -18]), rot([sgn * rs, -25]), SPRING_Z, P), { tone: "lo" }));

    /* the test mass: the one lit part */
    const [mx, my] = rot([sgn * rc, 0]);
    out.push(Sf(cylinder(mx, my, 10.5, 72, 3, P, 40, 0.5), { tone: "hi" }));
    out.push(Sf(cylinder(mx, my, 9.2, 75, 13, P, 40, 0.8), { tone: "hi", lit: true }));
    out.push(Sf(cylinder(mx, my, 10, 88, 3, P, 40, 0.6), { tone: "hi", lit: true }));
    out.push(Lf(sideArc(mx, my, 9.2, 79, P, 18), { tone: "lo" }));
    out.push(Lf(sideArc(mx, my, 9.2, 85, P, 18), { tone: "faint" }));
    out.push(Df([atf(sgn * rc, 0, 91.2)], { size: 0.6, tone: "hi" }));
  }

  return out.join("");
}

/* ---------- static bench ---------- */
function base() {
  const out = [`<path class="iso-halo" d="${haloOf(BASE, -BASE_H - FOOT_H, BASE_H, P)}"/>`];
  for (const [x, y] of byDepth(corners(BASE, 20))) {
    out.push(S(cylinder(x, y, 11, -BASE_H - FOOT_H, FOOT_H, P, 28), { tone: "lo" }));
    out.push(S(cylinder(x, y, 8.5, -BASE_H - FOOT_H + FOOT_H, 2.2, P, 28), { tone: "mid" }));
  }
  out.push(S(slabOf(BASE, -BASE_H, BASE_H, P, 10, 1.4), { tone: "mid" }));
  out.push(L(planOutline(insetPlan(BASE, 7), 0, P), { tone: "lo" }));
  out.push(L(planOutline(insetPlan(BASE, 13), 0, P), { tone: "faint" }));
  const screws = corners(BASE, 11);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.4, 0, P, 16)).join(""), { tone: "lo" }));
  out.push(D(screws.map(([x, y]) => at(x, y, 0)), { size: 0.5 }));

  /* radius scale along the front edge */
  const strip = { x: -165, y: 150, w: 330, d: 10, r: 1 };
  out.push(S(slabOf(strip, 0, 0.7, P, 3), { tone: "lo", crease: "none" }));
  const ticks = topTicks(-160, 160, 5, 5, 152, 0.8, [2.6, 4.8], P);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  out.push(D([at(-162, 157, 0.8), at(162, 157, 0.8)], { size: 0.45 }));

  /* engraved label plate */
  const plate = { x: 40, y: 128, w: 62, d: 15, r: 2.5 };
  out.push(S(slabOf(plate, 0, 1.1, P, 4, 0.3), { tone: "lo", crease: "none" }));
  out.push(L(planOutline(insetPlan(plate, 1.2), 1.1, P, 4), { tone: "faint" }));
  out.push(faceTextSvg(topMatrix([plate.x + 7, plate.y + 10], 1.15, P, "x"), "g-RIG", { size: 4.4, tone: "mid" }));
  out.push(L(lineOnTop([plate.x + 4, plate.y + 3.2], [plate.x + 4, plate.y + 11.8], 1.15, P), { tone: "faint" }));
  return out.join("");
}

function drive() {
  const out = [];
  const [mx, my] = MOTOR;
  /* motor feet and body */
  out.push(S(slabOf({ x: mx - 24, y: my - 24, w: 48, d: 48, r: 6 }, 0, 4, P, 5, 0.5), { tone: "mid" }));
  out.push(S(cylinder(mx, my, 20, 4, 26, P, 40, 0.8), { tone: "mid" }));
  out.push(S(cylinder(mx, my, 22, 24, 4, P, 40, 0.5), { tone: "mid" }));
  out.push(S(cylinder(mx, my, 16, 28, 4, P, 36, 0.4), { tone: "mid" }));
  out.push(L(knurl(mx, my, 20, 6, 26, 38, P, 0.45), { tone: "lo" }));
  out.push(L(k.sideArc(mx, my, 20, 14, P, 24), { tone: "faint" }));
  out.push(L(k.sideArc(mx, my, 20, 22, P, 24), { tone: "faint" }));
  /* terminal box */
  out.push(S(slabOf({ x: mx + 14, y: my - 10, w: 12, d: 20, r: 2 }, 12, 9, P, 3, 0.4), { tone: "mid" }));
  out.push(D([at(mx + 20, my - 4, 21), at(mx + 20, my + 4, 21)], { size: 0.45 }));
  /* motor pulley */
  out.push(S(cylinder(mx, my, 12, 32, 6, P, 32, 0.4), { tone: "mid" }));
  out.push(L(k.ring(mx, my, 5, 38, P, 20), { tone: "lo" }));

  /* spindle and bearing */
  out.push(S(slabOf({ x: -36, y: -36, w: 72, d: 72, r: 8 }, 0, 4, P, 6, 0.5), { tone: "mid" }));
  out.push(S(cylinder(0, 0, 15, 4, 20, P, 40, 0.6), { tone: "mid" }));
  out.push(S(cylinder(0, 0, 22, 18, 14, P, 48, 0.8), { tone: "mid" }));
  out.push(L(k.sideArc(0, 0, 22, 25, P, 30), { tone: "lo" }));
  out.push(D([at(15, 0, 32), at(-15, 0, 32), at(0, 15, 32), at(0, -15, 32)], { size: 0.45 }));
  out.push(S(cylinder(0, 0, 16, 26, 8, P, 40, 0.5), { tone: "mid" }));
  out.push(S(cylinder(0, 0, 13, 34, 8, P, 36, 0.4), { tone: "mid" }));
  out.push(L(k.ring(0, 0, 16, 34, P, 36), { tone: "faint" }));

  /* belt loop: external tangents around the two pulleys */
  const r1 = 12, r2 = 16, z = 36;
  const dx = 0 - mx, dy = 0 - my;
  const dist = Math.hypot(dx, dy), alpha = Math.atan2(dy, dx);
  const beta = Math.acos((r1 - r2) / dist);
  const a1 = alpha + beta, a2 = alpha - beta;
  const p1 = [mx + Math.cos(a1) * r1, my + Math.sin(a1) * r1];
  const p2 = [Math.cos(a1) * r2, Math.sin(a1) * r2];
  const p3 = [Math.cos(a2) * r2, Math.sin(a2) * r2];
  const p4 = [mx + Math.cos(a2) * r1, my + Math.sin(a2) * r1];
  const belt = [];
  belt.push(iso([p1[0], p1[1], z], P), iso([p2[0], p2[1], z], P));
  for (let i = 1; i <= 18; i++) {
    const a = a1 + (a2 - a1 + Math.PI * 2) * (i / 18);
    belt.push(iso([Math.cos(a) * r2, Math.sin(a) * r2, z], P));
  }
  belt.push(iso([p4[0], p4[1], z], P));
  for (let i = 1; i <= 18; i++) {
    const a = a2 + (a1 - a2) * (i / 18);
    belt.push(iso([mx + Math.cos(a) * r1, my + Math.sin(a) * r1, z], P));
  }
  out.push(L(pathOf(belt), { tone: "lo" }));
  out.push(D([at(p1[0], p1[1], z), at(p2[0], p2[1], z), at(p3[0], p3[1], z), at(p4[0], p4[1], z)], { size: 0.4, tone: "lo" }));
  return out.join("");
}

function gantry() {
  const out = [];
  const y = -160;
  const posts = [-155, -78, 0, 78, 155];
  for (const x of posts) {
    const tall = Math.abs(x) === 155;
    out.push(S(cylinder(x, y, tall ? 9 : 5, 0, 3, P, 24), { tone: "lo" }));
    out.push(S(cylinder(x, y, tall ? 6.5 : 3.2, 3, tall ? 117 : 23, P, 24, 0.4), { tone: "mid" }));
    out.push(S(cylinder(x, y, tall ? 8 : 4.2, tall ? 120 : 25.5, tall ? 3 : 2.5, P, 24, 0.4), { tone: "mid" }));
    out.push(D([at(x, y, tall ? 123.4 : 28.2)], { size: 0.45, tone: "mid" }));
  }
  for (let i = 0; i < posts.length - 1; i++) {
    const a = posts[i], b = posts[i + 1];
    out.push(wireSvg(iso([a + 3.2, y, 22], P), iso([b - 3.2, y, 22], P), { tone: "mid", size: 1.6 }));
    out.push(wireSvg(iso([a + 3.2, y, 13], P), iso([b - 3.2, y, 13], P), { tone: "lo", size: 1.2 }));
  }
  /* top beam and diagonal braces */
  out.push(S(slabOf({ x: -155, y: y - 5, w: 310, d: 10, r: 2 }, 112, 10, P, 4, 0.6), { tone: "mid" }));
  out.push(L(planOutline({ x: -150, y: y - 3, w: 300, d: 6, r: 1.5 }, 122, P, 3), { tone: "faint" }));
  out.push(D([at(-145, y, 122.2), at(-75, y, 122.2), at(0, y, 122.2), at(75, y, 122.2), at(145, y, 122.2)], { size: 0.45 }));
  for (const sgn of [-1, 1]) {
    out.push(wireSvg(iso([sgn * 150, y, 112], P), iso([sgn * 95, y, 122], P), { tone: "lo", size: 1.2 }));
    out.push(wireSvg(iso([sgn * 150, y, 70], P), iso([sgn * 95, y, 112], P), { tone: "faint", size: 1 }));
  }
  /* strobe head on a bracket over the rotor */
  out.push(S(slabOf({ x: -12, y: y, w: 24, d: 12, r: 2 }, 106, 6, P, 4, 0.4), { tone: "mid" }));
  out.push(S(cylinder(0, y + 10, 10, 96, 11, P, 40, 0.8), { tone: "hi" }));
  out.push(L(k.sideArc(0, y + 10, 10, 99, P, 24), { tone: "lo" }));
  out.push(L(k.sideArc(0, y + 10, 10, 105, P, 24), { tone: "lo" }));
  out.push(S(cylinder(0, y + 10, 7, 94, 2.4, P, 28, 0.4), { tone: "lo" }));
  out.push(L(k.ring(0, y + 10, 5.5, 94, P, 20), { tone: "lo" }));
  out.push(D([at(0, y + 10, 93.8)], { size: 0.5, tone: "hi" }));
  out.push(S(cylinder(0, y + 10, 4, 107, 3, P, 20), { tone: "mid" }));
  /* strobe cable down the left post to the cabinet */
  out.push(wireSvg(iso([0, y + 6, 108], P), iso([-155, y, 60], P), {
    via: [iso([-120, y + 2, 108], P), iso([-155, y, 95], P)], tone: "lo", size: 1.1,
  }));
  return out.join("");
}

const CAB = { x: 104, y: -142, w: 52, d: 48, r: 5 };
const CAB_G = [[118, -128], [142, -128]];
function cabinet() {
  const out = [];
  out.push(S(slabOf(CAB, 0, 4, P, 5, 0.4), { tone: "mid" }));
  out.push(S(slabOf(CAB, 4, 24, P, 5, 0.8), { tone: "mid" }));
  out.push(S(slabOf(insetPlan(CAB, 3), 28, 4, P, 5, 0.8), { tone: "mid" }));
  out.push(L(planOutline(insetPlan(CAB, 5), 32, P, 5), { tone: "lo" }));
  out.push(L(k.sideSeam(CAB, 16, P, 5), { tone: "faint" }));
  for (const z of [10, 14, 18, 22]) {
    out.push(L(segment([CAB.x + 1, CAB.y + CAB.d, z], [CAB.x + CAB.w - 1, CAB.y + CAB.d, z], P), { tone: "faint" }));
  }
  out.push(S(cylinder(CAB.x + 11, CAB.y + CAB.d - 1, 2.2, 12, 10, P, 16, 0.3), { tone: "mid" }));
  out.push(D([at(CAB.x + 11, CAB.y + CAB.d - 1, 22)], { size: 0.4, tone: "lo" }));
  /* two top gauges */
  for (let i = 0; i < 2; i++) {
    const [gx, gy] = CAB_G[i];
    out.push(S(cylinder(gx, gy, 8, 32, 3, P, 32, 0.4), { tone: "hi" }));
    out.push(L(k.ring(gx, gy, 6.5, 35.1, P, 28), { tone: "lo" }));
    const ticks = radialTicks(gx, gy, 6, 12, 3, 35.2, [1, 2], P);
    out.push(L(ticks.minor, { tone: "faint" }), L(ticks.major, { tone: "lo" }));
    out.push(D([at(gx, gy, 35.4)], { size: 0.4, tone: "hi" }));
  }
  /* emergency stop */
  const estop = cylinder(142, -104, 4.5, 32, 3, P, 24, 0.4);
  out.push(S(estop, { tone: "mid" }));
  out.push(`<path d="${estop.top}" fill="var(--anatomy-red)"/>`);
  out.push(L(k.ring(142, -104, 3.2, 35.1, P, 20), { tone: "red" }));
  /* cable gland and cable to the motor */
  out.push(S(cylinder(110, -142, 4, 24, 4, P, 20, 0.3), { tone: "mid" }));
  out.push(wireSvg(iso([110, -144, 26], P), iso([-67, -150, 20], P), {
    via: [iso([30, -166, 10], P), iso([-30, -166, 10], P)], tone: "lo", size: 1.4,
  }));
  return out.join("");
}

const PALLET = { x: 66, y: 44, w: 62, d: 46, r: 4 };
function rack() {
  const out = [];
  out.push(S(slabOf(PALLET, 0, 5, P, 5, 0.5), { tone: "mid" }));
  out.push(L(planOutline(insetPlan(PALLET, 4), 5, P, 4), { tone: "faint" }));
  for (const [x, r, h] of [[82, 8, 12], [102, 9, 15], [122, 7.5, 10]]) {
    out.push(S(cylinder(x, 66, r + 1.5, 5, 2, P, 28, 0.4), { tone: "lo" }));
    out.push(S(cylinder(x, 66, r, 7, h, P, 32, 0.6), { tone: "hi", lit: false }));
    out.push(S(cylinder(x, 66, r + 0.8, 7 + h, 2, P, 32, 0.4), { tone: "mid" }));
    out.push(L(k.sideArc(x, 66, r, 7 + h * 0.45, P, 18), { tone: "faint" }));
    out.push(D([at(x, 66, 9 + h)], { size: 0.45, tone: "mid" }));
  }
  out.push(L(lineOnTop([72, 44], [124, 44], 5.2, P), { tone: "faint" }));
  out.push(L(lineOnTop([72, 90], [124, 90], 5.2, P), { tone: "faint" }));
  out.push(D([at(70, 48, 5.2), at(124, 48, 5.2), at(70, 86, 5.2), at(124, 86, 5.2)], { size: 0.4, tone: "lo" }));
  return out.join("");
}

function benchDetail() {
  const out = [];
  /* dashed keep-out ring on the deck */
  const ringPts = [];
  for (let i = 0; i <= 96; i++) {
    const a = (i / 96) * Math.PI * 2;
    ringPts.push(iso([Math.sin(a) * 166, -Math.cos(a) * 166, 0.4], P));
  }
  out.push(L(pathOf(ringPts), { tone: "faint", dashed: true }));
  const spokes = [];
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
    spokes.push(iso([Math.sin(a) * 160, -Math.cos(a) * 160, 0.45], P));
    spokes.push(iso([Math.sin(a) * 172, -Math.cos(a) * 172, 0.45], P));
  }
  out.push(L(pathOf(spokes), { tone: "faint" }));

  /* cable tray along the front of the deck */
  const tray = { x: -122, y: 133, w: 244, d: 9, r: 2 };
  out.push(S(slabOf(tray, 0, 2.2, P, 3, 0.3), { tone: "mid" }));
  out.push(L(planOutline(insetPlan(tray, 2), 2.2, P, 3), { tone: "faint" }));
  for (let x = -110; x <= 110; x += 44) {
    out.push(S(slabOf({ x: x - 3, y: tray.y - 1, w: 6, d: tray.d + 2, r: 1 }, 2.2, 1.2, P, 2), { tone: "lo", crease: "none" }));
  }
  out.push(wireSvg(iso([-118, 137, 2.5], P), iso([-142, 136, 8], P), { tone: "lo", size: 1.3 }));
  out.push(wireSvg(iso([118, 137, 2.5], P), iso([136, 134, 8], P), { tone: "lo", size: 1.3 }));

  /* tool chest */
  const tool = { x: -96, y: 94, w: 46, d: 30, r: 4 };
  out.push(S(slabOf(tool, 0, 1.5, P, 5, 0.3), { tone: "lo" }));
  out.push(S(slabOf(tool, 1.5, 13, P, 5, 0.6), { tone: "mid" }));
  out.push(S(slabOf(insetPlan(tool, 1.5), 14.5, 5, P, 5, 0.5), { tone: "mid" }));
  out.push(L(k.sideSeam(tool, 8, P, 5), { tone: "faint" }));
  out.push(L(k.sideSeam(insetPlan(tool, 1.5), 17, P, 5), { tone: "faint" }));
  out.push(S(cylinder(tool.x + 23, tool.y + 15, 4, 19.5, 2, P, 20, 0.4), { tone: "mid" }));
  out.push(S(slabOf({ x: tool.x + 18, y: tool.y + 12, w: 10, d: 6, r: 2 }, 19.5, 2, P, 3, 0.3), { tone: "mid" }));
  out.push(D([at(tool.x + 6, tool.y + 1, 13), at(tool.x + 40, tool.y + 1, 13)], { size: 0.45, tone: "lo" }));
  out.push(D([at(tool.x + 23, tool.y + 1, 19.5)], { size: 0.4, tone: "mid" }));

  /* power supply near the control knob */
  const psu = { x: 56, y: 92, w: 34, d: 28, r: 3 };
  out.push(S(slabOf(psu, 0, 2, P, 4, 0.3), { tone: "lo" }));
  out.push(S(slabOf(psu, 2, 14, P, 4, 0.6), { tone: "mid" }));
  out.push(L(planOutline(insetPlan(psu, 4), 16, P, 4), { tone: "faint" }));
  for (const z of [6, 9, 12]) {
    out.push(L(segment([psu.x + 4, psu.y + psu.d, z], [psu.x + psu.w - 4, psu.y + psu.d, z], P), { tone: "faint" }));
  }
  out.push(S(cylinder(psu.x + 8, psu.y + 8, 2.5, 16, 2, P, 16, 0.3), { tone: "mid" }));
  out.push(`<circle cx="${at(psu.x + 8, psu.y + 8, 18.2)[0]}" cy="${at(psu.x + 8, psu.y + 8, 18.2)[1]}" r="1.7" fill="var(--anatomy-green)"/>`);
  out.push(wireSvg(iso([psu.x + psu.w, psu.y + 6, 6], P), iso([104, -60, 6], P), { via: [iso([150, 40, 4], P), iso([150, -60, 4], P)], tone: "lo", size: 1.2 }));
  return out.join("");
}

function hub() {
  const out = [];
  out.push(S(cylinder(0, 0, 27, HUB_Z, 12, P, 64, 1.0), { tone: "hi" }));
  out.push(L(k.sideArc(0, 0, 27, 48, P, 40), { tone: "lo" }));
  out.push(S(cylinder(0, 0, 22, HUB_Z + 12, 10, P, 56, 0.8), { tone: "hi" }));
  out.push(L(k.ring(0, 0, 18.5, HUB_TOP, P, 48), { tone: "lo" }));
  const bolts = [];
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
    bolts.push([0 + Math.cos(a) * 18.5, 0 + Math.sin(a) * 18.5, HUB_TOP]);
  }
  out.push(D(bolts.map(([x, y, z]) => at(x, y, z)), { size: 0.5 }));
  out.push(L(bolts.map(([x, y]) => k.ring(x, y, 1.5, HUB_TOP, P, 12)).join(""), { tone: "faint" }));
  out.push(S(cylinder(0, 0, 9, HUB_TOP, 4, P, 28, 0.5), { tone: "mid" }));
  out.push(L(k.ring(0, 0, 4, HUB_TOP + 4, P, 18), { tone: "lo" }));
  out.push(D([at(0, 0, HUB_TOP + 4.3)], { size: 0.55, tone: "hi" }));
  return out.join("");
}

function tachometer() {
  const out = [];
  const [cx, cy] = TACH;
  out.push(S(cylinder(cx, cy, 13, 0, 5, P, 32, 0.5), { tone: "mid" }));
  out.push(S(cylinder(cx, cy, 7, 5, 80, P, 28, 0.5), { tone: "mid" }));
  out.push(L(k.sideArc(cx, cy, 7, 30, P, 16), { tone: "faint" }));
  out.push(L(k.sideArc(cx, cy, 7, 58, P, 16), { tone: "faint" }));
  out.push(S(slabOf({ x: cx - 11, y: cy - 11, w: 22, d: 22, r: 3 }, 82, 4, P, 4, 0.4), { tone: "mid" }));
  out.push(S(cylinder(cx, cy, 30, 85, 9, P, 64, 0.9), { tone: "hi" }));
  out.push(L(k.sideArc(cx, cy, 30, 89, P, 40), { tone: "lo" }));
  out.push(S(cylinder(cx, cy, 27.5, 94, 0.7, P, 64), { tone: "hi", crease: "none" }));
  out.push(L(k.ring(cx, cy, 25, 94.5, P, 64), { tone: "lo" }));
  out.push(L(k.ring(cx, cy, 3.4, 94.5, P, 20), { tone: "lo" }));
  out.push(D([at(cx, cy, 94.7)], { size: 0.55, tone: "hi" }));
  const from = (210 / 180) * Math.PI, span = (300 / 180) * Math.PI;
  const ticks = radialTicks(cx, cy, 23, 30, 5, 94.6, [2.2, 4.4], P, from, span);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  /* red zone: 2 to 3 rpm, tick 20 to 30 */
  const red = [];
  for (let i = 0; i <= 10; i++) {
    const a = from + span * (2 / 3) + span * (i / 30);
    red.push(iso([cx + Math.sin(a) * 25, cy - Math.cos(a) * 25, 94.7], P));
  }
  out.push(L(pathOf(red), { tone: "red" }));
  return out.join("");
}

function knobAngle0(gv) { return (-135 / 180) * Math.PI + (270 / 180) * Math.PI * Math.min(1, Math.max(0, (gv - 0.4) / 0.6)); }

function knob() {
  const out = [];
  const [cx, cy] = KNOB;
  out.push(S(cylinder(cx, cy, 25, 0, 0.8, P, 48), { tone: "lo", crease: "none" }));
  const from = (-135 / 180) * Math.PI, span = (270 / 180) * Math.PI;
  const ticks = radialTicks(cx, cy, 23, 22, 5, 0.9, [2.2, 4.6], P, from, span);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  out.push(L(k.ring(cx, cy, 20.5, 0.9, P, 48), { tone: "faint" }));
  out.push(S(cylinder(cx, cy, 16, 0.8, 13, P, 40, 0.9), { tone: "mid" }));
  out.push(L(knurl(cx, cy, 16, 2, 13, 44, P, 0.4), { tone: "lo" }));
  out.push(S(cylinder(cx, cy, 11.5, 13.8, 2.2, P, 32, 0.5), { tone: "hi" }));
  out.push(L(k.ring(cx, cy, 9, 16, P, 28), { tone: "lo" }));
  out.push(D([at(cx, cy, 16.2)], { size: 0.5, tone: "hi" }));
  const [sx, sy] = at(cx, cy, 8);
  out.push(`<circle data-control="g" cx="${sx}" cy="${sy}" r="40" fill="transparent" pointer-events="all" style="cursor:ns-resize"/>`);
  return out.join("");
}

function crank() {
  const out = [];
  const [cx, cy] = CRANK;
  out.push(S(cylinder(cx, cy, 13, 0, 5, P, 32, 0.5), { tone: "mid" }));
  out.push(S(cylinder(cx, cy, 7, 5, 15, P, 28, 0.4), { tone: "mid" }));
  out.push(S(cylinder(cx, cy, 22, 20, 6, P, 56, 0.8), { tone: "mid" }));
  out.push(L(knurl(cx, cy, 22, 20, 26, 48, P, 0.4), { tone: "lo" }));
  out.push(L(k.ring(cx, cy, 16, 26.2, P, 40), { tone: "faint" }));
  out.push(S(cylinder(cx, cy, 5, 26, 2, P, 24, 0.4), { tone: "mid" }));
  const [sx, sy] = at(cx, cy, 24);
  out.push(`<circle data-control="r" cx="${sx}" cy="${sy}" r="42" fill="transparent" pointer-events="all" style="cursor:ew-resize"/>`);
  return out.join("");
}

function scalePointer() {
  return `<g data-part="scale-pointer" transform="${translateAlong(P, [0, 0, 0])}">` +
    S(slabOf({ x: -4, y: 151, w: 8, d: 12, r: 1.5 }, 0.7, 2.2, P, 3, 0.3), { tone: "hi" }) +
    L(lineOnTop([0, 151], [0, 159], 2.95, P), { tone: "hi" }) +
    D([at(0, 155, 2.95)], { size: 0.45, tone: "hi" }) +
    `</g>`;
}

const initial = { theta: 0, R: 180, g: 0.8 };
const svg = figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label:
    "A spin-gravity test rig on a heavy bench. A vertical spindle carries two radial arms. " +
    "On each arm a carriage with a test mass is held by a compression spring against an outboard stop. " +
    "A motor and belt drive the spindle; a tachometer shows rpm, a knob sets target gravity and a crank sets the floor radius. " +
    "As the rig turns, the test mass is pressed outward and the spring compresses; the readout gives rpm, radius and the gravity at the floor.",
  body: [
    base(),
    gantry(),
    benchDetail(),
    drive(),
    cabinet(),
    scalePointer(),
    rack(),
    `<g data-part="rotor">${rotorAt(initial.theta, initial.R, initial.g, P)}</g>`,
    hub(),
    tachometer(),
    knob(),
    crank(),
    `<path data-part="needle" class="iso-line" data-tone="hi" d="${(() => {
      const a = (210 / 180) * Math.PI + (300 / 180) * Math.PI * (2 / 3);
      return lineOnTop(TACH, [TACH[0] + Math.sin(a) * 21, TACH[1] - Math.cos(a) * 21], 95, P);
    })()}" style="stroke-width:1.2"/>`,
    `<path data-part="knob-pointer" class="iso-line" data-tone="hi" d="${lineOnTop(KNOB, [KNOB[0] + Math.sin(((-135 / 180) * Math.PI) + (270 / 180) * Math.PI * 0.8) * 19, KNOB[1] - Math.cos(((-135 / 180) * Math.PI) + (270 / 180) * Math.PI * 0.8) * 19], 16.3, P)}" style="stroke-width:1.3"/>`,
    `<g data-part="crank-handle">${crankHandleAt(initial.R, P)}</g>`,
    `<path data-part="cab-g" class="iso-line" data-tone="hi" d="${lineOnTop(CAB_G[0], [CAB_G[0][0] + Math.sin(knobAngle0(0.8)) * 5.5, CAB_G[0][1] - Math.cos(knobAngle0(0.8)) * 5.5], 35.4, P)}" style="stroke-width:1"/>`,
    `<path data-part="cab-rpm" class="iso-line" data-tone="hi" d="${lineOnTop(CAB_G[1], [CAB_G[1][0] + Math.sin(2.0 / 3 * Math.PI) * 5.5, CAB_G[1][1] - Math.cos(2.0 / 3 * Math.PI) * 5.5], 35.4, P)}" style="stroke-width:1"/>`,
  ].join(""),
});

function crankHandleAt(radiusM, P) {
  const [cx, cy] = CRANK;
  const a = (-140 / 180) * Math.PI + (280 / 180) * Math.PI * ((radiusM - 120) / 140);
  const hx = cx + Math.sin(a) * 15, hy = cy - Math.cos(a) * 15;
  return solidSvg(cylinder(hx, hy, 4.6, 26, 6, P, 24, 0.5), { tone: "hi" }) +
    solidSvg(cylinder(hx, hy, 5.8, 25.5, 1.2, P, 24), { tone: "lo" }) +
    lineSvg(knurl(hx, hy, 4.6, 27, 32, 22, P, 0.35), { tone: "lo" }) +
    dotsSvg([iso([hx, hy, 32.3], P)], { size: 0.45, tone: "hi" });
}

const html = plateHtml({
  fig: "图 3-3",
  title: "人工重力试验台",
  hint: "拖动旋钮 / 曲柄",
  readout: "180 m · 2.0 rpm · 0.80 g",
  body: `<div class="iso-stage" tabindex="0" role="group" aria-label="人工重力试验台：上下方向键改目标重力，左右方向键改半径">${svg}</div>`,
});

const kitScript = readFileSync(join(HERE, "vendor/iso-kit.mjs"), "utf8").replace(/^export /gm, "");
const themeCss = readFileSync(join(HERE, "theme.css"), "utf8");

const live = `
const P = ${JSON.stringify(P)};
const G0 = ${G0};
const TACH = ${JSON.stringify(TACH)};
const KNOB = ${JSON.stringify(KNOB)};
const CABG = ${JSON.stringify(CAB_G)};
const stage = root.querySelector(".iso-stage");
const svg = stage.querySelector("svg");
const narrow = matchMedia("(max-width: 560px)");
const setFrame = () => svg.setAttribute("viewBox", narrow.matches ? "90 30 610 460" : "0 0 760 540");
setFrame();
if (narrow.addEventListener) narrow.addEventListener("change", setFrame);
const rotor = svg.querySelector('[data-part="rotor"]');
const needle = svg.querySelector('[data-part="needle"]');
const knobPointer = svg.querySelector('[data-part="knob-pointer"]');
const crankHandle = svg.querySelector('[data-part="crank-handle"]');
const scalePointer = svg.querySelector('[data-part="scale-pointer"]');
const cabG = svg.querySelector('[data-part="cab-g"]');
const cabRpm = svg.querySelector('[data-part="cab-rpm"]');
const readout = root.querySelector("[data-readout]");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const PRESETS = [[0.8,120],[0.8,180],[0.8,260],[0.4,120],[1.0,260]];
let g = 0.8, R = 180, theta = 0;
let gShow = 0.8, RShow = 180, last = 0, lastBuild = 0, clock = 0;
let touring = true, visible = false, frame = 0, idleTimer = 0, drag = null;
const angleOf = (n) => (210 / 180) * Math.PI + (300 / 180) * Math.PI * clamp(n / 3, 0, 1);
const knobAngle = (gv) => (-135 / 180) * Math.PI + (270 / 180) * Math.PI * clamp((gv - 0.4) / 0.6, 0, 1);
const rpmAngle = (n) => (n / 3) * Math.PI * 2;
const speed = () => Math.sqrt((gShow * G0) / RShow);
function draw() {
  const omega = speed();
  const n = omega * 60 / (2 * Math.PI);
  rotor.innerHTML = rotorAtSrc(theta, RShow, gShow, P);
  needle.setAttribute("d", lineOnTop(TACH, [TACH[0] + Math.sin(angleOf(n)) * 21, TACH[1] - Math.cos(angleOf(n)) * 21], 95, P));
  knobPointer.setAttribute("d", lineOnTop(KNOB, [KNOB[0] + Math.sin(knobAngle(g)) * 19, KNOB[1] - Math.cos(knobAngle(g)) * 19], 16.3, P));
  crankHandle.innerHTML = crankAtSrc(RShow, P);
  cabG.setAttribute("d", lineOnTop(CABG[0], [CABG[0][0] + Math.sin(knobAngle(g)) * 5.5, CABG[0][1] - Math.cos(knobAngle(g)) * 5.5], 35.4, P));
  cabRpm.setAttribute("d", lineOnTop(CABG[1], [CABG[1][0] + Math.sin(rpmAngle(n)) * 5.5, CABG[1][1] - Math.cos(rpmAngle(n)) * 5.5], 35.4, P));
  const sx = -160 + ((RShow - 120) / 140) * 320;
  scalePointer.setAttribute("transform", translateAlong(P, [sx, 0, 0]));
  const head = Math.max(0, (gShow * (RShow - 1.7)) / RShow);
  const text = RShow.toFixed(0) + " m · " + n.toFixed(1) + " rpm · " + gShow.toFixed(2) + " g";
  if (readout.textContent !== text) readout.textContent = text;
  stage.setAttribute("aria-label", "人工重力试验台：半径 " + RShow.toFixed(0) + " 米，转速 " + n.toFixed(1) + " 转每分，地板重力 " + gShow.toFixed(2) + " g，头部重力 " + head.toFixed(2) + " g。上下方向键改目标重力，左右方向键改半径。");
}
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 24) : 1 / 60;
  last = now;
  if (touring) {
    clock += dt;
    const p = PRESETS[Math.floor(clock / 4.6) % PRESETS.length];
    g = p[0]; R = p[1];
  }
  if (still.matches) {
    gShow = g; RShow = R; draw(); return;
  }
  gShow += (g - gShow) * (1 - Math.exp(-dt / 0.4));
  RShow += (R - RShow) * (1 - Math.exp(-dt / 0.5));
  theta += speed() * dt;
  if (now - lastBuild > 33) { draw(); lastBuild = now; }
  frame = visible && root.isConnected ? requestAnimationFrame(tick) : 0;
}
const run = () => {
  if (!frame && visible && root.isConnected && !still.matches) { last = 0; lastBuild = 0; frame = requestAnimationFrame(tick); }
};
const steer = () => {
  touring = false;
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => { if (!root.isConnected) return; touring = !still.matches; clock = 0; run(); }, 7000);
  if (still.matches) { gShow = g; RShow = R; draw(); }
  run();
};
new IntersectionObserver((entries) => { visible = entries[entries.length - 1].isIntersecting; if (visible) run(); }, { rootMargin: "120px 0px" }).observe(stage);
if (still.matches) touring = false;
stage.addEventListener("keydown", (event) => {
  let handled = true;
  if (event.key === "ArrowUp") g = clamp(g + 0.05, 0.4, 1.0);
  else if (event.key === "ArrowDown") g = clamp(g - 0.05, 0.4, 1.0);
  else if (event.key === "ArrowRight") R = clamp(R + 10, 120, 260);
  else if (event.key === "ArrowLeft") R = clamp(R - 10, 120, 260);
  else if (event.key === "Home") { g = 0.8; R = 180; }
  else handled = false;
  if (!handled) return;
  event.preventDefault();
  steer();
});
stage.addEventListener("pointerdown", (event) => {
  const handle = event.target.closest("[data-control]");
  if (!handle) return;
  drag = { kind: handle.dataset.control, x: event.clientX, y: event.clientY, g, R };
  if (stage.setPointerCapture) stage.setPointerCapture(event.pointerId);
  touring = false;
  event.preventDefault();
});
stage.addEventListener("pointermove", (event) => {
  if (!drag) return;
  if (drag.kind === "g") g = clamp(drag.g - (event.clientY - drag.y) * 0.006, 0.4, 1.0);
  else R = clamp(Math.round((drag.R + (event.clientX - drag.x) * 0.7) / 10) * 10, 120, 260);
  steer();
});
const endDrag = () => { drag = null; };
stage.addEventListener("pointerup", endDrag);
stage.addEventListener("pointercancel", endDrag);
draw();
`;

const browserLib = kitScript + `\nconst CRANK = ${JSON.stringify(CRANK)};\nconst rotorAtSrc = ${rotorAt.toString()};\nconst crankAtSrc = ${crankHandleAt.toString()};\n`;
const siteScript = `(function(){\n${browserLib}\nwindow.ANATOMY_FIGURES = window.ANATOMY_FIGURES || {};\nwindow.ANATOMY_FIGURES.gravity = { html: ${JSON.stringify(html)}, init: function(root){\n${live}\n} };\n})();`;

writeFileSync(join(HERE, "gravity.js"), siteScript);
writeFileSync(join(HERE, "gravity.html"), pageHtml({
  title: "人工重力试验台",
  theme: "light",
  width: 760,
  body: html,
  script: `const root = document.querySelector(".iso-page");\n` + browserLib + live,
}).replace("</head>", `<style>${themeCss}</style></head>`));
console.log("wrote gravity.js and gravity.html");
