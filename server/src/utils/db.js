import { Low, JSONFile } from 'lowdb';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { generateId } from './id.js';
import { hashPassword } from './password.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const file = join(__dirname, '../../data/db.json');
const adapter = new JSONFile(file);
let db;

const defaultData = {
  users: [
    {
      id: 'user-1',
      name: 'Admin User',
      email: 'admin@atlas.local',
      password: await hashPassword('Admin123!'),
      role: 'admin',
      createdAt: new Date().toISOString()
    },
    {
      id: 'user-2',
      name: 'Lena Member',
      email: 'lena@atlas.local',
      password: await hashPassword('Member123!'),
      role: 'member',
      createdAt: new Date().toISOString()
    }
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'Website Redesign',
      description: 'Redesign company website with modern UI',
      createdBy: 'user-1',
      members: [
        { userId: 'user-1', role: 'owner' },
        { userId: 'user-2', role: 'member' }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  tasks: [
    {
      id: 'task-1',
      projectId: 'proj-1',
      title: 'Create Wireframes',
      description: 'Design wireframes for new website',
      assignedTo: 'user-2',
      status: 'in-progress',
      priority: 'high',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'task-2',
      projectId: 'proj-1',
      title: 'Setup Development Environment',
      description: 'Install and configure dev tools',
      assignedTo: 'user-1',
      status: 'completed',
      priority: 'medium',
      dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'task-3',
      projectId: 'proj-1',
      title: 'API Integration',
      description: 'Integrate backend APIs',
      assignedTo: null,
      status: 'pending',
      priority: 'high',
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]
};

export const initializeDB = async () => {
  try {
    db = new Low(adapter);
    await db.read();

    if (!db.data) {
      db.data = defaultData;
      await db.write();
      console.log('Database initialized with default data');
    }
    return db;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
};

export const getDB = () => {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDB first.');
  }
  return db;
};

export { db };
