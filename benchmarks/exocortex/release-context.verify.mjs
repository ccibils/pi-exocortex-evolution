import { readFileSync } from "node:fs";

const html = readFileSync("index.html", "utf8");
const visibleText = html
  .replace(/<style\b[\s\S]*?<\/style>/giu, " ")
  .replace(/<script\b[\s\S]*?<\/script>/giu, " ")
  .replace(/<[^>]+>/gu, " ")
  .replace(/\s+/gu, " ")
  .trim();
const checks = [
  ["release command title", html, /<title>Pi Exocortex · (?:Release Command|Mission Control|Release Front Door)<\/title>/u],
  ["earned frontier", visibleText, /R1.*earned/iu],
  ["current campaign", visibleText, /R2.*current campaign/iu],
  ["build frontier", visibleText, /build frontier\s+R3\.5/iu],
  ["rung context", visibleText, /R0.*earned.*R1.*earned.*R2.*current.*R3.*shadow/iu],
  ["completion progress", visibleText, /(?:3\s*\/\s*3.*(?:deliveries|sealed)|(?:deliveries|sealed).*3\s*\/\s*3)/iu],
  ["next proof", visibleText, /cheaper matched work|lower matched cost/iu],
  ["evidence story link", html, /story-88f39a9ad6ae514c1272f5e7d7a3e0c536464b35987c28e3ea4991a5e51b6011\.html/u],
  ["semantic main", html, /<main[\s>]/u],
  ["semantic navigation", html, /<nav[\s>]/u],
];

const results = checks.map(([name, source, pattern]) => ({ name, passed: pattern.test(source) }));
results.push({ name: "front door still redirects", passed: !/location\.replace\s*\(/u.test(html) });
results.push({
  name: "external runtime dependency",
  passed: !/<(?:script|link)[^>]+(?:src|href)=["']https?:/iu.test(html),
});

const failed = results.find((result) => !result.passed);
const passed = results.filter((result) => result.passed).length;
if (failed !== undefined) {
  console.log(JSON.stringify({
    schemaVersion: 1,
    passed,
    total: results.length,
    failure: {
      assertionId: failed.name.replaceAll(" ", "-"),
      message: `Release-context acceptance check failed: ${failed.name}`,
    },
  }));
  process.exit(1);
}

console.log(JSON.stringify({ schemaVersion: 1, passed, total: results.length, failure: null }));
