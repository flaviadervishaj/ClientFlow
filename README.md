# ClientFlow

ClientFlow is a responsive project management dashboard for freelancers and small teams. It keeps client details, project deadlines and delivery status together in a focused workspace.

## Features

- Create, edit, view and delete client projects
- Search by client, email or project type
- Filter projects by delivery status
- View live project summary statistics
- Save data automatically in browser storage
- Import and export JSON backups
- Responsive table-to-card layout for mobile devices
- Accessible form validation and keyboard-friendly controls

## Tech stack

- React 19
- JavaScript
- Vite
- CSS
- Browser Local Storage API

## Run locally

```bash
git clone https://github.com/flaviadervishaj/ClientFlow.git
cd ClientFlow
npm install
npm run dev
```

Open the local address shown by Vite.

## Available scripts

```bash
npm run dev      # Start the development server
npm run lint     # Check the code with ESLint
npm run build    # Create a production build
npm run preview  # Preview the production build
```

## Data storage

The app stores project data in the browser, so no account or backend is required. The Export and Import actions can be used to move a project list between browsers or keep a backup.

## Project structure

```text
src/
├── App.jsx
├── ClientsList.jsx
├── ProjectForm.jsx
├── AddClient.jsx
├── EditClient.jsx
├── ClientDetails.jsx
└── *.css
```

## Future improvements

- Optional account authentication
- Cloud database synchronization
- Team collaboration and activity history
- Deadline reminders
