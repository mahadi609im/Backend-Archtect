# 🚀 Express + TypeScript + PostgreSQL (Neon) – User CRUD API

A step-by-step learning project to build a REST API from scratch.

## 📚 What I am learning

- Create a server with Express and TypeScript
- Understand Express `Request` and `Response`
- Set up PostgreSQL with Neon Serverless Cloud
- Explore SQL data types
- Use a connection `Pool` and create tables
- Create a user (POST)
- Get all users and a single user with params (GET)
- Update a user (PUT)
- Delete a user (DELETE)
- Set up environment-based configuration (`.env`)

## 🛠️ Tech Stack

- Node.js, Express, TypeScript
- PostgreSQL (Neon)
- pg (node-postgres)

## 🎯 Goal

Build a clean, working CRUD API and understand how each part connects.

---

# ⚙️ Express.js + TypeScript Server Setup

A simple guide to set up an Express server with TypeScript from scratch.

## 📋 Overview

Steps in this guide:

1. Initialize the project
2. Install and configure TypeScript
3. Install Express and its types
4. Create the server file
5. Install `tsx` and add the dev script
6. Run the server

---

## 1. Initialize the Project

```
npm init -y
```

This creates a `package.json` file with default values.

> ⚠️ `npm init -y` uses your **folder name** as the package name. Use a
> lowercase name with no spaces, like `server-with-express`.

Set `"type": "module"` so the project uses modern ES module syntax (`import` /
`export`):

```json
{
  "name": "server-with-express",
  "version": "1.0.0",
  "description": "",
  "main": "server.ts",
  "type": "module"
}
```

## 2. Install and Configure TypeScript

```
npm i -D typescript
```

`-D` means a dev dependency. It is needed only during development.

Create the config file:

```
npx tsc --init
```

This creates a `tsconfig.json` file. Use the settings below:

```json
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

    // Recommended
    "sourceMap": true,
    "strict": true,
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "skipLibCheck": true
  },

  "include": ["src/**/*.ts"],
  "exclude": ["node_modules/", "dist"]
}
```

Key options:

- `rootDir` → your source code lives in `src`
- `outDir` → compiled files go to `dist`
- `strict` → turns on all strict type checks
- `types: ["node"]` → enables Node.js types

## 3. Install Express and Types

Install Express:

```
npm i express
```

Then install the type support, so the red errors in your editor go away:

```
npm i --save-dev @types/express @types/node
```

- `express` → the web framework (needed when the app runs)
- `@types/express` → type information for Express
- `@types/node` → type information for Node.js 💡 Express is plain JavaScript.
  The `@types/...` packages give TypeScript the information it needs for
  auto-complete and type safety.

## 4. Create the Server File

Create the file `src/server.ts`:

```ts
import express from 'express';
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
```

How it works:

- `express()` creates the app
- `app.get('/')` handles a GET request on the home route
- `req` = request (data coming in), `res` = response (data going out)
- `res.send()` sends a reply back to the browser
- `app.listen(port)` starts the server on port `3000`

## 5. Install tsx

```
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

## 6. Run the Server

```
npm run dev
```

Expected output:

```
Example app listening on port 3000
```

Open `http://localhost:3000` in your browser. You should see **Hello World!**

---

## 📁 Final Project Structure

```
server-with-express/
├── node_modules/
├── src/
│   └── server.ts
├── package-lock.json
├── package.json
└── tsconfig.json
```

- `node_modules` and `package-lock.json` are created automatically by npm. You
  do not write them by hand.
- `package-lock.json` locks exact package versions, so the project works the
  same on every computer.

## ✅ Final package.json

```json
{
  "name": "server-with-express",
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
  "dependencies": {
    "express": "^5.0.0",
    "tsx": "^4.0.0"
  },
  "devDependencies": {
    "@types/express": "^5.0.0",
    "@types/node": "^24.0.0",
    "typescript": "^5.0.0"
  }
}
```

Your version numbers will be different. npm fills them in automatically.
