# Translation and Summarization Platform

A modern, microservices-based platform that provides real-time translation and text summarization between English and Arabic languages.

## Features

- Bidirectional translation between English and Arabic
- Text summarization for both languages
- Support for multiple file formats (TXT, DOCX, PDF)
- Real-time translation preview
- User authentication and profile management
- Comprehensive API documentation
- Monitoring and logging
- Scalable microservices architecture

## Project Structure

```
├── frontend-service/         # React-based web interface
├── gateway-service/          # NGINX API Gateway
├── ar2en-service/           # Arabic to English translation
├── en2ar-service/           # English to Arabic translation
├── summary-service/         # Text summarization service
├── user-service/            # User management and authentication
├── monitoring-service/      # System monitoring and logging
└── docker-compose.yml       # Docker composition configuration
```

## Services

### Frontend Service
- React-based user interface
- Material-UI components
- File upload and processing
- Real-time translation preview

### Gateway Service
- NGINX-based API Gateway
- Request routing and load balancing
- Security headers and CORS configuration
- Centralized error handling

### Translation Services (ar2en & en2ar)
- FastAPI-based REST APIs
- Transformer-based neural machine translation
- Efficient text processing
- Batch translation support

### Summary Service
- Text summarization for both languages
- Configurable summary length
- PostgreSQL for storing summaries
- FastAPI implementation

### User Service
- User authentication with Supertokens
- Profile management
- Session handling
- Security features

### Monitoring Service
- Real-time service health monitoring
- Performance metrics collection
- Error logging and tracking
- Resource usage statistics

## Prerequisites

- Docker and Docker Compose
- Node.js 18 or higher (for local development)
- Python 3.8 or higher (for local development)
- PostgreSQL (for local development)
- Rust toolchain (for building dependencies)

## Quick Start

1. Clone the repository:
```bash
git clone [repository-url]
cd [repository-name]
```

2. Build and start all services:
```bash
docker-compose build
docker-compose up
```

3. Access the application:
- Frontend: http://localhost:80
- API Gateway: http://localhost:8000
- Swagger Documentation: http://localhost:8000/docs

## Development Setup

Each service can be run independently for development. Refer to individual service READMEs for specific instructions:

- [Frontend Service](./frontend-service/README.md)
- [Gateway Service](./gateway-service/README.md)
- [Arabic to English Service](./ar2en-service/README.md)
- [English to Arabic Service](./en2ar-service/README.md)
- [Summary Service](./summary-service/README.md)
- [User Service](./user-service/README.md)
- [Monitoring Service](./monitoring-service/README.md)

## Environment Variables

Create a `.env` file in the root directory. Example:
```env
# Frontend Configuration
REACT_APP_API_URL=http://localhost:8000

# Database Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_DB=translation_platform

# Service Ports
FRONTEND_PORT=80
GATEWAY_PORT=8000
AR2EN_PORT=8005
EN2AR_PORT=8004
SUMMARY_PORT=8003
USER_PORT=8002
MONITORING_PORT=8006
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to all contributors who have helped shape this project
- Built with support from the open-source community
