FROM python:latest

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir pip --upgrade && \
    pip install --no-cache-dir --default-timeout=100 -r requirements.txt --retries 5

# Copy project
COPY . .

# Collect static files
RUN python manage.py collectstatic --noinput

EXPOSE 8003

# Run uvicorn
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8003"]
