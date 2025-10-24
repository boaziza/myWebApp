// utils/server.js
import express from "express";
import cors from "cors";
import * as sdk from "node-appwrite";
import dotenv from "dotenv";

dotenv.config(); // Load .env if present

const app = express();
app.use(express.json());

// Allow limited origins
const allowedOrigins = [
  "https://boaziza.github.io/myWebApp",
  "http://localhost:5500"
];
app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (!allowedOrigins.includes(origin)) {
      return callback(new Error("CORS not allowed"), false);
    }
    return callback(null, true);
  }
}));

// Appwrite client
const client = new sdk.Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1")
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new sdk.Databases(client);

app.get("/api/attributes", async (req, res) => {
  try {
    const response = await databases.listAttributes(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_CUSTOMERS_ID
    );
    res.json(response);
  } catch (err) {
    console.error("Error fetching attributes:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/health", (req, res) => res.json({ status: "ok" }));

const port = process.env.PORT || 5500;
app.listen(port, () => console.log(`✅ Server running on http://localhost:${port} and https://boaziza.github.io/myWebApp`));
