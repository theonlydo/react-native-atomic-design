#!/bin/bash
echo "🔧 Fixing TypeScript path aliases..."

# Kill watchman
echo "Stopping watchman..."
watchman watch-del-all 2>/dev/null || true

# Clean caches
echo "Cleaning caches..."
rm -rf node_modules/.cache
rm -rf /tmp/metro-*
rm -rf /tmp/haste-*

echo "✅ Done! Now please:"
echo "1. Restart VS Code TypeScript server (Cmd+Shift+P -> 'TypeScript: Restart TS Server')"
echo "2. Wait a few seconds"
echo "3. Check if errors are gone"
