interface LoginErrorBannerProps {
  error: string;
}

export function LoginErrorBanner({ error }: LoginErrorBannerProps) {
  if (!error) return null;

  return (
    <div className="animate-fade-in rounded-t-2xl bg-red-50 px-6 py-3 text-sm text-red-800">
      {error}
    </div>
  );
}

