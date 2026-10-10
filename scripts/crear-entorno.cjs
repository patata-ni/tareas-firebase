// Crea los archivos de entorno a partir de las plantillas si todavía no existen.
// Nunca sobrescribe uno existente, así que tu configuración real se conserva.
const fs = require('node:fs');
const path = require('node:path');

const dir = path.join(__dirname, '..', 'src', 'environments');
let created = false;

for (const [example, target] of [
  ['environment.example.ts', 'environment.ts'],
  ['environment.prod.example.ts', 'environment.prod.ts'],
]) {
  const targetPath = path.join(dir, target);
  if (fs.existsSync(targetPath)) continue;
  fs.copyFileSync(path.join(dir, example), targetPath);
  console.warn(`Creado src/environments/${target} desde la plantilla.`);
  created = true;
}

if (created) {
  console.warn(
    'Edítalos con la configuración web de tu proyecto de Firebase; ' +
      'con los valores de ejemplo la app compila pero no puede iniciar sesión.'
  );
}
