import { db } from "../db/index.js";
import { salePersons } from "../db/schema/schema.js";
import { Router } from "express";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const data = await db.select().from(salePersons);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch salePersons" });
  }
});

router.post("/", async (req, res) => {
  try {
    const newSalePerson = req.body;

    const createSalePerson = await db
      .insert(salePersons)
      .values(newSalePerson)
      .returning();
    res.status(201).json(createSalePerson[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "failed to create salePersons" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updateSalePerson = req.body;
    const id = req.params.id;

    const editSalePerson = await db
      .update(salePersons)
      .set(updateSalePerson)
      .where(eq(salePersons.id, id))
      .returning();

    if (!editSalePerson.length) {
      return res.status(404).json({ message: "salePerson not found" });
    }
    res.json(editSalePerson[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "failed to update salePersons" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const deleteSalePerson = await db
      .delete(salePersons)
      .where(eq(salePersons.id, id))
      .returning();

    if (!deleteSalePerson.length) {
      return res.status(404).json({ message: "failed to delete" });
    }
    res.json({
      message: "salePerson deleted",
      salePerson: deleteSalePerson[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "failed to delete salePerson" });
  }
});
export const salePersonsRoutes = router;
