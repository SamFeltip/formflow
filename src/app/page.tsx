"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

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
      <button
        onClick={() => signIn("google")}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md"
      >
        Sign in with Google
      </button>
    </div>
  );
}