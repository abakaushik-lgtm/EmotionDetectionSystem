import asyncio
from typing import Dict, Set
from fastapi import WebSocket

class ConnectionManager:
    """WebSocket connection manager for real-time emotion detection updates."""

    def __init__(self):
        self.active_connections: Dict[str, Set[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = set()
        self.active_connections[user_id].add(websocket)

    def disconnect(self, websocket: WebSocket, user_id: str):
        if user_id in self.active_connections:
            self.active_connections[user_id].discard(websocket)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]

    async def send_to_user(self, user_id: str, message: dict):
        if user_id in self.active_connections:
            disconnected = set()
            for ws in self.active_connections[user_id]:
                try:
                    await ws.send_json(message)
                except Exception:
                    disconnected.add(ws)
            for ws in disconnected:
                self.active_connections[user_id].discard(ws)

    async def broadcast(self, message: dict):
        for user_id in list(self.active_connections.keys()):
            await self.send_to_user(user_id, message)

    @property
    def online_count(self) -> int:
        return sum(len(conns) for conns in self.active_connections.values())

manager = ConnectionManager()
