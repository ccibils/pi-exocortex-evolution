import { readFileSync } from "node:fs";

const html = readFileSync("index.html", "utf8");
const visibleText = html
  .replace(/<style\b[\s\S]*?<\/style>/giu, " ")
  .replace(/<script\b[\s\S]*?<\/script>/giu, " ")
  .replace(/<[^>]+>/gu, " ")
  .replace(/\s+/gu, " ")
  .trim();
const checks = [
  ["value-telemetry-landmark", html, /<section\b[\s\S]*?<h2[^>]*>\s*(?:campaign\s+)?(?:value|economics|telemetry|performance)[^<]*<\/h2>/iu],
  ["campaign-progress", visibleText, /(?:2\s*\/\s*3.*(?:deliveries|countable|sealed)|(?:deliveries|countable|sealed).*2\s*\/\s*3)/iu],
  ["context-cost", visibleText, /\$0\.096212/u],
  ["history-cost", visibleText, /\$0\.0544865/u],
  ["context-speed", visibleText, /92\.804\s*(?:s|seconds)/iu],
  ["history-speed", visibleText, /57\.783\s*(?:s|seconds)/iu],
  ["cost-improvement", visibleText, /43\.(?:3|4)\s*%/u],
  ["speed-improvement", visibleText, /37\.(?:7|8)\s*%/u],
  ["mean-quality", visibleText, /\+0\.11458/iu],
  ["campaign-net-value", visibleText, /\$8\.390968/iu],
  ["model-calls", visibleText, /6\s*model\s*calls?/iu],
  ["provider-reads", visibleText, /8\s*provider\s*reads?/iu],
  ["cache-economics", visibleText, /2[,\s]?304\s*(?:cache|cached)[-\s]*(?:read\s*)?tokens/iu],
  ["attention-improvement", visibleText, /2\s*(?:min|minutes).*attention|attention.*2\s*(?:min|minutes)/iu],
  ["trust", visibleText, /(?:0|zero)\s*trust\s*violations?/iu],
  ["release-history-preserved", visibleText, /Release history/iu],
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
      message: `Release-value acceptance check failed: ${failed.name}`,
    },
  }));
  process.exit(1);
}

console.log(JSON.stringify({ schemaVersion: 1, passed, total: results.length, failure: null }));
