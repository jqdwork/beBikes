import { relations } from "drizzle-orm";
import { products } from "./products.js";
import { customers } from "./customers.js";
import { salePersons } from "./salePersons.js";
import { sales } from "./sales.js";

export const salesRelations = relations(sales, ({ one }) => ({
  product: one(products, {
    fields: [sales.productsId],
    references: [products.id],
  }),
  customer: one(customers, {
    fields: [sales.customersId],
    references: [customers.id],
  }),
  salePerson: one(salePersons, {
    fields: [sales.salePersonsId],
    references: [salePersons.id],
  }),
}));
