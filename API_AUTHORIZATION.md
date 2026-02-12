# API Authorization Summary

## Overview
This document outlines the authorization requirements for all API endpoints in the CTS Optimizer Backend.

## Authentication & Authorization Middleware

### Middleware Used:
- **`authenticate`**: Verifies JWT token and loads user into `req.user`
- **`authorize(...roles)`**: Checks if user's role matches allowed roles

### User Roles:
- **admin**: Full system access
- **user**: Standard user access

---

## Endpoint Authorization Matrix

### 🔐 Authentication Routes (`/api/auth`)
| Method | Endpoint | Auth Required | Role Required | Description |
|--------|----------|---------------|---------------|-------------|
| POST | `/register` | ❌ No | - | Register new user |
| POST | `/login` | ❌ No | - | User login |
| GET | `/me` | ✅ Yes | Any | Get current user info |

### 🏢 Organization Routes (`/api/organizations`)
| Method | Endpoint | Auth Required | Role Required | Description |
|--------|----------|---------------|---------------|-------------|
| GET | `/` | ✅ Yes | **Admin** | Get all organizations |
| GET | `/:id` | ✅ Yes | **Admin** | Get organization by ID |
| POST | `/` | ✅ Yes | **Admin** | Create organization |
| PUT | `/:id` | ✅ Yes | **Admin** | Update organization |
| DELETE | `/:id` | ✅ Yes | **Admin** | Delete organization |

### 👥 User Routes (`/api/users`)
| Method | Endpoint | Auth Required | Role Required | Description |
|--------|----------|---------------|---------------|-------------|
| GET | `/` | ✅ Yes | **Admin** | Get all users |
| GET | `/:id` | ✅ Yes | Any | Get user by ID |
| POST | `/` | ✅ Yes | **Admin** | Create user |
| PUT | `/:id` | ✅ Yes | Any | Update user |
| DELETE | `/:id` | ✅ Yes | Any | Delete user |

### 👤 Customer Routes (`/api/customers`)
| Method | Endpoint | Auth Required | Role Required | Description |
|--------|----------|---------------|---------------|-------------|
| GET | `/` | ✅ Yes | Any | Get all customers |
| GET | `/:id` | ✅ Yes | Any | Get customer by ID |
| POST | `/` | ✅ Yes | Any | Create customer |
| PUT | `/:id` | ✅ Yes | Any | Update customer |
| DELETE | `/:id` | ✅ Yes | Any | Delete customer |

### 🛣️ Route Routes (`/api/routes`)
| Method | Endpoint | Auth Required | Role Required | Description |
|--------|----------|---------------|---------------|-------------|
| GET | `/` | ✅ Yes | Any | Get all routes |
| GET | `/:id` | ✅ Yes | Any | Get route by ID |
| POST | `/` | ✅ Yes | Any | Create route |
| PUT | `/:id` | ✅ Yes | Any | Update route |
| DELETE | `/:id` | ✅ Yes | Any | Delete route |

### 🚚 Transport Cost Routes (`/api/transport-costs`)
| Method | Endpoint | Auth Required | Role Required | Description |
|--------|----------|---------------|---------------|-------------|
| GET | `/` | ✅ Yes | Any | Get all transport costs |
| GET | `/:id` | ✅ Yes | Any | Get transport cost by ID |
| POST | `/` | ✅ Yes | Any | Create transport cost |
| PUT | `/:id` | ✅ Yes | Any | Update transport cost |
| DELETE | `/:id` | ✅ Yes | Any | Delete transport cost |

### 🏭 Warehouse Cost Routes (`/api/warehouse-costs`)
| Method | Endpoint | Auth Required | Role Required | Description |
|--------|----------|---------------|---------------|-------------|
| GET | `/` | ✅ Yes | Any | Get all warehouse costs |
| GET | `/:id` | ✅ Yes | Any | Get warehouse cost by ID |
| POST | `/` | ✅ Yes | Any | Create warehouse cost |
| PUT | `/:id` | ✅ Yes | Any | Update warehouse cost |
| DELETE | `/:id` | ✅ Yes | Any | Delete warehouse cost |

