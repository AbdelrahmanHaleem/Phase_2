# API Gateway Service

This service acts as the main entry point for all API requests in the application. It provides centralized access to all microservices and handles cross-cutting concerns such as authentication, logging, and request routing.

## Features

- Reverse proxy and load balancing for all microservices
- Security headers and CORS configuration
- Request logging and monitoring
- Health check endpoint
- File upload size limits configuration
- Centralized error handling

## Architecture

The API Gateway is built using NGINX and serves as the entry point for the following services:

- Frontend Service (React application)
- Translation Service (Django)
- Summary Service (Django)
- File Service (Django)

## Configuration

The service is configured through the `nginx.conf` file, which includes:

- Upstream server definitions
- Location-based routing
- Security headers
- CORS settings
- Logging configuration
- File upload limits

## Endpoints

- `/` - Frontend application
- `/api/translate/` - Translation service endpoints
- `/api/summary/` - Summary service endpoints
- `/api/files/` - File service endpoints
- `/health` - Health check endpoint

## Running the Service

The service can be run using Docker:

```bash
docker build -t gateway-service .
docker run -p 80:80 gateway-service
```

## Security

The gateway implements several security measures:

- X-Frame-Options header to prevent clickjacking
- X-XSS-Protection header for cross-site scripting protection
- X-Content-Type-Options header to prevent MIME type sniffing
- Referrer-Policy header for referrer information control
- CORS headers for cross-origin resource sharing control

## Monitoring

Access and error logs are available in:
- `/var/log/nginx/access.log`
- `/var/log/nginx/error.log`
