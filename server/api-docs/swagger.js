const swaggerJsDoc = require('swagger-jsdoc');
require('dotenv').config();

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.1.0',
        info: {
            title: 'Connectify API Documentation',
            version: '1.0.0',
            description: 'API Documentation',
            contact: {
                name: 'Connectify',
                url: `${process.env.FRONTEND_URL}`,
                email: `${process.env.EMAIL_USER}`,
            },
        },
        servers: [
            {
                url: `${process.env.BACKEND_URL}`,
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./routes/*.route.js','./models/*.model.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
module.exports = swaggerDocs;