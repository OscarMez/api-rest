require('dotenv').config();
console.log('JWT_SECRET:', process.env.JWT_SECRET);

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');

const jwt = require('jsonwebtoken'); // <-- Esto soluciona el error de jwt no definido




const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

// Swagger documentation
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Event Management API',
      version: '1.0.0',
      description: 'API for managing events and registrations'
    },
    servers: [
      {
        url: 'http://localhost:3000'
      }
    ],
    tags: [
      {
        name: 'Auth',
        description: 'Endpoints for user authentication and registration'
      },
      {
        name: 'Events',
        description: 'Endpoints for managing events'
      }
    ]
  },
  apis: ['./src/routes/*.js']
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Database sync and server start
const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
// IMPRIMIR
  
});