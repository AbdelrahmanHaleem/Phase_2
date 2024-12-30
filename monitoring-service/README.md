# Monitoring Service

This service provides monitoring and logging capabilities for the translation and summarization platform.

## Features

- Real-time service health monitoring
- Performance metrics collection
- Error logging and tracking
- Service uptime monitoring
- Resource usage statistics
- Alert notifications

## Prerequisites

- Node.js 18 or higher
- Docker and Docker Compose

## Installation

### Using Docker (Recommended)

1. Build the service:
```bash
docker-compose build monitoring-service
```

2. Run the service:
```bash
docker-compose up monitoring-service
```

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Run the service:
```bash
npm start
```

## Configuration

The service can be configured through environment variables:

- `PORT`: Service port (default: 8006)
- `LOG_LEVEL`: Logging level (default: 'info')
- `METRICS_INTERVAL`: Metrics collection interval in ms (default: 5000)

## API Endpoints

- `GET /health`: Get health status of all services
- `GET /metrics`: Get system metrics
- `GET /logs`: Get recent logs
- `GET /alerts`: Get active alerts

## Metrics Collected

- Service response times
- Request counts
- Error rates
- CPU usage
- Memory usage
- Network I/O

## Docker Build

The Dockerfile includes:
- Node.js base image
- NPM dependencies installation
- Service configuration
- Health check configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
