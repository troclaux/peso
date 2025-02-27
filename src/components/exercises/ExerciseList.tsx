'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface Exercise {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

interface ExerciseListProps {
  refreshTrigger?: number;
}

export function ExerciseList({ refreshTrigger = 0 }: ExerciseListProps) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/exercises');
        if (!response.ok) {
          throw new Error('Failed to fetch exercises');
        }
        const data = await response.json();
        setExercises(data);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Exercises</CardTitle>
          <CardDescription>Loading exercises...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (exercises.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Exercises</CardTitle>
          <CardDescription>No exercises found. Add your first one!</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exercises</CardTitle>
        <CardDescription>All available exercises</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {exercises.map((exercise) => (
            <div key={exercise.id} className="border p-4 rounded-lg">
              <h3 className="font-medium text-lg">{exercise.name}</h3>
              {exercise.description && (
                <p className="text-sm text-muted-foreground mt-1">{exercise.description}</p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}