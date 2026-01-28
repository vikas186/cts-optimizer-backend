const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CTS Optimizer Backend API',
      version: '1.0.0',
      description: 'API documentation for CTS Optimizer Backend',
      contact: {
        name: 'API Support'
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Organization: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Organization UUID'
            },
            name: {
              type: 'string',
              description: 'Organization name'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp'
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'User UUID'
            },
            organization_id: {
              type: 'string',
              format: 'uuid',
              description: 'Organization UUID'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              description: 'User role'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp'
            }
          }
        },
        Customer: {
          type: 'object',
          properties: {
            customer_id: {
              type: 'string',
              description: 'Customer ID'
            },
            organization_id: {
              type: 'string',
              format: 'uuid',
              description: 'Organization UUID'
            },
            segment: {
              type: 'string',
              description: 'Customer segment'
            },
            revenue_per_unit: {
              type: 'number',
              format: 'float',
              description: 'Revenue per unit'
            }
          }
        },
        WarehouseCost: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Warehouse cost UUID'
            },
            organization_id: {
              type: 'string',
              format: 'uuid',
              description: 'Organization UUID'
            },
            pick_cost_per_line: {
              type: 'number',
              format: 'float',
              description: 'Pick cost per line'
            },
            pack_cost: {
              type: 'number',
              format: 'float',
              description: 'Pack cost'
            },
            pallet_handling_cost: {
              type: 'number',
              format: 'float',
              description: 'Pallet handling cost'
            },
            storage_cost_per_day: {
              type: 'number',
              format: 'float',
              description: 'Storage cost per day'
            },
            effective_from: {
              type: 'string',
              format: 'date-time',
              description: 'Effective from date'
            }
          }
        },
        Route: {
          type: 'object',
          properties: {
            route_id: {
              type: 'string',
              description: 'Route ID'
            },
            organization_id: {
              type: 'string',
              format: 'uuid',
              description: 'Organization UUID'
            },
            distance_km: {
              type: 'number',
              format: 'float',
              description: 'Distance in kilometers'
            }
          }
        },
        TransportCost: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Transport cost UUID'
            },
            route_id: {
              type: 'string',
              description: 'Route ID'
            },
            organization_id: {
              type: 'string',
              format: 'uuid',
              description: 'Organization UUID'
            },
            base_cost: {
              type: 'number',
              format: 'float',
              description: 'Base cost'
            },
            cost_per_kg: {
              type: 'number',
              format: 'float',
              description: 'Cost per kilogram'
            },
            cost_per_km: {
              type: 'number',
              format: 'float',
              description: 'Cost per kilometer'
            }
          }
        },
        Order: {
          type: 'object',
          properties: {
            order_id: {
              type: 'string',
              description: 'Order ID'
            },
            organization_id: {
              type: 'string',
              format: 'uuid',
              description: 'Organization UUID'
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
              description: 'Order date'
            }
          }
        },
        CostResult: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Cost result UUID'
            },
            order_id: {
              type: 'string',
              description: 'Order ID'
            },
            organization_id: {
              type: 'string',
              format: 'uuid',
              description: 'Organization UUID'
            },
            transport_cost: {
              type: 'number',
              format: 'float',
              description: 'Transport cost'
            },
            warehouse_cost: {
              type: 'number',
              format: 'float',
              description: 'Warehouse cost'
            },
            admin_cost: {
              type: 'number',
              format: 'float',
              description: 'Admin cost'
            },
            return_cost: {
              type: 'number',
              format: 'float',
              description: 'Return cost'
            },
            cost_to_serve: {
              type: 'number',
              format: 'float',
              description: 'Cost to serve'
            },
            profit: {
              type: 'number',
              format: 'float',
              description: 'Profit'
            },
            profitable: {
              type: 'boolean',
              description: 'Is profitable'
            },
            calculated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Calculation timestamp'
            }
          }
        },
        DropSizeResult: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Drop size result UUID'
            },
            order_id: {
              type: 'string',
              description: 'Order ID'
            },
            organization_id: {
              type: 'string',
              format: 'uuid',
              description: 'Organization UUID'
            },
            fixed_cost: {
              type: 'number',
              format: 'float',
              description: 'Fixed cost'
            },
            unit_variable_cost: {
              type: 'number',
              format: 'float',
              description: 'Unit variable cost'
            },
            unit_revenue: {
              type: 'number',
              format: 'float',
              description: 'Unit revenue'
            },
            min_profitable_quantity: {
              type: 'number',
              format: 'float',
              description: 'Minimum profitable quantity'
            },
            calculated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Calculation timestamp'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string',
              description: 'Error message'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'object'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js', './src/app.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;

