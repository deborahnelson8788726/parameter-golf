# Give the cloud Claude session a real browser

Goal: let Claude Code on the web drive a headless browser (Playwright) so it can
log into dashboards (e.g. Railway) and click through UIs itself.

This needs **two environment changes that only the environment owner can make**
in the web UI at [claude.ai/code](https://claude.ai/code). The repo side is
already done: `.mcp.json` declares the `browser` (Playwright) MCP server.

## Why config is required
The default **Trusted** network level blocks the hosts Claude needs:
`cdn.playwright.dev` and `playwright.azureedge.net` (to download the browser)
and `railway.com` / `backboard.railway.com` (the site to operate). All return
`host_not_allowed` until allowlisted.

## Step 1 — Network access
Edit the environment (cloud icon → hover env → settings) → **Network access**:
- Easiest: set to **Full**.
- Tighter: set to **Custom**, check "Also include default list", and add:
  ```
  cdn.playwright.dev
  playwright.azureedge.net
  *.playwright.dev
  railway.com
  *.railway.com
  railway.app
  *.railway.app
  ```

## Step 2 — Setup script (installs the browser, then cached)
In the same environment dialog, add to the **setup script**:
```bash
npx --yes playwright@latest install --with-deps chromium
```
The filesystem is snapshotted after the setup script, so the browser is only
downloaded once and is present at the start of every later session.

## Step 3 — New session
Start a fresh cloud session on this branch. Claude Code will detect the
`browser` server in `.mcp.json` and ask you to approve it. Approve it, and the
browser navigation tools become available to Claude.

## Honest caveats
- **Logging into Google from a datacenter IP** (Railway "Login with Google")
  often triggers Google's bot-detection / 2FA and may fail regardless of setup.
- Driving a login means Claude types your credentials into the headless browser.
  Prefer credential-free paths when possible:
  - **Railway:** create an API token (Account → Tokens) and add it as the
    `RAILWAY_TOKEN` env var / GitHub secret — the included
    `.github/workflows/deploy-railway.yml` deploys with no browser login.
  - **GitHub Pages:** Settings → Pages → branch `gh-pages` → Save. Zero browser,
    zero network changes — the site is already pushed to `gh-pages`.
