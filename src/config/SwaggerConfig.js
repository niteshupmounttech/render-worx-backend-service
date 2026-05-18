const swaggerJSDoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Render Worx Admin Service",
      version: "1.0.0",
      description: "API documentation for Admin Service",
    },
    servers: [
      {
        url: "https://render-worx-backend-service.onrender.com",
        description: "Render api server",
      },
      {
        url: "http://localhost:4000",
        description: "Local server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    "./src/routes/AdminUserRoute.js",
    "./src/routes/RoleRoute.js",
    "./src/routes/ModuleRoute.js",
    "./src/routes/HomeBannerRoute.js",
    "./src/routes/PortfolioRoute.js",
    "./src/controllers/AdminUserController.js",
    "./src/controllers/ModuleController.js",
    "./src/controllers/HomeBannerController.js",
    "./src/controllers/RoleController.js",
    "./src/controllers/PortfolioController.js",
  ],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

module.exports = swaggerSpec;
