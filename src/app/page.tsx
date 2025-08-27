import { SignInForm } from "@/components/auth/SignInForm";
import { SignOutButton } from "@/components/auth/SignOutButton";
// import { auth } from "@/lib/auth";

export default async function Home() {
  // const session = await auth();

  if (session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-2xl font-bold">Welcome, {session.user?.name}</h1>
        <p className="text-lg">Email: {session.user?.email}</p>
        <p className="text-lg">Role: {session.user?.role}</p>
        <SignOutButton />
      </div>
    );
  }

  return <SignInForm />;
}
