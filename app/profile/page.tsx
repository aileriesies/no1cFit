"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {

  const [age,setAge]=useState("");
  const [weight,setWeight]=useState("");
  const [height,setHeight]=useState("");
  const [gender,setGender]=useState("");
  const [goal,setGoal]=useState("");
  const [activity,setActivity]=useState("");

  async function saveProfile(){

    const {
      data:{user}
    }=await supabase.auth.getUser();

    if(!user){
      return;
    }

    const {error}=await supabase
    .from("profiles")
    .upsert({
      id:user.id,

      age:Number(age),
      weight:Number(weight),
      height:Number(height),

      gender,
      goal,
      activity_level:activity
    });

    if(error){
      alert(error.message);
      return;
    }

    alert("Profile saved!");
  }

  return(

<div className="min-h-screen flex justify-center items-center">

<div className="border p-6 rounded w-[500px]">

<h1 className="text-2xl font-bold mb-5">
Health Profile
</h1>

<input
placeholder="Age"
className="border p-2 w-full mb-3"
value={age}
onChange={(e)=>setAge(e.target.value)}
/>

<input
placeholder="Weight (kg)"
className="border p-2 w-full mb-3"
value={weight}
onChange={(e)=>setWeight(e.target.value)}
/>

<input
placeholder="Height (cm)"
className="border p-2 w-full mb-3"
value={height}
onChange={(e)=>setHeight(e.target.value)}
/>

<select
className="border p-2 w-full mb-3"
onChange={(e)=>setGender(e.target.value)}
>

<option>Select Gender</option>
<option>Male</option>
<option>Female</option>

</select>

<select
className="border p-2 w-full mb-3"
onChange={(e)=>setGoal(e.target.value)}
>

<option>Select Goal</option>

<option>Weight Loss</option>
<option>Maintain</option>
<option>Muscle Gain</option>

</select>

<select
className="border p-2 w-full mb-4"
onChange={(e)=>setActivity(e.target.value)}
>

<option>Activity Level</option>

<option>Sedentary</option>
<option>Light</option>
<option>Moderate</option>
<option>Active</option>

</select>

<button
onClick={saveProfile}
className="w-full bg-black text-white p-2 rounded"
>
Save Profile
</button>

</div>

</div>

  )
}