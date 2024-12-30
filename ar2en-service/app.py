from flask import Flask, request, jsonify
from flask_restful import Api, Resource
from transformers import MarianMTModel, MarianTokenizer
import torch
import uuid
from datetime import datetime
import threading
from typing import Dict
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
api = Api(app)

# Load the translation model and tokenizer
model_name = "Helsinki-NLP/opus-mt-ar-en"
tokenizer = MarianTokenizer.from_pretrained(model_name)
model = MarianMTModel.from_pretrained(model_name)

# Store translation jobs
translation_jobs: Dict[str, Dict] = {}

def perform_translation(job_id: str, text: str):
    try:
        # Tokenize and translate
        inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=512)
        with torch.no_grad():
            translated = model.generate(**inputs)
        result = tokenizer.decode(translated[0], skip_special_tokens=True)

        # Update job status
        translation_jobs[job_id].update({
            "status": "completed",
            "result": result,
            "completed_at": datetime.now().isoformat()
        })
    except Exception as e:
        translation_jobs[job_id].update({
            "status": "failed",
            "error": str(e),
            "completed_at": datetime.now().isoformat()
        })

class TranslateAR2EN(Resource):
    def post(self):
        data = request.get_json()
        
        if not data or 'text' not in data:
            return {"error": "No text provided"}, 400
            
        text = data['text'].strip()
        if not text:
            return {"error": "Text cannot be empty"}, 400

        # Create a new translation job
        job_id = str(uuid.uuid4())
        translation_jobs[job_id] = {
            "status": "processing",
            "created_at": datetime.now().isoformat()
        }

        # Start translation in a separate thread
        thread = threading.Thread(target=perform_translation, args=(job_id, text))
        thread.start()

        return {
            "job_id": job_id,
            "status": "processing"
        }, 202

class TranslationStatus(Resource):
    def get(self, job_id):
        if job_id not in translation_jobs:
            return {"error": "Translation job not found"}, 404

        return translation_jobs[job_id], 200

class HealthCheck(Resource):
    def get(self):
        return {
            "status": "healthy",
            "service": "translation-ar2en",
            "timestamp": datetime.now().isoformat()
        }

# Register routes
api.add_resource(TranslateAR2EN, '/translate/ar2en')
api.add_resource(TranslationStatus, '/translate/ar2en/status/<string:job_id>')
api.add_resource(HealthCheck, '/health')

if __name__ == '__main__':
    port = int(os.getenv('PORT', 8005))
    app.run(host='0.0.0.0', port=port)
