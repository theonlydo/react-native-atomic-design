#!/bin/bash

# Environment Switcher Script
# Usage: ./switch-env.sh [dev|prod]

ENV=$1

if [ -z "$ENV" ]; then
  echo "❌ Error: Please specify environment (dev or prod)"
  echo "Usage: ./switch-env.sh [dev|prod]"
  exit 1
fi

if [ "$ENV" == "dev" ]; then
  echo "🔄 Switching to DEVELOPMENT environment..."
  cp env/.env.dev env/.env
  echo "✅ Environment switched to DEVELOPMENT"
  echo "📝 Config: env/.env.dev → env/.env"
  echo ""
  echo "Next steps:"
  echo "  npm run start    # Start Metro bundler"
  echo "  npm run android  # Run on Android"
  echo "  npm run ios      # Run on iOS"
elif [ "$ENV" == "prod" ]; then
  echo "🔄 Switching to PRODUCTION environment..."
  cp env/.env.prod env/.env
  echo "✅ Environment switched to PRODUCTION"
  echo "📝 Config: env/.env.prod → env/.env"
  echo ""
  echo "⚠️  WARNING: You are now in PRODUCTION mode!"
  echo "Next steps:"
  echo "  npm run start    # Start Metro bundler"
  echo "  npm run android  # Run on Android"
  echo "  npm run ios      # Run on iOS"
else
  echo "❌ Error: Invalid environment '$ENV'"
  echo "Valid options: dev, prod"
  exit 1
fi
