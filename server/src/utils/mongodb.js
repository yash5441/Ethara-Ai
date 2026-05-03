import mongoose from 'mongoose';
import User from '../models/User.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import { hashPassword } from './password.js';
import { v4 as uuidv4 } from 'uuid';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tms';

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    throw error;
  }
};

export const initializeDB = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Check if admin user exists
    const adminExists = await User.findOne({ email: 'admin@atlas.local' });
    
    if (!adminExists) {
      console.log('📝 Seeding database with demo data...');
      
      // Create admin user
      const adminId = uuidv4();
      await User.create({
        id: adminId,
        name: 'Admin User',
        email: 'admin@atlas.local',
        password: await hashPassword('Admin123!'),
        role: 'admin'
      });

      // Create member user
      const memberId = uuidv4();
      await User.create({
        id: memberId,
        name: 'Lena Member',
        email: 'lena@atlas.local',
        password: await hashPassword('Member123!'),
        role: 'member'
      });

      // Create sample project
      const projectId = 'proj-1';
      await Project.create({
        id: projectId,
        name: 'Website Redesign',
        description: 'Redesign company website with modern UI',
        createdBy: adminId,
        members: [
          { userId: adminId, userName: 'Admin User', role: 'owner' },
          { userId: memberId, userName: 'Lena Member', role: 'member' }
        ]
      });

      // Create sample task
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 5);
      
      await Task.create({
        id: 'task-1',
        projectId: projectId,
        title: 'Create Wireframes',
        description: 'Design wireframes for new website',
        assignedTo: memberId,
        assignedToName: 'Lena Member',
        status: 'in-progress',
        priority: 'high',
        dueDate: dueDate
      });

      console.log('✅ Database seeded successfully');
    }
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
};

export const getDB = () => {
  return {
    User,
    Project,
    Task
  };
};
