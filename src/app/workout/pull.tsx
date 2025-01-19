import { useRouter } from "next/router";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const pullExercises = [
  { name: "Pull-ups", sets: 3, reps: "8-12" },
  { name: "Seated Rows", sets: 3, reps: "8-10" },
  { name: "Lat Pulldown", sets: 3, reps: "8-10" },
  { name: "Bicep Hammer Curls", sets: 3, reps: "10-12" },
];

export default function PullWorkout() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      <h1 className="text-3xl font-bold">Pull Day Workout</h1>

      <Card className="mt-6 w-full max-w-lg">
        <CardContent>
          <CardTitle>Workout Plan</CardTitle>
          <Table className="mt-4">
            <TableHeader>
              <TableRow>
                <TableHead>Exercise</TableHead>
                <TableHead>Sets</TableHead>
                <TableHead>Reps</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pullExercises.map((exercise) => (
                <TableRow key={exercise.name}>
                  <TableCell>{exercise.name}</TableCell>
                  <TableCell>{exercise.sets}</TableCell>
                  <TableCell>{exercise.reps}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Button
        className="mt-6 w-full max-w-lg"
        onClick={() => alert("Workout Started!")}
      >
        Start Workout
      </Button>

      <Button
        variant="outline"
        className="mt-3 w-full max-w-lg"
        onClick={() => router.push("/dashboard")}
      >
        Back to Dashboard
      </Button>
    </div>
  );
}
