CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"manufacturer" varchar(255),
	"style" varchar(255),
	"purchasePrice" double precision,
	"salePrice " double precision,
	"qty" integer,
	"quantityOnHand" integer,
	"commissionPercentage" double precision
);
--> statement-breakpoint
CREATE TABLE "customers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"address" varchar(255) NOT NULL,
	"phoneNumber" varchar(255) NOT NULL,
	"startDate" date
);
--> statement-breakpoint
CREATE TABLE "salePersons" (
	"id" serial PRIMARY KEY NOT NULL,
	"firstName" varchar(255) NOT NULL,
	"lastName" varchar(255) NOT NULL,
	"address" varchar(255) NOT NULL,
	"phoneNumber" varchar(255) NOT NULL,
	"startDate" date,
	"terminationDate" date,
	"manager" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "sales" (
	"id" serial PRIMARY KEY NOT NULL,
	"productsId" serial NOT NULL,
	"customersId" serial NOT NULL,
	"salePersonsId" serial NOT NULL,
	"date" date,
	"price" double precision,
	"commission" double precision
);
--> statement-breakpoint
ALTER TABLE "sales" ADD CONSTRAINT "sales_productsId_products_id_fk" FOREIGN KEY ("productsId") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales" ADD CONSTRAINT "sales_customersId_customers_id_fk" FOREIGN KEY ("customersId") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales" ADD CONSTRAINT "sales_salePersonsId_salePersons_id_fk" FOREIGN KEY ("salePersonsId") REFERENCES "public"."salePersons"("id") ON DELETE no action ON UPDATE no action;