"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

const workouts = [
  { name: "Push Day", route: "/workout/push" },
  { name: "Pull Day", route: "/workout/pull" },
  { name: "Leg Day", route: "/workout/legs" },
  { name: "Full Body", route: "/workout/full-body" },
];

export default function Dashboard() {
  const { supabase, user } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<{
    nickname: string;
    avatar_url: string | null;
  } | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else {
      supabase
        .from("profiles")
        .select("nickname, avatar_url")
        .eq("id", user?.user?.id)
        .single()
        .then(({ data }) => {
          if (data) {
            setProfile(data);
          } else {
            setProfile({ nickname: "User", avatar_url: null });
          }
        });
    }
  }, [user, supabase, router]);

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
      {/* User Profile */}
      <div className="flex flex-col items-center">
        <Avatar className="w-20 h-20 rounded-full mb-3">
          <AvatarImage
            src={profile?.avatar_url || "/default-avatar.png"}
            alt="User Avatar"
          />
          <AvatarFallback>{profile?.nickname?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {profile?.nickname || "User"}!
        </h1>
      </div>

      {/* Workout Selection */}
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

      {/* Logout Button */}
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
