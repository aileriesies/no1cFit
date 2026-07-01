"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { TutorialTour, hasSeenTutorial, type TourStep } from "@/componentss/TutorialTour";

const tourSteps: TourStep[] = [
  {
    target: "progress-summary",
    title: "Today's Progress",
    description: "Your calories, protein, carbs, and fats for today — updates the moment you log something.",
  },
  {
    target: "food-search",
    title: "Search Any Food",
    description: "Type here to search real nutrition data. Tap a result and the macros fill in automatically.",
  },
  {
    target: "add-food-button",
    title: "Log It",
    description: "Once the details look right, tap here to add it to today's log.",
  },
  {
    target: "food-logs-list",
    title: "Your Food Logs",
    description: "Everything you've logged today shows up here. Edit or delete anytime.",
  },
  {
    target: "tutorial-button",
    title: "Need This Again?",
    description: "Tap here anytime to replay this tour.",
  },
];

export default function Dashboard() {
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fats, setFats] = useState("");
  const [mealType, setMealType] = useState("breakfast");

  const [foods, setFoods] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    if (!hasSeenTutorial()) {
      const timer = setTimeout(() => setShowTour(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  async function searchFoods(value: string) {
    setFoodName(value);

    if (!value.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(`/api/foods?query=${value}`);
      const data = await response.json();
      setSearchResults(data.foods || []);
    } catch (error) {
      console.log(error);
    }
  }

  async function loadFoods() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("food_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setFoods(data || []);
  }

  async function addFood() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("food_logs").insert({
      user_id: user.id,
      food_name: foodName,
      calories: Number(calories),
      protein: Number(protein),
      carbs: Number(carbs),
      fats: Number(fats),
      meal_type: mealType,
    });

    if (error) {
      alert(error.message);
      return;
    }

    setFoodName("");
    setCalories("");
    setProtein("");
    setCarbs("");
    setFats("");
    setSearchResults([]);

    loadFoods();
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  useEffect(() => {
    loadFoods();
  }, []);

  const totalCalories = foods.reduce((sum, item) => sum + item.calories, 0);
  const totalProtein = foods.reduce((sum, item) => sum + Number(item.protein), 0);
  const totalCarbs = foods.reduce((sum, item) => sum + Number(item.carbs), 0);
  const totalFats = foods.reduce((sum, item) => sum + Number(item.fats), 0);

  async function deleteFood(id: string) {
    await supabase.from("food_logs").delete().eq("id", id);
    loadFoods();
  }

  async function editFood(food: any) {
    const newCalories = prompt("New calories:", food.calories);
    if (!newCalories) return;

    await supabase.from("food_logs").update({ calories: Number(newCalories) }).eq("id", food.id);
    loadFoods();
  }

  const macros = [
    { label: "Calories", value: totalCalories, goal: 2200, unit: "", color: "#F4A331" },
    { label: "Protein", value: totalProtein, goal: 140, unit: "g", color: "#2F5233" },
    { label: "Carbs", value: totalCarbs, goal: 250, unit: "g", color: "#1B1B18" },
    { label: "Fats", value: totalFats, goal: 70, unit: "g", color: "#8C8C84" },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1B1B18] font-[family-name:var(--font-body)]">
      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-[#8C8C84] mb-1">Dashboard</p>
            <h1 className="text-4xl font-[family-name:var(--font-display)] font-extrabold uppercase tracking-tight">
              No1CFit
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              data-tour="tutorial-button"
              onClick={() => setShowTour(true)}
              className="border-2 border-[#1B1B18] px-4 py-2 text-xs font-semibold uppercase tracking-wide hover:bg-[#1B1B18] hover:text-[#FAFAF8] transition-all duration-300"
            >
              Tutorial
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#B3401F] border-2 border-[#B3401F] hover:bg-[#B3401F] hover:text-[#FAFAF8] transition-all duration-300"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Progress summary, nutrition-label style */}
        <div data-tour="progress-summary" className="border-2 border-[#1B1B18] p-6 mb-6">
          <div className="flex items-baseline justify-between border-b-2 border-[#1B1B18] pb-2 mb-4">
            <h2 className="text-2xl font-[family-name:var(--font-display)] font-extrabold uppercase tracking-tight">
              Today's Progress
            </h2>
            <span className="text-xs uppercase tracking-wide text-[#8C8C84]">Daily Goal</span>
          </div>

          <div className="space-y-4">
            {macros.map((m) => (
              <div key={m.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-semibold">{m.label}</span>
                  <span className="text-[#8C8C84]">
                    {m.value}{m.unit} / {m.goal}{m.unit}
                  </span>
                </div>
                <div className="w-full h-2 bg-[#1B1B18]/10">
                  <div
                    className="h-2 transition-all duration-500 ease-out"
                    style={{
                      width: `${Math.min((m.value / m.goal) * 100, 100)}%`,
                      backgroundColor: m.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add food */}
        <div className="border-2 border-[#1B1B18] p-6 mb-6">
          <h2 className="text-2xl font-[family-name:var(--font-display)] font-extrabold uppercase tracking-tight border-b-2 border-[#1B1B18] pb-2 mb-4">
            Log a Meal
          </h2>

          <div data-tour="food-search" className="relative mb-4">
            <label className="block text-xs uppercase tracking-wide text-[#8C8C84] mb-1">Food</label>
            <input
              placeholder="Search food..."
              className="w-full border-b border-[#1B1B18]/20 bg-transparent outline-none py-2 text-base focus:border-[#1B1B18] transition-colors"
              value={foodName}
              onChange={(e) => searchFoods(e.target.value)}
            />

            {searchResults.length > 0 && (
              <div className="absolute z-10 w-full border-2 border-[#1B1B18] bg-[#FAFAF8] max-h-52 overflow-auto mt-1">
                {searchResults.map((food) => (
                  <div
                    key={food.fdcId}
                    className="p-3 border-b border-[#1B1B18]/10 cursor-pointer hover:bg-[#1B1B18] hover:text-[#FAFAF8] transition-colors text-sm"
                    onClick={() => {
                      setFoodName(food.description);
                      const nutrients = food.foodNutrients || [];
                      const getNutrient = (id: number) =>
                        nutrients.find((n: any) => n.nutrientId === id)?.value || 0;

                      setProtein(String(getNutrient(1003)));
                      setFats(String(getNutrient(1004)));
                      setCarbs(String(getNutrient(1005)));
                      setCalories(String(getNutrient(1008)));
                      setSearchResults([]);
                    }}
                  >
                    {food.description}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-xs uppercase tracking-wide text-[#8C8C84] mb-1">Calories</label>
              <input
                className="w-full border-b border-[#1B1B18]/20 bg-transparent outline-none py-2 text-base focus:border-[#1B1B18] transition-colors"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wide text-[#8C8C84] mb-1">Protein</label>
              <input
                className="w-full border-b border-[#1B1B18]/20 bg-transparent outline-none py-2 text-base focus:border-[#1B1B18] transition-colors"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wide text-[#8C8C84] mb-1">Carbs</label>
              <input
                className="w-full border-b border-[#1B1B18]/20 bg-transparent outline-none py-2 text-base focus:border-[#1B1B18] transition-colors"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wide text-[#8C8C84] mb-1">Fats</label>
              <input
                className="w-full border-b border-[#1B1B18]/20 bg-transparent outline-none py-2 text-base focus:border-[#1B1B18] transition-colors"
                value={fats}
                onChange={(e) => setFats(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              className="border-2 border-[#1B1B18] px-3 py-2 text-sm bg-transparent outline-none uppercase tracking-wide font-semibold"
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>

            <button
              data-tour="add-food-button"
              onClick={addFood}
              className="bg-[#1B1B18] text-[#FAFAF8] px-6 py-2.5 text-sm font-semibold uppercase tracking-wide transition-transform duration-300 hover:-translate-y-0.5"
            >
              Add Food
            </button>
          </div>
        </div>

        {/* Food logs */}
        <div data-tour="food-logs-list">
          <h2 className="text-2xl font-[family-name:var(--font-display)] font-extrabold uppercase tracking-tight border-b-2 border-[#1B1B18] pb-2 mb-4">
            Food Logs
          </h2>

          {foods.length === 0 && (
            <p className="text-sm text-[#8C8C84] py-6 text-center">
              Nothing logged yet. Search a food above to get started.
            </p>
          )}

          <div className="space-y-3">
            {foods.map((food) => (
              <div
                key={food.id}
                className="border border-[#1B1B18]/20 p-4 flex justify-between items-center hover:border-[#1B1B18] transition-colors"
              >
                <div>
                  <p className="font-semibold">{food.food_name}</p>
                  <p className="text-xs uppercase tracking-wide text-[#8C8C84] mt-0.5">{food.meal_type}</p>
                  <p className="text-sm mt-1">
                    <span className="font-semibold text-[#F4A331]">{food.calories} cal</span>
                    <span className="text-[#8C8C84]"> · P:{food.protein} C:{food.carbs} F:{food.fats}</span>
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => editFood(food)}
                    className="text-xs font-semibold uppercase tracking-wide border-2 border-[#1B1B18] px-3 py-1.5 hover:bg-[#1B1B18] hover:text-[#FAFAF8] transition-all duration-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteFood(food.id)}
                    className="text-xs font-semibold uppercase tracking-wide border-2 border-[#B3401F] text-[#B3401F] px-3 py-1.5 hover:bg-[#B3401F] hover:text-[#FAFAF8] transition-all duration-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <TutorialTour steps={tourSteps} active={showTour} onClose={() => setShowTour(false)} />
    </div>
  );
}