import { execSync } from 'child_process';

try {
    console.log("--- Ejecutando npm install ---");
    execSync('npm install', { stdio: 'inherit' });

    console.log("--- Ejecutando npm test ---");
    execSync('npm test', { stdio: 'inherit' });

    console.log("--- Ejecutando npm run build ---");
    execSync('npm run build', { stdio: 'inherit' });

    console.log("--- Ejecutando mvn clean install ---");
    execSync('mvn clean install', { stdio: 'inherit' });

    console.log("--- ¡Build completo! ---");

} catch (error) {
    console.error(`Error durante el build: ${error.message}`);
    process.exit(1);
}