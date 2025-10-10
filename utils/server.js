// npm install node-appwrite express cors
import express from "express";
import cors from "cors";
import * as sdk from "node-appwrite";

const app = express();
app.use(cors());

const client = new sdk.Client()
  .setEndpoint("https://cloud.appwrite.io/v1") // or your Appwrite endpoint
  .setProject("68c3ec870024955539b0")
  .setKey("standard_4fff087f78f4cfe655cbcfb57b7f74c7e8bc1e5424bec781fa16215f2419d24f5f6e015c27ae7f08e604291da1a4b42e571500a329394c7b24f4f7d077238e8b68549d11a14867adb9a808060d2eed2ccae52668ac5cc4ed3bb00f34bf0b4b79429d596d17d5ab5647594165611a0cc52e4b0606f98759db58347ff54dedec15"); // 🚫 never expose this to frontend

const databases = new sdk.Databases(client);

// API route your frontend can call
app.get("/api/attributes", async (req, res) => {
  try {
    const databaseId = "68c3f10d002b0dfc0b2d";
    const customersId = "68e8e147003313b6e8c3";
    const response = await databases.listAttributes(databaseId, customersId);
    res.json(response);
  } catch (err) {
    console.error(" Error while fetching attributes:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(4000, () => console.log("✅ Server running on http://localhost:4000"));