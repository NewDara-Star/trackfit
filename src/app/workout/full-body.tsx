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

const fullBodyExercises = [
  { name: "Bench Press", sets: 4, reps: "4-6" },
  { name: "Pull-ups", sets: 3, reps: "Till Failure" },
  { name: "Squats", sets: 3, reps: "4-6" },
  { name: "Farmer’s Walk", sets: 2, reps: "30 sec" },
];

export default function FullBodyWorkout() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      <h1 className="text-3xl font-bold">Full Body Workout</h1>

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
              {fullBodyExercises.map((exercise) => (
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
