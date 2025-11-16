# Gym Trainer Management App

A comprehensive gym trainer management application built with Next.js 16, featuring role-based access control, subscription management, diet and exercise planning, and customer tracking.

## Features

- **Multi-Role System**: Customer, Trainer, Admin, and Master roles with role-based access control
- **Authentication**: Email/password and Google OAuth authentication
- **Subscription Management**: Track customer subscriptions with payment screenshot uploads
- **Diet Planning**: Create meal templates and assign daily/weekly meal plans to customers
- **Exercise Planning**: Create exercise templates and assign weekly workout plans
- **Customer Management**: Track customer information including phone numbers and Instagram handles
- **Role-Specific UI Themes**: Optimized color schemes for each role to maximize sales conversion

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: MongoDB
- **Authentication**: NextAuth v5
- **Styling**: Tailwind CSS v4
- **Form Handling**: React Hook Form + Zod
- **Password Hashing**: bcryptjs

## Project Structure

```
features/
├── core/                    # Shared core functionality
│   ├── server-actions/     # All CRUD server actions
│   ├── types/              # TypeScript type definitions
│   ├── constants/          # Shared constants
│   ├── hooks/              # Shared React hooks
│   └── styles/             # Theme styles
├── customers/              # Customer mini-app
│   ├── containers/         # Page containers
│   └── components/         # Customer-specific components
├── trainers/               # Trainer mini-app
│   ├── containers/
│   └── components/
└── admins/                 # Admin mini-app
    ├── containers/
    └── components/
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB database (local or Atlas)
- Google OAuth credentials (optional, for Google login)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd my-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-generate-with-openssl-rand-base64-32

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## User Roles

### Customer
- Access: `/`
- View assigned meal and exercise plans
- View subscription status
- Update profile (phone, Instagram)

### Trainer
- Access: `/trainer`
- View customer list
- Create meal and exercise templates
- Assign weekly plans to customers
- Customize templates for specific customers

### Admin
- Access: `/admin`
- Manage all users
- Create and manage subscriptions
- Upload payment screenshots
- View system statistics

### Master
- Access: All routes (`/`, `/trainer`, `/admin`)
- Full system access

## Database Collections

- `users`: User accounts with roles
- `subscriptions`: Customer subscription plans
- `meals`: Meal database
- `exercises`: Exercise database
- `mealTemplates`: Trainer-created meal templates
- `exerciseTemplates`: Trainer-created exercise templates
- `dailyAssignments`: Daily meal and exercise assignments for customers

## Development

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Code Style

- Feature-based vertical slicing architecture
- All folders use plural names
- Files follow pattern: `feature-name.file-type.tsx`
- Server actions in `features/core/server-actions/[entity]/[entity]-actions.ts`
- All server actions follow CRUD pattern

## Environment Variables

See `.env.example` for required environment variables.

## License

Private project
