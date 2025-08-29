#!/bin/bash

echo "🚀 Starting GIE Certificate Management System (JavaScript Version)"
echo "📂 Project converted to pure JavaScript/JSX"
echo "🌐 Server will run on http://localhost:5000"
echo ""

# Set environment
export NODE_ENV=development

# Start the JavaScript server
echo "▶️  Starting server..."
exec node server/index.js