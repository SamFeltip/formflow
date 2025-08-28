"use client";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "../ui/button";

export function SignOutButton() {
  const [signOutState, setSignOutState] = useState<
    | { state: "loading" }
    | { state: "success" }
    | { state: "failure"; message: string }
  >();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSignOutState({ state: "loading" });
    try {
      await authClient.signOut();
    } catch (err) {
      setSignOutState({ state: "failure", message: (err as Error).message });
      return;
    }
    setSignOutState({ state: "success" });
    redirect("/");
  };

  return (
    <form onSubmit={handleSubmit}>
      <Button type="submit" disabled={signOutState?.state === "loading"}>
        Sign out
      </Button>
    </form>
  );
}
