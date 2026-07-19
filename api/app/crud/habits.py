from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.check_in import CheckIn
from app.models.habit import UNCATEGORIZED, Habit
from app.schemas.habit import HabitResponse

DUPLICATE = "duplicate"
EMPTY = "empty"


def serialize_habit(habit: Habit) -> HabitResponse:
    check_ins = sorted(check_in.date for check_in in habit.check_ins)
    return HabitResponse(
        id=habit.id,
        name=habit.name,
        createdAt=habit.created_at,
        checkIns=check_ins,
        archived=habit.archived,
        category=habit.category,
    )


def normalize_category(category: str) -> str:
    return category.strip() or UNCATEGORIZED


def list_habits(db: Session, user_id: str) -> list[Habit]:
    return list(
        db.scalars(select(Habit).where(Habit.user_id == user_id).order_by(Habit.created_at))
    )


def get_owned_habit(db: Session, user_id: str, habit_id: str) -> Habit | None:
    return db.scalar(
        select(Habit).where(Habit.id == habit_id, Habit.user_id == user_id)
    )


def create_habit(db: Session, user_id: str, name: str, category: str) -> Habit | str:
    trimmed = name.strip()
    if not trimmed:
        return EMPTY

    habit = Habit(user_id=user_id, name=trimmed, category=normalize_category(category))
    db.add(habit)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        return DUPLICATE
    db.refresh(habit)
    return habit


def update_habit(db: Session, habit: Habit, name: str, category: str) -> Habit | str:
    trimmed = name.strip()
    if not trimmed:
        return EMPTY

    previous_name, previous_category = habit.name, habit.category
    habit.name = trimmed
    habit.category = normalize_category(category)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        habit.name, habit.category = previous_name, previous_category
        return DUPLICATE
    db.refresh(habit)
    return habit


def add_check_in(db: Session, habit: Habit, date: str) -> Habit:
    exists = db.scalar(
        select(CheckIn).where(CheckIn.habit_id == habit.id, CheckIn.date == date)
    )
    if exists is None:
        db.add(CheckIn(habit_id=habit.id, date=date))
        try:
            db.commit()
        except IntegrityError:
            db.rollback()
    db.refresh(habit)
    return habit


def set_archived(db: Session, habit: Habit, archived: bool) -> Habit:
    habit.archived = archived
    db.commit()
    db.refresh(habit)
    return habit
