import assert from "node:assert/strict";
import test from "node:test";
import {
  blobPathAllowed,
  canDeleteTaxCustomer,
  canDeleteTaxFile,
  canReadTaxFile,
  canUploadAsCustomer,
  canUploadAsStaff,
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

test("staff can upload filed copies into their own shop customer folder only", () => {
  const staff = { role: "staff" as const, clientId: "shop-a", userId: "staff-1" };
  assert.equal(canUploadAsStaff(staff, "shop-a"), true);
  assert.equal(canUploadAsStaff(staff, "shop-b"), false);
  assert.equal(
    blobPathAllowed(
      staff,
      "tax-portal/shop-a/cust-1/filed/2024/return.pdf",
      "cust-1",
    ),
    true,
  );
  assert.equal(
    blobPathAllowed(
      staff,
      "tax-portal/shop-b/cust-1/filed/2024/return.pdf",
      "cust-1",
    ),
    false,
  );
  const customer = {
    role: "customer" as const,
    clientId: "shop-a",
    userId: "cust-1",
  };
  assert.equal(canUploadAsStaff(customer, "shop-a"), false);
});

test("only staff can delete files, and only inside their own shop", () => {
  const staffA = { role: "staff" as const, clientId: "shop-a", userId: "staff-1" };
  const staffB = { role: "staff" as const, clientId: "shop-b", userId: "staff-2" };
  const customer = {
    role: "customer" as const,
    clientId: "shop-a",
    userId: "cust-1",
  };
  const file = { clientId: "shop-a", userId: "cust-1" };
  assert.equal(canDeleteTaxFile(staffA, file), true);
  assert.equal(canDeleteTaxFile(staffB, file), false);
  assert.equal(canDeleteTaxFile(customer, file), false);
  assert.equal(canDeleteTaxFile(customer, { clientId: "shop-a" }), false);
});

test("only staff can delete a customer profile, and shops stay isolated", () => {
  const staffA = { role: "staff" as const, clientId: "shop-a", userId: "staff-1" };
  const staffB = { role: "staff" as const, clientId: "shop-b", userId: "staff-2" };
  const customer = {
    role: "customer" as const,
    clientId: "shop-a",
    userId: "cust-1",
  };
  const otherCustomer = {
    role: "customer" as const,
    clientId: "shop-b",
    userId: "cust-2",
  };
  assert.equal(canDeleteTaxCustomer(staffA, customer), true);
  assert.equal(canDeleteTaxCustomer(staffB, customer), false);
  assert.equal(canDeleteTaxCustomer(staffA, otherCustomer), false);
  assert.equal(canDeleteTaxCustomer(customer, customer), false);
  assert.equal(canDeleteTaxCustomer(customer, otherCustomer), false);
  assert.equal(
    canDeleteTaxCustomer(staffA, { ...staffA, role: "staff" }),
    false,
  );
});

