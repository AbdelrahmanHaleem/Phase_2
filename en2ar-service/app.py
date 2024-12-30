from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, Optional
import uuid
from transformers import MarianMTModel, MarianTokenizer
import asyncio
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="Translation Service - English to Arabic")

# Load the translation model and tokenizer
model_name = "Helsinki-NLP/opus-mt-en-ar"
tokenizer = MarianTokenizer.from_pretrained(model_name)
model = MarianMTModel.from_pretrained(model_name)

# Store translation jobs
translation_jobs: Dict[str, Dict] = {}

class TranslationRequest(BaseModel):
    text: str

class TranslationResponse(BaseModel):
    job_id: str
    status: str

class TranslationStatus(BaseModel):
    job_id: str
    status: str
    result: Optional[str] = None
    error: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None

async def perform_translation(job_id: str, text: str):
    try:
        # Tokenize and translate
        inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=512)
        translated = model.generate(**inputs)
        result = tokenizer.decode(translated[0], skip_special_tokens=True)

        # Update job status
        translation_jobs[job_id].update({
            "status": "completed",
            "result": result,
            "completed_at": datetime.now()
        })
    except Exception as e:
        translation_jobs[job_id].update({
            "status": "failed",
            "error": str(e),
            "completed_at": datetime.now()
        })

@app.post("/translate/en2ar", response_model=TranslationResponse)
async def translate_text(request: TranslationRequest):
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")

    # Create a new translation job
    job_id = str(uuid.uuid4())
    translation_jobs[job_id] = {
        "status": "processing",
        "created_at": datetime.now()
    }

    # Start translation in background
    asyncio.create_task(perform_translation(job_id, request.text))

    return TranslationResponse(job_id=job_id, status="processing")

@app.get("/translate/en2ar/status/{job_id}", response_model=TranslationStatus)
async def get_translation_status(job_id: str):
    if job_id not in translation_jobs:
        raise HTTPException(status_code=404, detail="Translation job not found")

    job = translation_jobs[job_id]
    return TranslationStatus(
        job_id=job_id,
        status=job["status"],
        result=job.get("result"),
        error=job.get("error"),
        created_at=job["created_at"],
        completed_at=job.get("completed_at")
    )

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "translation-en2ar", "timestamp": datetime.now().isoformat()}

if __name__ == '__main__':
    port = int(os.getenv('PORT', 8006))
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=port)
