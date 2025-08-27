import { signIn } from "@/lib/auth";

export function SignInForm() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-bold">You are not logged in</h1>

      <form
        action={async () => {
          "use server";
          await signIn();
        }}
        className="mt-4 flex flex-col space-y-2"
      >
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded-md"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
