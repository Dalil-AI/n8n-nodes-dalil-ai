#!/bin/bash

# Dalil AI n8n Node - Complete Installation & Testing Script
# This script will build, install, and test the node end-to-end

echo "🚀 Dalil AI n8n Node - Installation & Testing"
echo "============================================="

# Step 1: Build the package
echo "📦 Building the package..."
npm install
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"

# Step 2: Check if dist directory was created
if [ ! -d "dist" ]; then
    echo "❌ dist directory not found!"
    exit 1
fi

echo "✅ dist directory created"

# Step 3: Verify all files are compiled
echo "🔍 Verifying compiled files..."

REQUIRED_FILES=(
    "dist/credentials/DalilAiApi.credentials.js"
    "dist/nodes/DalilAI/DalilAI.node.js"
    "dist/nodes/DalilAI/GenericFunctions.js"
    "dist/nodes/DalilAI/PeopleDescription.js"
    "dist/nodes/DalilAI/DalilAI.node.json"
    "dist/nodes/DalilAI/dalil-ai.svg"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Missing: $file"
        exit 1
    else
        echo "✅ Found: $file"
    fi
done

# Step 4: Test the index.js file
echo "🧪 Testing index.js..."
node -e "
    try {
        const pkg = require('./index.js');
        console.log('✅ index.js loads successfully');
        console.log('📊 Credentials:', pkg.credentials?.length || 0);
        console.log('📊 Nodes:', pkg.nodes?.length || 0);
        
        if (pkg.credentials?.length > 0 && pkg.nodes?.length > 0) {
            console.log('✅ Package exports are valid');
        } else {
            console.log('❌ Package exports are invalid');
            process.exit(1);
        }
    } catch (error) {
        console.log('❌ index.js failed to load:', error.message);
        process.exit(1);
    }
"

if [ $? -ne 0 ]; then
    echo "❌ index.js test failed!"
    exit 1
fi

# Step 5: Run linting
echo "🔍 Running linting..."
npm run lint

if [ $? -ne 0 ]; then
    echo "⚠️  Linting issues found (but continuing...)"
fi

# Step 6: Test package.json structure
echo "📋 Verifying package.json..."
node -e "
    const pkg = require('./package.json');
    const required = ['name', 'version', 'main', 'n8n'];
    
    for (const field of required) {
        if (!pkg[field]) {
            console.log('❌ Missing field:', field);
            process.exit(1);
        }
    }
    
    if (!pkg.n8n.credentials?.includes('dist/credentials/DalilAiApi.credentials.js')) {
        console.log('❌ DalilAiApi.credentials.js not listed in package.json');
        process.exit(1);
    }
    
    if (!pkg.n8n.nodes?.includes('dist/nodes/DalilAI/DalilAI.node.js')) {
        console.log('❌ DalilAI.node.js not listed in package.json');
        process.exit(1);
    }
    
    console.log('✅ package.json structure is valid');
"

if [ $? -ne 0 ]; then
    echo "❌ package.json validation failed!"
    exit 1
fi

# Step 7: Check for API availability (optional)
echo "🌐 Testing API connection (optional)..."
if curl -s http://localhost:3000/rest/people > /dev/null 2>&1; then
    echo "✅ Dalil AI API is running on localhost:3000"
    echo "💡 You can test the node with real API calls"
else
    echo "⚠️  Dalil AI API not available on localhost:3000"
    echo "💡 Make sure to start your API before testing"
fi

# Step 8: Display installation instructions
echo ""
echo "🎉 Package is ready for deployment!"
echo ""
echo "📝 Installation Options:"
echo ""
echo "1️⃣  LOCAL DEVELOPMENT:"
echo "   # Link for local development"
echo "   npm link"
echo "   # In your n8n directory:"
echo "   npm link n8n-nodes-dalil-ai"
echo ""
echo "2️⃣  MANUAL INSTALLATION:"
echo "   # Copy to n8n nodes directory"
echo "   cp -r dist/* ~/.n8n/nodes/"
echo "   # Or install from current directory"
echo "   npm install $(pwd)"
echo ""
echo "3️⃣  COMMUNITY NODES:"
echo "   # Publish to npm first"
echo "   npm publish"
echo "   # Then install via n8n UI: Settings > Community Nodes"
echo ""
echo "🔧 Testing Checklist:"
echo "   □ Start Dalil AI API (http://localhost:3000)"
echo "   □ Create Dalil AI API credentials in n8n"
echo "   □ Test 'Get Many' operation first"
echo "   □ Verify custom properties load in Create operation"
echo "   □ Test Create/Update/Delete with real data"
echo ""
echo "📚 Documentation: README.md"
echo "🐛 Issues: Check logs with N8N_LOG_LEVEL=debug"
echo ""
echo "✅ All systems ready! Happy automating! 🚀" 