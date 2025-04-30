#!/bin/bash

handle_error() {
    echo "Error during build: $1"
    exit 1
}

echo "--- Running npm install in frontend ---"
cd frontend && npm install || handle_error "npm install failed"
cd ..

echo "--- Running npm test ---"
cd frontend && npm test || handle_error "npm test failed"
cd ..

echo "--- Running npm run build ---"
cd frontend && npm run build || handle_error "npm run build failed"
cd ..

echo "--- Running mvn clean install ---"
cd backend && mvn clean install || handle_error "mvn clean install failed"
cd ..