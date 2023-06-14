"""create initial tables

Revision ID: b1b348e02d07
Revises: 
Create Date: 2023-04-25 20:23:37.794293

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b1b348e02d07'
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
    op.create_table(
        'prediction',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column("date_created", sa.Date, nullable=False),
        sa.Column('predictions', sa.Integer, nullable=False),
        sa.Column('user_id', sa.Integer, nullable=False),
    )
    print('done')


def downgrade():
    op.drop_table("user")
