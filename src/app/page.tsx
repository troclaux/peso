'use client';

import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen">
      <div
        className="py-20 relative bg-cover bg-center"
        style={{ backgroundImage: "url('/exercise.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <Container className="relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 p-6 rounded-full">
              <div className="text-white text-5xl font-bold">PESO</div>
            </div>
            <h1 className="text-4xl font-bold mb-4 text-white">
              Workout Tracker
            </h1>
            <p className="text-xl text-white/80 max-w-md mb-8">
              Full-stack DevOps project developed by Arthur Moreira de Albuquerque
            </p>
            <div className="flex gap-4">
              {session ? (
                <Button
                  size="lg"
                  asChild
                  className="bg-transparent text-white font-semibold border-2 border-white hover:bg-white hover:text-black"
                >
                  <Link href="/workouts">My Workouts</Link>
                </Button>
              ) : (
                <Button
                  size="lg"
                  asChild
                  className="bg-transparent text-white font-semibold border-2 border-white hover:bg-white hover:text-black"
                >
                  <Link href="/auth/signin">Get Started</Link>
                </Button>
              )}
              <Button
                variant="outline"
                size="lg"
                asChild
                className="bg-transparent text-white font-semibold border-2 border-white hover:bg-white hover:text-black"
              >
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

      <div className="py-12">
        <Container>
          <Card className="w-full">
            <CardHeader className="text-center">
              <CardTitle>Ready to start?</CardTitle>
              <CardDescription>Join today and begin your fitness journey</CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-center pb-6">
              {session ? (
                <Button asChild>
                  <Link href="/workouts/new">Create Workout</Link>
                </Button>
              ) : (
                <Button asChild>
                  <Link href="/api/auth/signin">Sign In</Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        </Container>
      </div>

      <Container>
        <div className="border-t py-8 mt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="font-bold">PESO</div>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/exercises" className="text-muted-foreground hover:text-foreground px-1">
                Exercises
              </Link>
              <Link href="/workouts" className="text-muted-foreground hover:text-foreground px-1">
                Workouts
              </Link>
              {session && (
                <Link href="/profile" className="text-muted-foreground hover:text-foreground px-1">
                  Profile
                </Link>
              )}
              <Link href="https://github.com/troclaux/peso" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground px-1">
                🔗 Source Code On GitHub
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
