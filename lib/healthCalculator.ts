export function calculateHealthGoals(
  weight:number,
  height:number,
  age:number,
  gender:string,
  goal:string,
  activity:string
){

let bmr=0;

if(gender==="Male"){
bmr=
88.36+
(13.4*weight)+
(4.8*height)-
(5.7*age);
}else{
bmr=
447.6+
(9.2*weight)+
(3.1*height)-
(4.3*age);
}

const activityMultipliers:any={
Sedentary:1.2,
Light:1.375,
Moderate:1.55,
Active:1.725
};

let calories=
bmr*
(activityMultipliers[activity]||1.2);

if(goal==="Weight Loss"){
calories-=500;
}

if(goal==="Muscle Gain"){
calories+=300;
}

const protein=
weight*2.2;

const fats=
weight*0.8;

const carbs=
(calories-(protein*4+fats*9))/4;

return{
calories:Math.round(calories),
protein:Math.round(protein),
carbs:Math.round(carbs),
fats:Math.round(fats)
};

}