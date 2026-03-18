from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import socketio
from db import models, database

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="PromptDuino Backend")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup Socket.io
sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins='*')
socket_app = socketio.ASGIApp(sio, other_asgi_app=app)

@app.get("/")
async def root():
    return {"status": "ok", "message": "PromptDuino Backend is running."}

@sio.on('connect')
async def connect(sid, environ):
    print(f"Client connected: {sid}")

@sio.on('disconnect')
async def disconnect(sid):
    print(f"Client disconnected: {sid}")

@sio.on('chat_message')
async def handle_message(sid, data):
    print(f"Received message from {sid}: {data}")
    await sio.emit('agent_reply', {'message': f"Received your prompt: {data}"}, room=sid)
