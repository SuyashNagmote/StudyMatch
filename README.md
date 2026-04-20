# StudyMatch

StudyMatch is a full-stack MVP that matches students into effective study groups using graph-based similarity scores. The backend exposes reusable graph data so a Three.js 3D layer can be added later without changing matching logic.

## Stack

- React + Vite + Tailwind CSS
- Node.js + Express
- MongoDB + Mongoose

## Run locally

1. Copy `server/.env.example` to `server/.env`
2. Start MongoDB locally
3. Run `npm install`
4. Run `npm run install:all`
5. Run `npm run seed`
6. Run `npm run dev`

## Environment

- Keep `server/.env` local-only and never commit live credentials.
- Use a long random `JWT_SECRET` in any deployed environment.
- Set `CLIENT_URL` to the exact frontend origin that should be allowed by CORS.

## API

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/profile`
- `GET /api/auth/me`
- `GET /api/match`
- `GET /api/match/graph`
