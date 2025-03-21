'use client';
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Container } from "@/components/ui/container";

const Profile = () => {
  const { data: session } = useSession();

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/profile");
  }

  return (
    <Container className="py-10">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      <div className="max-w-md mx-auto">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>Your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center gap-6">
              {session.user?.image ? (
                <div className="relative h-28 w-28 rounded-full overflow-hidden border-4 border-primary/10">
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "Profile"}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-28 w-28 bg-primary/10 rounded-full text-4xl font-bold text-primary">
                  {session.user?.name?.[0] || "U"}
                </div>
              )}
              <div className="w-full">
                <div className="space-y-3">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{session.user?.name || "Not provided"}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{session.user?.email || "Not provided"}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default Profile;
