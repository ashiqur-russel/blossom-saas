#!/bin/bash

# Setup script to create .env file from .env.example

ENV_FILE=".env"
ENV_EXAMPLE=".env.example"

if [ -f "$ENV_FILE" ]; then
    echo "⚠️  .env file already exists!"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Aborted."
        exit 1
    fi
fi

if [ ! -f "$ENV_EXAMPLE" ]; then
    echo "❌ .env.example file not found!"
    exit 1
fi

# Copy example file
cp "$ENV_EXAMPLE" "$ENV_FILE"

# Generate secure secrets
echo "🔐 Generating secure JWT secrets..."

JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_REFRESH_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

# Replace secrets in .env file
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s|JWT_SECRET=.*|JWT_SECRET=$JWT_SECRET|" "$ENV_FILE"
    sed -i '' "s|JWT_REFRESH_SECRET=.*|JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET|" "$ENV_FILE"
else
    # Linux
    sed -i "s|JWT_SECRET=.*|JWT_SECRET=$JWT_SECRET|" "$ENV_FILE"
    sed -i "s|JWT_REFRESH_SECRET=.*|JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET|" "$ENV_FILE"
fi

echo "✅ .env file created successfully!"
echo "📝 Generated secrets have been added to .env file"
echo ""
echo "⚠️  IMPORTANT: Keep your .env file secure and never commit it to version control!"


