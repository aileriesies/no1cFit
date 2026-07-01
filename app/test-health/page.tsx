import { calculateHealthGoals } from "@/lib/healthCalculator";

export default function TestHealthPage() {

  const result = calculateHealthGoals(
    70,          // weight
    175,         // height
    20,          // age
    "Male",
    "Muscle Gain",
    "Moderate"
  );

  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-4">
        Health Test
      </h1>

      <p>Calories: {result.calories}</p>
      <p>Protein: {result.protein}g</p>
      <p>Carbs: {result.carbs}g</p>
      <p>Fats: {result.fats}g</p>

    </div>
  );
}