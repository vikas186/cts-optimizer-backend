const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CTS Optimizer Backend API',
      version: '1.0.0',
      description: `API documentation for CTS Optimizer Backend.

**Upload flow only (no manual fill)**  
The only way to add CTS data is POST /api/upload/excel. Upload your CTS template workbook; customers and routes are created automatically from the file. All other data endpoints are read-only (GET only): Organizations, Users, Customers, Routes, Warehouse Costs, Transport Costs, Orders, Cost Results, Drop Size Results. There are no POST, PUT, or DELETE endpoints for any of these; use Auth (register/login) and Upload (excel) only for writes.

**Authentication**  
Only these endpoints are public (no auth): POST /api/auth/register, POST /api/auth/login, GET /health.  
All other endpoints require a JWT: set Authorization header to Bearer <token> or use the Authorize button above.`,
      contact: {
        name: 'API Support',
        email: 'support@cts-optimizer.com'
      }
    },
    tags: [
      { name: 'Auth', description: 'Authentication — register and login are public; /me requires Bearer token' },
      { name: 'Health', description: 'Health check (public, no auth)' },
      { name: 'Upload', description: 'Excel upload — only data import; requires Bearer token' },
      { name: 'Organizations', description: 'Organizations (read-only)' },
      { name: 'Users', description: 'Users (read-only)' },
      { name: 'Customers', description: 'Customers (read-only; from Excel upload)' },
      { name: 'Routes', description: 'Routes (read-only; from Excel upload)' },
      { name: 'Warehouse Costs', description: 'Warehouse costs (read-only; from Excel)' },
      { name: 'Transport Costs', description: 'Transport costs (read-only; from Excel)' },
      { name: 'Orders', description: 'Orders (read-only; from Excel)' },
      { name: 'Cost Results', description: 'Cost results (read-only)' },
      { name: 'Drop Size Results', description: 'Drop size results (read-only)' },
      { name: 'Calculate', description: 'Cost engine and drop-size optimizer (run calculations)' },
      { name: 'Export', description: 'CSV export for reports' }
    ],
    servers: [
      {
        url: process.env.NODE_ENV === 'production'
          ? 'https://your-production-url.com'
          : `http://localhost:${process.env.PORT || 4000}`,
        description: process.env.NODE_ENV === 'production'
          ? 'Production server'
          : 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT authentication token'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean'
            },
            message: {
              type: 'string'
            },
            error: {
              type: 'string'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean'
            },
            message: {
              type: 'string'
            },
            data: {
              type: 'object',
              description: 'Response data'
            }
          }
        },
        HealthCheck: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean'
            },
            message: {
              type: 'string'
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'User ID',
              example: 'string'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email',
              example: 'string'
            },
            role: {
              type: 'string',
              enum: ['user'],
              description: 'User role (only user is supported)'
            },
            organization_id: {
              type: 'string',
              format: 'uuid',
              description: 'Organization ID',
              example: 'string'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
              example: 'string'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
              example: 'string'
            }
          }
        },
        Customer: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Customer ID',
              example: 'string'
            },
            customer_id: {
              type: 'string',
              description: 'Customer identifier'
            },
            organization_id: {
              type: 'string',
              format: 'uuid',
              description: 'Organization ID',
              example: 'string'
            },
            segment: {
              type: 'string',
              description: 'Customer segment'
            },
            revenue_per_unit: {
              type: 'number',
              format: 'float',
              description: 'Revenue per unit'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
              example: 'string'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
              example: 'string'
            }
          }
        },
        Order: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Order ID',
              example: 'string'
            },
            order_id: {
              type: 'string',
              description: 'Order identifier'
            },
            organization_id: {
              type: 'string',
              format: 'uuid',
              description: 'Organization ID',
              example: 'string'
            },
            customer_id: {
              type: 'string',
              description: 'Customer ID'
            },
            route_id: {
              type: 'string',
              description: 'Route ID'
            },
            sku: {
              type: 'string',
              description: 'SKU'
            },
            quantity: {
              type: 'integer',
              description: 'Quantity'
            },
            revenue: {
              type: 'number',
              format: 'float',
              description: 'Revenue'
            },
            weight_kg: {
              type: 'number',
              format: 'float',
              description: 'Weight in kilograms'
            },
            volume_m3: {
              type: 'number',
              format: 'float',
              description: 'Volume in cubic meters'
            },
            lines: {
              type: 'integer',
              description: 'Number of lines'
            },
            pallets: {
              type: 'integer',
              description: 'Number of pallets'
            },
            order_date: {
              type: 'string',
              format: 'date',
              description: 'Order date',
              example: 'string'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
              example: 'string'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
              example: 'string'
            }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean'
            },
            message: {
              type: 'string'
            },
            token: {
              type: 'string',
              description: 'JWT authentication token'
            },
            user: {
              $ref: '#/components/schemas/User'
            }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean'
            },
            message: {
              type: 'string'
            },
            data: {
              type: 'object',
              description: 'Response data'
            }
          }
        },
        SuccessListResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean'
            },
            message: {
              type: 'string'
            },
            data: {
              type: 'array',
              items: {
                type: 'object'
              },
              description: 'Array of data items'
            }
          }
        },
        Organization: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Organization ID',
              example: 'string'
            },
            name: {
              type: 'string',
              description: 'Organization name',
              example: 'string'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
              example: 'string'
            }
          }
        },
        Route: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Route ID',
              example: 'string'
            },
            route_id: {
              type: 'string',
              description: 'Route identifier',
              example: 'string'
            },
            distance_km: {
              type: 'number',
              format: 'float',
              description: 'Distance in kilometers',
              example: 0
            }
          }
        },
        TransportCost: {
          type: 'object',
          properties: {
            base_cost: {
              type: 'number',
              format: 'float',
              description: 'Base cost',
              example: 0
            },
            cost_per_kg: {
              type: 'number',
              format: 'float',
              description: 'Cost per kilogram',
              example: 0
            },
            cost_per_km: {
              type: 'number',
              format: 'float',
              description: 'Cost per kilometer',
              example: 0
            }
          }
        },
        WarehouseCost: {
          type: 'object',
          properties: {
            pick_cost_per_line: {
              type: 'number',
              format: 'float',
              description: 'Pick cost per line',
              example: 0
            },
            pack_cost: {
              type: 'number',
              format: 'float',
              description: 'Pack cost',
              example: 0
            },
            pallet_handling_cost: {
              type: 'number',
              format: 'float',
              description: 'Pallet handling cost',
              example: 0
            },
            storage_cost_per_day: {
              type: 'number',
              format: 'float',
              description: 'Storage cost per day',
              example: 0
            }
          }
        },
        CostResult: {
          type: 'object',
          properties: {
            transport_cost: {
              type: 'number',
              format: 'float',
              description: 'Transport cost',
              example: 0
            },
            warehouse_cost: {
              type: 'number',
              format: 'float',
              description: 'Warehouse cost',
              example: 0
            },
            admin_cost: {
              type: 'number',
              format: 'float',
              description: 'Admin cost',
              example: 0
            },
            return_cost: {
              type: 'number',
              format: 'float',
              description: 'Return cost',
              example: 0
            },
            cost_to_serve: {
              type: 'number',
              format: 'float',
              description: 'Cost to serve',
              example: 0
            },
            profit: {
              type: 'number',
              format: 'float',
              description: 'Profit',
              example: 0
            },
            profitable: {
              type: 'boolean',
              description: 'Is profitable'
            }
          }
        },
        DropSizeResult: {
          type: 'object',
          properties: {
            fixed_cost: {
              type: 'number',
              format: 'float',
              description: 'Fixed cost',
              example: 0
            },
            unit_variable_cost: {
              type: 'number',
              format: 'float',
              description: 'Unit variable cost',
              example: 0
            },
            unit_revenue: {
              type: 'number',
              format: 'float',
              description: 'Unit revenue',
              example: 0
            },
            min_profitable_quantity: {
              type: 'number',
              format: 'float',
              description: 'Minimum profitable quantity',
              example: 0
            }
          }
        }
      },
      responses: {
        BadRequestError: {
          description: 'Bad request - Invalid input data',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        UnauthorizedError: {
          description: 'Unauthorized - Authentication required',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        NotFoundError: {
          description: 'Not found - Resource does not exist',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        InternalServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    './src/routes/**/*.js',
    './src/app.js'
  ]
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs
};
