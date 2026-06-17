import { useState } from "react";
import HeatMap from "./HeatMap";

function HabitCard({habit, onComplete, onDelete}){
    return (
        <div className="bg-gray rounded-xl p-4 shadow-md border border-gray-100 mb-10">
            <div className="grid grid-cols-3 gap-4">
                <p className="text-center font-bold text-xl text-gray-600 mb-1"> Habit Name </p>
                <p className="text-center font-bold text-xl text-gray-600 mb-1"> Habit Description </p>
                <p className="text-center font-bold text-xl text-gray-600 mb-1"> Streak </p>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                <p className="text-xl font-bold text-black-100">{habit.name}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                <p className="text-xl font-bold text-gray-100-400 text-black-100">{habit.description}</p>
            </div>
            <div className={`bg-white rounded-xl p-4 shadow-md font-bold border border-gray-100 ${habit.streak > 0 ? "text-green-600" : "text-red-600"}`}>
                <p>{habit.streak > 0 ? `${habit.streak} day streak` : "No streak yet"}</p>
            </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-8">
            <button onClick={() => onComplete(habit.id)} disabled={habit.completed_today}
              className={` text-white rounded-lg py-2 text-sm font-medium ${habit.completed_today ? "bg-gray-600" : "bg-green-600"}`}
            > {habit.completed_today ? "Completed Today" : "Mark Complete"}</button>       
            <button onClick={() => onDelete(habit.id)}
              className="bg-red-600 text-white rounded-lg py-2 text-sm font-medium"
            > Delete Habit</button>  
            </div>    
            <HeatMap habitId={habit.id} /> 
        </div>
    )
}

export default HabitCard;