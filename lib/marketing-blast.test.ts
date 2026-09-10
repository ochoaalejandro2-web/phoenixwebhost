import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const blastFiles = [
  "../app/marketing-blast/page.tsx",
  "../app/marketing-blast-order/page.tsx",
  "../public/marketing-blast.html",
  "../public/marketing-blast-order.html",
] as const;

function read(rel: (typeof blastFiles)[number]) {
  return readFileSync(new URL(rel, import.meta.url), "utf8");
}

test("marketing blast pages share the enriched site lime tokens", () => {
  const theme = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(theme, /--brand-green: #00c851/);
  assert.match(theme, /--brand-green-hover: #00b34a/);
  assert.match(theme, /--brand-green-deep: #008738/);
  assert.match(theme, /--brand-green-light: #d7f4e3/);
  assert.match(theme, /--color-brand-green:/);

  for (const file of blastFiles) {
    const src = read(file);
    assert.match(src, /#00c851/, `${file} should use site lime #00c851`);
    assert.match(src, /#00b34a/, `${file} should use lime-deep hover #00b34a`);
    assert.match(src, /#d7f4e3/, `${file} should use enriched greenLight #d7f4e3`);
    assert.doesNotMatch(src, /#22c55e/, `${file} should not use washed Tailwind green-500`);
    assert.doesNotMatch(src, /#16a34a/, `${file} should not use washed green-600 hover`);
    assert.doesNotMatch(src, /#f0fdf4/, `${file} should not use pastel green-50 fills`);
  }
});

test("appointment confirmation pricing states the monthly commitment", () => {
  for (const file of [
    "../app/marketing-blast/page.tsx",
    "../public/marketing-blast.html",
  ] as const) {
    const src = read(file);
    assert.match(src, /then \$29\/mo/);
    assert.match(src, /cancel anytime/);
    assert.match(src, /items-stretch/);
    assert.match(src, /bg-brand-greenDeep/);
    assert.match(src, /scroll-padding-top: 6rem/);
  }
});
