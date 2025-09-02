#!/bin/bash
# Build script for Vercel deployment
echo "Building GIE Certificate System for Vercel..."

# Create dist directory and copy public files
mkdir -p dist
cp -r public/* dist/

echo "Build completed successfully!"
echo "Files copied to dist/ directory for Vercel deployment"
