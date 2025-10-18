# Database Integration

This document describes the MongoDB database integration for the authentication system.

## Overview

The authentication system has been successfully integrated with MongoDB using Mongoose ODM. The system now persists user data in a MongoDB database instead of using in-memory storage.

## Database Architecture

### Connection Configuration

- **Database**: MongoDB
- **ODM**: Mongoose
- **Connection**: Configured in `src/config/db.ts`
- **Environment Variable**: `DATABASE_URI`

### User Model

The User model is defined in `src/models/user.model.ts` with the following features:

#### Schema Fields

- `email`: String (required, unique, indexed, lowercase)
- `password`: String (required, min 8 characters)
- `firstName`: String (required, max 50 characters)
- `lastName`: String (required, max 50 characters)
- `createdAt`: Date (auto-generated)
- `updatedAt`: Date (auto-generated)

#### Indexes

- Email field index for faster queries
- CreatedAt field index for sorting

#### Validation

- Email format validation
- Password length validation
- Name length validation
- Required field validation

#### Security Features

- Password field excluded from JSON output by default
- Email normalization to lowercase
- Unique email constraint

## Database Operations

### User Store Methods

The `UserStore` class in `src/stores/user.store.ts` provides the following MongoDB operations:

#### Core Operations

- `createUser()`: Create a new user
- `findByEmail()`: Find user by email
- `findById()`: Find user by ID
- `updateUser()`: Update user information
- `deleteUser()`: Delete user account
- `emailExists()`: Check if email exists

#### Additional Operations

- `getAllUsers()`: Get paginated list of users
- `getUserCount()`: Get total user count

## Environment Setup

### Required Environment Variables

Create a `.env` file in the backend directory:

```env
# Database Configuration
DATABASE_URI=mongodb://localhost:27017/referral-credit-management

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

### MongoDB Setup Options

#### Option 1: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/referral-credit-management`

#### Option 2: MongoDB Atlas (Cloud)

1. Create a MongoDB Atlas account
2. Create a cluster
3. Get connection string
4. Use Atlas connection string in `DATABASE_URI`

#### Option 3: Docker MongoDB

```bash
docker run --name mongodb -p 27017:27017 -d mongo:latest
```

## Database Connection

### Connection Management

The database connection is managed in `src/config/db.ts`:

- **Automatic Connection**: Database connects on server startup
- **Connection Options**: Optimized for production use
- **Error Handling**: Comprehensive error handling and logging
- **Graceful Shutdown**: Proper connection cleanup on server termination

### Connection Events

- Connection success/failure logging
- Disconnection warnings
- Reconnection notifications
- Error handling

## Testing Database Integration

### Test Script

Run the database integration test:

```bash
cd backend
npx tsx src/test-db.ts
```

### Test Coverage

The test script verifies:

1. Database connection
2. User registration
3. User login
4. Profile retrieval
5. Profile updates
6. Password changes
7. Account deletion
8. Database disconnection

## API Endpoints

All authentication endpoints now work with MongoDB:

| Method | Endpoint                    | Description     | Database Operation |
| ------ | --------------------------- | --------------- | ------------------ |
| POST   | `/api/auth/register`        | Register user   | `createUser()`     |
| POST   | `/api/auth/login`           | Login user      | `findByEmail()`    |
| GET    | `/api/auth/profile`         | Get profile     | `findById()`       |
| PUT    | `/api/auth/profile`         | Update profile  | `updateUser()`     |
| PUT    | `/api/auth/change-password` | Change password | `updateUser()`     |
| DELETE | `/api/auth/account`         | Delete account  | `deleteUser()`     |

## Error Handling

### Database Errors

- Connection failures
- Query errors
- Validation errors
- Duplicate key errors

### Error Responses

All database errors are properly handled and return consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

## Performance Considerations

### Indexing

- Email field indexed for fast lookups
- CreatedAt field indexed for sorting

### Connection Pooling

- Maximum 10 concurrent connections
- Optimized connection settings
- Automatic connection management

### Query Optimization

- Selective field projection
- Pagination support
- Efficient update operations

## Security Features

### Data Protection

- Password hashing with bcrypt
- Password exclusion from responses
- Email normalization
- Input validation

### Database Security

- Connection string protection
- Environment variable security
- Query injection prevention (Mongoose)

## Production Deployment

### Database Requirements

1. **MongoDB Version**: 4.4 or higher
2. **Memory**: Minimum 2GB RAM
3. **Storage**: SSD recommended
4. **Network**: Stable internet connection

### Deployment Checklist

- [ ] Update `DATABASE_URI` with production connection string
- [ ] Set strong `JWT_SECRET`
- [ ] Configure proper CORS settings
- [ ] Set up database backups
- [ ] Monitor database performance
- [ ] Configure connection pooling
- [ ] Set up error monitoring

### Monitoring

- Database connection status
- Query performance
- Error rates
- User registration/login metrics

## Troubleshooting

### Common Issues

#### Connection Failed

```
Error: Failed to connect to MongoDB
```

**Solution**: Check MongoDB service status and connection string

#### Duplicate Email Error

```
Error: E11000 duplicate key error
```

**Solution**: Email already exists, handle in frontend

#### Validation Error

```
Error: Validation failed
```

**Solution**: Check input data format and requirements

### Debug Mode

Enable debug logging by setting:

```env
NODE_ENV=development
```

## Migration from In-Memory Storage

The system has been successfully migrated from in-memory storage to MongoDB:

### Changes Made

1. ✅ Installed Mongoose ODM
2. ✅ Created database configuration
3. ✅ Implemented User model
4. ✅ Updated UserStore to use MongoDB
5. ✅ Integrated database connection
6. ✅ Updated environment configuration
7. ✅ Tested all operations

### Backward Compatibility

- All API endpoints remain the same
- Response formats unchanged
- Error handling consistent
- Authentication flow identical

## Next Steps

### Recommended Enhancements

1. **Database Migrations**: Add migration system for schema changes
2. **Caching**: Implement Redis caching for frequently accessed data
3. **Audit Logging**: Add comprehensive audit trails
4. **Backup Strategy**: Implement automated database backups
5. **Monitoring**: Add database performance monitoring
6. **Sharding**: Consider database sharding for scale

### Additional Features

1. **User Roles**: Add role-based access control
2. **Profile Pictures**: Add file upload for user avatars
3. **Social Login**: Integrate OAuth providers
4. **Email Verification**: Add email verification system
5. **Password Reset**: Implement password reset functionality
