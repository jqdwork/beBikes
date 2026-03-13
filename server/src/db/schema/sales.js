import { pgTable, serial, date, doublePrecision } from "drizzle-orm/pg-core";
import { customers } from "./customers";
import { products } from "./products";
import { salePersons } from "./salePersons";

export const sales = pgTable("sales", {
  id: serial("id").primaryKey(),
  productsId: serial("productsId")
    .notNull()
    .references(() => products.id),
  customersId: serial("customersId")
    .notNull()
    .references(() => customers.id),
  salePersonsId: serial("salePersonsId")
    .notNull()
    .references(() => salePersons.id),
  date: date("date"),
  price: doublePrecision("price"),
  commission: doublePrecision("commission"),
});
