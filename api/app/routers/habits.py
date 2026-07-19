from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.crud.habits import (
    DUPLICATE,
    EMPTY,
    add_check_in,
    create_habit,
    get_owned_habit,
    list_habits,
    serialize_habit,
    set_archived,
    update_habit,
)
from app.database import get_db
from app.models.habit import Habit
from app.models.user import User
from app.schemas.habit import CheckInRequest, HabitCreateRequest, HabitResponse, HabitUpdateRequest

router = APIRouter(prefix="/habits", tags=["habits"])

_ERROR_MESSAGES = {
    EMPTY: "習慣名を入力してください。",
    DUPLICATE: "同じ名前の習慣がすでにあります。",
}


def _raise_for_error(result: str) -> None:
    status_code = status.HTTP_422_UNPROCESSABLE_CONTENT if result == EMPTY else status.HTTP_409_CONFLICT
    raise HTTPException(status_code=status_code, detail=_ERROR_MESSAGES[result])


def _get_owned_or_404(db: Session, current_user: User, habit_id: str) -> Habit:
    habit = get_owned_habit(db, current_user.id, habit_id)
    if habit is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="習慣が見つかりません。")
    return habit


@router.get("", response_model=list[HabitResponse])
def get_habits(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
) -> list[HabitResponse]:
    return [serialize_habit(habit) for habit in list_habits(db, current_user.id)]


@router.post("", response_model=HabitResponse, status_code=status.HTTP_201_CREATED)
def post_habit(
    payload: HabitCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> HabitResponse:
    result = create_habit(db, current_user.id, payload.name, payload.category)
    if isinstance(result, str):
        _raise_for_error(result)
    return serialize_habit(result)


@router.patch("/{habit_id}", response_model=HabitResponse)
def patch_habit(
    habit_id: str,
    payload: HabitUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> HabitResponse:
    habit = _get_owned_or_404(db, current_user, habit_id)
    result = update_habit(db, habit, payload.name, payload.category)
    if isinstance(result, str):
        _raise_for_error(result)
    return serialize_habit(result)


@router.post("/{habit_id}/check-ins", response_model=HabitResponse)
def post_check_in(
    habit_id: str,
    payload: CheckInRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> HabitResponse:
    habit = _get_owned_or_404(db, current_user, habit_id)
    return serialize_habit(add_check_in(db, habit, payload.date))


@router.post("/{habit_id}/archive", response_model=HabitResponse)
def post_archive(
    habit_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> HabitResponse:
    habit = _get_owned_or_404(db, current_user, habit_id)
    return serialize_habit(set_archived(db, habit, True))


@router.post("/{habit_id}/unarchive", response_model=HabitResponse)
def post_unarchive(
    habit_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> HabitResponse:
    habit = _get_owned_or_404(db, current_user, habit_id)
    return serialize_habit(set_archived(db, habit, False))
