## A comprehensive web-based project management application with task tracking, team collaboration, and role-based access control.

## Features ✨

- **Authentication**: Secure signup/login with JWT tokens
- **Project Management**: Create and manage projects with team members
- **Task Tracking**: Create, assign, and track task progress
- **Role-Based Access**: Admin and Member roles with proper permissions
- **Dashboard**: Overview of projects, tasks, and progress
- **Team Collaboration**: Add/remove team members to projects
- **Task Status**: Track task status (Pending, In Progress, Completed, On Hold)
- **Priority Levels**: Low, Medium, High, Critical priorities
- **Due Dates**: Set and track task deadlines with overdue indicators
- **Responsive UI**: Beautiful, modern interface for desktop and mobile

## Tech Stack 🛠️

### Backend
- **Node.js** + **Express.js**: REST API server
- **MongoDB** + **Mongoose**: NoSQL database with ODM
- **JWT**: Authentication tokens
- **bcryptjs**: Password hashing

### Frontend
- **React 18**: UI framework
- **Vite**: Build tool and dev server
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **CSS3**: Modern styling

## Project Structure 📁

```
atlas-project-manager/
├── server/                    # Backend
│   ├── src/
│   │   ├── controllers/      # Business logic
│   │   ├── routes/           # API routes
│   │   ├── middleware/       # Auth, error handling
│   │   ├── utils/            # JWT, password, database
│   │   └── index.js          # Entry point
│   ├── data/                 # JSON database
│   ├── package.json
│   └── .env
│
├── client/                    # Frontend
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API calls
│   │   ├── context/          # React context
│   │   ├── styles/           # CSS files
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

## Setup & Installation 🔧

### Prerequisites
- Node.js 14+ and npm
- **MongoDB** (Local or MongoDB Atlas Cloud)

### MongoDB Setup (REQUIRED) ⚠️

Before running the backend, you need to set up MongoDB. See [MONGODB_SETUP.md](MONGODB_SETUP.md) for detailed instructions on:
- **Option 1**: MongoDB Atlas (Cloud) - Recommended, free tier available
- **Option 2**: Local MongoDB installation

After setup, update your `server/.env` file with your MongoDB connection string.

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The API server will run on `http://localhost:4000`

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will run on `http://localhost:5173`

## Running Both Servers

Open two terminals and run:

**Terminal 1 (Backend):**
```bash
cd server && npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd client && npm run dev
```

## Demo Accounts 👤

Use these credentials to test the application:

### Admin Account
- **Email**: `admin@atlas.local`
- **Password**: `Admin123!`

### Member Account
- **Email**: `lena@atlas.local`
- **Password**: `Member123!`

## API Endpoints 📡

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `GET /api/auth/users` - Get all users

### Projects
- `POST /api/projects` - Create project
- `GET /api/projects` - Get user's projects
- `GET /api/projects/:projectId` - Get project details
- `PUT /api/projects/:projectId` - Update project
- `POST /api/projects/:projectId/members` - Add team member
- `DELETE /api/projects/:projectId/members/:userId` - Remove team member

### Tasks
- `POST /api/projects/:projectId/tasks` - Create task
- `GET /api/projects/:projectId/tasks` - Get project tasks
- `GET /api/projects/:projectId/tasks/:taskId` - Get task details
- `PUT /api/projects/:projectId/tasks/:taskId` - Update task
- `DELETE /api/projects/:projectId/tasks/:taskId` - Delete task

## Database Schema 💾

### Users
- `id`: Unique identifier
- `name`: User name
- `email`: Email address (unique)
- `password`: Hashed password
- `role`: admin | member
- `createdAt`: Timestamp

### Projects
- `id`: Unique identifier
- `name`: Project name
- `description`: Project description
- `createdBy`: Creator user ID
- `members`: Array of member objects with roles
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

### Tasks
- `id`: Unique identifier
- `projectId`: Parent project ID
- `title`: Task title
- `description`: Task description
- `assignedTo`: Assigned user ID (optional)
- `status`: pending | in-progress | completed | on-hold
- `priority`: low | medium | high | critical
- `dueDate`: Due date (optional)
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

## Features Explained 🎯

### Role-Based Access Control
- **Admin**: Can manage all projects and users
- **Member**: Can create projects and manage tasks within assigned projects
- **Project Owner**: Can add/remove members from their projects

### Task Management
- Create tasks with title, description, priority, and due dates
- Assign tasks to team members
- Update task status through different stages
- Delete tasks (owner/admin only)
- Track overdue tasks

### Team Collaboration
- Add team members to projects
- View team member information
- Manage member roles within projects

## Security Features 🔒

- JWT-based authentication
- Password hashing with bcryptjs
- Protected API endpoints
- Role-based access control
- XSS protection through React
- Secure token storage in localStorage

## Styling & UI 🎨

- Modern gradient backgrounds
- Smooth animations and transitions
- Responsive grid layouts
- Dark/light theme colors
- Card-based design
- Mobile-friendly interface

## Future Enhancements 🚀

- Real-time notifications
- Task comments and activity feed
- File attachments
- Task dependencies
- Sprint/milestone management
- Advanced filtering and search
- Email notifications
- Dark mode toggle
- Project templates
- Analytics dashboard

## Troubleshooting 🐛

### Port Already in Use
If ports 4000 or 5173 are already in use:
- Backend: Change `PORT` in `.env`
- Frontend: Modify `vite.config.js` server port

### Database Reset
Delete `server/data/db.json` and restart the server to reset to default data

### Dependencies Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

## Railway Deployment 🚆

This app now runs as a single Railway service from the backend:

- Root directory: `server`
- Build command: `npm install && npm install --prefix ../client && npm run build --prefix ../client`
- Start command: `npm start`
- Environment variables: Railway provides `PORT`. Set `JWT_SECRET` if you want a custom secret.

The Express server serves the API and the built React app from `client/dist`.

Important note: the current backend uses file-based storage, so data can reset when the Railway service restarts or redeploys. If you need persistence, switch the backend to an external database or attach persistent storage.

## License 📄

This project is open source and available for educational purposes.

## Support 💬

For issues or questions, please refer to the documentation or check the API endpoints.

---

**Created with ❤️ **
