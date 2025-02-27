'use client';

import { useState } from 'react';
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { ExerciseList } from "@/components/exercises/ExerciseList";
import { ExerciseForm } from "@/components/exercises/ExerciseForm";
import { Button } from "@/components/ui/button";
import { PlusCircle, XCircle } from "lucide-react";

interface Exercise {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

const ExercisesPage = () => {
  const { data: session } = useSession();
  const [showForm, setShowForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [currentExercise, setCurrentExercise] = useState<Exercise | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/exercises");
  }

  const handleFormSuccess = () => {
    setShowForm(false);
    setIsEditing(false);
    setCurrentExercise(undefined);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleEditExercise = (exercise: Exercise) => {
    setCurrentExercise(exercise);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setCurrentExercise(undefined);
  };

  return (
    <div className="container mx-auto max-w-4xl py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Exercises</h1>
        {!showForm ? (
          <Button
            onClick={() => setShowForm(true)}
            variant="default"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Exercise
          </Button>
        ) : (
          <Button
            onClick={handleCancelForm}
            variant="destructive"
          >
            <XCircle className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        )}
      </div>

      {showForm && (
        <div className="mb-8">
          <ExerciseForm
            onSuccess={handleFormSuccess}
            exercise={currentExercise}
            isEditing={isEditing}
          />
        </div>
      )}

      <ExerciseList
        refreshTrigger={refreshTrigger}
        onEdit={handleEditExercise}
      />
    </div>
  );
};

export default ExercisesPage;
