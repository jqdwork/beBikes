import { pgTable, integer, date, doublePrecision } from "drizzle-orm/pg-core";
import { customers } from "./customers.js";
import { products } from "./products.js";
import { salePersons } from "./salePersons.js";

export const sales = pgTable("sales", {
  id: integer("id").primaryKey(),
  productsId: integer("productsId")
    .notNull()
    .references(() => products.id),
  customersId: integer("customersId")
    .notNull()
    .references(() => customers.id),
  salePersonsId: integer("salePersonsId")
    .notNull()
    .references(() => salePersons.id),
  date: date("date"),
  price: doublePrecision("price"),
  commission: doublePrecision("commission"),
});
