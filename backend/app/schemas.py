from pydantic import BaseModel, field_validator
from datetime import datetime
from typing import Optional

class HabitCreate(BaseModel):
    name: str
    description: Optional[str] = None

    @field_validator("name")
    def type_must_be_valid(cls, v):
        if v.strip() == "":
            raise ValueError("Name should notbe blank")
        return v

class HabitResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    created_at: datetime
    streak: int
    completed_today: bool

    class Config:
        from_attributes = True

class CompletionResponse(BaseModel):
    id: int
    habit_id: int
    completed_date: datetime

    class Config:
        from_attributes = True

