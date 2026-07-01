"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fats, setFats] = useState("");
  const [mealType, setMealType] = useState("breakfast");

  const [foods, setFoods] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  async function searchFoods(value: string) {
    setFoodName(value);

    if (!value.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(
        `/api/foods?query=${value}`
      );

      const data = await response.json();

      setSearchResults(data.foods || []);

    } catch (error) {
      console.log(error);
    }
  }

  async function loadFoods() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("food_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false
      });

    setFoods(data || []);
  }

  async function addFood() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from("food_logs")
      .insert({
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

  const totalCalories =
    foods.reduce(
      (sum, item) => sum + item.calories,
      0
    );

  const totalProtein =
    foods.reduce(
      (sum, item) => sum + Number(item.protein),
      0
    );

  const totalCarbs =
    foods.reduce(
      (sum, item) => sum + Number(item.carbs),
      0
    );

  const totalFats =
    foods.reduce(
      (sum, item) => sum + Number(item.fats),
      0
    );

    async function deleteFood(id: string) {
  await supabase
    .from("food_logs")
    .delete()
    .eq("id", id);

  loadFoods();
}

async function editFood(food:any) {
  const newCalories =
    prompt(
      "New calories:",
      food.calories
    );

  if (!newCalories) return;

  await supabase
    .from("food_logs")
    .update({
      calories:Number(newCalories)
    })
    .eq("id", food.id);

  loadFoods();
}

  return (
    <div className="p-8">

      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">
          No1CFit Dashboard
        </h1>

        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="border p-4 rounded mb-6">
          <h2 className="font-bold mb-4">
            Today's Progress
          </h2>

          {/* Calories */}
          <p>
            Calories: {totalCalories}/2200
          </p>

          <div className="w-full bg-gray-300 rounded h-4 mb-3">
            <div
              className="bg-green-500 h-4 rounded"
              style={{
                width: `${Math.min(
                  (totalCalories / 2200) * 100,
                  100
                )}%`
              }}
            />
          </div>

          {/* Protein */}
          <p>
            Protein: {totalProtein}/140g
          </p>

          <div className="w-full bg-gray-300 rounded h-4 mb-3">
            <div
              className="bg-blue-500 h-4 rounded"
              style={{
                width: `${Math.min(
                  (totalProtein / 140) * 100,
                  100
                )}%`
              }}
            />
          </div>

          {/* Carbs */}
          <p>
            Carbs: {totalCarbs}/250g
          </p>

          <div className="w-full bg-gray-300 rounded h-4 mb-3">
            <div
              className="bg-yellow-500 h-4 rounded"
              style={{
                width: `${Math.min(
                  (totalCarbs / 250) * 100,
                  100
                )}%`
              }}
            />
          </div>

          {/* Fats */}
          <p>
            Fats: {totalFats}/70g
          </p>

          <div className="w-full bg-gray-300 rounded h-4">
            <div
              className="bg-red-500 h-4 rounded"
              style={{
                width: `${Math.min(
                  (totalFats / 70) * 100,
                  100
                )}%`
              }}
            />
          </div>

        </div>

      <div className="border p-4 rounded mb-6">

        <div className="relative">

          <input
            placeholder="Search Food"
            className="border p-2 mr-2 mb-2 w-full"
            value={foodName}
            onChange={(e)=>
              searchFoods(e.target.value)
            }
          />

          {searchResults.length > 0 && (
            <div className="border rounded bg-white max-h-52 overflow-auto">

              {searchResults.map((food)=>(
                <div
                  key={food.fdcId}
                  className="p-2 border-b cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setFoodName(food.description);

                    const nutrients = food.foodNutrients || [];

                    const getNutrient = (id: number) => {
                      return (
                        nutrients.find(
                          (n: any) => n.nutrientId === id
                        )?.value || 0
                      );
                    };

                    // USDA nutrient IDs
                    setProtein(String(getNutrient(1003))); // protein
                    setFats(String(getNutrient(1004))); // fat
                    setCarbs(String(getNutrient(1005))); // carbs
                    setCalories(String(getNutrient(1008))); // calories

                    setSearchResults([]);
                  }}
                >
                  {food.description}
                </div>
              ))}

            </div>
          )}

        </div>

        <input
          placeholder="Calories"
          className="border p-2 mr-2 mb-2"
          value={calories}
          onChange={(e)=>setCalories(e.target.value)}
        />

        <input
          placeholder="Protein"
          className="border p-2 mr-2 mb-2"
          value={protein}
          onChange={(e)=>setProtein(e.target.value)}
        />

        <input
          placeholder="Carbs"
          className="border p-2 mr-2 mb-2"
          value={carbs}
          onChange={(e)=>setCarbs(e.target.value)}
        />

        <input
          placeholder="Fats"
          className="border p-2 mr-2 mb-2"
          value={fats}
          onChange={(e)=>setFats(e.target.value)}
        />

        <select
          value={mealType}
          onChange={(e)=>setMealType(e.target.value)}
          className="border p-2 mr-2 mb-2"
        >
          <option>breakfast</option>
          <option>lunch</option>
          <option>dinner</option>
          <option>snack</option>
        </select>

        <button
          onClick={addFood}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Add Food
        </button>

      </div>

      <h2 className="font-bold mb-4">
        Food Logs
      </h2>

      {foods.map((food)=>(
      <div
        key={food.id}
        className="border p-4 rounded mb-3 flex justify-between items-center"
        >

        <div>

        <p className="font-bold">
        {food.food_name}
        </p>

        <p>{food.meal_type}</p>

        <p>
        {food.calories} cal
        </p>

        <p>
        P:{food.protein}
        C:{food.carbs}
        F:{food.fats}
        </p>

        </div>

        <div className="flex gap-2">

        <button
        onClick={()=>editFood(food)}
        className="bg-blue-500 text-white px-3 py-1 rounded"
        >
        Edit
        </button>

        <button
        onClick={()=>deleteFood(food.id)}
        className="bg-red-500 text-white px-3 py-1 rounded"
        >
        Delete
        </button>

        </div>

        </div>

        ))}

    </div>
  );
}