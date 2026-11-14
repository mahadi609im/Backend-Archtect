# 🚀 Node.js + TypeScript Server Setup

A simple guide to set up a Node.js server with TypeScript from scratch.

---

## 📋 Overview

Steps in this guide:

1. Initialize the project
2. Install and configure TypeScript
3. Add Node.js type support
4. Create the server file
5. Install `tsx` and add the dev script
6. Run the server

---

## 1. Initialize the Project

```bash
npm init -y
```

This creates a `package.json` file with default values.

Set `"type": "module"` so the project uses modern ES module syntax (`import` /
`export`):

```json
{
  "name": "server-with-node",
  "version": "1.0.0",
  "description": "",
  "main": "server.ts",
  "type": "module"
}
```

---

## 2. Install TypeScript

```bash
npm i -D typescript
```

`-D` means a dev dependency. It is needed only during development.

---

## 3. Configure TypeScript

```bash
npx tsc --init
```

This creates a `tsconfig.json` file. Use the settings below:

```jsonc
{
  "compilerOptions": {
    // File layout
    "rootDir": "./src",
    "outDir": "./dist",

    // Environment
    "module": "esnext",
    "target": "esnext",
    "moduleResolution": "bundler",
    "types": ["node"],

    // Other outputs
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,

    // Stricter type checking
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,

    // Recommended
    "strict": true,
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "noUncheckedSideEffectImports": true,
    "moduleDetection": "force",
    "skipLibCheck": true,
  },

  "include": ["src/**/*.ts"],
  "exclude": ["node_modules/", "dist"],
}
```

Key options:

- `rootDir` → your source code lives in `src`
- `outDir` → compiled files go to `dist`
- `strict` → turns on all strict type checks
- `types: ["node"]` → enables Node.js types

---

## 4. Install Node.js Types

```bash
npm i -D @types/node
```

This gives TypeScript the type information for Node.js modules like `http`.

---

## 5. Create the Server File

Create the file `src/server.ts`:

```typescript
import { createServer } from 'http';

const server = createServer((req, res) => {
  console.log(req);
});

server.listen(5000, () => {
  console.log('server is running!!');
});
```

How it works:

- `createServer` makes an HTTP server
- The callback runs on every request (`req` = request, `res` = response)
- `server.listen(5000)` starts the server on port `5000`
  > 💡 **Tip:** This example logs the request but never sends a response, so the
  > browser will keep loading. Add `res.end('Hello, World!');` inside the
  > callback to send a reply.

---

## 6. Install tsx

```bash
npm i tsx
```

`tsx` runs TypeScript files directly. No build step is needed in development.

Add the `dev` script in `package.json`:

```json
"scripts": {
  "dev": "tsx watch ./src/server.ts",
  "test": "echo \"Error: no test specified\" && exit 1"
}
```

`watch` mode restarts the server automatically when you save a file.

---

## 7. Run the Server

```bash
npm run dev
```

Expected output:

```
server is running!!
```

Open `http://localhost:5000` in your browser to test it.

---

## 📁 Final Project Structure

```
server-with-node/
├── src/
│   └── server.ts
├── package.json
└── tsconfig.json
```

---

## ✅ Final package.json

```json
{
  "name": "server-with-node",
  "version": "1.0.0",
  "description": "",
  "main": "server.ts",
  "scripts": {
    "dev": "tsx watch ./src/server.ts",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "module",
  "devDependencies": {
    "@types/node": "^26.6.6",
    "typescript": "^7.0.2"
  },
  "dependencies": {
    "tsx": "^4.23.15"
  }
}
```
