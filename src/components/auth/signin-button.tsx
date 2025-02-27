import { signIn } from "@/auth"

export default function SignIn() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("google", { redirectTo: "/" })
      }}
    >
      <button type="submit">Signin with Google</button>
    </form>
  )
}
