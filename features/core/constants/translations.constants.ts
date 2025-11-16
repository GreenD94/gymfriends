/**
 * Centralized Spanish translations for the application
 * All user-facing text should be accessed through the t() helper function
 */

export const TRANSLATIONS = {
  auth: {
    signIn: 'Iniciar sesión',
    signOut: 'Cerrar sesión',
    signUp: 'Registrarse',
    next: 'Siguiente',
    back: 'Volver',
    continueWithGoogle: 'Continuar con Google',
    signingIn: 'Iniciando sesión...',
    createAccount: 'Crear cuenta',
    creatingAccount: 'Creando cuenta...',
    dontHaveAccount: "¿No tienes una cuenta?",
    alreadyHaveAccount: "¿Ya tienes una cuenta?",
    signUpToGetStarted: 'Regístrate para comenzar',
  },
  validation: {
    invalidEmail: 'Por favor ingresa un correo electrónico válido',
    enterYourEmail: 'Por favor ingresa tu correo electrónico',
    enterYourPassword: 'Por favor ingresa tu contraseña',
    emailRequired: 'El correo electrónico es requerido',
    passwordRequired: 'La contraseña es requerida',
    passwordMinLength: 'La contraseña debe tener al menos 6 caracteres',
    nameMinLength: 'El nombre debe tener al menos 2 caracteres',
    invalidEmailFormat: 'Correo electrónico inválido',
  },
  errors: {
    invalidEmailOrPassword: 'Correo o contraseña incorrectos',
    wrongPassword: 'Contraseña incorrecta',
    userExists: 'Este correo ya está registrado',
    userNotFound: 'Usuario no encontrado',
    userNotFoundAfterUpdate: 'Usuario no encontrado después de la actualización',
    loginError: 'Error al iniciar sesión',
    registerError: 'Error al registrarse',
    genericError: 'Ocurrió un error',
  },
  roles: {
    customer: 'Cliente',
    trainer: 'Entrenador',
    admin: 'Administrador',
    master: 'Maestro',
  },
  navigation: {
    dashboard: 'Panel',
    adminDashboard: 'Panel de Administración',
    trainerDashboard: 'Panel de Entrenador',
    users: 'Usuarios',
    subscriptions: 'Suscripciones',
    customers: 'Clientes',
    templates: 'Plantillas',
    assignments: 'Asignaciones',
    profile: 'Perfil',
  },
  dashboard: {
    welcome: '¡Bienvenido, {name}!',
    welcomeBack: '¡Bienvenido de nuevo, {name}!',
    adminDashboard: 'Panel de Administración',
    adminOverview: 'Resumen de tu sistema de gestión de gimnasio',
    trainerManage: 'Gestiona tus clientes y asignaciones',
    customerPlan: "Aquí está tu plan semanal",
    loading: 'Cargando...',
    totalUsers: 'Usuarios totales',
    totalCustomers: 'Clientes totales',
    totalTrainers: 'Entrenadores',
    activeSubscriptions: 'Suscripciones activas',
    pendingSubscriptions: 'Pendientes',
    recentAssignments: 'Asignaciones recientes',
    manageUsers: 'Gestionar Usuarios',
    manageUsersDesc: 'Ver y gestionar todos los usuarios, clientes y entrenadores',
    manageSubscriptions: 'Gestionar Suscripciones',
    manageSubscriptionsDesc: 'Crear y gestionar suscripciones de clientes con seguimiento de pagos',
    manageCustomers: 'Gestionar Clientes',
    manageCustomersDesc: 'Ver y gestionar tu lista de clientes, actualizar su información',
    templates: 'Plantillas',
    templatesDesc: 'Crear y gestionar plantillas de comidas y ejercicios',
    assignPlans: 'Asignar Planes',
    assignPlansDesc: 'Asignar planes semanales de comidas y ejercicios a clientes',
  },
  forms: {
    fullName: 'Nombre completo',
    email: 'Correo electrónico',
    emailAddress: 'Correo electrónico',
    password: 'Contraseña',
    accountType: 'Tipo de cuenta',
    phoneNumber: 'Número de teléfono',
    phoneNumberOptional: 'Número de teléfono (Opcional)',
    instagram: 'Instagram',
    instagramOptional: 'Instagram (Opcional)',
    enterYourEmail: 'Ingresa tu correo electrónico',
    enterYourPassword: 'Ingresa tu contraseña',
    namePlaceholder: 'John Doe',
    emailPlaceholder: 'you@example.com',
    passwordPlaceholder: '••••••••',
    phonePlaceholder: '+1234567890',
    instagramPlaceholder: '@username',
  },
  table: {
    name: 'Nombre',
    email: 'Correo',
    role: 'Rol',
    phone: 'Teléfono',
    instagram: 'Instagram',
    noUsersFound: 'No se encontraron usuarios',
  },
  themes: {
    admin: {
      title: 'Portal de Administración',
      subtitle: 'Inicia sesión para gestionar el sistema',
    },
    customer: {
      title: 'Portal de Cliente',
      subtitle: 'Inicia sesión para ver tu plan de entrenamiento',
    },
    trainer: {
      title: 'Portal de Entrenador',
      subtitle: 'Inicia sesión para gestionar tus clientes',
    },
    master: {
      title: 'Portal Maestro',
      subtitle: 'Inicia sesión para acceder a todas las funciones',
    },
  },
} as const;

/**
 * Helper function to access translations
 * Usage: t('auth.signIn') returns 'Iniciar sesión'
 */
export function t(key: string): string {
  const keys = key.split('.');
  let value: any = TRANSLATIONS;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k as keyof typeof value];
    } else {
      console.warn(`Translation key not found: ${key}`);
      return key; // Return key if translation not found
    }
  }
  
  return typeof value === 'string' ? value : key;
}

/**
 * Helper function to format translations with placeholders
 * Usage: tFormat('dashboard.welcome', { name: 'John' }) returns '¡Bienvenido, John!'
 */
export function tFormat(key: string, params: Record<string, string>): string {
  let translation = t(key);
  
  Object.entries(params).forEach(([param, value]) => {
    translation = translation.replace(`{${param}}`, value);
  });
  
  return translation;
}

