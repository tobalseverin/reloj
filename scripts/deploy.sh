#!/usr/bin/env bash
# Deploy the static build to wonki (Vesta user: cristobal).
# Run from your Mac: pnpm deploy:wonki
set -euo pipefail

HOST="cs@wonki.p113.io"
VESTA_USER="cristobal"
DOMAIN="reloj.wrdowrdo.art"
TARGET="/home/$VESTA_USER/web/$DOMAIN/public_html/"
STAGING="/tmp/reloj-dist/"

# Reuse one SSH connection so the password is asked only once.
SSH_OPTS=(-o ControlMaster=auto -o ControlPath="/tmp/ssh-reloj-%r@%h" -o ControlPersist=120)

cd "$(dirname "$0")/.."

echo "→ Build"
pnpm build

echo "→ Upload to staging ($HOST:$STAGING)"
rsync -az --delete -e "ssh ${SSH_OPTS[*]}" dist/ "$HOST:$STAGING"

echo "→ Publish to $TARGET as $VESTA_USER (sudo asks for the cs password)"
ssh -t "${SSH_OPTS[@]}" "$HOST" "sudo rsync -a --delete $STAGING $TARGET \
  && sudo chown -R $VESTA_USER:$VESTA_USER $TARGET \
  && rm -rf $STAGING \
  && ls -la $TARGET"

echo "→ Check"
curl -sI "http://$DOMAIN/" | head -1
