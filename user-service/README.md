# User Management Service

This service handles user authentication and profile management using Supertokens.

## Features

- User registration and login
- Email verification
- Session management
- Password reset functionality
- User profile management
- Admin dashboard

## Prerequisites

- Node.js 18 or higher
- Supertokens Core running (either locally or using Supertokens managed service)
- MongoDB (for user profiles)

## Environment Variables

Copy `.env.example` to `.env` and configure the following variables:

```bash
PORT=8003
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
API_DOMAIN=http://localhost:8003
COOKIE_DOMAIN=localhost
SUPERTOKENS_CONNECTION_URI=http://localhost:3567
SUPERTOKENS_API_KEY=your-api-key
```

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

## API Endpoints

### Authentication (provided by Supertokens)
- POST `/auth/signup` - Register a new user
- POST `/auth/signin` - Sign in existing user
- POST `/auth/signout` - Sign out user
- POST `/auth/verify-email` - Verify email address
- POST `/auth/reset-password` - Reset password

### Custom User Endpoints
- GET `/api/users/me` - Get user profile
- PUT `/api/users/me` - Update user profile
- DELETE `/api/users/me` - Delete user account

### Health Check
- GET `/health` - Service health check

## Docker

Build and run the service using Docker:

```bash
# Build image
docker build -t user-service .

# Run container
docker run -p 8003:8003 user-service
```

## Security Features

- CSRF protection
- XSS protection
- Secure session management
- Rate limiting
- Email verification
- Password hashing
- JWT token management

## Integration with Frontend

The frontend application should use the Supertokens React SDK to integrate with this service. Example configuration will be provided in the frontend documentation.
