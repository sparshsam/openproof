#!/bin/bash
# OpenProof Capacitor Android Build Script
# Builds the web app as a static export for Capacitor, then copies to native project

set -euo pipefail

echo "=== OpenProof Capacitor Build ==="

# Build with static export for Capacitor
echo "[1/3] Building static export..."
NEXT_PUBLIC_STATIC_EXPORT=true npx next build 2>&1

if [ -d "out" ]; then
  echo "[2/3] Copying web assets to Capacitor Android project..."
  npx cap copy android 2>&1
  
  echo "[3/3] Syncing Capacitor..."
  npx cap sync android 2>&1
  
  echo ""
  echo "✅ Capacitor Android build complete!"
  echo "To open in Android Studio: npx cap open android"
else
  echo "❌ out/ directory not found. Static export may have failed."
  exit 1
fi
