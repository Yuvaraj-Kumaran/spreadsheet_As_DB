# Student Management System

A simple student CRUD application using Node.js, Express, Google Sheets as the backend database, and HTML/CSS/JavaScript for the frontend.

## What is included

- `server.js` - starts the Express server
- `src/app.js` - Express API routes and Google Sheets integration
- `public/index.html` - frontend UI
- `public/style.css` - basic styles
- `public/app.js` - frontend logic for creating, reading, updating, and deleting students
- `.env` - environment variables with `SPREADSHEET_ID`
- `credentials.json` - Google service account key (must not be committed)

## Security and Git

The repository ignores the following sensitive files:

- `credentials.json`
- `.env`
- `node_modules/`

This is managed in `.gitignore` so your Google service account key and spreadsheet ID are not pushed to source control.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a Google Sheets spreadsheet.

3. In the sheet, create headers in row 1:

   - `id`
   - `name`
   - `email`
   - `course`
   - `createdAt`

4. Enable the Google Sheets API in Google Cloud.

5. Create a service account in Google Cloud.

6. Download the service account key JSON and save it as `credentials.json` in the project root.

7. Share the Google Sheet with the service account email from `credentials.json`.
   - Give it `Editor` access.

8. Add your sheet ID to `.env`:

```env
SPREADSHEET_ID=your_google_sheet_id_here
```

   - The sheet ID is the long value in the sheet URL between `/d/` and `/edit`.

## Run the app

To start the server:

```bash
npm start
```

For development with automatic restart:

```bash
npm run dev
```

Then open the browser at:

```text
http://localhost:3000
```

## Notes

- Do not open `public/index.html` directly from the file system.
- Use `http://localhost:3000` so Express serves the static files correctly.
- If you see `PERMISSION_DENIED`, re-check the Google Sheet sharing settings.

## Troubleshooting

- If `GET /students` returns `500`:
  - make sure `SPREADSHEET_ID` is correct
  - ensure `credentials.json` is a valid service account key
  - ensure the sheet is shared with the service account email

- If `POST /students` fails with permission errors:
  - confirm the service account has `Editor` access
  - verify the sheet name is `Sheet1` or update the range in `src/app.js`
