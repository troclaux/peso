'use client';

import { useState } from 'react';
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { ExerciseList } from "@/components/exercises/ExerciseList";
import { ExerciseForm } from "@/components/exercises/ExerciseForm";
import { Button } from "@/components/ui/button";
import { Toaster } from "sonner";
import { PlusCircle, XCircle } from "lucide-react";

const ExercisesPage = () => {
  const { data: session } = useSession();
  const [showForm, setShowForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Protect route - redirect to login if not authenticated
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/exercises");
  }

  const handleFormSuccess = () => {
    // Hide form after successful submission
    setShowForm(false);
    // Trigger refresh of exercise list
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="container mx-auto max-w-4xl py-6">
      <Toaster position="top-right" />

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Exercises</h1>
        <Button
          onClick={() => setShowForm(!showForm)}
          variant={showForm ? "destructive" : "default"}
        >
          {showForm ? (
            <>
              <XCircle className="mr-2 h-4 w-4" />
              Cancel
            </>
          ) : (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Exercise
            </>
          )}
        </Button>
      </div>

      {showForm && (
        <div className="mb-8">
          <ExerciseForm onSuccess={handleFormSuccess} />
        </div>
      )}

      <ExerciseList refreshTrigger={refreshTrigger} />
    </div>
  );
};

export default ExercisesPage;
