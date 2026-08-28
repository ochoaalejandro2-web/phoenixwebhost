import assert from "node:assert/strict";
import test from "node:test";
import { COMPANY } from "./config.ts";

test("public marketing phone is Alex’s Phoenixwebhost number", () => {
  assert.equal(COMPANY.phone, "(480) 953-2393");
  assert.equal(COMPANY.telHref, "tel:4809532393");
  assert.equal(COMPANY.email, "hello@phoenixwebhost.com");
});
