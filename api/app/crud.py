import uuid
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.models import Habit, HabitLog
from app.schemas import HabitCreate, HabitUpdate, HabitResponse


def _to_response(habit: Habit) -> HabitResponse:
    return HabitResponse(
        id=habit.id,
        name=habit.name,
        category=habit.category,
        archived=habit.archived,
        checkedDates=sorted(log.checked_date for log in habit.logs),
    )


def get_all(db: Session, user_id: str) -> list[HabitResponse]:
    habits = db.query(Habit).filter(Habit.user_id == user_id).all()
    return [_to_response(h) for h in habits]


def get_by_id(db: Session, habit_id: str, user_id: str) -> HabitResponse | None:
    habit = db.query(Habit).filter(Habit.id == habit_id, Habit.user_id == user_id).first()
    return _to_response(habit) if habit else None


def create(db: Session, data: HabitCreate, user_id: str) -> HabitResponse:
    habit = Habit(id=str(uuid.uuid4()), user_id=user_id, name=data.name, category=data.category)
    db.add(habit)
    db.commit()
    db.refresh(habit)
    return _to_response(habit)


def update(db: Session, habit_id: str, data: HabitUpdate, user_id: str) -> HabitResponse | None:
    habit = db.query(Habit).filter(Habit.id == habit_id, Habit.user_id == user_id).first()
    if not habit:
        return None
    if data.name is not None:
        habit.name = data.name
    if data.category is not None:
        habit.category = data.category
    if data.archived is not None:
        habit.archived = data.archived
    db.commit()
    db.refresh(habit)
    return _to_response(habit)


def delete(db: Session, habit_id: str, user_id: str) -> bool:
    habit = db.query(Habit).filter(Habit.id == habit_id, Habit.user_id == user_id).first()
    if not habit:
        return False
    db.delete(habit)
    db.commit()
    return True


def add_log(db: Session, habit_id: str, date: str, user_id: str) -> HabitResponse | None:
    habit = db.query(Habit).filter(Habit.id == habit_id, Habit.user_id == user_id).first()
    if not habit:
        return None
    log = HabitLog(habit_id=habit_id, checked_date=date)
    db.add(log)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()  # already checked — treat as success
    db.refresh(habit)
    return _to_response(habit)


def remove_log(db: Session, habit_id: str, date: str, user_id: str) -> HabitResponse | None:
    habit = db.query(Habit).filter(Habit.id == habit_id, Habit.user_id == user_id).first()
    if not habit:
        return None
    log = (
        db.query(HabitLog)
        .filter(HabitLog.habit_id == habit_id, HabitLog.checked_date == date)
        .first()
    )
    if log:
        db.delete(log)
        db.commit()
        db.refresh(habit)
    return _to_response(habit)
