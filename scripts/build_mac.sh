#!/bin/bash

handle_error() {
    echo "Error durante el build: $1"
    exit 1
}

echo "--- Ejecutando npm install en frontend ---"
cd frontend && npm install || handle_error "npm install falló"
cd ..

echo "--- Ejecutando npm test ---"
cd frontend && npm test || handle_error "npm test falló"
cd ..

echo "--- Ejecutando npm run build ---"
cd frontend && npm run build || handle_error "npm run build falló"
cd ..

echo "--- Ejecutando mvn clean install ---"
cd backend && mvn clean install || handle_error "mvn clean install falló"
cd ..