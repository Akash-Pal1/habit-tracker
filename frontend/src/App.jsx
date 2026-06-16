import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"
import axios from "axios"
import HabitForm from "./components/HabitForm"

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

export default function App() {
  const [habit, setHabit] = useState([])
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
    setHabit(habitRes.data)
    } catch(err){
      setError(err.response?.data?.details?.[0]?.msg || "Something went wrong")
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
      setError(err.response?.data?.details?.[0]?.msg || "Something went wrong")
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
      setError(err.response?.data?.details?.[0]?.msg || "Something went wrong")
    }
  }

  if (loading) return <p> Loading ...</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      <HabitForm onAdd={handleAdd}></HabitForm>
    </div>
  )
}