'use client';
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

const Profile = () => {
  const { data: session } = useSession()

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/profile");
  }

  return (
    <div>
      <p>{session?.user?.name}</p>
      <p>{session?.user?.email}</p>
    </div>
  );
};

export default Profile;
