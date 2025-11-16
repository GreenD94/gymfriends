// Load environment variables FIRST before any other imports
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env before any other imports that depend on env vars
config({ path: resolve(process.cwd(), '.env') });

// Now import other modules after env vars are loaded
import { MongoClient } from 'mongodb';
import { getRoleId, RoleName } from '../features/core/constants/roles.constants';

interface UserWithRole {
  _id: any;
  email: string;
  role?: RoleName;
  roleId?: number;
  [key: string]: any;
}

async function migrateRoles() {
  try {
    console.log('🔄 Starting role migration...');
    
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

    // Find all users
    const users = await usersCollection.find({}).toArray() as UserWithRole[];
    
    console.log(`📊 Found ${users.length} users to migrate`);

    let migrated = 0;
    let skipped = 0;
    let errors = 0;

    for (const user of users) {
      try {
        // Skip if already has roleId
        if (user.roleId) {
          console.log(`⏭️  User ${user.email} already has roleId: ${user.roleId}, skipping...`);
          skipped++;
          continue;
        }

        // Skip if no role field
        if (!user.role) {
          console.log(`⚠️  User ${user.email} has no role field, skipping...`);
          skipped++;
          continue;
        }

        // Convert role name to roleId
        const roleId = getRoleId(user.role as RoleName);

        // Update user with roleId
        await usersCollection.updateOne(
          { _id: user._id },
          { 
            $set: { roleId },
            // Keep role field for backward compatibility (optional - can remove later)
            // $unset: { role: '' } // Uncomment to remove role field
          }
        );

        console.log(`✅ Migrated ${user.email}: role "${user.role}" → roleId ${roleId}`);
        migrated++;
      } catch (error) {
        console.error(`❌ Error migrating user ${user.email}:`, error);
        errors++;
      }
    }

    console.log('\n✨ Migration completed!');
    console.log(`   ✅ Migrated: ${migrated}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   ❌ Errors: ${errors}`);
    
    // Close connection
    await client.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during migration:', error);
    process.exit(1);
  }
}

migrateRoles();

