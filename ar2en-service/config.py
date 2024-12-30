import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Service configuration
    SERVICE_NAME = "translation-ar2en"
    API_VERSION = "v1"
    
    # Model configuration
    MODEL_NAME = "Helsinki-NLP/opus-mt-ar-en"
    MAX_TEXT_LENGTH = 512
    
    # Server configuration
    HOST = os.getenv('HOST', '0.0.0.0')
    PORT = int(os.getenv('PORT', 8005))
    
    # Gunicorn configuration
    WORKERS = int(os.getenv('WORKERS', 4))
    TIMEOUT = int(os.getenv('TIMEOUT', 120))

config = Config()
