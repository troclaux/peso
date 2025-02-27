'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface Exercise {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

interface ExerciseFormProps {
  onSuccess?: () => void;
  exercise?: Exercise;
  isEditing?: boolean;
}

export function ExerciseForm({ onSuccess, exercise, isEditing = false }: ExerciseFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  // Initialize form with exercise data if in edit mode
  useEffect(() => {
    if (exercise) {
      setName(exercise.name);
      setDescription(exercise.description || '');
    }
  }, [exercise]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let url = '/api/exercises';
      let method = 'POST';
      
      if (isEditing && exercise) {
        url = `/api/exercises/${exercise.id}`;
        method = 'PUT';
      }
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `Failed to ${isEditing ? 'update' : 'create'} exercise`);
      }
      
      toast.success(`Exercise ${isEditing ? 'updated' : 'created'} successfully`);
      
      // Reset form if not editing
      if (!isEditing) {
        setName('');
        setDescription('');
      }
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Exercise' : 'Add New Exercise'}</CardTitle>
        <CardDescription>
          {isEditing 
            ? 'Update the details of this exercise' 
            : 'Create a new exercise to add to your workouts'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Exercise Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="E.g., Bench Press, Squat, etc."
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the exercise techniques, muscles targeted, etc."
              rows={4}
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              isEditing ? 'Update Exercise' : 'Create Exercise'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}