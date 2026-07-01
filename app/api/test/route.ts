import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*");

    if (error) {
      throw error;
    }

    return NextResponse.json({
      message: "Supabase connected successfully",
      data,
    });

  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
    });
  }
}