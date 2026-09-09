import express from "express";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleAIChat, handleAIHealth } from "./routes/ai";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: "5mb" }));
  app.use(express.urlencoded({ extended: true }));

  // Health & demo
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });
  app.get("/api/demo", handleDemo);

  // AI routes
  app.get("/api/ai/health", handleAIHealth);
  app.post("/api/ai/chat", handleAIChat);

  return app;
}
