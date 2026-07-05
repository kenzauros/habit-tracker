"""add users

Revision ID: b1c2d3e4f5a6
Revises: 3538baec25d7
Create Date: 2026-06-26 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = 'b1c2d3e4f5a6'
down_revision: Union[str, Sequence[str], None] = '3538baec25d7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'users',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('hashed_password', sa.String(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email'),
    )
    # SQLite does not support ADD CONSTRAINT via ALTER TABLE; FK is enforced by the ORM
    op.add_column('habits', sa.Column('user_id', sa.String(), nullable=True))


def downgrade() -> None:
    op.drop_column('habits', 'user_id')
    op.drop_table('users')
