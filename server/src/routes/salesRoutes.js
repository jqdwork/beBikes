import { db } from "../db/index.js";
import { sales } from "../db/schema/schema.js";
import { products } from "../db/schema/products.js";
import { customers } from "../db/schema/customers.js";
import { salePersons } from "../db/schema/salePersons.js";
import { Router } from "express";
import { eq, gte, lte, and } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { from, to } = req.query;

    const conditions = [];
    if (from) conditions.push(gte(sales.date, from));
    if (to) conditions.push(lte(sales.date, to));

    const data = await db
      .select()
      .from(sales)
      .leftJoin(products, eq(sales.productsId, products.id))
      .leftJoin(customers, eq(sales.customersId, customers.id))
      .leftJoin(salePersons, eq(sales.salePersonsId, salePersons.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch sales" });
  }
});

router.post("/filter", async (req, res) => {
  try {
    const { from, to } = req.body;

    const conditions = [];
    if (from) conditions.push(gte(sales.date, from));
    if (to) conditions.push(lte(sales.date, to));

    const data = await db
      .select()
      .from(sales)
      .leftJoin(products, eq(sales.productsId, products.id))
      .leftJoin(customers, eq(sales.customersId, customers.id))
      .leftJoin(salePersons, eq(sales.salePersonsId, salePersons.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch sales" });
  }
});

router.post("/", async (req, res) => {
  try {
    const newSale = req.body;

    const createSale = await db.insert(sales).values(newSale).returning();
    res.status(201).json(createSale[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "failed to create sales" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updateSale = req.body;
    const id = req.params.id;

    const editSale = await db
      .update(sales)
      .set(updateSale)
      .where(eq(sales.id, id))
      .returning();

    if (!editSale.length) {
      return res.status(404).json({ message: "sale not found" });
    }
    res.json(editSale[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "failed to update sales" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const deleteSale = await db
      .delete(sales)
      .where(eq(sales.id, id))
      .returning();

    if (!deleteSale.length) {
      return res.status(404).json({ message: "failed to delete" });
    }
    res.json({ message: "sale deleted", sale: deleteSale[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "failed to delete sale" });
  }
});
export const salesRoutes = router;
