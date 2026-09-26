# ClientFlow

ClientFlow is a responsive workspace for managing client projects, deadlines and progress. Each account has its own project data, stored in Cloud Firestore.

## Features

- Create, edit, search and delete client projects
- Track deadlines and project status
- Sign in with email and password through Firebase Authentication
- Keep projects separate by account with Firestore security rules
- Download a JSON backup and restore it from Settings
- Use the dashboard on desktop and mobile

## Stack

React, JavaScript, CSS, Vite, Firebase Authentication and Cloud Firestore.

## Live demo

[Open ClientFlow](https://client-flow-ten.vercel.app/).

## Local development

Requires Node.js and npm. From the project directory:

```bash
npm ci
npm run dev
```

Run `npm run lint` and `npm run build` before submitting changes.

The Firebase web configuration is in `src/lib/firebase.js`. To use your own Firebase project, replace that public configuration, enable Email/Password sign-in and Cloud Firestore, and deploy the rules in `firestore.rules`. The web configuration identifies the project; the Firestore rules restrict project data to the signed-in account.

## Data and backups

Projects are stored under `users/{uid}/projects`. A backup contains project fields in JSON format and excludes account credentials. Restoring a backup replaces the projects in the current account after confirmation; download a copy of existing projects first if you want to keep them.
