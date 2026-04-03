import express from "express";
import cors from "cors";
import {
  productsRoutes,
  customersRoutes,
  salesRoutes,
  salePersonsRoutes,
} from "./routes/index.js";

const app = express();
const PORT = process.env.PORT || 3000;
//allow origins
const allowedOrigins = [
  "https://be-spoked-bikes-one.vercel.app",
  "http://localhost:5173",
];

app.use(express.json());

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

app.use("/api/products", productsRoutes);
app.use("/api/customers", customersRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/salesPersons", salePersonsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
