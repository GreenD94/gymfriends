import { LoginContainer } from '@/features/auth/containers/login.container';

export default function LoginPage() {
  return <LoginContainer role="customer" defaultRedirect="/" />;
}

