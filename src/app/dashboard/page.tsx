"use client"

import { useSession } from "next-auth/react"

export default function Page() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirectTo: "/api/auth/signin"
    }
  });

  if (session?.user) {
    return (
      <>
        <h1>You are logged in, welcome!</h1>
        <h3>{session?.user?.email}</h3>
      </>
    );
  }

  return <p>You are not logged in!</p>
}
