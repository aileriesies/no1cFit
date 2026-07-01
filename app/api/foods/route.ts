import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({
      foods:[]
    });
  }

  try {
    const response = await fetch(
      `https://api.nal.usda.gov/fdc/v1/foods/search?query=${query}&pageSize=20&api_key=${process.env.USDA_API_KEY}`
    );

    const data = await response.json();

    const filteredFoods =
      (data.foods || []).filter(
        (food:any)=>
          food.foodNutrients &&
          food.foodNutrients.length > 0
      );

    return NextResponse.json({
      foods: filteredFoods.slice(0,10)
    });

  } catch(error:any){
    return NextResponse.json({
      error:error.message
    });
  }
}