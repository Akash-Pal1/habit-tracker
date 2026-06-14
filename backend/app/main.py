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


def calculate_streak(completions):
    if not completions:
        return 0
    
    dates = sorted([c.completed_date for c in completions], reverse=True)
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