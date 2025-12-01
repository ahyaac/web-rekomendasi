# app/deps.py
from fastapi import Request, HTTPException
from jose import JWTError
from .auth import decode_access_token

async def get_current_user_id(request: Request) -> int:
    token = request.cookies.get("access_token")
    if not token:
        return None
    try:
        payload = decode_access_token(token)
        user_id = payload.get("user_id")
        if user_id is None:
            return None
        return int(user_id)
    except JWTError:
        return None