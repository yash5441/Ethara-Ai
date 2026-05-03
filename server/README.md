# Atlas Backend API 🚀

REST API server for Atlas Project Manager built with Express.js and MongoDB (Mongoose).

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
# .env file
PORT=4000
MONGODB_URI=mongodb://localhost:27017/tms
JWT_SECRET=your_jwt_secret_key_change_this_in_production_12345
NODE_ENV=development
```

3. Start development server:
```bash
npm run dev
```

Server runs on `http://localhost:4000`

## API Documentation

See main README.md for complete API reference.

## Project Structure

- `src/index.js` - Server entry point
- `src/controllers/` - Business logic for auth, projects, tasks
- `src/routes/` - API route definitions
- `src/middleware/` - Authentication and error handling
- `src/utils/` - JWT, password, database utilities

This server uses MongoDB via Mongoose. Set `MONGODB_URI` in your `.env` (or use the default `mongodb://localhost:27017/tms`). The database is seeded with demo accounts on first run.

## Demo Accounts

- Admin: admin@atlas.local / Admin123!
- Member: lena@atlas.local / Member123!

Database is automatically seeded with sample data on first run.
