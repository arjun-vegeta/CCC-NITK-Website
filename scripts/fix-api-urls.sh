#!/bin/bash

# Script to help identify files that need API URL updates

echo "🔍 Scanning for hardcoded API URLs..."
echo ""

# Find all files with localhost:8000
echo "Files with hardcoded localhost:8000:"
echo "======================================"
grep -r "http://localhost:8000" src/ --include="*.js" --include="*.jsx" -l | sort

echo ""
echo "📊 Total files to update:"
grep -r "http://localhost:8000" src/ --include="*.js" --include="*.jsx" -l | wc -l

echo ""
echo "💡 Next steps:"
echo "1. Create .env file with REACT_APP_API_URL"
echo "2. Import API_ENDPOINTS from src/config/api.js in each file"
echo "3. Replace hardcoded URLs with API_ENDPOINTS constants"
echo ""
echo "Example:"
echo "  import { API_ENDPOINTS } from '../config/api';"
echo "  fetch(API_ENDPOINTS.PEOPLE)"
