// utils/server.js
import express from "express";
import cors from "cors";
import * as sdk from "node-appwrite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// ✅ Allow only trusted origins
const allowedOrigins = [
  "https://boaziza.github.io",  // Your GitHub Pages frontend
  "http://localhost:5500",      // VSCode Live Server
  "http://127.0.0.1:5501",      // Alternate local test
  "http://localhost:4000"       // Local backend
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true); // allow server-to-server calls
      if (!allowedOrigins.includes(origin)) {
        return callback(new Error(`CORS not allowed from origin: ${origin}`), false);
      }
      return callback(null, true);
    },
  })
);

// ✅ Appwrite client setup
const client = new sdk.Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1")
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY); // Server key — NEVER expose in frontend

const databases = new sdk.Databases(client);

// ✅ Shared database + collections
const databaseId = process.env.APPWRITE_DATABASE_ID;
const collections = {
  customers: process.env.APPWRITE_CUSTOMERS_ID,
  loans: process.env.APPWRITE_LOANS_ID,
  fiche: process.env.APPWRITE_FICHE_ID,
  gain: process.env.APPWRITE_GAIN_ID,
  payments: process.env.APPWRITE_PAYMENTS_ID,
  stock: process.env.APPWRITE_STOCK_ID
};

// ✅ Route 1: Get attributes (fields) for one collection
app.get("/api/attributes/:collection", async (req, res) => {
  const { collection } = req.params;
  const collectionId = collections[collection];

  if (!collectionId) {
    return res.status(400).json({ error: `Invalid collection name: ${collection}` });
  }

  try {
    const response = await databases.listAttributes(databaseId, collectionId);
    res.json(response);
  } catch (err) {
    console.error(`Error fetching attributes for ${collection}:`, err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Route 2: (Optional) Get both attributes in one go
app.get("/api/attributes", async (req, res) => {
  try {
    const [customers, loans] = await Promise.all([
      databases.listAttributes(databaseId, collections.customers),
      databases.listAttributes(databaseId, collections.fiche),
      databases.listAttributes(databaseId, collections.loans)
    ]);

    res.json({ customers, loans, fiche });
  } catch (err) {
    console.error("Error fetching both customers and loans attributes:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET documents from a collection
app.get("/api/documents/:collection", async (req, res) => {
  const { collection } = req.params;
  const collectionId = collections[collection];

  if (!collectionId) {
    return res.status(400).json({ error: `Collection '${collection}' not found` });
  }

  try {
    const response = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID,
      collectionId
    );
    res.json(response);
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/tables", (req, res) => {
  // You can return both the collection names and their IDs
  res.json({
    databaseId,
    availableTables: collections,
  });
});

// ✅ Health check
app.get("/health", (req, res) => res.json({ status: "ok", time: new Date().toISOString() }));

// ✅ Start server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log("✅ Server running successfully!");
  console.log(`   Local:     http://localhost:${port}`);
  console.log(`   Frontend:  https://boaziza.github.io/myWebApp`);
});
