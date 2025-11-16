import { LoginContainer } from '@/features/auth/containers/login.container';

export default function TrainerLoginPage() {
  return <LoginContainer role="trainer" defaultRedirect="/trainer" />;
}

