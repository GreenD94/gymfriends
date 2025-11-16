import { LoginContainer } from '@/features/auth/containers/login.container';

export default function AdminLoginPage() {
  return <LoginContainer role="admin" defaultRedirect="/admin" />;
}

