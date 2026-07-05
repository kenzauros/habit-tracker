from pydantic import BaseModel


class UserCreate(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class HabitCreate(BaseModel):
    name: str
    category: str | None = None


class HabitUpdate(BaseModel):
    name: str | None = None
    category: str | None = None
    archived: bool | None = None


class HabitResponse(BaseModel):
    id: str
    name: str
    category: str | None
    archived: bool
    checkedDates: list[str]

    model_config = {"from_attributes": True}


class LogCreate(BaseModel):
    date: str  # YYYY-MM-DD
