'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Plus, X, ArrowUp, ArrowDown } from 'lucide-react';
import { Exercise, Workout, WorkoutExercise } from '@/types/workout';
import {
  // Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface WorkoutFormProps {
  workout?: Workout;
  isEditing?: boolean;
  onSuccess?: () => void;
}

export function WorkoutForm({ workout, isEditing = false, onSuccess }: WorkoutFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>([]);
  const [showExerciseSearch, setShowExerciseSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [sets, setSets] = useState('3');
  const [reps, setReps] = useState('10');

  useEffect(() => {
    async function fetchExercises() {
      try {
        const response = await fetch('/api/exercises');
        if (!response.ok) {
          throw new Error('Failed to fetch exercises');
        }
        const data = await response.json();
        setExercises(data);
      } catch (error) {
        console.error('Error fetching exercises:', error);
        toast.error('Failed to load exercises');
      }
    }

    fetchExercises();
  }, []);

  useEffect(() => {
    if (workout && isEditing) {
      setTitle(workout.title);
      setDescription(workout.description || '');

      if (workout.exercises) {
        setWorkoutExercises(workout.exercises);
      }
    }
  }, [workout, isEditing]);

  const filteredExercises = exercises.filter(exercise =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddExercise = () => {
    if (!selectedExercise) return;

    const newWorkoutExercise: WorkoutExercise = {
      id: Math.random(),
      exercise_id: selectedExercise.id,
      name: selectedExercise.name,
      description: selectedExercise.description,
      sets: parseInt(sets, 10),
      reps: parseInt(reps, 10),
      order_number: workoutExercises.length + 1
    };

    setWorkoutExercises([...workoutExercises, newWorkoutExercise]);
    setSelectedExercise(null);
    setSets('3');
    setReps('10');
    setShowExerciseSearch(false);
  };

  const handleRemoveExercise = (index: number) => {
    const updatedExercises = [...workoutExercises];
    updatedExercises.splice(index, 1);

    updatedExercises.forEach((ex, i) => {
      ex.order_number = i + 1;
    });

    setWorkoutExercises(updatedExercises);
  };

  const handleMoveExercise = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === workoutExercises.length - 1)
    ) {
      return;
    }

    const updatedExercises = [...workoutExercises];
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    [updatedExercises[index], updatedExercises[newIndex]] =
      [updatedExercises[newIndex], updatedExercises[index]];

    updatedExercises.forEach((ex, i) => {
      ex.order_number = i + 1;
    });

    setWorkoutExercises(updatedExercises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (workoutExercises.length === 0) {
      toast.error('Please add at least one exercise to the workout');
      return;
    }

    setLoading(true);

    try {
      const exercisesData = workoutExercises.map(ex => ({
        exercise_id: ex.exercise_id,
        sets: ex.sets,
        reps: ex.reps
      }));

      let url = '/api/workouts';
      let method = 'POST';

      if (isEditing && workout) {
        url = `/api/workouts/${workout.id}`;
        method = 'PUT';
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          exercises: exercisesData,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `Failed to ${isEditing ? 'update' : 'create'} workout`);
      }

      toast.success(`Workout ${isEditing ? 'updated' : 'created'} successfully`);

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/workouts');
      }
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

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Workout' : 'Create New Workout'}</CardTitle>
        <CardDescription>
          {isEditing
            ? 'Update your workout details and exercises'
            : 'Create a new workout by adding exercises, sets, and reps'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Workout Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g., Upper Body Day, Full Body Workout, etc."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the workout focus, goals, etc."
              rows={3}
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Exercises</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowExerciseSearch(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Exercise
              </Button>
            </div>

            {workoutExercises.length === 0 ? (
              <div className="text-center p-6 border rounded-md bg-muted/50">
                <p className="text-muted-foreground">No exercises added yet.</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => setShowExerciseSearch(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Exercise
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Exercise</TableHead>
                    <TableHead className="text-center">Sets</TableHead>
                    <TableHead className="text-center">Reps</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workoutExercises.map((ex, index) => (
                    <TableRow key={ex.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{ex.name}</TableCell>
                      <TableCell className="text-center">{ex.sets}</TableCell>
                      <TableCell className="text-center">{ex.reps}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            disabled={index === 0}
                            onClick={() => handleMoveExercise(index, 'up')}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            disabled={index === workoutExercises.length - 1}
                            onClick={() => handleMoveExercise(index, 'down')}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveExercise(index)}
                            className="text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              isEditing ? 'Update Workout' : 'Create Workout'
            )}
          </Button>
        </form>
      </CardContent>

      {/* exercise search box */}
      <CommandDialog open={showExerciseSearch} onOpenChange={setShowExerciseSearch}>
        <div className="p-4">
          <h2 className="text-lg font-medium mb-4">Add Exercise to Workout</h2>

          <div className="space-y-4 mb-4">
            <CommandInput
              placeholder="Search exercises..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />

            <div className="h-[200px] overflow-y-auto border rounded-md">
              <CommandList>
                <CommandGroup>
                  {filteredExercises.length === 0 ? (
                    <CommandEmpty>No exercises found</CommandEmpty>
                  ) : (
                    filteredExercises.map(exercise => (
                      <CommandItem
                        key={exercise.id}
                        onSelect={() => setSelectedExercise(exercise)}
                        className={selectedExercise?.id === exercise.id ? 'bg-muted' : ''}
                      >
                        {exercise.name}
                      </CommandItem>
                    ))
                  )}
                </CommandGroup>
              </CommandList>
            </div>
          </div>

          {selectedExercise && (
            <div className="space-y-4 mb-4">
              <div className="p-3 border rounded-md">
                <p className="font-medium">{selectedExercise.name}</p>
                {selectedExercise.description && (
                  <p className="text-sm text-muted-foreground mt-1">{selectedExercise.description}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sets">Sets</Label>
                  <Input
                    id="sets"
                    type="number"
                    min="1"
                    value={sets}
                    onChange={(e) => setSets(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reps">Reps</Label>
                  <Input
                    id="reps"
                    type="number"
                    min="1"
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowExerciseSearch(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddExercise}
              disabled={!selectedExercise}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add to Workout
            </Button>
          </div>
        </div>
      </CommandDialog>
    </Card>
  );
}