### 📦 Order Routes (`/api/orders`)
| Method | Endpoint | Auth Required | Role Required | Description |
|--------|----------|---------------|---------------|-------------|
| GET | `/` | ✅ Yes | Any | Get all orders |
| GET | `/:id` | ✅ Yes | Any | Get order by ID |
| POST | `/` | ✅ Yes | Any | Create order |
| PUT | `/:id` | ✅ Yes | Any | Update order |
| DELETE | `/:id` | ✅ Yes | Any | Delete order |

### 💰 Cost Result Routes (`/api/cost-results`)
| Method | Endpoint | Auth Required | Role Required | Description |
|--------|----------|---------------|---------------|-------------|
| GET | `/` | ✅ Yes | Any | Get all cost results |
| GET | `/:id` | ✅ Yes | Any | Get cost result by ID |
| POST | `/` | ✅ Yes | Any | Create cost result |
| PUT | `/:id` | ✅ Yes | Any | Update cost result |
| DELETE | `/:id` | ✅ Yes | Any | Delete cost result |

### 📊 Drop Size Result Routes (`/api/drop-size-results`)
| Method | Endpoint | Auth Required | Role Required | Description |
|--------|----------|---------------|---------------|-------------|
| GET | `/` | ✅ Yes | Any | Get all drop size results |
| GET | `/:id` | ✅ Yes | Any | Get drop size result by ID |
| POST | `/` | ✅ Yes | Any | Create drop size result |
| PUT | `/:id` | ✅ Yes | Any | Update drop size result |
| DELETE | `/:id` | ✅ Yes | Any | Delete drop size result |

---

## Authorization Rules Summary

### Public Endpoints (No Auth Required):
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /health` - Health check

### Admin-Only Endpoints:
- **All Organization operations** (`/api/organizations/*`)
- `GET /api/users` - List all users
- `POST /api/users` - Create new user

### Authenticated User Endpoints:
- **All other endpoints** require authentication but allow any authenticated user

---

## How Authorization Works

### 1. **Authentication Flow**:
```javascript
// User sends request with JWT token in header
Authorization: Bearer <jwt_token>

// Middleware verifies token and loads user
authenticate(req, res, next)
```

### 2. **Authorization Flow**:
```javascript
// After authentication, check user role
authorize('admin')(req, res, next)

// If user.role !== 'admin', return 403 Forbidden
```

### 3. **Example Protected Route**:
```javascript
router.get('/', 
  authenticate,           // Step 1: Verify JWT token
  authorize('admin'),     // Step 2: Check if user is admin
  controller.getAll       // Step 3: Execute controller
);
```

---

## Error Responses

### 401 Unauthorized
Returned when:
- No JWT token provided
- Invalid JWT token
- Expired JWT token
- User not found

```json
{
  "success": false,
  "error": "Not authorized to access this route"
}
```

### 403 Forbidden
Returned when:
- User is authenticated but doesn't have required role

```json
{
  "success": false,
  "error": "User role 'user' is not authorized to access this route"
}
```

---

## Testing Authorization

### Get JWT Token:
```bash
# Login to get token
POST http://localhost:5000/api/auth/login
{
  "email": "admin@example.com",
  "password": "password123"
}

# Response includes token
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Use Token in Requests:
```bash
# Add token to Authorization header
GET http://localhost:5000/api/organizations
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Security Best Practices

✅ **Implemented:**
- JWT-based authentication
- Role-based access control (RBAC)
- Password hashing with bcrypt
- Token verification on protected routes
- Admin-only operations for sensitive data

✅ **Recommendations:**
- Regularly rotate JWT secrets
- Implement token refresh mechanism
- Add rate limiting to prevent brute force
- Log authentication failures
- Implement account lockout after failed attempts
