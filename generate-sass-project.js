const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const projectName = process.argv[2];
if (!projectName) {
    console.log("Veuillez fournir un nom pour le projet.");
    process.exit(1);
}

const projectPath = path.join(process.cwd(), projectName);
const indexPath = path.join(projectPath, 'index.html');
const scssPath = path.join(projectPath, 'index.scss');
const jsPath = path.join(projectPath, 'app.js');

// Création du répertoire du projet
if (!fs.existsSync(projectPath)) {
    fs.mkdirSync(projectPath);
}
console.log(`Répertoire ${projectName} créé : ${projectPath}`);

// Génération du fichier index.html
const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${projectName}</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

<script src="app.js"></script>
</body>
</html>`;
fs.writeFileSync(indexPath, htmlContent);
console.log(`Fichier HTML ${indexPath} créé`);

// Création du fichier SCSS
const scssContent = `// SCSS initial ${projectName}
* {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
}`;
fs.writeFileSync(scssPath, scssContent);
console.log(`Fichier SCSS ${scssPath} créé`);

// Création du fichier JS
fs.writeFileSync(jsPath, "// JavaScript initial");
console.log(`Fichier JS ${jsPath} créé`);

// Initialisation de npm, installation de node-sass, live-server et concurrently
console.log('Initialisation de npm, installation de node-sass, live-server, concurrently, et ESLint');
exec('npm init -y && npm install node-sass live-server concurrently eslint --save-dev', { cwd: projectPath }, (error, stdout) => {
    if (error) {
        console.error(`Erreur d'exécution: ${error}`);
        return;
    }
    console.log(stdout);

    // Modification du package.json pour ajouter les scripts
    const packageJsonPath = path.join(projectPath, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    packageJson.scripts = {
        ...packageJson.scripts,
        "scss": "node-sass --watch index.scss style.css",
        "server": "live-server",
        "start": "concurrently \"npm run scss\" \"npm run server\"",
        "lint": "eslint . --fix"
    };
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('Fichier package.json mis à jour')

    // Générer un fichier .eslintrc.json de base
    const eslintConfig = {
        "env": {
            "browser": true,
            "es2021": true
        },
        "extends": "eslint:recommended",
        "parserOptions": {
            "ecmaVersion": 12,
            "sourceType": "module"
        },
        "rules": {
            // Ici, vous pouvez définir ou ajuster les règles selon vos préférences
        }
    };
    fs.writeFileSync(path.join(projectPath, '.eslintrc.json'), JSON.stringify(eslintConfig, null, 2));
    console.log('Fichier .eslintrc.json créé avec une configuration de base');

    console.log(`Projet ${projectName} initialisé avec succès.`);
});
