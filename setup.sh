#!/usr/bin/env bash
# Backwards-compatible entry point; the canonical setup script lives in tools/.
set -euo pipefail
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
exec bash "$SCRIPT_DIR/tools/setup.sh" "$@"
