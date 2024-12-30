# Text Summarization Service

This service provides text summarization capabilities for both English and Arabic text using advanced NLP models.

## Features

- FastAPI-based REST API
- Support for both English and Arabic text summarization
- Configurable summary length and parameters
- PostgreSQL integration for storing summaries
- Docker containerization for easy deployment

## Prerequisites

- Docker and Docker Compose
- Python 3.8 or higher (if running locally)
- Rust toolchain (for building dependencies)
- PostgreSQL (if running locally)

## Installation

### Using Docker (Recommended)

1. Build the service:
```bash
docker-compose build summary-service
```

2. Run the service:
```bash
docker-compose up summary-service
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

3. Set up PostgreSQL:
- Create a database
- Update the database connection string in environment variables

4. Run the service:
```bash
uvicorn app:app --host 0.0.0.0 --port 8003
```

## API Endpoints

- `POST /summarize`: Generate a summary of the input text
  - Request body: `{"text": "your text here", "max_length": 150}`
  - Response: `{"summary": "summarized text"}`

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `MODEL_PATH`: Path to the summarization model
- `MAX_LENGTH`: Maximum summary length (default: 150)
- `MIN_LENGTH`: Minimum summary length (default: 50)

## Testing

Run the tests using:
```bash
pytest
```

## Docker Build

The Dockerfile includes:
- Base Python image
- PostgreSQL client installation
- Rust installation for building dependencies
- Required Python packages
- FastAPI application setup

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
