import { db } from "../db/index.js";
import { products } from "../db/schema/schema.js";
import { Router } from "express";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const data = await db.select().from(products);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

router.post("/", async (req, res) => {
  try {
    const newProduct = req.body;

    const createProduct = await db
      .insert(products)
      .values(newProduct)
      .returning();
    res.status(201).json(createProduct[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "failed to create products" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updateProduct = req.body;
    const id = req.params.id;

    const editProduct = await db
      .update(products)
      .set(updateProduct)
      .where(eq(products.id, id))
      .returning();

    if (!editProduct.length) {
      return res.status(404).json({ message: "product not found" });
    }
    res.json(editProduct[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "failed to update products" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const deleteProduct = await db
      .delete(products)
      .where(eq(products.id, id))
      .returning();

    if (!deleteProduct.length) {
      return res.status(404).json({ message: "failed to delete" });
    }
    res.json({ message: "product deleted", product: deleteProduct[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "failed to delete product" });
  }
});
export const productsRoutes = router;
