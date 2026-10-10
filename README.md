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

1. Crea un proyecto en la [consola de Firebase](https://console.firebase.google.com/).
2. Activa **Authentication → Correo/contraseña** y crea una base de datos **Firestore**.
3. En Configuración del proyecto → Tus apps → Web, copia la configuración.
4. Pégala en [environment.ts](./src/environments/environment.ts) y
   [environment.prod.ts](./src/environments/environment.prod.ts).
5. Pon el id de tu proyecto en [.firebaserc](./.firebaserc).
6. Publica las reglas: `npx firebase-tools deploy --only firestore:rules`.

La configuración web de Firebase no es un secreto: la protección real son
las reglas de Firestore. Aun así, no la subas a un repositorio público sin
revisar esas reglas.

## Ejecutar

Requisitos: Node.js 22.22.3 o superior (o 24.15+), que es lo que exige Angular 22.

```bash
npm install
npm start
```

Abre http://localhost:4200. Para compilar: `npm run build`.

## Tecnologías

Angular 22, Ionic 9, Capacitor 8, Firebase 12.
