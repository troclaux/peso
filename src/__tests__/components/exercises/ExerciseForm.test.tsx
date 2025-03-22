/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { ExerciseForm } from '@/components/exercises/ExerciseForm';

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('lucide-react', () => ({
  Loader2: () => <div data-testid="loading-icon">Loading</div>,
}));

global.fetch = jest.fn();

describe('ExerciseForm', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });
  });

  it('renders the create form correctly', () => {
    render(<ExerciseForm />);

    expect(screen.getByText('Add New Exercise')).toBeInTheDocument();
    expect(screen.getByLabelText('Exercise Name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create Exercise' })).toBeInTheDocument();
  });

  it('renders the edit form when in edit mode', () => {
    const exercise = {
      id: 1,
      name: 'Test Exercise',
      description: 'Test Description',
      created_at: '2023-01-01',
      updated_at: '2023-01-01',
      user_id: 1,
    };

    render(<ExerciseForm exercise={exercise} isEditing={true} />);

    expect(screen.getByText('Edit Exercise')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Update Exercise' })).toBeInTheDocument();
  });
});
