'use client';

import { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Pencil } from 'lucide-react';
import { Workout } from '@/types/workout';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { use } from 'react';

interface WorkoutDetailPageProps {
  params: {
    id: string;
  };
}

const WorkoutDetailPage = ({ params }: WorkoutDetailPageProps) => {
  const { id } = use(params);
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const response = await fetch(`/api/workouts/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            toast.error('Workout not found');
            router.push('/workouts');
            return;
          }
          throw new Error('Failed to fetch workout');
        }

        const data = await response.json();
        setWorkout(data);
      } catch (error) {
        console.error('Error fetching workout:', error);
        toast.error('Failed to load workout');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkout();
  }, [id, router]);

  if (loading) {
    return (
      <Container>
        <div className="py-6 flex justify-center items-center min-h-[40vh]">
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
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Link href="/workouts">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Workouts
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">{workout.title}</h1>
          </div>
          <Link href={`/workouts/${workout.id}/edit`}>
            <Button>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Workout
            </Button>
          </Link>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Workout Details</CardTitle>
            {workout.description && (
              <CardDescription>{workout.description}</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mb-6">
              <p>Created: {new Date(workout.created_at).toLocaleDateString()}</p>
              <p>Last Updated: {new Date(workout.updated_at).toLocaleDateString()}</p>
            </div>

            <h3 className="text-lg font-medium mb-4">Exercises</h3>

            {!workout.exercises || workout.exercises.length === 0 ? (
              <p className="text-muted-foreground">No exercises in this workout.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Exercise</TableHead>
                    <TableHead className="text-center">Sets</TableHead>
                    <TableHead className="text-center">Reps</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workout.exercises.map((exercise, index) => (
                    <TableRow key={exercise.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{exercise.name}</p>
                          {exercise.description && (
                            <p className="text-sm text-muted-foreground">{exercise.description}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{exercise.sets}</TableCell>
                      <TableCell className="text-center">{exercise.reps}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default WorkoutDetailPage;
