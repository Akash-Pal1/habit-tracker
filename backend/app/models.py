from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, UniqueConstraint, Date
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class Habit(Base):
    __tablename__ = "habits"

    id =  Column(Integer, primary_key=True)
    name =  Column(String, nullable=False)
    description =  Column(String, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    completions = relationship("HabitCompletion", back_populates="habit", cascade="all, delete-orphan")

class HabitCompletion(Base):
    __tablename__ = 'habit_completions'

    id = Column(Integer, primary_key=True)
    habit_id = Column(Integer, ForeignKey("habits.id"))
    completed_date = Column(Date,nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    habit = relationship("Habit", back_populates="completions")

    __table_args__ = (
        UniqueConstraint("habit_id", "completed_date", name="uq_habit_date"),
    )