import urllib.request
import json
import asyncio
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

@sio.on('simulate_code')
async def handle_simulate(sid, data):
    code = data.get("code", "")
    await sio.emit('serial_output', {'text': '=== Initiating Wokwi Compiler ==='}, room=sid)
    
    url = "https://hexi.wokwi.com/build"
    payload = {
         "format": "hex",
         "sketch": code
    }
    req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers={'Content-Type': 'application/json'})
    
    try:
        response = urllib.request.urlopen(req)
        result = json.loads(response.read())
        
        if result.get("stderr"):
            await sio.emit('serial_output', {'text': f"Compilation Error:\n{result['stderr']}"}, room=sid)
            await sio.emit('simulation_status', {'status': 'error'}, room=sid)
            return

        await sio.emit('serial_output', {'text': 'Compilation successful! Starting mock execution via wokwi workflow...'}, room=sid)
        
        for i in range(5):
            await asyncio.sleep(1)
            await sio.emit('serial_output', {'text': f'Serial output line {i+1} [Mock Wokwi Web Assembly]'}, room=sid)
            
        await sio.emit('serial_output', {'text': 'Simulation complete.'}, room=sid)
        await sio.emit('simulation_status', {'status': 'stopped'}, room=sid)
        
    except Exception as e:
        await sio.emit('serial_output', {'text': f"Compile Failed: {str(e)}"}, room=sid)
        await sio.emit('simulation_status', {'status': 'error'}, room=sid)

@sio.on('serial_input')
async def handle_serial_input(sid, data):
    await sio.emit('serial_output', {'text': f"Received command: {data.get('text', '')}"}, room=sid)
