#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

echo "Starting Next.js on http://0.0.0.0:3000 ..."
pnpm dev &
DEV_PID=$!

cleanup() {
  kill "$DEV_PID" 2>/dev/null || true
}
trap cleanup EXIT

for i in {1..30}; do
  if curl -sf http://127.0.0.1:3000 >/dev/null 2>&1; then
    break
  fi
  sleep 1
done

echo ""
echo "Starting public preview tunnel..."
echo "Use the URL printed below in your browser."
echo ""

if command -v cloudflared >/dev/null 2>&1; then
  cloudflared tunnel --url http://127.0.0.1:3000
elif [ -x /tmp/cloudflared ]; then
  /tmp/cloudflared tunnel --url http://127.0.0.1:3000
else
  npx --yes localtunnel --port 3000
fi
