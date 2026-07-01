"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeToggle(){

const {theme,setTheme}=useTheme();

return(

<button
onClick={()=>setTheme(
theme==="dark"
?"light"
:"dark"
)}
className="border p-2 rounded-full"
>

{theme==="dark"
?<Sun size={18}/>
:<Moon size={18}/>
}

</button>

);

}