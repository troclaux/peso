'use client';

import { WorkoutList } from '@/components/workouts/WorkoutList';
import { Container } from '@/components/ui/container';

const WorkoutsPage = () => {
  return (
    <Container>
      <div className="py-6">
        <h1 className="text-3xl font-bold mb-6">Workouts</h1>
        <WorkoutList />
      </div>
    </Container>
  );
};

export default WorkoutsPage;
