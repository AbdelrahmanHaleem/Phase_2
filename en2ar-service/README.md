# English to Arabic Translation Service

This service is responsible for translating text from English to Arabic using state-of-the-art machine translation models.

## Features

- FastAPI-based REST API
- Transformer-based neural machine translation
- Efficient text processing and batch translation support
- Docker containerization for easy deployment

## Prerequisites

- Docker and Docker Compose
- Python 3.8 or higher (if running locally)
- Rust toolchain (for building dependencies)

## Installation

### Using Docker (Recommended)

1. Build the service:
```bash
docker-compose build en2ar-service
```

2. Run the service:
```bash
docker-compose up en2ar-service
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
uvicorn app:app --host 0.0.0.0 --port 8004
```

## API Endpoints

- `POST /translate`: Translate English text to Arabic
  - Request body: `{"text": "Hello world"}`
  - Response: `{"translation": "مرحبا بالعالم"}`

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
