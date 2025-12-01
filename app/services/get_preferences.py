from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import UserPreferences

async def get_user_preferences_text(user_id: int, db: AsyncSession):
    q = await db.execute(
        select(
            UserPreferences.embedding,
        ).where(UserPreferences.user_id == user_id)
    )

    result = q.first()

    if not result:
        return None  # atau nilai default

    return result[0]