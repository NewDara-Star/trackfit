"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

interface Profile {
  nickname: string;
  avatar_url: string | null;
}

const workouts = [
  {
    name: "Push Day",
    route: "/workout/push",
    description: "Chest, shoulders, and triceps",
  },
  {
    name: "Pull Day",
    route: "/workout/pull",
    description: "Back and biceps",
  },
  {
    name: "Leg Day",
    route: "/workout/legs",
    description: "Quadriceps, hamstrings, and calves",
  },
  {
    name: "Full Body",
    route: "/workout/full-body",
    description: "Complete body workout",
  },
];

export default function Dashboard() {
  const { user, supabase } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!user?.id) {
          console.log("No user ID found");
          return;
        }

        // First, fetch the profile data
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("nickname, avatar_url")
          .eq("id", user.id) // Ensure user.id is correct
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          return;
        }

        if (!profileData) {
          console.log("No profile data found");
          return;
        }

        console.log("Raw profile data:", profileData); // Debug log

        // If there's an avatar_url, get its public URL
        let avatarPublicUrl = null;
        if (profileData.avatar_url) {
          const { data } = supabase.storage
            .from("avatars")
            .getPublicUrl(profileData.avatar_url);
          avatarPublicUrl = data?.publicUrl;
        }

        // Set the profile with the processed data
        setProfile({
          nickname: profileData.nickname || "User",
          avatar_url: avatarPublicUrl,
        });
      } catch (error) {
        console.error("Profile fetch error:", error);
      }
    };

    fetchProfile();
  }, [user, supabase]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-6">
      {/* User Profile Section */}
      <div className="flex flex-col items-center mb-8">
        <Avatar className="w-20 h-20 rounded-full mb-3">
          <AvatarImage src={profile?.avatar_url || undefined} alt="Profile" />
          <AvatarFallback>
            {profile?.nickname?.[0]?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {profile?.nickname || "User"}!
        </h1>
      </div>

      {/* Workout Selection */}
      <p className="text-gray-600 mb-4">Choose your workout for today:</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl">
        {workouts.map((workout) => (
          <Card
            key={workout.name}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push(workout.route)}
          >
            <CardContent className="p-6">
              <CardTitle className="text-xl mb-2">{workout.name}</CardTitle>
              <p className="text-gray-500">{workout.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Logout Button */}
      <Button variant="outline" onClick={handleLogout} className="mt-8">
        Logout
      </Button>
    </div>
  );
}
