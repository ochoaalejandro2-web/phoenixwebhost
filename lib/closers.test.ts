import assert from "node:assert/strict";
import test from "node:test";
import {
  closerFromName,
  closerLeadNote,
  closerSellPath,
  isCloserSoldNote,
  launchSoldNote,
  parseCloserFromPath,
  sanitizeCloserCode,
} from "./closers.ts";
import { t } from "./i18n.ts";

test("closer codes stay short, lowercase, and reject junk", () => {
  assert.equal(sanitizeCloserCode("Jose"), "jose");
  assert.equal(sanitizeCloserCode(" ana-maria "), "ana-maria");
  assert.equal(sanitizeCloserCode("a"), "");
  assert.equal(sanitizeCloserCode("../admin"), "");
  assert.equal(sanitizeCloserCode("https://client.phxhosting.net/cart.php"), "");
  assert.equal(closerFromName("Ana María"), "ana-maria");
});

test("unique closer paths and query-style sell links stay on Phoenixwebhost", () => {
  assert.equal(closerSellPath("jose"), "/r/jose");
  assert.equal(closerSellPath("jose", "es"), "/es/r/jose");
  assert.deepEqual(parseCloserFromPath("/r/jose"), {
    code: "jose",
    locale: "en",
  });
  assert.deepEqual(parseCloserFromPath("/es/r/ana-maria"), {
    code: "ana-maria",
    locale: "es",
  });
  assert.equal(parseCloserFromPath("/s/desert-peak-roofing"), null);
});

test("sold-note copy is a missed-call gift, not a cash launch-fee payout", () => {
  const note = launchSoldNote("Jose (jose)");
  assert.match(note, /Missed-call text-back/);
  assert.match(note, /6 months free/);
  assert.match(note, /1 year at 50% off/);
  assert.match(note, /\$49 setup \+ \$29\/month/);
  assert.match(note, /Stripe succeeded/);
  assert.match(note, /Do not auto-payout/);
  assert.doesNotMatch(note, /Pay them the \$200 launch/);
  assert.match(note, /not a cash launch-fee payout/);
  assert.doesNotMatch(note, /Stripe Connect|transfer|split/i);
  assert.equal(isCloserSoldNote(note), true);
  assert.equal(
    isCloserSoldNote("Sold by Jose. Pay them the $200 launch after Stripe succeeded."),
    true,
  );
  const leadNote = closerLeadNote("jose");
  assert.match(leadNote, /Closer code jose/);
  assert.match(leadNote, /Missed-call text-back/);
  assert.doesNotMatch(leadNote, /Pay them the \$200 launch/);
});

test("public affiliate copy is a missed-call gift, not a cash launch-fee payout", () => {
  const en = t("en");
  const es = t("es");
  assert.match(en.affiliatesLead, /Missed-call text-back/);
  assert.match(en.affiliatesLead, /service credit/);
  assert.match(en.affiliatesLead, /not a cash payout/);
  assert.match(en.affiliatesRewardFree, /6 months/);
  assert.match(en.affiliatesRewardHalf, /1 year at 50%/);
  assert.match(en.affiliatesRewardAfter, /\$49 setup \+ \$29\/month/);
  assert.match(en.affiliatesPayBody, /does not send an automatic payout/);
  assert.match(en.affiliatesPayBody, /by hand/);
  assert.doesNotMatch(
    `${en.affiliatesLead} ${en.affiliatesPayBody}`,
    /pays you the launch fee|Pro is \$200/,
  );
  assert.match(es.affiliatesLead, /Texto si no contestan/);
  assert.match(es.affiliatesLead, /crédito de servicio/);
  assert.match(es.affiliatesLead, /no un pago en efectivo/);
  assert.match(es.affiliatesRewardFree, /6 meses/);
  assert.match(es.affiliatesRewardHalf, /1 año al 50%/);
  assert.match(es.affiliatesRewardAfter, /\$49 de instalación \+ \$29 al mes/);
  assert.match(es.affiliatesPayBody, /no envía un pago automático/);
  assert.doesNotMatch(
    `${es.affiliatesLead} ${es.affiliatesPayBody}`,
    /le paga el lanzamiento|Pro es \$200/,
  );
});
