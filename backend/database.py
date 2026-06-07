from motor.motor_asyncio import AsyncIOMotorClient
from config import settings
from bson import ObjectId
import copy
from datetime import datetime

# Global in-memory state for mock collections
MOCK_DATABASE_STATE = {
    "users": [],
    "detections": [],
    "login_history": [],
}

def matches_query(doc, query):
    if not query:
        return True
    for k, q_val in query.items():
        doc_val = doc.get(k)
        if isinstance(q_val, dict):
            for op, op_val in q_val.items():
                if op == "$gte":
                    if doc_val is None or doc_val < op_val:
                        return False
                elif op == "$lte":
                    if doc_val is None or doc_val > op_val:
                        return False
                elif op == "$in":
                    if doc_val not in op_val:
                        return False
                else:
                    if doc_val != op_val:
                        return False
        else:
            # Normalize comparisons for _id and general fields
            if k == "_id":
                doc_id_str = str(doc_val) if doc_val else ""
                q_val_str = str(q_val) if q_val else ""
                if doc_id_str != q_val_str:
                    return False
            else:
                doc_val_str = str(doc_val) if isinstance(doc_val, ObjectId) else doc_val
                q_val_str = str(q_val) if isinstance(q_val, ObjectId) else q_val
                if doc_val_str != q_val_str:
                    return False
    return True

class MockCursor:
    def __init__(self, items):
        self.items = list(items)
        self.index = 0

    def sort(self, key_or_list, direction=None):
        if isinstance(key_or_list, list):
            for key, dir_val in key_or_list:
                reverse = True if dir_val == -1 else False
                self.items.sort(key=lambda x: x.get(key, ""), reverse=reverse)
        else:
            key = key_or_list
            reverse = True if direction == -1 else False
            self.items.sort(key=lambda x: x.get(key, ""), reverse=reverse)
        return self

    def skip(self, n):
        self.items = self.items[n:]
        return self

    def limit(self, n):
        self.items = self.items[:n]
        return self

    def __aiter__(self):
        self.index = 0
        return self

    async def __anext__(self):
        if self.index < len(self.items):
            val = self.items[self.index]
            self.index += 1
            return val
        else:
            raise StopAsyncIteration

    async def to_list(self, length=None):
        if length is not None:
            return self.items[:length]
        return self.items

