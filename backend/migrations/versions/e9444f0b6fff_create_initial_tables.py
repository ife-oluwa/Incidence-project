"""create initial tables

Revision ID: e9444f0b6fff
Revises: 
Create Date: 2023-06-06 08:30:51.191687

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e9444f0b6fff'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "user",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("email", sa.String(50), nullable=False),
        sa.Column("first_name", sa.String(100), nullable=False),
        sa.Column("last_name", sa.String(100)),
        sa.Column("address", sa.String(100)),
        sa.Column("hashed_password", sa.String(100), nullable=False),
        sa.Column("is_active", sa.Boolean, nullable=False),
        sa.Column("is_superuser", sa.Boolean, nullable=False),
    )
    print('done')


def downgrade():
    op.drop_table("user")
