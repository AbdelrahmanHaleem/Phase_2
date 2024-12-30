FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .

# Upgrade pip and install requirements with increased timeout and retries
RUN pip install --no-cache-dir pip --upgrade && \
    pip install --no-cache-dir --default-timeout=300 -r requirements.txt --retries 10

COPY . .

EXPOSE 8005

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8005"]
