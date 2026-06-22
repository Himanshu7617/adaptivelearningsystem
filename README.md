# Adaptive Learning System

Run the app with one command:

```bash
./scripts/dev.sh
```

This starts:

- ML service: `http://localhost:8000`
- Express backend and app: `http://localhost:4000/index.html`

The backend serves the frontend, so you do not need a separate frontend server for normal development.

If you still want the static frontend on port `3000`, run:

```bash
WITH_FRONTEND=1 ./scripts/dev.sh
```

Useful port overrides:

```bash
ML_PORT=8001 PORT=4001 FRONTEND_PORT=3001 WITH_FRONTEND=1 ./scripts/dev.sh
```

Press `Ctrl-C` to stop all services started by the script.
