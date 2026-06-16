import { useState } from "react";

export default function HabitForm({onAdd}){
    const [name, setName] = useState([])
    const [description, setDescription] = useState([])
    const [error, setError] = useState("")

    function handleSubmit(e){
        e.preventDefault();

        if(!(name.trim())){
            setError("Name of Habit should be something")
            return;
        }

        setError("")
        onAdd(name, description)
        setDescription("")
        setName("")

    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Add Habit</h2>
            <input
            type="text"
            placeholder="Name of Habit"
            value={name}
            onChange={(e)=> setName(e.target.value)}
            />

            <textarea 
            type="text"
            placeholder="Description of Habit"
            value={description}
            onChange={(e)=> setDescription(e.target.value)}
            />

            {error && <p>{error}</p>}
            <button type="submit">Add Habit</button>

        </form>
    );

}