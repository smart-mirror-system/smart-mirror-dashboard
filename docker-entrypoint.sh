#!/bin/sh
cat <<EOF > /usr/share/nginx/html/js/env-config.js
window.env = {
  BACKEND_URL: "${BACKEND_URL:-http://localhost:3010}"
};
EOF

exec "$@"
