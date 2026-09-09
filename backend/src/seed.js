import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from './models/User.js';
import { Task } from './models/Task.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Database connected for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Task.deleteMany({});

    // Hash admin password
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('Admin@123456', salt);
    const userPassword = await bcrypt.hash('User@123456', salt);

    // Create Admin User
    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@lesstaxi.com',
      password: adminPassword,
      role: 'admin',
    });

    // Create Normal Users
    const user1 = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: userPassword,
      role: 'user',
    });

    const user2 = await User.create({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: userPassword,
      role: 'user',
    });

    // Create Initial Tasks
    await Task.create([
      {
        title: 'Design UI Wireframes',
        description: 'Draft initial wireframes for Kanban board layout',
        status: 'Done',
        creator: admin._id,
        assignedTo: user1._id,
      },
      {
        title: 'Setup Express API Endpoints',
        description: 'Build user authentication and task CRUD routes',
        status: 'Doing',
        creator: user1._id,
        assignedTo: user1._id,
      },
      {
        title: 'Integrate Drag and Drop',
        description: 'Connect frontend card dragging to database status updates',
        status: 'To Do',
        creator: user2._id,
        assignedTo: null,
      },
    ]);

    console.log('Seeding completed successfully!');
    console.log('-----------------------------------');
    console.log('Admin Credentials:');
    console.log('Email: admin@lesstaxi.com');
    console.log('Password: Admin@123456');
    console.log('-----------------------------------');
    process.exit(0);
  } catch (error) {
    console.error(`Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();