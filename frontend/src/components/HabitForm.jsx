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
        <div className="bg-white rounded-xl p-6 shadow-sm border-gray-100 mb-8">
        <h2 className="text-2xl font-bold text-black-600 mb-6 text-center">Add Habit</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <input
            type="text"
            placeholder="Name of Habit"
            value={name}
            onChange={(e)=> setName(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <textarea 
            type="text"
            placeholder="Description of Habit"
            value={description}
            onChange={(e)=> setDescription(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            {error && <p>{error}</p>}
            <button type="submit" className="col-span-2 bg-blue-600 text-white rounded-lg py-2 text-sm font-medium">Add Habit</button>

        </form>
        </div>
    );

}