import { useEffect, useState } from "react";
import axios from "axios"


const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

export default function HeatMap({habitId}){
    const [completions, setCompletions] = useState([])

    useEffect(()=> {
        async function fetchCompletions(){
            try {
                const response = await axios.get(
                    `${API}/habits/${habitId}/completions`
                )
                const dates = response.data.map(
                item => item.completed_date
                )   
            setCompletions(dates)
            console.log("API Dates: ",dates)
        }catch(err){
            console.error("Failed to fetch Completions");
        }
    }
    fetchCompletions()
    },[habitId])

    const completionSet = new Set(completions);
    const dates = [];
    let previousMonth = -1;
    const monthLabels = [];
    for(let i = 364; i >=0; i--){
        const date = new Date();
        date.setDate(date.getDate()-i);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        const dateString = `${year}-${month}-${day}`;
        dates.push(dateString);

        const currentMonth = date.getMonth();
        if(currentMonth !== previousMonth){
            monthLabels.push({
                month: date.toLocaleString("default",{month: "short"}),column: Math.floor((364-i)/7), 
            });
            previousMonth = currentMonth;
        }
        if (
            monthLabels.length > 1 &&
            monthLabels[0].month === monthLabels[monthLabels.length - 1].month
            ) {
            monthLabels.shift();
        }
        
    }
    // console.log(dates.slice(-5))
    // console.log("Completion Set:",completionSet)
    return (
        <div>
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(53, 15px)",
                gap: "25px",
                marginBottom: "10px",
                fontSize: "15px",
            }}
            >
            {monthLabels.map((label) => (
                <div
                key={`${label.month}-${label.column}`}
                style={{
                    gridColumn: label.column + 1,
                    whiteSpace:"nowrap"
                }}
                >
                {label.month}
                </div>
            ))}
            </div>

        <div style ={{display:"grid", gridTemplateRows: "repeat(7,12px)",gridAutoFlow:"column",gap:"3px"}}>
            {dates.map(date => (
                <div
                key={date}
                title={date}
                style={{
                    width: "12px",
                    height: "12px",
                    backgroundColor: completionSet.has(date)
                    ? "green"
                    : "lightgray"
                }}
                />
            ))}
        </div>
        </div>
    )
}