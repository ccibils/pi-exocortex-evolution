import { readFileSync } from "node:fs";

const html = readFileSync("index.html", "utf8");
const visibleText = html
  .replace(/<style\b[\s\S]*?<\/style>/giu, " ")
  .replace(/<script\b[\s\S]*?<\/script>/giu, " ")
  .replace(/<[^>]+>/gu, " ")
  .replace(/\s+/gu, " ")
  .trim();

const checks = [
  ["autonomy-thesis", visibleText, /machine that learns to ship itself/iu],
  ["issue-to-production", visibleText, /1\s*→\s*prod/iu],
  ["unsafe-promotion-count", visibleText, /0\s*\/\s*7/iu],
  ["seven-stage-loop", visibleText, /Intake.*Triage.*Author.*Worker.*Reviewer.*Promote.*Shipwatch/iu],
  ["search-history", visibleText, /Dependency illusion.*32 MB ceiling.*Blunt timebox.*Budget breach.*False “verified”.*False “success”.*Learned/iu],
  ["matched-cost-baseline", visibleText, /\$0\.526298/u],
  ["matched-cost-improvement", visibleText, /\$0\.395250.*24\.9% cheaper/iu],
  ["end-to-end-cost", visibleText, /\$0\.553913/u],
  ["cache-read-economics", visibleText, /800,256.*cache-read tokens/iu],
  ["scheduler-cadence", visibleText, /every 15 minutes/iu],
  ["bounded-concurrency", visibleText, /1 default.*4 hard max/iu],
  ["idle-cost", visibleText, /\$0.*0 calls/iu],
  ["self-authored-pr", html, /pi-exocortex\/pull\/14/u],
  ["hosted-proof", html, /actions\/runs\/30350688522/u],
  ["credential-free", visibleText, /Credential material exposed:\s*none/iu],
];

const results = checks.map(([name, source, pattern]) => ({ name, passed: pattern.test(source) }));
results.push({ name: "external-runtime-dependency", passed: !/<(?:script|link)[^>]+(?:src|href)=["']https?:/iu.test(html) });

const failed = results.find((result) => !result.passed);
const passed = results.filter((result) => result.passed).length;
if (failed !== undefined) {
  console.log(JSON.stringify({ schemaVersion: 1, passed, total: results.length, failure: { assertionId: failed.name } }));
  process.exit(1);
}

console.log(JSON.stringify({ schemaVersion: 1, passed, total: results.length, failure: null }));
