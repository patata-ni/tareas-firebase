# Tareas con Firebase (Ionic / Angular)

Lista de tareas con inicio de sesión. Cada usuario ve y gestiona solo las suyas.

- **Autenticación:** registro e inicio de sesión con correo y contraseña
  (Firebase Authentication). Una guardia de rutas protege la pantalla de tareas.
- **Datos:** las tareas se guardan en Cloud Firestore, en
  `usuarios/{uid}/tareas`, y se actualizan en tiempo real.
- **Seguridad:** [firestore.rules](./firestore.rules) permite leer y borrar solo
  al dueño, valida el título (texto de 1 a 200 caracteres) al crear y deniega todo lo demás.

## Configurar Firebase

Este repositorio **no incluye** la configuración de ningún proyecto de Firebase.
Tu configuración vive en `src/environments/environment.ts` y
`environment.prod.ts`, que git ignora: no se sube a GitHub.

1. Crea un proyecto en la [consola de Firebase](https://console.firebase.google.com/).
2. Activa **Authentication → Correo/contraseña** y crea una base de datos **Firestore**.
3. En Configuración del proyecto → Tus apps → Web, copia la configuración.
4. Ejecuta `npm install` y luego `npm start` una vez: se crean los dos archivos
   desde las plantillas [environment.example.ts](./src/environments/environment.example.ts)
   y [environment.prod.example.ts](./src/environments/environment.prod.example.ts).
5. Pega tu configuración en `environment.ts` y `environment.prod.ts`.
6. Pon el id de tu proyecto en [.firebaserc](./.firebaserc).
7. Publica las reglas: `npx firebase-tools deploy --only firestore:rules`.

El script [crear-entorno.cjs](./scripts/crear-entorno.cjs) nunca sobrescribe un
archivo que ya exista. Con los valores de ejemplo la app compila, pero no puede
iniciar sesión.

La configuración web de Firebase no es un secreto: la protección real son
las reglas de Firestore.

## Ejecutar

Requisitos: Node.js 22.22.3 o superior (o 24.15+), que es lo que exige Angular 22.

```bash
npm install
npm start
```

Abre http://localhost:4200. Para compilar: `npm run build`.

## Tecnologías

Angular 22, Ionic 9, Capacitor 8, Firebase 12.
