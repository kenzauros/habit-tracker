from pydantic import BaseModel, Field


class HabitCreateRequest(BaseModel):
    name: str = Field(min_length=1)
    category: str = ""


class HabitUpdateRequest(BaseModel):
    name: str = Field(min_length=1)
    category: str = ""


class CheckInRequest(BaseModel):
    date: str = Field(pattern=r"^\d{4}-\d{2}-\d{2}$")


class HabitResponse(BaseModel):
    id: str
    name: str
    createdAt: str
    checkIns: list[str]
    archived: bool
    category: str
