import express from "express";
import { productsRoutes } from "./routes/index.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/products", productsRoutes);

const allowedOrigins = [
  "http://localhost:5173",
  "https://white-water-0cb109f1e.2.azurestaticapps.net",
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
