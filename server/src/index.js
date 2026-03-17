import express from "express";
import {
  productsRoutes,
  customersRoutes,
  salesRoutes,
  salePersonsRoutes,
} from "./routes/index.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = ["https://white-water-0cb109f1e.2.azurestaticapps.net"];

app.use(express.json());

app.use("/api/products", productsRoutes);
app.use("/api/customers", customersRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/salesPersons", salePersonsRoutes);

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
