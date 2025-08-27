"use client";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { FormEvent, useState } from "react";

export function SignUpForm() {
  const [signUpState, setSignUpState] = useState<
    | { state: "loading" }
    | { state: "success" }
    | { state: "failure"; message: string }
  >();

  const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const password = formData.get("password") as string;
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;

    await authClient.signUp.email(
      {
        email, // user email address
        password, // user password -> min 8 characters by default
        name, // user display name
        callbackURL: "/", // A URL to redirect to after the user verifies their email (optional)
      },
      {
        onRequest: (ctx) => {
          setSignUpState({ state: "loading" });
        },
        onSuccess: (ctx) => {
          setSignUpState({ state: "success" });
          redirect("/");
        },
        onError: (ctx) => {
          //   alert(ctx.error.message);
          setSignUpState({ state: "failure", message: ctx.error.message });
        },
      }
    );
  };

  return (
    <div>
      <div>
        {signUpState?.state === "failure" && (
          <p className="text-red-500">Error: {signUpState.message}</p>
        )}
      </div>
      <form onSubmit={handleSignIn} className="mt-4 flex flex-col space-y-2">
        <input
          title="name"
          placeholder="put your name here"
          type="name"
          name="name"
          className="px-4 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 mb-2 w-full"
        />
        <input
          title="email"
          placeholder="put your email here"
          type="email"
          name="email"
          className="px-4 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 mb-2 w-full"
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
          disabled={signUpState?.state === "loading"}
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
        >
          Sign Up
          {/* {signUpState?.state === "loading" && (
              <span className="animate-spin">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                  <path d="M272 112C272 85.5 293.5 64 320 64C346.5 64 368 85.5 368 112C368 138.5 346.5 160 320 160C293.5 160 272 138.5 272 112zM272 528C272 501.5 293.5 480 320 480C346.5 480 368 501.5 368 528C368 554.5 346.5 576 320 576C293.5 576 272 554.5 272 528zM112 272C138.5 272 160 293.5 160 320C160 346.5 138.5 368 112 368C85.5 368 64 346.5 64 320C64 293.5 85.5 272 112 272zM480 320C480 293.5 501.5 272 528 272C554.5 272 576 293.5 576 320C576 346.5 554.5 368 528 368C501.5 368 480 346.5 480 320zM139 433.1C157.8 414.3 188.1 414.3 206.9 433.1C225.7 451.9 225.7 482.2 206.9 501C188.1 519.8 157.8 519.8 139 501C120.2 482.2 120.2 451.9 139 433.1zM139 139C157.8 120.2 188.1 120.2 206.9 139C225.7 157.8 225.7 188.1 206.9 206.9C188.1 225.7 157.8 225.7 139 206.9C120.2 188.1 120.2 157.8 139 139zM501 433.1C519.8 451.9 519.8 482.2 501 501C482.2 519.8 451.9 519.8 433.1 501C414.3 482.2 414.3 451.9 433.1 433.1C451.9 414.3 482.2 414.3 501 433.1z" />
                </svg>
              </span>
            )} */}
        </button>
      </form>
    </div>
  );
}
