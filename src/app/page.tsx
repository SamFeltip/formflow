import { auth } from "@/lib/auth";
import { signIn, signOut } from "next-auth/react";
import { useState } from "react";

export default async function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const session = await auth();

  const handleSignIn = async () => {
    await signIn("credentials", { email, password, callbackUrl: "/" });
  };
  ``;

  if (session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-2xl font-bold">Welcome, {session.user?.name}</h1>
        <p className="text-lg">Email: {session.user?.email}</p>
        <p className="text-lg">Role: {session.user?.role}</p>
        <button
          onClick={() => signOut()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-bold">You are not logged in</h1>
      <div className="mt-4 flex flex-col space-y-2">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-2 border rounded-md text-black"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-4 py-2 border rounded-md text-black"
        />
        <button
          onClick={handleSignIn}
          className="px-4 py-2 bg-green-500 text-white rounded-md"
        >
          Sign in
        </button>
      </div>
    </div>
  );
}
