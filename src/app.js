const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const errorHandler = require('./middleware/common/errorHandler');
const routes = require('./routes');
const { swaggerUi, specs } = require('./config/swagger');

const app = express();

// Security middleware
app.use(helmet());

// CORS
app.use(cors());

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customCss: `
    .swagger-ui .topbar { display: none }
    /* Hide example values in Responses section only; keep request body examples visible */
    .swagger-ui .responses-wrapper .example-value,
    .swagger-ui .responses-wrapper .model-example,
    .swagger-ui .response .example-value,
    .swagger-ui .response .model-example,
    .swagger-ui .responses-inner .example-value { display: none !important }
    /* Hide media type / content-type in Responses section */
    .swagger-ui .response-content-type,
    .swagger-ui .response .response-content-type,
    .swagger-ui .responses-wrapper .response-content-type,
    .swagger-ui .responses-inner .response-content-type,
    .swagger-ui .response-col_description .content-type { display: none !important }
  `,
  customSiteTitle: 'CTS Optimizer API Documentation'
}));

// Routes
app.use('/api', routes);

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the health status of the server (public - no auth required)
 *     tags: [Health]
 *     security: []
 *     responses:
 *       200:
 *         description: Server is running successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthCheck'
 */
// Health check (public - no auth required)
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running'
  });
});

// 404 handler - no route matched
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;

