# Student Result App (Node/Express + MySQL) — phpMyAdmin / MySQL variant

This project replaces the original MongoDB/Mongoose backend with a MySQL backend (suitable for managing via phpMyAdmin).
It contains a simple Node/Express backend and a Tailwind + vanilla JS frontend.

## What you get
- Backend: Node.js + Express + mysql2
- Frontend: static files in `public/` (admin.html, index.html)
- SQL schema: `models.sql` (import into phpMyAdmin or run via MySQL)
- Example env file: `.env.example`

## Setup (quick)
1. Install Node dependencies:
   ```bash
   npm install
   ```

2. Create the database and tables:
   - Option A (via phpMyAdmin): Import `models.sql`.
   - Option B (via MySQL CLI): `mysql -u root -p < models.sql`

3. Copy `.env.example` to `.env` and fill in your MySQL credentials (these are the same credentials phpMyAdmin uses):
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=student_results
   DB_PORT=3306
   PORT=5000
   ```

4. Start the server:
   ```bash
   node server.js
   ```

5. Open the frontend:
   - Student Portal: http://localhost:5000/index.html
   - Admin Login: http://localhost:5000/admin.html
   - Admin credentials: username `Z2A`, password `1234`

## API
- `POST /api/admin/login` — JSON `{ username, password }`
- `POST /api/students` — Add student. Example payload:
  ```json
  {
    "name": "Alice",
    "roll": "R123",
    "dob": "2004-05-01",
    "subjects": [
      {"name":"Math","marks":90,"pass":true},
      {"name":"Physics","marks":80,"pass":true}
    ]
  }
  ```
- `GET /api/students` — List all students (summary)
- `GET /api/students/:roll/:dob` — Fetch student result

## Notes
- The MySQL schema stores students and subjects in separate tables (one-to-many).
- Use phpMyAdmin to browse/import the `models.sql` for quick setup.
- This project intentionally avoids authentication tokens and sophisticated security to keep it simple and runnable locally. Do not use in production without adding proper auth and sanitization.

## Creating the ZIP
The project in this ZIP is ready. After you extract, run `npm install` and `node server.js`.
