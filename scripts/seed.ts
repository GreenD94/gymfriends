// Load environment variables FIRST before any other imports
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env before any other imports that depend on env vars
config({ path: resolve(process.cwd(), '.env') });

// Now import other modules after env vars are loaded
import bcrypt from 'bcryptjs';
import { MongoClient } from 'mongodb';
import { RoleId, getRoleName } from '../features/core/constants/roles.constants';

interface SeedUser {
  email: string;
  password: string;
  name: string;
  roleId: RoleId;
  phone?: string;
  instagram?: string;
}

const seedUsers: SeedUser[] = [
  {
    email: 'master@gymapp.com',
    password: 'Master123!',
    name: 'Master Admin',
    roleId: RoleId.MASTER,
    phone: '+1234567890',
  },
  {
    email: 'admin@gymapp.com',
    password: 'Admin123!',
    name: 'Admin User',
    roleId: RoleId.ADMIN,
    phone: '+1234567891',
  },
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...');
    
    // Check for MONGODB_URI
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not set in .env');
    }

    // Connect to MongoDB
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const dbName = process.env.MONGODB_DATABASE_NAME || 'gymfriends';
    const db = client.db(dbName);
    const usersCollection = db.collection('users');

    for (const user of seedUsers) {
      // Check if user already exists
      const existingUser = await usersCollection.findOne({ email: user.email });
      
      if (existingUser) {
        console.log(`⚠️  User ${user.email} already exists, skipping...`);
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(user.password, 10);

      // Create user with roleId
      const newUser = {
        email: user.email,
        password: hashedPassword,
        name: user.name,
        roleId: user.roleId,
        phone: user.phone,
        instagram: user.instagram,
        createdAt: new Date(),
      };

      const result = await usersCollection.insertOne(newUser);
      
      const roleName = getRoleName(user.roleId);
      console.log(`✅ Created ${roleName} user: ${user.email} (ID: ${result.insertedId})`);
      console.log(`   Password: ${user.password}`);
    }

    console.log('✨ Database seed completed successfully!');
    console.log('\n📋 Created users:');
    seedUsers.forEach(user => {
      const roleName = getRoleName(user.roleId);
      console.log(`   - ${user.email} (${roleName})`);
    });
    console.log('\n⚠️  Please change these passwords after first login!');
    
    // Close connection
    await client.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();

