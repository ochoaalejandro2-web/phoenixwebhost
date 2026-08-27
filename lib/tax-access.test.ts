import assert from "node:assert/strict";
import test from "node:test";
import {
  blobPathAllowed,
  canReadTaxFile,
  canUploadAsCustomer,
} from "./tax-access.ts";

test("staff can only read files for their own tax office", () => {
  const staff = { role: "staff" as const, clientId: "shop-a", userId: "staff-1" };
  assert.equal(
    canReadTaxFile(staff, { clientId: "shop-a", userId: "cust-1" }),
    true,
  );
  assert.equal(
    canReadTaxFile(staff, { clientId: "shop-b", userId: "cust-1" }),
    false,
  );
});

test("a customer cannot read another customer folder", () => {
  const customer = {
    role: "customer" as const,
    clientId: "shop-a",
    userId: "cust-1",
  };
  assert.equal(
    canReadTaxFile(customer, { clientId: "shop-a", userId: "cust-1" }),
    true,
  );
  assert.equal(
    canReadTaxFile(customer, { clientId: "shop-a", userId: "cust-2" }),
    false,
  );
  assert.equal(
    canReadTaxFile(customer, { clientId: "shop-b", userId: "cust-1" }),
    false,
  );
});

test("uploads stay inside the signed-in customer prefix", () => {
  const session = {
    role: "customer" as const,
    clientId: "shop-a",
    userId: "cust-1",
  };
  assert.equal(canUploadAsCustomer(session, "shop-a"), true);
  assert.equal(canUploadAsCustomer(session, "shop-b"), false);
  assert.equal(
    blobPathAllowed(session, "tax-portal/shop-a/cust-1/file.pdf"),
    true,
  );
  assert.equal(
    blobPathAllowed(session, "tax-portal/shop-b/cust-1/file.pdf"),
    false,
  );
  assert.equal(
    blobPathAllowed(session, "tax-portal/shop-a/cust-2/file.pdf"),
    false,
  );
});
