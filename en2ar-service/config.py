import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Service configuration
    SERVICE_NAME = "translation-en2ar"
    API_VERSION = "v1"
    
    # Model configuration
    MODEL_NAME = "Helsinki-NLP/opus-mt-en-ar"
    MAX_TEXT_LENGTH = 512
    
    # Server configuration
    HOST = os.getenv('HOST', '0.0.0.0')
    PORT = int(os.getenv('PORT', 8006))
    
    # Gunicorn configuration
    WORKERS = int(os.getenv('WORKERS', 4))
    TIMEOUT = int(os.getenv('TIMEOUT', 120))

config = Config()
