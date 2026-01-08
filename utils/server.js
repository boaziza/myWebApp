// utils/server.js
import express from "express";
import cors from "cors";
import { Query, ID } from "node-appwrite";
import * as sdk from "node-appwrite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : [];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.warn(`❌ Blocked by CORS: ${origin}`);
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// ✅ Appwrite client setup
const client = new sdk.Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1")
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new sdk.Databases(client);

// ✅ Shared database + collections
const databaseId = process.env.APPWRITE_DATABASE_ID;
const collections = {
  index: process.env.APPWRITE_INDEX_ID,
  payments: process.env.APPWRITE_PAYMENTS_ID,
  situation: process.env.APPWRITE_SITUATION_ID,
  gain: process.env.APPWRITE_GAIN_ID,
  loans: process.env.APPWRITE_LOANS_ID,
  fiche: process.env.APPWRITE_FICHE_ID,
  stock: process.env.APPWRITE_STOCK_ID,
  gainTesting: process.env.APPWRITE_GAINTESTING_ID,
};

// ✅ Helper: Fetch all documents with pagination
async function fetchAllDocuments(collectionId) {
  const limit = 100;
  let all = [];
  let cursor = null;

  while (true) {
    const queries = [Query.limit(limit)];
    if (cursor) queries.push(Query.cursorAfter(cursor));

    const result = await databases.listDocuments(databaseId, collectionId, queries);
    all.push(...result.documents);

    if (result.documents.length < limit) break;
    cursor = result.documents[result.documents.length - 1].$id;
  }

  return all;
}

// ✅ Route: Get attributes (fields) for one collection
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

// ✅ Route: GET documents from a collection
app.get("/api/documents/:collection", async (req, res) => {
  const { collection } = req.params;
  const collectionId = collections[collection];

  if (!collectionId) {
    return res.status(400).json({ error: `Collection '${collection}' not found` });
  }

  try {
    const documents = await fetchAllDocuments(collectionId);
    res.json({ documents });
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Route: GET available tables
app.get("/api/tables", (req, res) => {
  res.json({
    databaseId,
    availableTables: collections,
  });
});

// ✅ Route: Universal CREATE document
app.post("/api/create/:collection", async (req, res) => {
  try {
    const tableKey = req.params.collection;
    const data = req.body;

    const tableId = collections[tableKey];
    
    if (!tableId) {
      return res.status(400).json({ error: `Collection '${tableKey}' not found` });
    }

    const result = await databases.createDocument(
      databaseId,
      tableId,
      ID.unique(),
      data
    );

    res.json({ success: true, result });

  } catch (error) {
    console.error("Create error:", error);
    res.status(500).json({ error: "Failed to create document", details: error.message });
  }
});

// ✅ Route: UPDATE document by searching a field
app.patch("/api/update-by-field/:collection", async (req, res) => {
  try {
    const { collection } = req.params;
    const { searchField, searchValue, updateData } = req.body;
    
    const collectionId = collections[collection];
    if (!collectionId) {
      return res.status(400).json({ error: `Collection '${collection}' not found` });
    }

    // Find document(s) matching the search criteria
    const findResult = await databases.listDocuments(
      databaseId,
      collectionId,
      [Query.equal(searchField, searchValue)]
    );

    if (findResult.documents.length === 0) {
      return res.status(404).json({ error: "Document not found" });
    }

    // Update the first matching document
    const documentId = findResult.documents[0].$id;

    const updateResult = await databases.updateDocument(
      databaseId,
      collectionId,
      documentId,
      updateData
    );

    res.json({ success: true, result: updateResult });
  } catch (error) {
    console.error("Update by field error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Route: UPDATE document by ID directly
app.patch("/api/update/:collection/:documentId", async (req, res) => {
  try {
    const { collection, documentId } = req.params;
    const updateData = req.body;
    
    const collectionId = collections[collection];
    if (!collectionId) {
      return res.status(400).json({ error: `Collection '${collection}' not found` });
    }

    const updateResult = await databases.updateDocument(
      databaseId,
      collectionId,
      documentId,
      updateData
    );

    res.json({ success: true, result: updateResult });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Route: DELETE document by ID
app.delete("/api/delete/:collection/:documentId", async (req, res) => {
  try {
    const { collection, documentId } = req.params;
    
    const collectionId = collections[collection];
    if (!collectionId) {
      return res.status(400).json({ error: `Collection '${collection}' not found` });
    }

    await databases.deleteDocument(
      databaseId,
      collectionId,
      documentId
    );

    res.json({ success: true, message: "Document deleted" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Route: Query documents with filters
app.post("/api/query/:collection", async (req, res) => {
  try {
    const { collection } = req.params;
    const { filters } = req.body; // Array of query objects: [{field, operator, value}]
    
    const collectionId = collections[collection];
    if (!collectionId) {
      return res.status(400).json({ error: `Collection '${collection}' not found` });
    }

    const queries = [];
    
    if (filters && Array.isArray(filters)) {
      filters.forEach(filter => {
        switch (filter.operator) {
          case "equal":
            queries.push(Query.equal(filter.field, filter.value));
            break;
          case "notEqual":
            queries.push(Query.notEqual(filter.field, filter.value));
            break;
          case "greaterThan":
            queries.push(Query.greaterThan(filter.field, filter.value));
            break;
          case "lessThan":
            queries.push(Query.lessThan(filter.field, filter.value));
            break;
          case "search":
            queries.push(Query.search(filter.field, filter.value));
            break;
          default:
            break;
        }
      });
    }

    const result = await databases.listDocuments(
      databaseId,
      collectionId,
      queries
    );

    res.json({ success: true, documents: result.documents });
  } catch (error) {
    console.error("Query error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Health check
app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    time: new Date().toISOString(),
    collections: Object.keys(collections)
  });
});

// ✅ Start server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log("✅ Server running successfully!");
  console.log(`   Local:     http://localhost:${port}`);
  console.log(`   Health:    http://localhost:${port}/health`);
  console.log(`   Frontend:  https://boaziza.github.io/myWebApp`);
});