# Database Seed Scripts

## Seed Users

To seed the database with initial master and admin users, run:

```bash
npm run seed
```

This will create:
- **Master User**: `master@gymapp.com` / `Master123!`
- **Admin User**: `admin@gymapp.com` / `Admin123!`

⚠️ **Important**: Change these passwords after first login!

The script will:
- Check if users already exist (won't duplicate)
- Hash passwords securely
- Create users with proper roles
- Display success messages

Make sure your `.env` file has the correct `MONGODB_URI` before running.

