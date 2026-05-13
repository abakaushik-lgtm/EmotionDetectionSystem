import asyncio
import sys
import os

# Add the parent directory to sys.path so we can import from database and middleware
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import connect_db, get_db
from middleware.auth_middleware import hash_password
from datetime import datetime

async def seed_user(name, email, password, role="user"):
    await connect_db()
    db = get_db()
    
    if hasattr(db, '__class__') and db.__class__.__name__ == 'MagicMockDB':
        print("CRITICAL: Could not connect to real MongoDB. User will not be saved.")
        return

    # Check if user already exists
    existing = await db.users.find_one({"email": email})
    if existing:
        print(f"User with email {email} already exists.")
        return

    user_doc = {
        "name": name,
        "email": email,
        "password": hash_password(password),
        "role": role,
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat(),
    }
    
    result = await db.users.insert_one(user_doc)
    print(f"User created successfully with ID: {result.inserted_id}")

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python seed_user.py <name> <email> <password> [role]")
        sys.exit(1)
    
    name = sys.argv[1]
    email = sys.argv[2]
    password = sys.argv[3]
    role = sys.argv[4] if len(sys.argv) > 4 else "user"
    
    asyncio.run(seed_user(name, email, password, role))
