# Postman API Testing Guide

This guide provides all the information you need to test the authentication API using Postman.

## Server Setup

1. **Start MongoDB**: Ensure MongoDB is running locally or use MongoDB Atlas
2. **Environment Variables**: Create a `.env` file in the backend directory:

   ```env
   DATABASE_URI=mongodb://localhost:27017/referral-credit-management
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   JWT_EXPIRES_IN=24h
   BCRYPT_SALT_ROUNDS=12
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX=5
   PASSWORD_MIN_LENGTH=8
   PASSWORD_REQUIRE_UPPERCASE=true
   PASSWORD_REQUIRE_LOWERCASE=true
   PASSWORD_REQUIRE_NUMBERS=true
   PASSWORD_REQUIRE_SPECIAL_CHARS=true
   ```

3. **Start Server**: Run `npm run dev` in the backend directory
4. **Base URL**: `http://localhost:3001`

## API Endpoints

### 1. Health Check

- **Method**: `GET`
- **URL**: `http://localhost:3001/health`
- **Headers**: None required
- **Expected Response**:
  ```json
  {
    "success": true,
    "message": "Server is running",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
  ```

### 2. Register User

- **Method**: `POST`
- **URL**: `http://localhost:3001/api/auth/register`
- **Headers**:
  ```
  Content-Type: application/json
  ```
- **Body** (raw JSON):
  ```json
  {
    "email": "test@example.com",
    "password": "TestPass123!",
    "firstName": "John",
    "lastName": "Doe"
  }
  ```
- **Expected Response** (Success - 201):
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "test@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

### 3. Login User

- **Method**: `POST`
- **URL**: `http://localhost:3001/api/auth/login`
- **Headers**:
  ```
  Content-Type: application/json
  ```
- **Body** (raw JSON):
  ```json
  {
    "email": "test@example.com",
    "password": "TestPass123!"
  }
  ```
- **Expected Response** (Success - 200):
  ```json
  {
    "success": true,
    "message": "Login successful",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "test@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

### 4. Get User Profile (Protected)

- **Method**: `GET`
- **URL**: `http://localhost:3001/api/auth/profile`
- **Headers**:
  ```
  Authorization: Bearer YOUR_JWT_TOKEN_HERE
  ```
- **Expected Response** (Success - 200):
  ```json
  {
    "success": true,
    "message": "Profile retrieved successfully",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "test@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
  ```

### 5. Update User Profile (Protected)

- **Method**: `PUT`
- **URL**: `http://localhost:3001/api/auth/profile`
- **Headers**:
  ```
  Content-Type: application/json
  Authorization: Bearer YOUR_JWT_TOKEN_HERE
  ```
- **Body** (raw JSON):
  ```json
  {
    "firstName": "Jane",
    "lastName": "Smith"
  }
  ```
- **Expected Response** (Success - 200):
  ```json
  {
    "success": true,
    "message": "Profile updated successfully",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "test@example.com",
      "firstName": "Jane",
      "lastName": "Smith",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
  ```

### 6. Change Password (Protected)

- **Method**: `PUT`
- **URL**: `http://localhost:3001/api/auth/change-password`
- **Headers**:
  ```
  Content-Type: application/json
  Authorization: Bearer YOUR_JWT_TOKEN_HERE
  ```
- **Body** (raw JSON):
  ```json
  {
    "currentPassword": "TestPass123!",
    "newPassword": "NewPass123!"
  }
  ```
- **Expected Response** (Success - 200):
  ```json
  {
    "success": true,
    "message": "Password changed successfully"
  }
  ```

### 7. Logout (Protected)

- **Method**: `POST`
- **URL**: `http://localhost:3001/api/auth/logout`
- **Headers**:
  ```
  Authorization: Bearer YOUR_JWT_TOKEN_HERE
  ```
- **Expected Response** (Success - 200):
  ```json
  {
    "success": true,
    "message": "Logout successful"
  }
  ```

### 8. Delete Account (Protected)

- **Method**: `DELETE`
- **URL**: `http://localhost:3001/api/auth/account`
- **Headers**:
  ```
  Authorization: Bearer YOUR_JWT_TOKEN_HERE
  ```
- **Expected Response** (Success - 200):
  ```json
  {
    "success": true,
    "message": "Account deleted successfully"
  }
  ```

## Error Responses

All endpoints return consistent error responses:

### Validation Error (400)

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": ["Password must be at least 8 characters long"]
}
```

### Unauthorized (401)

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

### Forbidden (403)

```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### Not Found (404)

```json
{
  "success": false,
  "message": "User not found"
}
```

### Rate Limited (429)

```json
{
  "success": false,
  "message": "Too many authentication attempts, please try again later"
}
```

### Server Error (500)

```json
{
  "success": false,
  "message": "Internal server error"
}
```

## Testing Workflow

### Step 1: Health Check

1. Test `GET /health` to ensure server is running

### Step 2: Register User

1. Test `POST /api/auth/register` with valid data
2. Save the returned `token` for subsequent requests

### Step 3: Login User

1. Test `POST /api/auth/login` with the same credentials
2. Verify you get a new token

### Step 4: Test Protected Routes

1. Use the token in Authorization header: `Bearer YOUR_TOKEN`
2. Test `GET /api/auth/profile`
3. Test `PUT /api/auth/profile`
4. Test `PUT /api/auth/change-password`
5. Test `POST /api/auth/logout`

### Step 5: Test Error Cases

1. Try registering with duplicate email
2. Try logging in with wrong password
3. Try accessing protected routes without token
4. Try accessing protected routes with invalid token

## Postman Collection Setup

### Environment Variables

Create a Postman environment with:

- `base_url`: `http://localhost:3001`
- `auth_token`: (will be set automatically from login/register responses)

### Pre-request Scripts

For protected routes, add this pre-request script:

```javascript
// Auto-set Authorization header if token exists
if (pm.environment.get('auth_token')) {
  pm.request.headers.add({
    key: 'Authorization',
    value: 'Bearer ' + pm.environment.get('auth_token'),
  });
}
```

### Tests Scripts

Add this to login/register requests to auto-save token:

```javascript
// Auto-save token from response
if (pm.response.code === 200 || pm.response.code === 201) {
  const responseJson = pm.response.json();
  if (responseJson.token) {
    pm.environment.set('auth_token', responseJson.token);
  }
}
```

## Password Requirements

Passwords must meet these criteria:

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

Example valid passwords:

- `TestPass123!`
- `MySecure1@`
- `Password99#`

## Rate Limiting

Authentication endpoints are rate limited:

- 5 requests per 15 minutes per IP
- Applies to `/api/auth/*` routes only

## Troubleshooting

### Common Issues

1. **Connection Refused**: Check if MongoDB is running
2. **Validation Errors**: Check password requirements and email format
3. **Token Errors**: Ensure token is properly formatted in Authorization header
4. **Rate Limited**: Wait 15 minutes or restart server to reset limits

### Debug Tips

1. Check server console for detailed error logs
2. Verify environment variables are loaded correctly
3. Test with curl if Postman issues persist:
   ```bash
   curl -X POST http://localhost:3001/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"TestPass123!","firstName":"Test","lastName":"User"}'
   ```
