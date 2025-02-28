'use client';

import { WorkoutForm } from '@/components/workouts/WorkoutForm';
import { Container } from '@/components/ui/container';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const NewWorkoutPage = () => {
  return (
    <Container>
      <div className="py-6">
        <div className="flex items-center mb-6">
          <Link href="/workouts">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Workouts
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Create New Workout</h1>
        </div>

        <WorkoutForm />
      </div>
    </Container>
  );
};

export default NewWorkoutPage;
