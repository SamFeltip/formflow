"use client";

import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { FormEvent, useState } from "react";

export function SignInForm() {
  const [signInState, setSignInState] = useState<
    | { state: "loading" }
    | { state: "success" }
    | { state: "failure"; message: string }
  >();

  const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const password = formData.get("password") as string;
    const email = formData.get("email") as string;

    setSignInState({ state: "loading" });

    let response;

    try {
      response = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/",
      });
      setSignInState({ state: "success" });
    } catch (err) {
      setSignInState({ state: "failure", message: (err as Error).message });
      return;
    }

    if (!response.data) {
      setSignInState({
        state: "failure",
        message: response.error?.message || "An unknown error occurred",
      });
      return;
    }

    if (response.data?.url) {
      redirect(response.data.url);
    }
  };

  return (
    <div>
      <div>
        {signInState?.state === "failure" && (
          <p className="text-red-500">Error: {signInState.message}</p>
        )}
      </div>
      <form onSubmit={handleSignIn} className="mt-4 flex flex-col space-y-2">
        <input
          title="email"
          placeholder="put your email here"
          type="email"
          name="email"
          className="px-4 py-2 bg-gray-100  rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 mb-2 w-full"
        />
        <input
          title="password"
          placeholder="put your password here"
          type="password"
          name="password"
          className="px-4 py-2 bg-gray-100  rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 mb-2 w-full"
        />
        <button
          type="submit"
          className="
              px-4 py-2
              bg-green-500
              text-white
              rounded-md
              transition
              duration-150
              ease-in-out
              hover:bg-green-600
              active:scale-95
              cursor-pointer
              disabled:opacity-50
              disabled:cursor-not-allowed
          "
          disabled={signInState?.state === "loading"}
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
