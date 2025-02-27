'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
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
  onEdit?: (exercise: Exercise) => void;
}

export function ExerciseList({ refreshTrigger = 0, onEdit }: ExerciseListProps) {
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
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, [refreshTrigger]);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this exercise?')) return;

    try {
      const response = await fetch(`/api/exercises/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete exercise');
      }

      setExercises(exercises.filter(exercise => exercise.id !== id));
      toast.success('Exercise deleted successfully');
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unknown error occurred');
      }
    }
  };

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
            <div key={exercise.id} className="border p-4 rounded-lg flex justify-between items-start">
              <div>
                <h3 className="font-medium text-lg">{exercise.name}</h3>
                {exercise.description && (
                  <p className="text-sm text-muted-foreground mt-1">{exercise.description}</p>
                )}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit && onEdit(exercise)}
                  className="h-8 w-8 p-0"
                >
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(exercise.id)}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
