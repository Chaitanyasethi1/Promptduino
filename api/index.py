import urllib.request
import json
import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from db import models, database

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="PromptDuino Backend API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SimulationRequest(BaseModel):
    code: str

@app.post("/api/simulate")
async def simulate(data: SimulationRequest):
    code = data.code
    logs = ['=== Initiating Wokwi Compiler ===']
    
    url = "https://hexi.wokwi.com/build"
    payload = {
         "format": "hex",
         "sketch": code
    }
    
    try:
        req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers={'Content-Type': 'application/json'})
        response = urllib.request.urlopen(req)
        result = json.loads(response.read())
        
        if result.get("stderr"):
            logs.append(f"Compilation Error:\n{result['stderr']}")
            return {"status": "error", "logs": logs}

        logs.append('Compilation successful! Starting mock execution via wokwi REST backend...')
        
        for i in range(5):
            logs.append(f'Serial output line {i+1} [Mock Wokwi Web Assembly]')
            
        logs.append('Simulation complete.')
        return {"status": "success", "logs": logs}
        
    except Exception as e:
        logs.append(f"Compile Failed: {str(e)}")
        return {"status": "error", "logs": logs}

@app.get("/api/ping")
async def ping():
    return {"status": "ok", "message": "PromptDuino Backend is running."}
