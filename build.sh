#!/usr/bin/env bash
# Generates config.js from a Netlify environment variable so the API key
# never lives in the git repo.
set -e

cat > config.js <<EOF
window.PORTFOLIO_CONFIG = {
    YOUTUBE_API_KEY: '${YOUTUBE_API_KEY:-}'
};
EOF

if [ -z "${YOUTUBE_API_KEY:-}" ]; then
    echo "[build] WARNING: YOUTUBE_API_KEY env var is empty — view counts will not load."
else
    echo "[build] config.js generated with YouTube API key."
fi
