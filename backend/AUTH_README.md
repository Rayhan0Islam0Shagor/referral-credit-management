# Authentication System

This document describes the modular authentication system implemented in the backend.

## Architecture Overview

The authentication system follows a modular architecture with clear separation of concerns:

```
src/
├── types/
│   └── auth.types.ts          # TypeScript interfaces and types
├── config/
│   └── auth.config.ts         # Authentication configuration
├── middleware/
│   ├── auth.middleware.ts     # JWT verification and password handling
│   └── validation.middleware.ts # Input validation
├── stores/
│   └── user.store.ts          # User data storage (in-memory)
├── services/
│   └── auth.service.ts        # Business logic layer
├── controllers/
│   └── auth.controller.ts     # Request/response handling
└── routes/
    └── auth.routes.ts         # Route definitions
```

## Features

- ✅ User registration with email validation
- ✅ Secure login with JWT tokens
- ✅ Password hashing with bcrypt
- ✅ JWT token verification middleware
- ✅ Rate limiting for authentication endpoints
- ✅ Input validation with express-validator
- ✅ Profile management
- ✅ Password change functionality
- ✅ Account deletion
- ✅ Comprehensive error handling

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint           | Description         | Access  |
| ------ | ------------------ | ------------------- | ------- |
| POST   | `/register`        | Register a new user | Public  |
| POST   | `/login`           | Login user          | Public  |
| POST   | `/logout`          | Logout user         | Private |
| GET    | `/profile`         | Get user profile    | Private |
| PUT    | `/profile`         | Update user profile | Private |
| PUT    | `/change-password` | Change password     | Private |
| DELETE | `/account`         | Delete account      | Private |

## Request/Response Examples

### Register User

**Request:**

```json
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "abc123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login User

**Request:**

```json
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "abc123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Get Profile

**Request:**

```json
GET /api/auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**

```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "user": {
    "id": "abc123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## Environment Configuration

Create a `.env` file in the backend directory with the following variables:

```env
# Authentication Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=5

# Password Requirements
PASSWORD_MIN_LENGTH=8
PASSWORD_REQUIRE_UPPERCASE=true
PASSWORD_REQUIRE_LOWERCASE=true
PASSWORD_REQUIRE_NUMBERS=true
PASSWORD_REQUIRE_SPECIAL_CHARS=true
```

## Security Features

### Password Requirements

- Minimum length: 8 characters (configurable)
- Must contain uppercase letters (configurable)
- Must contain lowercase letters (configurable)
- Must contain numbers (configurable)
- Must contain special characters (configurable)

### Rate Limiting

- 5 requests per 15 minutes per IP for authentication endpoints
- Configurable window and limit

### JWT Security

- Configurable expiration time
- Secure secret key (must be changed in production)
- Bearer token authentication

### Password Security

- bcrypt hashing with configurable salt rounds
- Passwords are never returned in API responses

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"]
}
```

Common HTTP status codes:

- `200` - Success
- `201` - Created (registration)
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid credentials)
- `403` - Forbidden (invalid token)
- `404` - Not Found
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

## Usage in Frontend

### Storing Tokens

Store the JWT token securely (localStorage, sessionStorage, or httpOnly cookies):

```javascript
// After successful login
localStorage.setItem('authToken', response.data.token);
```

### Making Authenticated Requests

Include the token in the Authorization header:

```javascript
const token = localStorage.getItem('authToken');
fetch('/api/auth/profile', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

### Logout

Remove the token from storage:

```javascript
localStorage.removeItem('authToken');
```

## Development

### Running the Server

```bash
cd backend
npm run dev
```

### Testing Endpoints

Use tools like Postman, curl, or your frontend application to test the endpoints.

### Example curl Commands

```bash
# Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123!","firstName":"Test","lastName":"User"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123!"}'

# Get Profile (replace TOKEN with actual token)
curl -X GET http://localhost:3001/api/auth/profile \
  -H "Authorization: Bearer TOKEN"
```

## Production Considerations

1. **Database Integration**: Replace the in-memory user store with a proper database (MongoDB, PostgreSQL, etc.)
2. **JWT Secret**: Use a strong, randomly generated secret key
3. **HTTPS**: Always use HTTPS in production
4. **Token Blacklisting**: Implement token blacklisting for enhanced security
5. **Refresh Tokens**: Implement refresh token rotation
6. **Email Verification**: Add email verification for registration
7. **Password Reset**: Implement password reset functionality
8. **Audit Logging**: Add comprehensive audit logging
9. **Input Sanitization**: Additional input sanitization beyond validation
10. **CORS Configuration**: Configure CORS properly for your frontend domain
