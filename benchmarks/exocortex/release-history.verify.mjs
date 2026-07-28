import { readFileSync } from "node:fs";

const html = readFileSync("index.html", "utf8");
const visibleText = html
  .replace(/<style\b[\s\S]*?<\/style>/giu, " ")
  .replace(/<script\b[\s\S]*?<\/script>/giu, " ")
  .replace(/<[^>]+>/gu, " ")
  .replace(/\s+/gu, " ")
  .trim();
const checks = [
  ["release-history-landmark", html, /<section[^>]+aria-label=["'][^"']*(?:release\s+)?history[^"']*["']/iu],
  ["campaign-progress", visibleText, /(?:1\s*\/\s*3.*(?:deliveries|countable)|(?:deliveries|countable).*1\s*\/\s*3)/iu],
  ["context-delivery", visibleText, /context.*(?:feature|delivery|front door)/iu],
  ["release-commit", visibleText, /283f8e9(?:252fc44c975a9e2569534785e5e6cae1f)?/iu],
  ["pages-build", visibleText, /1118900944/u],
  ["workflow-run", html, /actions\/runs\/30338495883/u],
  ["episode-receipt", visibleText, /031ba77beca89bf768926f2901644ba296165a96ed7e82b184c359ac24c50124/u],
  ["quality-gain", visibleText, /\+0\.1667/iu],
  ["generation-cost", visibleText, /\$0\.096212/u],
  ["generation-speed", visibleText, /92\.8(?:04)?\s*(?:s|seconds)/iu],
  ["attention-improvement", visibleText, /1\s*(?:min|minute).*attention/iu],
  ["evidence-story-link", html, /story-88f39a9ad6ae514c1272f5e7d7a3e0c536464b35987c28e3ea4991a5e51b6011\.html/u],
  ["semantic-main", html, /<main[\s>]/u],
  ["semantic-navigation", html, /<nav[\s>]/u],
];

const results = checks.map(([name, source, pattern]) => ({ name, passed: pattern.test(source) }));
results.push({ name: "front-door-still-redirects", passed: !/location\.replace\s*\(/u.test(html) });
results.push({
  name: "external-runtime-dependency",
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
      assertionId: failed.name,
      message: `Release-history acceptance check failed: ${failed.name}`,
    },
  }));
  process.exit(1);
}

console.log(JSON.stringify({ schemaVersion: 1, passed, total: results.length, failure: null }));
