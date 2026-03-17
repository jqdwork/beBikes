import { db } from "../db/index.js";
import { customers } from "../db/schema/schema.js";
import { Router } from "express";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const data = await db.select().from(customers);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch customers" });
  }
});

router.post("/", async (req, res) => {
  try {
    const newCustomer = req.body;

    const createCustomer = await db
      .insert(customers)
      .values(newCustomer)
      .returning();
    res.status(201).json(createCustomer[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "failed to create customers" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updateCustomer = req.body;
    const id = req.params.id;

    const editCustomer = await db
      .update(customers)
      .set(updateCustomer)
      .where(eq(customers.id, id))
      .returning();

    if (!editCustomer.length) {
      return res.status(404).json({ message: "customer not found" });
    }
    res.json(editCustomer[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "failed to update customers" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const deleteCustomer = await db
      .delete(customers)
      .where(eq(customers.id, id))
      .returning();

    if (!deleteCustomer.length) {
      return res.status(404).json({ message: "failed to delete" });
    }
    res.json({ message: "customer deleted", customer: deleteCustomer[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "failed to delete customer" });
  }
});
export const customersRoutes = router;
