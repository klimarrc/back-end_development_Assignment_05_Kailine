import express, { Express } from "express";
import helmet, { hidePoweredBy } from "helmet";
import dotenv from "dotenv";
// Load environment variables BEFORE your internal imports!
dotenv.config();


import eventPostRoutes from "./api/v1/routes/eventPostRoutes";
import morgan from "morgan";
import setupSwagger from "./config/swagger";


// Load environment variables BEFORE your internal imports!
dotenv.config();

const app: Express = express();


app.use(helmet({
  contentSecurityPolicy: false, // APIs return JSON, not HTML
  crossOriginEmbedderPolicy: false,
  referrerPolicy: {
    policy: "no-referrer",
  },
  frameguard: {
    action: "deny",
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
  xssFilter: true,
  noSniff: true,
  hidePoweredBy: true,
})); // Apply basic Helmet security

app.set("json spaces", 2); // set JSON response indentation to 2 spaces for readability

app.use(express.json()); //  use JSON body parsing


app.use(morgan("combined")); //  use morgan for logging


// GET request at the app root
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Health check route
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

app.use("/api/v1/events", eventPostRoutes);

// Export the app
setupSwagger(app);
export default app;