from sqlalchemy import ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.user import _now_iso


class CheckIn(Base):
    __tablename__ = "check_ins"
    __table_args__ = (UniqueConstraint("habit_id", "date", name="uq_check_ins_habit_id_date"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    habit_id: Mapped[str] = mapped_column(
        String, ForeignKey("habits.id", ondelete="CASCADE"), nullable=False, index=True
    )
    date: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[str] = mapped_column(String, nullable=False, default=_now_iso)

    habit: Mapped["Habit"] = relationship(back_populates="check_ins")
