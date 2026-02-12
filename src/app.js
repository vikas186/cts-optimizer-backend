const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const errorHandler = require('./middleware/common/errorHandler');
const routes = require('./routes');

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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .example-value { display: none !important }
    .swagger-ui .model-example { display: none !important }
    .swagger-ui .response-example { display: none !important }
    .swagger-ui .highlight-code { display: none !important }
    .swagger-ui .microlight { display: none !important }
    .swagger-ui .renderedMarkdown pre { display: none !important }
    .swagger-ui .opblock-body pre { display: none !important }
    .swagger-ui .opblock-body .highlight-code { display: none !important }
    .swagger-ui .response-col_description { display: none }
    .swagger-ui .response-col_links { display: none }
    .swagger-ui .response-content-type { display: none }
    .swagger-ui .response .example { display: none !important }
    .swagger-ui .response .examples { display: none !important }
    .swagger-ui .response .example-wrapper { display: none !important }
    .swagger-ui .response .example-value-wrapper { display: none !important }
  `,
  customSiteTitle: 'CTS Optimizer API Documentation',
  swaggerOptions: {
    defaultModelsExpandDepth: -1,
    defaultModelExpandDepth: -1,
    displayRequestDuration: true,
    docExpansion: 'list',
    filter: true,
    showExtensions: false,
    showCommonExtensions: false,
    tryItOutEnabled: true,
    requestSnippetsEnabled: false
  }
}));

// Routes
app.use('/api', routes);

// Health check
/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running'
  });
});

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;

