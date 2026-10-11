#!/usr/bin/env bash
# Deploy the static build to wonki (Vesta user: cristobal).
# Run from your Mac: pnpm deploy:wonki
set -euo pipefail

HOST="cs@wonki.p113.io"
VESTA_USER="cristobal"
DOMAIN="reloj.wrdowrdo.art"
TARGET="/home/$VESTA_USER/web/$DOMAIN/public_html/"
RELEASES="/home/$VESTA_USER/releases/$DOMAIN"
STAGING="/tmp/reloj-dist/"
STAMP="$(date +%Y%m%d-%H%M%S)"

# Reuse one SSH connection so the password is asked only once.
SSH_OPTS=(-o ControlMaster=auto -o ControlPath="/tmp/ssh-reloj-%r@%h" -o ControlPersist=120)

cd "$(dirname "$0")/.."

echo "→ Build"
pnpm build

echo "→ Upload to staging ($HOST:$STAGING)"
rsync -az --delete -e "ssh ${SSH_OPTS[*]}" dist/ "$HOST:$STAGING"

# Everything on the project's files runs as the Vesta user (sudo asks for the cs password).
echo "→ Back up current version to $RELEASES/$STAMP, keep last 3, publish as $VESTA_USER"
ssh -t "${SSH_OPTS[@]}" "$HOST" "sudo chmod -R a+rX $STAGING \
  && sudo -u $VESTA_USER mkdir -p $RELEASES \
  && sudo -u $VESTA_USER cp -a $TARGET $RELEASES/$STAMP \
  && sudo -u $VESTA_USER sh -c 'cd $RELEASES && ls -1d */ | sort | head -n -3 | xargs -r rm -rf' \
  && sudo -u $VESTA_USER rsync -a --delete $STAGING $TARGET \
  && rm -rf $STAGING \
  && ls -la $TARGET && ls -1 $RELEASES"

echo "→ Check"
curl -sI "https://$DOMAIN/" | head -1
