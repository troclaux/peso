import { signIn } from "next-auth/react";

export default function SignIn() {
  return (
    <div className="auth-options">
      <button onClick={() => signIn("google", { redirectTo: "/" })}>
        Sign in with Google
      </button>

      <button onClick={() => signIn("github", { redirectTo: "/" })}>
        Sign in with GitHub
      </button>
    </div>
  );
}
