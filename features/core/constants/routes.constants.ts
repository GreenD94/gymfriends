export const ROUTES = {
  // Auth
  LOGIN: '/login',
  REGISTER: '/register',
  
  // Customer routes
  CUSTOMER_HOME: '/',
  CUSTOMER_PROFILE: '/profile',
  
  // Trainer routes
  TRAINER_HOME: '/trainer',
  TRAINER_CUSTOMERS: '/trainer/customers',
  TRAINER_TEMPLATES: '/trainer/templates',
  TRAINER_ASSIGNMENTS: '/trainer/assignments',
  
  // Admin routes
  ADMIN_HOME: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_SUBSCRIPTIONS: '/admin/subscriptions',
} as const;

