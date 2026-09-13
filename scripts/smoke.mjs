import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";

// Own the server process so failures never leave it running in CI or locally.
const port = 3197;
const base = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", String(port)], { stdio: "inherit" });
const closed = new Promise((resolve) => server.once("exit", resolve));
let serverError;
server.on("error", (error) => { serverError = error; });

async function request(path, options = {}) {
  return fetch(`${base}${path}`, { signal: AbortSignal.timeout(5000), ...options });
}

try {
  let ready = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    if (serverError) throw serverError;
    if (server.exitCode !== null) throw new Error("Production server exited before readiness");
    try {
      ready = (await request("/fr")).ok;
    } catch { /* Wait for Next.js to bind the port. */ }
    if (ready) break;
    await delay(500);
  }
  assert.ok(ready, "Production server did not become ready");
  for (const path of ["/fr", "/fr/tiers", "/fr/games", "/fr/kids", "/fr/cycle-3", "/fr/middle-school", "/fr/middle-school/algebra/equations"]) {
    const response = await request(path);
    assert.equal(response.status, 200, path);
    assert.match(await response.text(), /<html[^>]*lang="fr"/, path);
  }
  for (const [path, destination] of [["/", "/fr"], ["/en/games", "/fr/games"]]) {
    const response = await request(path, { redirect: "manual", headers: { "Accept-Language": "en-US" } });
    assert.ok([307, 308].includes(response.status), path);
    assert.equal(response.headers.get("location"), destination);
  }
  for (const path of ["/fr/high-school", "/fr/college"]) {
    assert.equal((await request(path)).status, 404, path);
  }
  const sitemap = await request("/sitemap.xml");
  assert.equal(sitemap.status, 200);
  const xml = await sitemap.text();
  assert.match(xml, /\/fr\/middle-school/);
  assert.doesNotMatch(xml, /\/(en|high-school|college)(?:\/|<)/);
  console.log("Smoke tests passed: French pages, lessons, redirects, excluded levels and sitemap.");
} finally {
  if (server.exitCode === null && !serverError) {
    server.kill("SIGTERM");
    const force = setTimeout(() => server.kill("SIGKILL"), 5000);
    await closed;
    clearTimeout(force);
  }
}
