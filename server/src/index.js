import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import matchRoutes from "./routes/matchRoutes.js";

dotenv.config({ path: new URL("../.env", import.meta.url) });

const app = express();
const requiredEnvVars = ["MONGODB_URI", "JWT_SECRET", "CLIENT_URL"];
const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingEnvVars.length > 0) {
  console.error(`Missing required environment variables: ${missingEnvVars.join(", ")}`);
  process.exit(1);
}

if (process.env.NODE_ENV === "production" && process.env.JWT_SECRET === "super-secret-key") {
  console.error("Refusing to start in production with an insecure JWT secret.");
  process.exit(1);
}

app.disable("x-powered-by");
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

app.use(
  cors({
    origin: process.env.NODE_ENV === 'production' 
      ? process.env.CLIENT_URL 
      : true,
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.status(200).json({ message: "StudyMatch API is running" });
});

// Proper API route organization
app.use("/api/auth", authRoutes);
app.use("/api/match", matchRoutes);
app.use("/api", (_req, res) => {
  res.status(404).json({ message: "API route not found" });
});
app.use((error, _req, res, _next) => {
  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({ message: "Invalid JSON payload" });
  }

  if (error.type === "entity.too.large") {
    return res.status(413).json({ message: "Request body is too large" });
  }

  console.error("Unhandled server error:", error);
  return res.status(500).json({ message: "Internal server error" });
});

const port = process.env.PORT || 5000;

connectDB().then(() => {
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  const shutdown = async () => {
    server.close(async () => {
      await mongoose.connection.close();
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
});
