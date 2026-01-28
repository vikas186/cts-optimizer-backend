# CTS Optimizer Backend

A Node.js, Express.js, PostgreSQL, and Sequelize backend API for the CTS Optimizer system.

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **Sequelize** - ORM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Swagger** - API documentation

## Project Structure

```
cts-optimizer-backend/
├── src/
│   ├── config/          # Configuration files
│   ├── models/          # Sequelize models
│   ├── migrations/      # Database migrations
│   ├── controllers/     # Route controllers
│   ├── services/        # Business logic layer
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── utils/           # Utility functions
│   └── app.js           # Express app setup
├── server.js            # Entry point
└── package.json         # Dependencies
```

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cts-optimizer-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

4. Update the `.env` file with your database credentials:
```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=cts_optimizer
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
```

5. Create the PostgreSQL database:
```bash
createdb cts_optimizer
```

6. Run database migrations:
```bash
npm run migrate
```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

## API Documentation

Swagger API documentation is available at:
- **Swagger UI**: `http://localhost:3000/api-docs`

The Swagger documentation provides:
- Interactive API testing interface
- Complete endpoint descriptions
- Request/response schemas
- Authentication requirements
- Example requests and responses

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Organizations
- `GET /api/organizations` - Get all organizations (protected)
- `GET /api/organizations/:id` - Get organization by ID (protected)
- `POST /api/organizations` - Create organization (admin only)
- `PUT /api/organizations/:id` - Update organization (admin only)
- `DELETE /api/organizations/:id` - Delete organization (admin only)

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID (protected)
- `POST /api/users` - Create user (admin only)
- `PUT /api/users/:id` - Update user (protected)
- `DELETE /api/users/:id` - Delete user (admin only)

### Customers
- `GET /api/customers` - Get all customers (protected)
- `GET /api/customers/:id` - Get customer by ID (protected)
- `POST /api/customers` - Create customer (protected)
- `PUT /api/customers/:id` - Update customer (protected)
- `DELETE /api/customers/:id` - Delete customer (protected)

### Warehouse Costs
- `GET /api/warehouse-costs` - Get all warehouse costs (protected)
- `GET /api/warehouse-costs/:id` - Get warehouse cost by ID (protected)
- `POST /api/warehouse-costs` - Create warehouse cost (protected)
- `PUT /api/warehouse-costs/:id` - Update warehouse cost (protected)
- `DELETE /api/warehouse-costs/:id` - Delete warehouse cost (protected)

### Routes
- `GET /api/routes` - Get all routes (protected)
- `GET /api/routes/:id` - Get route by ID (protected)
- `POST /api/routes` - Create route (protected)
- `PUT /api/routes/:id` - Update route (protected)
- `DELETE /api/routes/:id` - Delete route (protected)

### Transport Costs
- `GET /api/transport-costs` - Get all transport costs (protected)
- `GET /api/transport-costs/:id` - Get transport cost by ID (protected)
- `POST /api/transport-costs` - Create transport cost (protected)
- `PUT /api/transport-costs/:id` - Update transport cost (protected)
- `DELETE /api/transport-costs/:id` - Delete transport cost (protected)

### Orders
- `GET /api/orders` - Get all orders (protected)
- `GET /api/orders/:id` - Get order by ID (protected)
- `POST /api/orders` - Create order (protected)
- `PUT /api/orders/:id` - Update order (protected)
- `DELETE /api/orders/:id` - Delete order (protected)

### Cost Results
- `GET /api/cost-results` - Get all cost results (protected)
- `GET /api/cost-results/:id` - Get cost result by ID (protected)
- `POST /api/cost-results` - Create cost result (protected)
- `PUT /api/cost-results/:id` - Update cost result (protected)
- `DELETE /api/cost-results/:id` - Delete cost result (protected)

### Drop Size Results
- `GET /api/drop-size-results` - Get all drop size results (protected)
- `GET /api/drop-size-results/:id` - Get drop size result by ID (protected)
- `POST /api/drop-size-results` - Create drop size result (protected)
- `PUT /api/drop-size-results/:id` - Update drop size result (protected)
- `DELETE /api/drop-size-results/:id` - Delete drop size result (protected)

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Database Models

The system includes the following models:

1. **Organizations** - Organization entities
2. **Users** - User accounts with authentication
3. **Customers** - Customer information
4. **WarehouseCosts** - Warehouse cost configurations
5. **Routes** - Delivery routes
6. **TransportCosts** - Transport cost configurations
7. **Orders** - Order records
8. **CostResults** - Calculated cost results
9. **DropSizeResults** - Drop size optimization results

## Database Migrations

### Run migrations
```bash
npm run migrate
```

### Rollback last migration
```bash
npm run migrate:undo
```

### Rollback all migrations
```bash
npm run migrate:undo:all
```

## Health Check

- `GET /health` - Server health check endpoint

## Error Handling

The API uses a centralized error handling middleware. Errors are returned in the following format:

```json
{
  "success": false,
  "error": "Error message"
}
```

## Development

### Scripts

- `npm start` - Start the server
- `npm run dev` - Start the server in development mode with nodemon
- `npm run migrate` - Run database migrations
- `npm run migrate:undo` - Rollback last migration
- `npm run migrate:undo:all` - Rollback all migrations

## License

ISC

