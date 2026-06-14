from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from app import models, schemas
from app.database import engine, get_db
from datetime import date, timedelta

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Habit Tracker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*"
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


def calculate_streak(dates):
    if not dates:
        return 0
    
    dates = sorted(dates, reverse=True)
    # dates = sorted(completions, reverse=True) -- useed for checking and testing purpose


    if dates[0] < date.today() - timedelta(days=1):
        return 0 
    
    streak = 1
    for i in range(1, len(dates)):
        if(dates[i-1] - dates[i]).days == 1:
            streak +=1 
        else:
            break

    return streak

@app.get("/")
def root():
    return {"message": "Habit Tracker API is running"}

@app.post("/habits", response_model=schemas.HabitCreate)
def create_habit(habit: schemas.HabitCreate, db: Session = Depends(get_db)):
    db_habit = models.Habit(**habit.model_dump())
    db.add(db_habit)
    db.commit()
    db.refresh(db_habit)
    return db_habit

@app.get("/habits", response_model=List[schemas.HabitResponse])
def get_habits(db: Session = Depends(get_db)):
    habits = db.query(models.Habit).all()

    result = []
    for habit in habits:
        dates = [c.completed_date for c in habit.completions]

        streak = calculate_streak(dates)
        completed_today = date.today() in dates

        result.append({
            "id": habit.id,
            "name":habit.name,
            "description": habit.description,
            "created_at": habit.created_at,
            "streak": streak, 
            "completed_today":completed_today
        })

    return result
    
@app.delete("/delete/{id}")
def delete_habits(id: int, db: Session = Depends(get_db)):
    habit = db.query(models.Habit).filter(models.Habit.id == id).first()
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    db.delete(habit)
    db.commit()
    return {"message": "Transaction deleted"}


@app.post("/habits/{habit_id}/complete", response_model=schemas.CompletionResponse)
def complete_habit(habit_id : int , db: Session = Depends(get_db)):
    habit_row = db.query(models.Habit).filter(models.Habit.id == habit_id).first()
    if not habit_row:
        raise HTTPException(status_code=404, detail="Habit not Found")
    habit_completion = db.query(models.HabitCompletion).filter(models.HabitCompletion.habit_id == habit_id, models.HabitCompletion.completed_date == date.today()).first()
    if habit_completion:
        raise HTTPException(status_code=400, detail="Habit already Completed")
    

    new_completion =  models.HabitCompletion(
        habit_id= habit_id,
        completed_date= date.today()
    )
    db.add(new_completion)
    db.commit()
    db.refresh(new_completion)
    return new_completion

@app.get("/habits/{habit_id}/completions", response_model=List[schemas.CompletionResponse])
def get_habits_completions(habit_id: int, db: Session = Depends(get_db)):
    habits_completions = db.query(models.HabitCompletion).filter(models.HabitCompletion.habit_id == habit_id).all()
    return habits_completions