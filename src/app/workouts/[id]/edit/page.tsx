'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { WorkoutForm } from '@/components/workouts/WorkoutForm';
import { Container } from '@/components/ui/container';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Workout } from '@/types/workout';

export default function EditWorkoutPage() {
  const params = useParams();
  const router = useRouter();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWorkout() {
      if (!params.id) return;

      setLoading(true);
      try {
        const response = await fetch(`/api/workouts/${params.id}`);

        if (!response.ok) {
          throw new Error('Failed to fetch workout');
        }

        const data = await response.json();
        setWorkout(data);
      } catch (error) {
        console.error('Error fetching workout:', error);
        toast.error('Failed to load workout');
        router.push('/workouts');
      } finally {
        setLoading(false);
      }
    }

    fetchWorkout();
  }, [params.id, router]);

  if (loading) {
    return (
      <Container>
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Container>
    );
  }

  if (!workout) {
    return null;
  }

  return (
    <Container>
      <div className="py-6">
        <h1 className="text-3xl font-bold mb-6">Edit Workout</h1>
        <WorkoutForm
          workout={workout}
          isEditing={true}
          onSuccess={() => router.push('/workouts')}
        />
      </div>
    </Container>
  );
}
