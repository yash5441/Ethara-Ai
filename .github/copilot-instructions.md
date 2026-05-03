# Atlas Project Manager - Copilot Instructions

## Project Overview
Atlas Project Manager is a full-stack project management web application with:
- Authentication (Signup/Login with JWT)
- Project & team management
- Task creation, assignment & status tracking
- Role-based access control (Admin/Member)
- Beautiful, responsive UI
- REST APIs with JSON database

## Tech Stack
- **Backend**: Node.js, Express, lowdb, JWT, bcryptjs
- **Frontend**: React, Vite, React Router, Axios
- **Database**: JSON (lowdb)

## Project Structure
```
d:\Ethara AI\
├── server/           # Express API
├── client/           # React frontend
├── README.md         # Main documentation
└── .github/          # Config files
```

## Key Files & Locations

### Backend
- Entry: `server/src/index.js`
- Controllers: `server/src/controllers/`
- Routes: `server/src/routes/`
- Middleware: `server/src/middleware/`
- Utils: `server/src/utils/`
- Database: `server/data/db.json`

### Frontend
- Entry: `client/src/main.jsx`
- App: `client/src/App.jsx`
- Pages: `client/src/pages/`
- Components: `client/src/components/`
- Services: `client/src/services/`
- Context: `client/src/context/`
- Styles: `client/src/styles/`

## Running the Application

### Backend
```bash
cd server
npm install
npm run dev
# Runs on http://localhost:4000
```

### Frontend
```bash
cd client
npm install
npm run dev
# Runs on http://localhost:5173
```

## Demo Accounts
- Admin: admin@atlas.local / Admin123!
- Member: lena@atlas.local / Member123!

## API Endpoints Summary

### Auth
- POST /api/auth/signup
- POST /api/auth/login
- GET /api/auth/me
- GET /api/auth/users

### Projects
- POST /api/projects
- GET /api/projects
- GET /api/projects/:projectId
- PUT /api/projects/:projectId
- POST /api/projects/:projectId/members
- DELETE /api/projects/:projectId/members/:userId

### Tasks
- POST /api/projects/:projectId/tasks
- GET /api/projects/:projectId/tasks
- GET /api/projects/:projectId/tasks/:taskId
- PUT /api/projects/:projectId/tasks/:taskId
- DELETE /api/projects/:projectId/tasks/:taskId

## Important Features

### Authentication
- JWT tokens with 7-day expiration
- Password hashing with bcryptjs
- Protected API endpoints
- Auto-logout on token expiration

### Role-Based Access
- Admin: Manage all projects and users
- Member: Create projects, manage assigned tasks
- Owner: Add/remove project members

### Task Management
- Status: Pending, In Progress, Completed, On Hold
- Priority: Low, Medium, High, Critical
- Assignment to team members
- Due date tracking with overdue indicators
- Task filtering by status

### Project Management
- Create and manage projects
- Add/remove team members
- Track task statistics
- View team members and their roles

## Database Schema

### Users
```javascript
{
  id: string,
  name: string,
  email: string (unique),
  password: string (hashed),
  role: 'admin' | 'member',
  createdAt: timestamp
}
```

### Projects
```javascript
{
  id: string,
  name: string,
  description: string,
  createdBy: string (userId),
  members: [
    { userId: string, role: 'owner' | 'member' }
  ],
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Tasks
```javascript
{
  id: string,
  projectId: string,
  title: string,
  description: string,
  assignedTo: string (userId, optional),
  status: 'pending' | 'in-progress' | 'completed' | 'on-hold',
  priority: 'low' | 'medium' | 'high' | 'critical',
  dueDate: timestamp (optional),
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## Common Development Tasks

### Add New API Endpoint
1. Create controller in `server/src/controllers/`
2. Add route in `server/src/routes/`
3. Import route in `server/src/index.js`

### Add New Frontend Page
1. Create page component in `client/src/pages/`
2. Add route in `client/src/App.jsx`
3. Use context and services for data

### Modify Database
Edit `server/data/db.json` directly and restart server

### Update Styles
Modify CSS files in `client/src/styles/` or create new ones

## Validations & Security

### Backend Validations
- Email uniqueness check
- Password strength (min 8 chars)
- Passwords must match on signup
- User must be project member for task operations
- Owner/admin only for project modifications

### Frontend Validations
- Required field validation
- Email format validation
- Password confirmation
- Form error displays

### Security
- JWT token authentication
- Password hashing with salt
- Protected routes (Auth guard)
- CORS enabled
- Role-based access control

## Troubleshooting

### Database Reset
Delete `server/data/db.json` to start fresh with default data

### Port Conflicts
- Backend: Change PORT in `.env`
- Frontend: Change port in `vite.config.js`

### Token Issues
Check localStorage and ensure token is present after login

### CORS Errors
Verify backend is running and API URL is correct in `client/src/services/api.js`

## Performance Considerations

- Lazy load routes with React Router
- Memoize components to prevent re-renders
- Use context for state management
- Cache API responses where appropriate
- Optimize re-renders with useCallback

## Future Enhancements

- Real-time updates with WebSockets
- Task comments and activity feed
- File attachments
- Notifications system
- Advanced search and filtering
- Export to PDF/CSV
- Calendar view
- Gantt charts
- Team analytics
