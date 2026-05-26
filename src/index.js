require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const connectDB = require("./config/DBConfig");
const adminUserRoutes = require("./routes/AdminUserRoute");
const moduleRoutes = require("./routes/ModuleRoute");
const roleRoutes = require("./routes/RoleRoute");
const locationRoutes = require("./routes/LocationRoute");
const appContentRoutes = require("./routes/AppContentRoute");
const homeBannerRoutes = require("./routes/HomeBannerRoute");
const portfolioRoutes = require("./routes/PortfolioRoute");
const contactInfoRoutes = require("./routes/ContactInfoRoute");
const ourServiceRoutes = require("./routes/OurServiceRoute");
const blogRoutes = require("./routes/BlogRoute");
const enquiryRoutes = require("./routes/EnquiryRoute");
const dashboardRoutes = require("./routes/DashboardRoute");
const aboutUsRoutes = require("./routes/AboutUsRoute");
const swaggerSpec = require("./config/SwaggerConfig"); // 👈 import swagger config

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));


app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Swagger docs should match API versioning
app.use("/admin/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ✅ All admin routes
app.use("/admin/user", adminUserRoutes);
// ✅ Module routes
app.use("/admin/module", moduleRoutes);
// ✅ Role routes
app.use("/admin/role", roleRoutes);

// ✅ Location routes
app.use("/admin/location", locationRoutes);

// ✅ App Content routes
app.use("/admin/content", appContentRoutes);

// ✅ Home Banner routes
app.use("/admin/home", homeBannerRoutes);

// ✅ Portfolio routes
app.use("/admin/portfolio", portfolioRoutes);

// ✅ Contact Info routes
app.use("/admin/contact", contactInfoRoutes);

// ✅ Our Services routes
app.use("/admin/services", ourServiceRoutes);

// ✅ Blog routes
app.use("/admin/blog", blogRoutes);

// ✅ Enquiry routes
app.use("/admin/enquiry", enquiryRoutes);

// ✅ Dashboard routes
app.use("/admin/dashboard", dashboardRoutes);

// ✅ About Us routes
app.use("/admin/about", aboutUsRoutes);


// Health check
app.get("/health", (_, res) => res.json({ status: "up" }));

const PORT = process.env.PORT || 4000;
connectDB().then(() =>
  app.listen(PORT, () => console.log(`🚀 Admin Service running on port ${PORT}`))
);
