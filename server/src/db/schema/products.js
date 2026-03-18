import {
  pgTable,
  serial,
  varchar,
  doublePrecision,
  integer,
} from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  manufacturer: varchar("manufacturer", { length: 255 }),
  style: varchar("style", { length: 255 }),
  purchasePrice: doublePrecision("purchasePrice"),
  salePrice: doublePrecision("salePrice"),
  qty: integer("qty"),
  quantityOnHand: integer("quantityOnHand"),
  commissionPercentage: doublePrecision("commissionPercentage"),
});
