from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app import crud
from app.auth import get_current_user
from app.database import get_db
from app.models import User
from app.schemas import HabitCreate, HabitResponse, HabitUpdate, LogCreate

router = APIRouter(prefix="/habits", tags=["habits"])


@router.get("", response_model=list[HabitResponse])
def list_habits(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return crud.get_all(db, current_user.id)


@router.post("", response_model=HabitResponse, status_code=status.HTTP_201_CREATED)
def create_habit(
    body: HabitCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return crud.create(db, body, current_user.id)


@router.get("/{habit_id}", response_model=HabitResponse)
def get_habit(
    habit_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    habit = crud.get_by_id(db, habit_id, current_user.id)
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    return habit


@router.put("/{habit_id}", response_model=HabitResponse)
def update_habit(
    habit_id: str,
    body: HabitUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    habit = crud.update(db, habit_id, body, current_user.id)
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    return habit


@router.delete("/{habit_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_habit(
    habit_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not crud.delete(db, habit_id, current_user.id):
        raise HTTPException(status_code=404, detail="Habit not found")


@router.post("/{habit_id}/logs", response_model=HabitResponse)
def add_log(
    habit_id: str,
    body: LogCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    habit = crud.add_log(db, habit_id, body.date, current_user.id)
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    return habit


@router.delete("/{habit_id}/logs/{date}", response_model=HabitResponse)
def remove_log(
    habit_id: str,
    date: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    habit = crud.remove_log(db, habit_id, date, current_user.id)
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    return habit
