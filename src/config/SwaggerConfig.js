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
        url: "https://render-worx-backend-service.onrender.com", // change in prod
        description: "Render api server",
      },
      {
        url: "http://localhost:4000", // change in prod
        description: "Local server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT", // optional
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  //apis: ["./src/routes/*.js", "./src/controllers/*.js"], // path to your route/controller files
 apis: ["./src/routes/AdminUserRoute.js","./src/routes/RoleRoute.js","./src/routes/ModuleRoute.js", "./src/controllers/AdminUserController.js", "./src/controllers/ModuleController.js", "./src/controllers/RoleController.js"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

module.exports = swaggerSpec;
