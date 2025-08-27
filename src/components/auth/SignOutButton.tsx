"use client";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { FormEvent } from "react";

export function SignOutButton() {
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await authClient.signOut();
    redirect("/");
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Sign Out</button>
    </form>
  );
}
