#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ML_PORT="${ML_PORT:-8000}"
BACKEND_PORT="${PORT:-4000}"
FRONTEND_PORT="${FRONTEND_PORT:-3000}"
WITH_FRONTEND="${WITH_FRONTEND:-0}"

pids=()
cleanup_done=0

cleanup() {
    if [[ "$cleanup_done" == "1" ]]; then
        return
    fi

    cleanup_done=1

    echo
    echo "Stopping dev services..."

    for pid in "${pids[@]}"; do
        if kill -0 "$pid" 2>/dev/null; then
            kill "$pid" 2>/dev/null || true
        fi
    done

    wait 2>/dev/null || true
}

trap cleanup EXIT INT TERM

require_port_free() {
    local port="$1"
    local name="$2"
    local env_name="$3"

    if lsof -nP -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1; then
        echo "Port $port is already in use for $name."
        echo "Stop that process or run with a different port, for example:"
        echo "  $env_name=<port> ./scripts/dev.sh"
        exit 1
    fi
}

start_service() {
    local name="$1"
    local workdir="$2"
    shift 2

    echo "Starting $name..."
    (
        cd "$workdir"
        "$@"
    ) &
    pids+=("$!")
}

require_port_free "$ML_PORT" "ML service" "ML_PORT"
require_port_free "$BACKEND_PORT" "backend" "PORT"

if [[ "$WITH_FRONTEND" == "1" ]]; then
    require_port_free "$FRONTEND_PORT" "frontend" "FRONTEND_PORT"
fi

start_service "ML service on http://localhost:$ML_PORT" \
    "$ROOT_DIR/ml-service" \
    python3 -m uvicorn app.main:app --host 127.0.0.1 --port "$ML_PORT"

start_service "backend on http://localhost:$BACKEND_PORT" \
    "$ROOT_DIR/backend" \
    env PORT="$BACKEND_PORT" ML_SERVICE_URL="http://127.0.0.1:$ML_PORT" node server.js

if [[ "$WITH_FRONTEND" == "1" ]]; then
    start_service "frontend on http://localhost:$FRONTEND_PORT" \
        "$ROOT_DIR/files" \
        python3 -m http.server "$FRONTEND_PORT"
fi

echo
echo "Ready."
echo "App:     http://localhost:$BACKEND_PORT/index.html"
echo "API:     http://localhost:$BACKEND_PORT"
echo "ML:      http://localhost:$ML_PORT"

if [[ "$WITH_FRONTEND" == "1" ]]; then
    echo "Frontend: http://localhost:$FRONTEND_PORT"
fi

echo
echo "Press Ctrl-C to stop everything."

wait
