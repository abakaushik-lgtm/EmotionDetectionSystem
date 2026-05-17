import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def test():
    c = AsyncIOMotorClient("mongodb://localhost:27017", serverSelectionTimeoutMS=2000)
    await c.admin.command("ping")
    print("MongoDB connected!")
    db = c["emotionsense"]
    print("Collections:", await db.list_collection_names())
    users = await db.users.find().to_list(100)
    print(f"Users in DB: {len(users)}")
    for u in users:
        print(f"  - {u.get('email')} (name: {u.get('name')})")
    c.close()

asyncio.run(test())
