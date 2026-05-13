import asyncio
import sys
import os

# Add the parent directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import connect_db, get_db

async def check_user(email):
    await connect_db()
    db = get_db()
    user = await db.users.find_one({"email": email})
    if user:
        print(f"User found: {user['email']}")
        print(f"Hashed password: {user['password']}")
        print(f"Role: {user['role']}")
    else:
        print("User not found.")

if __name__ == "__main__":
    email = sys.argv[1] if len(sys.argv) > 1 else "admin@emotionsense.ai"
    asyncio.run(check_user(email))
