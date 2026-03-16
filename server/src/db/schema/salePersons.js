import { pgTable, varchar, date, serial } from "drizzle-orm/pg-core";

export const salePersons = pgTable("salePersons", {
  id: serial("id").primaryKey(),
  firstName: varchar("firstName", { length: 255 }).notNull(),
  lastName: varchar("lastName", { length: 255 }).notNull(),
  address: varchar("address", { length: 255 }).notNull(),
  phoneNumber: varchar("phoneNumber", { length: 255 }).notNull(),
  startDate: date(),
  terminationDate: date(),
  manager: varchar("manager", { length: 255 }),
});
