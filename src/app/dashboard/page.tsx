"use client";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

const workouts = [
  { name: "Push Day", route: "/workout/push" },
  { name: "Pull Day", route: "/workout/pull" },
  { name: "Leg Day", route: "/workout/legs" },
  { name: "Full Body", route: "/workout/full-body" },
];

export default function Dashboard() {
  const { user, supabase } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl">
        Redirecting...
      </div>
    );
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-6">
      <h1 className="text-3xl font-bold text-gray-900">
        Welcome, {user?.user?.email}
      </h1>
      <p className="text-gray-600 mt-2">Choose your workout for today:</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 w-full max-w-sm">
        {workouts.map((workout) => (
          <Card
            key={workout.name}
            className="cursor-pointer hover:bg-gray-200 transition shadow-md border border-gray-300 rounded-lg"
            onClick={() => router.push(workout.route)}
          >
            <CardContent className="p-6 text-center">
              <CardTitle className="text-lg font-semibold">
                {workout.name}
              </CardTitle>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button
        variant="destructive"
        onClick={handleLogout}
        className="mt-6 w-full max-w-sm py-3 text-lg"
      >
        Logout
      </Button>
    </div>
  );
}
