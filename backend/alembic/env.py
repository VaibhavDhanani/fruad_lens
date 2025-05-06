import asyncio
from logging.config import fileConfig
import os

from sqlalchemy.ext.asyncio import create_async_engine
from alembic import context
from dotenv import load_dotenv

# Load .env variables
load_dotenv()

# Alembic Config object
config = context.config

# Set up logging
fileConfig(config.config_file_name)

# Get DB details from .env
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME")

# Construct async DATABASE_URL
DATABASE_URL = f"postgresql+asyncpg://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# print(f"\n\n{DATABASE_URL}\n\n")

# Set in Alembic config
config.set_main_option("sqlalchemy.url", DATABASE_URL)

# Import your models' metadata
from app.models.models import Base  # make sure all models are imported
target_metadata = Base.metadata

# Async migration function
def run_migrations_offline():
    """Run migrations in 'offline' mode."""
    context.configure(
        url=DATABASE_URL,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

async def run_migrations_online():
    """Run migrations in 'online' mode."""
    connectable = create_async_engine(DATABASE_URL, poolclass=None)

    async with connectable.connect() as connection:
        def do_migrations(sync_conn):
            context.configure(
                connection=sync_conn,
                target_metadata=target_metadata,
            )
            with context.begin_transaction():
                context.run_migrations()

        await connection.run_sync(do_migrations)

    await connectable.dispose()


# Main runner
if context.is_offline_mode():
    run_migrations_offline()
else:
    asyncio.run(run_migrations_online())
