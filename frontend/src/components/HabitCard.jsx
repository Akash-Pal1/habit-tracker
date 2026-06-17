import { useState } from "react";
import HeatMap from "./HeatMap";

function HabitCard({habit, onComplete, onDelete}){
    return (
        <div>
            <p>{habit.name}</p>
            <p>{habit.description}</p>
            <p>{habit.streak > 0 ? `${habit.streak} day streak` : "No streak yet"}</p>
            <button onClick={() => onComplete(habit.id)} disabled={habit.completed_today}> Mark Complete</button>       
            <button onClick={() => onDelete(habit.id)}> Delete Habit</button>      
            <HeatMap habitId={habit.id} /> 
        </div>
    )
}

export default HabitCard;