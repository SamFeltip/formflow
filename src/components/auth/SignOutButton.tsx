"use client";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { FormEvent, useState } from "react";

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
      <button
        type="submit"
        className="
              px-4 py-2
              bg-gray-500
              text-white
              rounded-md
              transition
              duration-150
              ease-in-out
              hover:bg-gray-600
              active:scale-95
              cursor-pointer
              disabled:opacity-50
              disabled:cursor-not-allowed
          "
        disabled={signOutState?.state === "loading"}
      >
        Sign out
      </button>
    </form>
  );
}
