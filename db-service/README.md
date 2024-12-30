# Database Service

PostgreSQL database service for the Translation Platform, handling user data and processing history.

## Features

- Secure storage of user credentials and profiles
- Session management
- Translation and summarization history logging
- Optimized indexes for fast queries
- Automatic timestamp management
- User activity tracking

## Data Models

### Users Table
- `id` (UUID, Primary Key)
- `email` (VARCHAR, Unique)
- `password_hash` (VARCHAR)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Sessions Table
- `session_id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `created_at` (TIMESTAMP)
- `expires_at` (TIMESTAMP)
- `is_valid` (BOOLEAN)

### Translation Logs Table
- `request_id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `input_text` (TEXT)
- `output_text` (TEXT)
- `source_language` (VARCHAR)
- `target_language` (VARCHAR)
- `created_at` (TIMESTAMP)
- `processing_time` (INTERVAL)
- `status` (VARCHAR)

### Summary Logs Table
- `request_id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `input_text` (TEXT)
- `output_text` (TEXT)
- `summary_type` (VARCHAR)
- `created_at` (TIMESTAMP)
- `processing_time` (INTERVAL)
- `status` (VARCHAR)

## Setup

1. Build the Docker image:
```bash
docker build -t db-service .
```

2. Run the container:
```bash
docker run -d \
  --name db-service \
  -e POSTGRES_DB=translation_platform \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=admin_password \
  -p 5432:5432 \
  db-service
```

## Environment Variables

- `POSTGRES_DB`: Database name (default: translation_platform)
- `POSTGRES_USER`: Database user (default: admin)
- `POSTGRES_PASSWORD`: Database password (default: admin_password)

## Database Optimization

- Indexes on frequently queried columns
- Automatic updated_at timestamp management
- Optimized PostgreSQL configuration
- Connection pooling support
- WAL configuration for reliability

## Backup and Recovery

To backup the database:
```bash
docker exec db-service pg_dump -U admin translation_platform > backup.sql
```

To restore from backup:
```bash
cat backup.sql | docker exec -i db-service psql -U admin translation_platform
```

## Monitoring

The database is configured with extensive logging:
- Query performance logging (queries taking > 1s)
- Connection logging
- Checkpoint logging
- Lock wait logging

## Security Features

- Password hashing using pgcrypto
- SSL enabled by default
- Connection limits
- Statement timeouts
- Secure password policies

## Views

### User Activity View
Provides a summary of user activity including:
- Translation count
- Summary count
- Last activity timestamp
