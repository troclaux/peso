'use client';

import { WorkoutList } from '@/components/workouts/WorkoutList';
import { Container } from '@/components/ui/container';
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const WorkoutsPage = () => {

  const { data: session } = useSession();

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/workouts");
  }

  return (
    <Container>
      <div className="py-6">
        <h1 className="text-3xl font-bold mb-6">Workouts</h1>
        <WorkoutList />
      </div>
    </Container>
  );
};

export default WorkoutsPage;
