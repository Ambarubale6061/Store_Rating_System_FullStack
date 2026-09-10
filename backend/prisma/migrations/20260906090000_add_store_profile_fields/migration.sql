-- AlterTable: extend "stores" with optional profile fields used by the
-- Store Details page (phone, description, business hours, logo, and
-- multi-value categories/services). All nullable or defaulted so this is
-- safe to run against a database that already has store rows.
ALTER TABLE "stores"
ADD COLUMN "phone" TEXT,
  ADD COLUMN "description" TEXT,
  ADD COLUMN "businessHours" TEXT,
  ADD COLUMN "logoUrl" TEXT,
  ADD COLUMN "categories" TEXT [] NOT NULL DEFAULT ARRAY []::TEXT [],
  ADD COLUMN "services" TEXT [] NOT NULL DEFAULT ARRAY []::TEXT [];