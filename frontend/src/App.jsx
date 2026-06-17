import { useState, useEffect } from "react"
import axios from "axios"
import HabitForm from "./components/HabitForm"
import HabitCard from "./components/HabitCard"

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

export default function App() {
  const [habits, setHabits] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchHabits()
    // const interval = setInterval(fetchHabits, 5000)
    // return () => clearInterval(interval)
  }, [])

  async function fetchHabits(){
    setLoading(true)
    setError("")
    try {
    const habitRes = await axios.get(`${API}/habits`)
    setHabits(habitRes.data)
    } catch(err){
      setError(err.response?.data?.detail?.[0]?.msg || "Something went wrong")
    } finally{
      setLoading(false)
    }   
  }

  async function handleAdd(name, description){
    setError("")
    try {
      await axios.post(`${API}/habits`,{
        name, description
      })
      fetchHabits()
    }catch(err){
      setError(err.response?.data?.detail?.[0]?.msg || "Something went wrong")
    }
  }

  async function handelDelete(id){
    await axios.delete(`${API}/habits/${id}`)
    fetchHabits()
  }

  async function handleCompletion(habit_id) {
    setError("")
    try {
      await axios.post(`${API}/habits/${habit_id}/complete`)
      fetchHabits()
    } catch(err){
      setError(err.response?.data?.detail || "Already Completed")
      setTimeout(() => setError(""),3000)
    }
  }

  if (loading) return <p> Loading ...</p>
  // if (error) return <p>{error}</p>

  return (
    <div className="bg-gray-50 p-6">
    <div className="mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Habit Tracker</h1>
    <div>
      {error && <p className="text-red-500">{error}</p>}
      <HabitForm onAdd={handleAdd}></HabitForm>
      {habits.length === 0 ? (
      <p className="font-bold text-red-600 mt-5">No habits yet. Add one above</p>
        ) : (
          habits.map(habit => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onComplete={handleCompletion}
              onDelete={handelDelete}
            />
          ))
        )}
    </div>
    </div>
    </div>
  )
}