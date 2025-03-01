'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Trash2, Pencil, Plus } from 'lucide-react';
import { Workout } from '@/types/workout';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface WorkoutListProps {
  onEditWorkout?: (workout: Workout) => void;
}

export function WorkoutList({ onEditWorkout }: WorkoutListProps) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [workoutToDelete, setWorkoutToDelete] = useState<Workout | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchWorkouts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/workouts');
      if (!response.ok) {
        throw new Error('Failed to fetch workouts');
      }
      const data = await response.json();
      setWorkouts(data);
    } catch (error) {
      console.error('Error fetching workouts:', error);
      toast.error('Failed to load workouts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const handleDeleteClick = (workout: Workout) => {
    setWorkoutToDelete(workout);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!workoutToDelete) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/workouts/${workoutToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete workout');
      }

      setWorkouts(workouts.filter(w => w.id !== workoutToDelete.id));
      toast.success('Workout deleted successfully');
    } catch (error) {
      console.error('Error deleting workout:', error);
      toast.error('Failed to delete workout');
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
      setWorkoutToDelete(null);
    }
  };

  const handleEditClick = (workout: Workout) => {
    if (onEditWorkout) {
      onEditWorkout(workout);
    } else {
      window.location.href = `/workouts/${workout.id}/edit`;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Your Workouts</h2>
          <Link href="/workouts/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Workout
            </Button>
          </Link>
        </div>

        {workouts.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                You haven&apos;t created any workouts yet.
              </p>
              <div className="mt-4 flex justify-center">
                <Link href="/workouts/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Workout
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {workouts.map((workout) => (
              <Card key={workout.id}>
                <CardHeader className="pb-2">
                  <CardTitle>
                    <Link
                      href={`/workouts/${workout.id}`}
                      className="hover:underline"
                    >
                      {workout.title}
                    </Link>
                  </CardTitle>
                  {workout.description && (
                    <CardDescription>{workout.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {new Date(workout.created_at).toLocaleDateString()}
                  </p>
                  <div className="flex justify-between mt-4">
                    <Link href={`/workouts/${workout.id}`}>
                      <Button
                        variant="default"
                        size="sm"
                      >
                        View
                      </Button>
                    </Link>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditClick(workout)}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteClick(workout)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the workout.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
