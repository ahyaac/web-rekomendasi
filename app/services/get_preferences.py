from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import UserPreferences

async def get_user_preferences_text(user_id: int, db: AsyncSession):
    q = await db.execute(
        select(
            UserPreferences.environment,
            UserPreferences.tipe,
            UserPreferences.price_category
        ).where(UserPreferences.user_id == user_id)
    )

    result = q.first()

    if not result:
        return None  # atau nilai default

    environment, tipe, price = result
    # Gabungkan menjadi 1 string, contoh: "Murah, Sepi, Dekat"
    combined = f"{environment}, {tipe}, {price}"

    return combined
