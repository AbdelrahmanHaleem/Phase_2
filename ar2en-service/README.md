# Arabic to English Translation Service

This service handles the translation of text from Arabic to English using advanced machine translation models.

## Features

- FastAPI-based REST API
- Transformer-based neural machine translation
- Support for Arabic text preprocessing
- Docker containerization for easy deployment

## Prerequisites

- Docker and Docker Compose
- Python 3.8 or higher (if running locally)
- Rust toolchain (for building dependencies)

## Installation

### Using Docker (Recommended)

1. Build the service:
```bash
docker-compose build ar2en-service
```

2. Run the service:
```bash
docker-compose up ar2en-service
```

### Local Development

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the service:
```bash
uvicorn app:app --host 0.0.0.0 --port 8005
```

## API Endpoints

- `POST /translate`: Translate Arabic text to English
  - Request body: `{"text": "مرحبا بالعالم"}`
  - Response: `{"translation": "Hello world"}`

## Environment Variables

- `MODEL_PATH`: Path to the translation model (default: local model path)
- `DEVICE`: Computing device ('cpu' or 'cuda' for GPU acceleration)
- `BATCH_SIZE`: Translation batch size (default: 32)

## Testing

Run the tests using:
```bash
pytest
```

## Docker Build

The Dockerfile includes:
- Base Python image
- Rust installation for building dependencies
- Required Python packages
- FastAPI application setup

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
