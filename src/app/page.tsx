import { SignOutButton } from "@/components/auth/SignOutButton";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  // const session = await auth();

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-bold">Welcome, {session.user.name}</h1>
      <p className="text-lg">Email: {session.user.email}</p>
      <SignOutButton />
    </div>
  );
}
