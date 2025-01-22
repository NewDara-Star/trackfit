"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  duration?: string;
  image: string;
}

const pushExercises: Exercise[] = [
  {
    name: "Machine over-head shoulder press",
    sets: 3,
    reps: "10",
    image: "/exercises/machine-overhead-press.png"
  },
  {
    name: "Over head dumbbell press",
    sets: 3,
    reps: "10",
    image: "/exercises/overhead-dumbbell-press.png"
  },
  {
    name: "Inclined dumbbell press",
    sets: 3,
    reps: "10",
    image: "/exercises/incline-dumbbell-press.png"
  },
  {
    name: "Flat dumbbell press",
    sets: 3,
    reps: "6-8",
    image: "/exercises/flat-dumbbell-press.png"
  },
  {
    name: "Machine-chest press",
    sets: 3,
    reps: "10",
    image: "/exercises/machine-chest-press.png"
  }
];

export default function PushWorkout() {
  const router = useRouter();
  const [currentRound, setCurrentRound] = useState(1);

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* Header */}
      <div className="p-4 flex items-center">
        <Button 
          variant="ghost" 
          className="text-white p-2"
          onClick={() => router.back()}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-semibold flex-1 text-center mr-8">Workout</h1>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-6">
        <h2 className="text-3xl font-bold">Push Day</h2>
        <p className="text-gray-400">
          Focus on chest, shoulders, and triceps with these compound movements.
          Remember to warm up properly and maintain good form throughout.
        </p>

        {/* Rounds */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Rounds</h3>
            <span className="text-gray-400">{currentRound}/5</span>
          </div>

          {/* Exercise List */}
          <div className="space-y-4">
            {pushExercises.map((exercise, index) => (
              <div
                key={exercise.name}
                className="bg-[#2a2a2a] rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-700 rounded-lg">
                    {/* Replace with actual exercise image */}
                  </div>
                  <div>
                    <h4 className="font-medium">{exercise.name}</h4>
                    <p className="text-gray-400">
                      {exercise.sets} sets of {exercise.reps} reps
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="text-[#b4ff32] h-10 w-10 p-0"
                >
                  ▶️
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4">
        <Button 
          className="w-full py-6 text-lg font-semibold bg-[#b4ff32] text-black hover:bg-[#a3e82d] rounded-full"
        >
          Let's Workout
        </Button>
      </div>
    </div>
  );
}
