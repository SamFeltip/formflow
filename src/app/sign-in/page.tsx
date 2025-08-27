import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/auth/SignUpForm";

export default function SignInOrUp() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-bold">You are not logged in</h1>
      <div className="flex flex-row gap-3">
        <SignUpForm />
        <SignInForm />
      </div>
    </div>
  );
}