class MockCollection:
    def __init__(self, name):
        self.name = name
        if name not in MOCK_DATABASE_STATE:
            MOCK_DATABASE_STATE[name] = []
        self.items = MOCK_DATABASE_STATE[name]

    async def create_index(self, *args, **kwargs):
        return "mock_index"

    async def find_one(self, query):
        for item in self.items:
            if matches_query(item, query):
                return copy.deepcopy(item)
        return None

    async def insert_one(self, doc):
        doc = copy.deepcopy(doc)
        if "_id" not in doc:
            doc["_id"] = ObjectId()
        self.items.append(doc)
        
        class MockInsertResult:
            def __init__(self, inserted_id):
                self.inserted_id = inserted_id
        return MockInsertResult(doc["_id"])

    async def insert_many(self, docs):
        inserted_ids = []
        for doc in docs:
            doc = copy.deepcopy(doc)
            if "_id" not in doc:
                doc["_id"] = ObjectId()
            self.items.append(doc)
            inserted_ids.append(doc["_id"])
        
        class MockInsertManyResult:
            def __init__(self, inserted_ids):
                self.inserted_ids = inserted_ids
        return MockInsertManyResult(inserted_ids)

    async def update_one(self, query, update):
        modified_count = 0
        for item in self.items:
            if matches_query(item, query):
                if "$set" in update:
                    for k, v in update["$set"].items():
                        item[k] = copy.deepcopy(v)
                    modified_count = 1
                break
        
        class MockUpdateResult:
            def __init__(self, modified_count):
                self.modified_count = modified_count
        return MockUpdateResult(modified_count)

    async def delete_one(self, query):
        deleted_count = 0
        for idx, item in enumerate(self.items):
            if matches_query(item, query):
                self.items.pop(idx)
                deleted_count = 1
                break
        
        class MockDeleteResult:
            def __init__(self, deleted_count):
                self.deleted_count = deleted_count
        return MockDeleteResult(deleted_count)

    async def delete_many(self, query):
        deleted_count = 0
        for idx in range(len(self.items) - 1, -1, -1):
            if matches_query(self.items[idx], query):
                self.items.pop(idx)
                deleted_count += 1
        
        class MockDeleteResult:
            def __init__(self, deleted_count):
                self.deleted_count = deleted_count
        return MockDeleteResult(deleted_count)

    async def count_documents(self, query):
        count = 0
        for item in self.items:
            if matches_query(item, query):
                count += 1
        return count

    def find(self, query=None, projection=None):
        matched = []
        for item in self.items:
            if matches_query(item, query):
                doc = copy.deepcopy(item)
                if projection:
                    for k, v in projection.items():
                        if v == 0 and k in doc:
                            del doc[k]
                matched.append(doc)
        return MockCursor(matched)

    async def aggregate(self, pipeline):
        current_items = copy.deepcopy(self.items)

        for step in pipeline:
            operator = list(step.keys())[0]
            step_val = step[operator]

            if operator == "$match":
                current_items = [item for item in current_items if matches_query(item, step_val)]

            elif operator == "$group":
                group_id_expr = step_val.get("_id")
                group_key = group_id_expr.lstrip("$") if isinstance(group_id_expr, str) else group_id_expr
                
                groups = {}
                for item in current_items:
                    g_val = item.get(group_key)
                    if g_val not in groups:
                        groups[g_val] = []
                    groups[g_val].append(item)

                grouped_results = []
                for g_val, group_items in groups.items():
                    result_doc = {"_id": g_val}
                    for field_name, expr in step_val.items():
                        if field_name == "_id":
                            continue
                        expr_op = list(expr.keys())[0]
                        expr_val = expr[expr_op]

                        if expr_op == "$sum":
                            if expr_val == 1:
                                result_doc[field_name] = len(group_items)
                            else:
                                result_doc[field_name] = sum(item.get(expr_val.lstrip("$"), 0) for item in group_items)
                        elif expr_op == "$avg":
                            avg_field = expr_val.lstrip("$")
                            vals = [item.get(avg_field) for item in group_items if item.get(avg_field) is not None]
                            result_doc[field_name] = sum(vals) / len(vals) if vals else 0
                    grouped_results.append(result_doc)

                current_items = grouped_results

            elif operator == "$sort":
                for sort_field, dir_val in step_val.items():
                    reverse = True if dir_val == -1 else False
                    current_items.sort(key=lambda x: x.get(sort_field, 0), reverse=reverse)

        return MockCursor(current_items)

class MagicMockDB:
    def __init__(self):
        self.collections = {}

    def __getattr__(self, name):
        if name not in self.collections:
            self.collections[name] = MockCollection(name)
        return self.collections[name]

client: AsyncIOMotorClient = None
db = None

def seed_mock_users():
    # Pre-seed default user credentials in the mock database
    from passlib.context import CryptContext
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    
    users_list = MOCK_DATABASE_STATE["users"]
    emails = {u.get("email") for u in users_list}
    
    if "admin@emotionsense.ai" not in emails:
        users_list.append({
            "_id": ObjectId("650c8b9d997b6a4a1599e8b1"),
            "name": "System Administrator",
            "email": "admin@emotionsense.ai",
            "password": pwd_context.hash("admin123"),
            "role": "admin",
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat(),
        })
    if "demo@emotionsense.ai" not in emails:
        users_list.append({
            "_id": ObjectId("650c8b9d997b6a4a1599e8b2"),
            "name": "Demo User",
            "email": "demo@emotionsense.ai",
            "password": pwd_context.hash("demo123"),
            "role": "user",
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat(),
        })
    print("Pre-seeded demo and administrator credentials in the in-memory database.")

async def connect_db():
    global client, db
    try:
        client = AsyncIOMotorClient(settings.MONGODB_URL, serverSelectionTimeoutMS=2000)
        await client.admin.command('ping')
        db = client[settings.DATABASE_NAME]
        await db.detections.create_index([("user_id", 1), ("created_at", -1)])
        await db.detections.create_index([("user_id", 1), ("type", 1)])
        print(f"Connected to MongoDB: {settings.DATABASE_NAME} (Indexes configured)")
    except Exception as e:
        print(f"Could not connect to MongoDB: {e}")
        print("Using mock database for demo mode")
        client = None
        db = MagicMockDB()
        seed_mock_users()

async def close_db():
    global client
    if client:
        client.close()
        print(" MongoDB connection closed")

def get_db():
    global db
    if db is None:
        print("Database not connected, initializing MagicMockDB on the fly!")
        db = MagicMockDB()
        seed_mock_users()
    return db

