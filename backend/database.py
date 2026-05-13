from motor.motor_asyncio import AsyncIOMotorClient
from config import settings
from unittest.mock import MagicMock

class MagicMockDB:
    def __getattr__(self, name):
        mock_collection = MagicMock()
        mock_collection.find_one.return_value = None
        # Make it awaitable returning None
        async def mock_async_none(*args, **kwargs):
            return None
        mock_collection.find_one = mock_async_none
        mock_collection.insert_one = mock_async_none
        return mock_collection

client: AsyncIOMotorClient = None
db = None

async def connect_db():
    global client, db
    try:
        client = AsyncIOMotorClient(settings.MONGODB_URL, serverSelectionTimeoutMS=2000)
        # Try a quick ping to see if server is alive
        await client.admin.command('ping')
        db = client[settings.DATABASE_NAME]
        print(f"Connected to MongoDB: {settings.DATABASE_NAME}")
    except Exception as e:
        print(f"Could not connect to MongoDB: {e}")
        print("Using mock database for demo mode")
        client = None
        db = MagicMockDB()

async def close_db():
    global client
    if client:
        client.close()
        print("🔌 MongoDB connection closed")

def get_db():
    return db
