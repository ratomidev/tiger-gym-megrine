// app/(auth)/login/page.tsx

import { Toaster } from "sonner";
import { LoginForm } from "../../../components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="container flex items-center justify-center min-h-screen">
      <Toaster position="top-right" richColors />
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Tiger Gym Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Enter your credentials to sign in
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
