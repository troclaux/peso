'use client';

import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-b from-primary/20 to-background py-20">
        <Container>
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 p-6 rounded-full">
              <div className="text-black text-5xl font-bold">PESO</div>
            </div>
            <h1 className="text-4xl font-bold mb-4">
              Simple Workout Tracking
            </h1>
            <p className="text-xl text-muted-foreground max-w-md mb-8">
              Track your fitness journey with ease
            </p>
            <div className="flex gap-4">
              {session ? (
                <Button size="lg" asChild>
                  <Link href="/workouts">My Workouts</Link>
                </Button>
              ) : (
                <Button size="lg" asChild>
                  <Link href="/auth/signin">Get Started</Link>
                </Button>
              )}
              <Button variant="outline" size="lg" asChild>
                <Link href="/exercises">Exercises</Link>
              </Button>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-16">
        <h2 className="text-2xl font-bold text-center mb-10">Key Features</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card rounded-lg p-6 shadow-sm border">
            <div className="text-primary text-xl font-bold mb-2">Create Workouts</div>
            <p className="text-muted-foreground">
              Build custom workout routines with your favorite exercises
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-sm border">
            <div className="text-primary text-xl font-bold mb-2">Track Progress</div>
            <p className="text-muted-foreground">
              Watch your body strength improve over time
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-sm border">
            <div className="text-primary text-xl font-bold mb-2">Exercise Library</div>
            <p className="text-muted-foreground">
              Access a comprehensive collection of exercises for any goal
            </p>
          </div>
        </div>
      </Container>

      <div className="bg-primary/5 py-12">
        <Container>
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to start?</h2>
            <p className="text-muted-foreground mb-6">
              Join today and begin your fitness journey
            </p>
            {session ? (
              <Button asChild>
                <Link href="/workouts/new">Create Workout</Link>
              </Button>
            ) : (
              <Button asChild>
                <Link href="/auth/signin">Sign In</Link>
              </Button>
            )}
          </div>
        </Container>
      </div>

      <Container>
        <div className="border-t py-8 mt-8">
          <div className="flex justify-between items-center">
            <div className="font-bold">PESO</div>
            <div className="flex gap-4">
              <Link href="/exercises" className="text-muted-foreground hover:text-foreground">
                Exercises
              </Link>
              <Link href="/workouts" className="text-muted-foreground hover:text-foreground">
                Workouts
              </Link>
              <Link href="/profile" className="text-muted-foreground hover:text-foreground">
                Profile
              </Link>
            </div>
          </div>
          <div className="text-center text-muted-foreground text-sm mt-6">
            © {new Date().getFullYear()} PESO
          </div>
        </div>
      </Container>
    </div>
  );
}
