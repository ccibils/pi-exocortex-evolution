import { readFileSync } from "node:fs";

const html = readFileSync("index.html", "utf8");
const checks = [
  ["release command title", /<title>Pi Exocortex · Release Command<\/title>/u],
  ["earned frontier", /Earned frontier[^<]*R0/iu],
  ["current campaign", /Current campaign[^<]*R1/iu],
  ["build frontier", /Build frontier[^<]*R3\.5/iu],
  ["rung context", /R0[^<]*(?:earned|proven)[\s\S]*R1[^<]*(?:current|earning)[\s\S]*R2[^<]*shadow[\s\S]*R3[^<]*shadow/iu],
  ["completion progress", /0\s*\/\s*3[^<]*(?:deliveries|countable)/iu],
  ["next proof", /Next proof/iu],
  ["evidence story link", /story-88f39a9ad6ae514c1272f5e7d7a3e0c536464b35987c28e3ea4991a5e51b6011\.html/u],
  ["semantic main", /<main[\s>]/u],
  ["semantic navigation", /<nav[\s>]/u],
];

const failures = checks.filter(([, pattern]) => !pattern.test(html)).map(([name]) => name);
if (/location\.replace\s*\(/u.test(html)) failures.push("front door still redirects");
if (/<(?:script|link)[^>]+(?:src|href)=["']https?:/iu.test(html)) failures.push("external runtime dependency");

if (failures.length > 0) {
  console.error(JSON.stringify({ ok: false, failures }));
  process.exit(1);
}

console.log(JSON.stringify({ ok: true, passed: checks.length + 2, total: checks.length + 2 }));
