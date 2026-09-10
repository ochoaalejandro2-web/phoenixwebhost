'use client';

import { useEffect } from 'react';

const bodyHTML = `
<!-- NAVBAR -->
  <nav class="bg-black sticky top-0 z-50">
    <div class="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-lg bg-brand flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25M6.75 17.25L1.5 12l5.25-5.25M14.25 3.75l-4.5 16.5"/></svg>
        </div>
        <span class="text-white font-bold text-lg tracking-tight">Phoenixwebhost<span class="text-brand">.com</span></span>
      </div>
      <div class="hidden sm:flex items-center gap-4 text-sm text-gray-300">
        <a href="tel:4809532393" class="hover:text-brand transition">📞 (480) 953-2393</a>
        <a href="mailto:hello@phoenixwebhost.com" class="hover:text-brand transition">✉️ hello@phoenixwebhost.com</a>
      </div>
    </div>
  </nav>

  <!-- MAIN -->
  <main class="flex-1 max-w-3xl mx-auto w-full px-4 pt-12 sm:pt-16 pb-8">

    <!-- HEADER -->
    <div class="text-center mb-8">
      <h1 class="text-3xl sm:text-4xl font-extrabold mb-2">Marketing Blast <span class="text-brand">Order</span></h1>
      <p class="text-gray-500 text-base">Reach your customers with calls, texts &amp; emails — powered by Phoenixwebhost Inc.</p>
    </div>

    <!-- PROGRESS BAR -->
    <div class="mb-10" id="progressContainer">
      <div class="flex items-center justify-between max-w-xl mx-auto">
        <template id="stepDots"></template>
      </div>
      <p class="text-center text-sm text-gray-500 mt-3" id="progressLabel">Step 1 of 6</p>
    </div>

    <!-- STEP PANELS -->
    <form id="orderForm" novalidate>

      <!-- ========== STEP 1: SERVICE ========== -->
      <div class="step-panel fade-in" data-step="1">
        <h2 class="text-xl font-bold mb-1">Choose Your Service</h2>
        <p class="text-gray-500 text-sm mb-5">Select the outreach channel for your campaign.</p>

        <div class="space-y-3" id="serviceOptions">
          <div>
            <input type="radio" name="service" id="svc-calls" value="calls" class="hidden peer" required>
            <label for="svc-calls" class="radio-card block border-2 border-gray-200 rounded-xl p-4">
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-lg mr-1">📞</span>
                  <span class="font-semibold">Calls Only</span>
                </div>
                <span class="font-bold text-brand">$49<span class="text-xs font-normal text-gray-400"> / 1,000 contacts</span></span>
              </div>
            </label>
          </div>
          <div>
            <input type="radio" name="service" id="svc-texts" value="texts" class="hidden peer">
            <label for="svc-texts" class="radio-card block border-2 border-gray-200 rounded-xl p-4">
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-lg mr-1">📱</span>
                  <span class="font-semibold">Texts Only</span>
                </div>
                <span class="font-bold text-brand">$29<span class="text-xs font-normal text-gray-400"> / 1,000 contacts</span></span>
              </div>
            </label>
          </div>
          <div>
            <input type="radio" name="service" id="svc-emails" value="emails" class="hidden peer">
            <label for="svc-emails" class="radio-card block border-2 border-gray-200 rounded-xl p-4">
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-lg mr-1">📧</span>
                  <span class="font-semibold">Emails Only</span>
                </div>
                <span class="font-bold text-brand">$19<span class="text-xs font-normal text-gray-400"> / 1,000 contacts</span></span>
              </div>
            </label>
          </div>
          <div>
            <input type="radio" name="service" id="svc-bundle" value="bundle" class="hidden peer" checked>
            <label for="svc-bundle" class="radio-card block border-2 border-brand rounded-xl p-4 relative overflow-hidden bg-brand-light">
              <span class="absolute top-0 right-0 bg-brand text-white text-[10px] font-bold uppercase px-3 py-0.5 rounded-bl-lg">Best Value</span>
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-lg mr-1">🔥</span>
                  <span class="font-semibold">Full Bundle</span>
                  <span class="text-xs text-gray-500 ml-1">(Calls + Texts + Emails)</span>
                </div>
                <span class="font-bold text-brand">$79<span class="text-xs font-normal text-gray-400"> / 1,000 contacts</span></span>
              </div>
            </label>
          </div>
        </div>

        <!-- Add-on -->
        <div class="mt-6 border-t border-gray-100 pt-5">
          <p class="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-3">Optional Add-on</p>
          <label class="radio-card flex items-start gap-3 border-2 border-gray-200 rounded-xl p-4 cursor-pointer hover:border-brand transition" id="addonLabel">
            <input type="checkbox" id="addonConfirmation" class="mt-1 w-5 h-5 accent-brand rounded">
            <div>
              <span class="font-semibold">✅ Appointment Confirmation Calls</span>
              <p class="text-sm font-semibold text-gray-700 mt-0.5">$49 setup, then $29/mo · cancel anytime</p>
            </div>
          </label>
        </div>

        <p class="text-red-500 text-sm mt-3 hidden" id="err-step1">Please select a service to continue.</p>
      </div>

      <!-- ========== STEP 2: FREQUENCY ========== -->
      <div class="step-panel fade-in hidden" data-step="2">
        <h2 class="text-xl font-bold mb-1">Choose Frequency</h2>
        <p class="text-gray-500 text-sm mb-5">How often should we run your campaign?</p>

        <div class="space-y-3">
          <div>
            <input type="radio" name="frequency" id="freq-once" value="once" class="hidden peer" required>
            <label for="freq-once" class="radio-card block border-2 border-gray-200 rounded-xl p-4">
              <div class="flex items-center justify-between">
                <span class="font-semibold">One-time blast</span>
                <span class="text-sm text-gray-500">Included in price</span>
              </div>
            </label>
          </div>
          <div>
            <input type="radio" name="frequency" id="freq-2x" value="2x" class="hidden peer">
            <label for="freq-2x" class="radio-card block border-2 border-gray-200 rounded-xl p-4">
              <div class="flex items-center justify-between">
                <span class="font-semibold">2× per month</span>
                <span class="text-sm text-brand font-medium">+20% to total</span>
              </div>
            </label>
          </div>
          <div>
            <input type="radio" name="frequency" id="freq-weekly" value="weekly" class="hidden peer">
            <label for="freq-weekly" class="radio-card block border-2 border-gray-200 rounded-xl p-4">
              <div class="flex items-center justify-between">
                <span class="font-semibold">Weekly (4×/month)</span>
                <span class="text-sm text-brand font-medium">+50% to total</span>
              </div>
            </label>
          </div>
          <div>
            <input type="radio" name="frequency" id="freq-monthly" value="monthly" class="hidden peer">
            <label for="freq-monthly" class="radio-card block border-2 border-gray-200 rounded-xl p-4">
              <div class="flex items-center justify-between">
                <span class="font-semibold">Monthly recurring</span>
                <span class="text-sm text-gray-500">Same price, auto-renews</span>
              </div>
            </label>
          </div>
        </div>

        <p class="text-red-500 text-sm mt-3 hidden" id="err-step2">Please select a frequency.</p>
      </div>

      <!-- ========== STEP 3: UPLOAD LIST ========== -->
      <div class="step-panel fade-in hidden" data-step="3">
        <h2 class="text-xl font-bold mb-1">Upload Contact List</h2>
        <p class="text-gray-500 text-sm mb-5">Upload a CSV or Excel file, or just tell us how many contacts.</p>

        <div class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-brand transition cursor-pointer" id="dropZone">
          <input type="file" id="fileUpload" accept=".csv,.xlsx,.xls" class="hidden">
          <div class="text-4xl mb-2">📂</div>
          <p class="font-semibold text-gray-700">Drag &amp; drop your file here</p>
          <p class="text-sm text-gray-400 mt-1">or <span class="text-brand underline cursor-pointer" id="browseLink">browse files</span> (CSV, Excel)</p>
          <p class="text-sm text-brand font-medium mt-3 hidden" id="fileName"></p>
        </div>

        <div class="mt-6">
          <label class="block text-sm font-medium text-gray-700 mb-1">How many contacts are in your list?</label>
          <input type="number" id="contactCount" min="1" placeholder="e.g. 5000" class="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none transition">
        </div>

        <!-- Price Breakdown -->
        <div class="mt-5 bg-gray-50 rounded-xl p-4 hidden" id="priceBreakdown">
          <p class="text-sm text-gray-500 mb-1">Price estimate:</p>
          <p class="text-lg font-bold" id="priceCalc"></p>
        </div>

        <p class="text-red-500 text-sm mt-3 hidden" id="err-step3">Please enter the number of contacts.</p>
      </div>

      <!-- ========== STEP 4: BUSINESS INFO ========== -->
      <div class="step-panel fade-in hidden" data-step="4">
        <h2 class="text-xl font-bold mb-1">Your Business Info</h2>
        <p class="text-gray-500 text-sm mb-5">We'll use this to set up and confirm your campaign.</p>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Business Name <span class="text-red-400">*</span></label>
            <input type="text" id="bizName" required placeholder="e.g. Joe's Plumbing" class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand focus:border-brand outline-none transition">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Your Name <span class="text-red-400">*</span></label>
            <input type="text" id="custName" required placeholder="First and last name" class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand focus:border-brand outline-none transition">
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email <span class="text-red-400">*</span></label>
              <input type="email" id="custEmail" required placeholder="you@business.com" class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand focus:border-brand outline-none transition">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Phone <span class="text-red-400">*</span></label>
              <input type="tel" id="custPhone" required placeholder="(555) 123-4567" class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand focus:border-brand outline-none transition">
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Website <span class="text-gray-400 text-xs font-normal">(optional)</span></label>
            <input type="url" id="custWebsite" placeholder="https://yourbusiness.com" class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand focus:border-brand outline-none transition">
          </div>
        </div>

        <p class="text-red-500 text-sm mt-3 hidden" id="err-step4">Please fill in all required fields.</p>
      </div>

      <!-- ========== STEP 5: PRICE SUMMARY + PRIVACY + PAYMENT ========== -->
      <div class="step-panel fade-in hidden" data-step="5">
        <h2 class="text-xl font-bold mb-1">Order Summary</h2>
        <p class="text-gray-500 text-sm mb-5">Review your order before payment.</p>

        <div class="bg-gray-50 rounded-xl border border-gray-200 divide-y divide-gray-200" id="summaryBox">
          <div class="p-4 flex justify-between"><span class="text-gray-500">Service</span><span class="font-semibold" id="sumService">—</span></div>
          <div class="p-4 flex justify-between"><span class="text-gray-500">Frequency</span><span class="font-semibold" id="sumFreq">—</span></div>
          <div class="p-4 flex justify-between"><span class="text-gray-500">Contacts</span><span class="font-semibold" id="sumContacts">—</span></div>
          <div class="p-4 flex justify-between"><span class="text-gray-500">Base Cost</span><span class="font-semibold" id="sumBase">—</span></div>
          <div class="p-4 flex justify-between hidden" id="sumFreqRow"><span class="text-gray-500">Frequency Adjustment</span><span class="font-semibold" id="sumFreqAdj">—</span></div>
          <div class="p-4 flex justify-between hidden" id="sumAddonRow"><span class="text-gray-500">Appt. Confirmation Calls</span><span class="font-semibold" id="sumAddon">—</span></div>
          <div class="p-4 flex justify-between bg-black rounded-b-xl text-white">
            <span class="font-bold text-lg">Total Due Today</span>
            <span class="font-extrabold text-xl text-brand" id="sumTotal">$0</span>
          </div>
        </div>

        <!-- PRIVACY DISCLOSURE -->
        <div class="mt-8 bg-brand-light border border-brand/30 rounded-xl p-5">
          <p class="font-bold text-sm mb-2">🔒 Your Privacy is Protected</p>
          <p class="text-sm text-gray-600 leading-relaxed">Phoenixwebhost Inc. will never sell, share, or disclose your contact list or customer data to any third party. Your list is used solely to execute your campaign and is permanently deleted after delivery. By proceeding, you agree to our terms of service.</p>
          <label class="flex items-start gap-2 mt-4 cursor-pointer">
            <input type="checkbox" id="agreeTerms" class="mt-1 w-5 h-5 accent-brand rounded" required>
            <span class="text-sm font-medium text-gray-700">I agree to the privacy policy and terms of service <span class="text-red-400">*</span></span>
          </label>
        </div>

        <p class="text-red-500 text-sm mt-3 hidden" id="err-step5">You must agree to the privacy policy to continue.</p>
      </div>

      <!-- ========== STEP 6: STRIPE PAYMENT ========== -->
      <div class="step-panel fade-in hidden" data-step="6">
        <h2 class="text-xl font-bold mb-1">Payment</h2>
        <p class="text-gray-500 text-sm mb-5">Enter your card details to complete the order.</p>

        <div class="bg-gray-50 rounded-xl p-4 mb-5 flex justify-between items-center">
          <span class="text-gray-500 text-sm">Total due</span>
          <span class="font-extrabold text-2xl text-brand" id="payTotal">$0</span>
        </div>

        <label class="block text-sm font-medium text-gray-700 mb-2">Card Details</label>
        <div id="card-element" class="mb-1"></div>
        <p id="card-errors" class="text-red-500 text-sm mt-1 min-h-[20px]"></p>

        <button type="button" id="payBtn" class="w-full mt-6 bg-brand hover:bg-brand-dark text-white font-bold py-4 rounded-xl text-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          <svg class="w-5 h-5 animate-spin hidden" id="paySpinner" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
          <span id="payBtnText">Pay Now</span>
        </button>

        <div class="flex items-center justify-center gap-3 mt-4 text-xs text-gray-400">
          <span>🔒 Secured by Stripe</span>
          <span>•</span>
          <span>256-bit SSL encryption</span>
        </div>
      </div>

    </form>

    <!-- ========== SUCCESS PAGE ========== -->
    <div id="successPage" class="hidden fade-in text-center py-12">
      <div class="w-20 h-20 bg-brand rounded-full flex items-center justify-center mx-auto mb-6">
        <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
      </div>
      <h2 class="text-2xl sm:text-3xl font-extrabold mb-2">Thank you, <span id="successName">—</span>!</h2>
      <p class="text-gray-500 text-lg mb-1">Your campaign is being set up.</p>
      <p class="text-gray-500 mb-6">We'll contact you at <strong id="successEmail">—</strong> within 24 hours to confirm details.</p>
      <div class="bg-gray-50 rounded-xl p-5 inline-block text-left">
        <p class="text-sm text-gray-500 mb-1">Questions?</p>
        <p class="font-semibold">📞 <a href="tel:4809532393" class="text-brand hover:underline">(480) 953-2393</a></p>
        <p class="font-semibold">✉️ <a href="mailto:hello@phoenixwebhost.com" class="text-brand hover:underline">hello@phoenixwebhost.com</a></p>
      </div>
    </div>

    <!-- NAVIGATION BUTTONS -->
    <div class="flex items-center justify-between mt-8" id="navBtns">
      <button type="button" id="prevBtn" class="hidden px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:border-gray-400 transition">← Back</button>
      <div class="flex-1"></div>
      <button type="button" id="nextBtn" class="px-8 py-3 rounded-xl bg-brand hover:bg-brand-dark text-white font-bold text-lg transition">Next →</button>
    </div>

  </main>

  <!-- FOOTER -->
  <footer class="bg-black text-gray-400 text-center text-xs py-6 mt-12">
    <p>&copy; 2026 Phoenixwebhost Inc. · Phoenix, AZ · All rights reserved.</p>
    <p class="mt-1">Your data is protected under our <span class="text-brand cursor-pointer hover:underline">Privacy Policy</span>. We never sell your information.</p>
  </footer>
`;

const inlineScript = `
// ====== CONFIG ======
    const STRIPE_PK = "YOUR_STRIPE_PK";

    const PRICES = { calls: 49, texts: 29, emails: 19, bundle: 79 };
    const SERVICE_LABELS = { calls: "📞 Calls Only", texts: "📱 Texts Only", emails: "📧 Emails Only", bundle: "🔥 Full Bundle (Calls + Texts + Emails)" };
    const FREQ_LABELS = { once: "One-time blast", "2x": "2× per month", weekly: "Weekly (4×/month)", monthly: "Monthly recurring" };
    const FREQ_MULT = { once: 1, "2x": 1.2, weekly: 1.5, monthly: 1 };
    const TOTAL_STEPS = 6;

    let currentStep = 1;

    // ====== DOM ======
    const panels = document.querySelectorAll('.step-panel');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const navBtns = document.getElementById('navBtns');
    const progressLabel = document.getElementById('progressLabel');
    const progressContainer = document.getElementById('progressContainer');
    const successPage = document.getElementById('successPage');

    // ====== PROGRESS ======
    function renderProgress() {
      const bar = progressContainer.querySelector('.flex');
      bar.innerHTML = '';
      for (let i = 1; i <= TOTAL_STEPS; i++) {
        const dot = document.createElement('div');
        dot.className = 'flex flex-col items-center';
        const circle = document.createElement('div');
        circle.className = \`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all \${
          i < currentStep ? 'step-done' : i === currentStep ? 'step-active' : 'step-pending'
        }\`;
        circle.textContent = i < currentStep ? '✓' : i;
        dot.appendChild(circle);
        bar.appendChild(dot);
        if (i < TOTAL_STEPS) {
          const line = document.createElement('div');
          line.className = \`flex-1 h-0.5 self-center mx-1 \${i < currentStep ? 'bg-brand' : 'bg-gray-200'} transition-all\`;
          bar.appendChild(line);
        }
      }
      const stepNames = ['Service', 'Frequency', 'Contacts', 'Info', 'Review', 'Payment'];
      progressLabel.textContent = \`Step \${currentStep} of \${TOTAL_STEPS} — \${stepNames[currentStep - 1]}\`;
    }

    // ====== NAVIGATION ======
    function showStep(n) {
      panels.forEach(p => {
        p.classList.add('hidden');
        p.classList.remove('fade-in');
      });
      const panel = document.querySelector(\`[data-step="\${n}"]\`);
      if (panel) {
        panel.classList.remove('hidden');
        void panel.offsetWidth;
        panel.classList.add('fade-in');
      }
      prevBtn.classList.toggle('hidden', n === 1);
      nextBtn.classList.toggle('hidden', n === TOTAL_STEPS);
      if (n === 5) nextBtn.textContent = 'Proceed to Payment →';
      else nextBtn.textContent = 'Next →';

      renderProgress();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function validate(step) {
      // Hide all errors
      document.querySelectorAll('[id^="err-step"]').forEach(e => e.classList.add('hidden'));

      if (step === 1) {
        const svc = document.querySelector('input[name="service"]:checked');
        if (!svc) { document.getElementById('err-step1').classList.remove('hidden'); return false; }
      }
      if (step === 2) {
        const freq = document.querySelector('input[name="frequency"]:checked');
        if (!freq) { document.getElementById('err-step2').classList.remove('hidden'); return false; }
      }
      if (step === 3) {
        const count = parseInt(document.getElementById('contactCount').value);
        if (!count || count < 1) { document.getElementById('err-step3').classList.remove('hidden'); return false; }
      }
      if (step === 4) {
        const biz = document.getElementById('bizName').value.trim();
        const name = document.getElementById('custName').value.trim();
        const email = document.getElementById('custEmail').value.trim();
        const phone = document.getElementById('custPhone').value.trim();
        if (!biz || !name || !email || !phone) { document.getElementById('err-step4').classList.remove('hidden'); return false; }
      }
      if (step === 5) {
        if (!document.getElementById('agreeTerms').checked) { document.getElementById('err-step5').classList.remove('hidden'); return false; }
      }
      return true;
    }

    nextBtn.addEventListener('click', () => {
      if (!validate(currentStep)) return;
      if (currentStep === 4) populateSummary();
      if (currentStep === 5) initStripe();
      currentStep = Math.min(currentStep + 1, TOTAL_STEPS);
      showStep(currentStep);
    });

    prevBtn.addEventListener('click', () => {
      currentStep = Math.max(currentStep - 1, 1);
      showStep(currentStep);
    });

    // ====== PRICE CALCULATOR ======
    const contactInput = document.getElementById('contactCount');
    const priceBreakdown = document.getElementById('priceBreakdown');
    const priceCalc = document.getElementById('priceCalc');

    contactInput.addEventListener('input', updatePricePreview);

    function getSelectedService() {
      const el = document.querySelector('input[name="service"]:checked');
      return el ? el.value : null;
    }
    function getSelectedFrequency() {
      const el = document.querySelector('input[name="frequency"]:checked');
      return el ? el.value : null;
    }
    function getContactCount() {
      return parseInt(contactInput.value) || 0;
    }

    function calcTotal() {
      const svc = getSelectedService();
      const freq = getSelectedFrequency();
      const count = getContactCount();
      if (!svc || !freq || !count) return { base: 0, freqAdj: 0, addon: 0, total: 0 };

      const rate = PRICES[svc];
      const base = Math.ceil(count / 1000) * rate;
      const mult = FREQ_MULT[freq];
      const adjusted = base * mult;
      const freqAdj = adjusted - base;
      const addon = document.getElementById('addonConfirmation').checked ? 49 + 29 : 0;
      const total = adjusted + addon;
      return { base, freqAdj: Math.round(freqAdj * 100) / 100, addon, total: Math.round(total * 100) / 100, rate, count, mult };
    }

    function updatePricePreview() {
      const svc = getSelectedService();
      const count = getContactCount();
      if (!svc || !count) { priceBreakdown.classList.add('hidden'); return; }
      const rate = PRICES[svc];
      const units = Math.ceil(count / 1000);
      const cost = units * rate;
      priceCalc.innerHTML = \`<span class="text-brand">\${count.toLocaleString()} contacts</span> × $\${rate}/1k = <span class="text-brand font-extrabold">$\${cost.toLocaleString()}</span>\`;
      priceBreakdown.classList.remove('hidden');
    }

    // ====== SUMMARY ======
    function populateSummary() {
      const svc = getSelectedService();
      const freq = getSelectedFrequency();
      const { base, freqAdj, addon, total } = calcTotal();

      document.getElementById('sumService').textContent = SERVICE_LABELS[svc] || '—';
      document.getElementById('sumFreq').textContent = FREQ_LABELS[freq] || '—';
      document.getElementById('sumContacts').textContent = getContactCount().toLocaleString();
      document.getElementById('sumBase').textContent = '$' + base.toLocaleString();

      const freqRow = document.getElementById('sumFreqRow');
      if (freqAdj > 0) {
        freqRow.classList.remove('hidden');
        const pct = freq === '2x' ? '+20%' : '+50%';
        document.getElementById('sumFreqAdj').textContent = \`+$\${freqAdj.toLocaleString()} (\${pct})\`;
      } else {
        freqRow.classList.add('hidden');
      }

      const addonRow = document.getElementById('sumAddonRow');
      if (addon > 0) {
        addonRow.classList.remove('hidden');
        document.getElementById('sumAddon').textContent = \`+$\${addon} ($49 setup + $29/mo)\`;
      } else {
        addonRow.classList.add('hidden');
      }

      document.getElementById('sumTotal').textContent = '$' + total.toLocaleString();
      document.getElementById('payTotal').textContent = '$' + total.toLocaleString();
    }

    // ====== FILE UPLOAD ======
    const dropZone = document.getElementById('dropZone');
    const fileUpload = document.getElementById('fileUpload');
    const browseLink = document.getElementById('browseLink');
    const fileNameEl = document.getElementById('fileName');

    browseLink.addEventListener('click', () => fileUpload.click());
    dropZone.addEventListener('click', () => fileUpload.click());

    dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('border-brand', 'bg-brand-light'); });
    dropZone.addEventListener('dragleave', () => { dropZone.classList.remove('border-brand', 'bg-brand-light'); });
    dropZone.addEventListener('drop', e => {
      e.preventDefault();
      dropZone.classList.remove('border-brand', 'bg-brand-light');
      if (e.dataTransfer.files.length) {
        fileUpload.files = e.dataTransfer.files;
        handleFile(e.dataTransfer.files[0]);
      }
    });
    fileUpload.addEventListener('change', () => { if (fileUpload.files.length) handleFile(fileUpload.files[0]); });

    function handleFile(file) {
      fileNameEl.textContent = '✅ ' + file.name;
      fileNameEl.classList.remove('hidden');
    }

    // ====== STRIPE ======
    let stripe, cardElement, stripeReady = false;

    function initStripe() {
      if (stripeReady) return;
      try {
        stripe = Stripe(STRIPE_PK);
        const elements = stripe.elements();
        cardElement = elements.create('card', {
          style: {
            base: { fontSize: '16px', color: '#1f2937', fontFamily: 'Inter, sans-serif', '::placeholder': { color: '#9ca3af' } },
            invalid: { color: '#ef4444' }
          }
        });
        cardElement.mount('#card-element');
        cardElement.on('change', e => {
          document.getElementById('card-errors').textContent = e.error ? e.error.message : '';
        });
        stripeReady = true;
      } catch (err) {
        console.warn('Stripe init error:', err);
      }
    }

    // Pay button
    document.getElementById('payBtn').addEventListener('click', async () => {
      const btn = document.getElementById('payBtn');
      const spinner = document.getElementById('paySpinner');
      const btnText = document.getElementById('payBtnText');

      btn.disabled = true;
      spinner.classList.remove('hidden');
      btnText.textContent = 'Processing…';

      try {
        const { total } = calcTotal();

        // POST to backend to create payment intent
        const res = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: Math.round(total * 100), // cents
            service: getSelectedService(),
            frequency: getSelectedFrequency(),
            contacts: getContactCount(),
            addon: document.getElementById('addonConfirmation').checked,
            business: document.getElementById('bizName').value.trim(),
            name: document.getElementById('custName').value.trim(),
            email: document.getElementById('custEmail').value.trim(),
            phone: document.getElementById('custPhone').value.trim(),
            website: document.getElementById('custWebsite').value.trim(),
          })
        });

        if (!res.ok) throw new Error('Payment server error');
        const { clientSecret } = await res.json();

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: { card: cardElement }
        });

        if (error) {
          document.getElementById('card-errors').textContent = error.message;
          btn.disabled = false;
          spinner.classList.add('hidden');
          btnText.textContent = 'Pay Now';
          return;
        }

        if (paymentIntent.status === 'succeeded') {
          showSuccess();
        }
      } catch (err) {
        // Demo mode fallback — show success for prototype
        console.warn('Payment API not available — showing demo success.', err);
        showSuccess();
      }
    });

    function showSuccess() {
      document.getElementById('orderForm').classList.add('hidden');
      navBtns.classList.add('hidden');
      progressContainer.classList.add('hidden');
      successPage.classList.remove('hidden');

      const name = document.getElementById('custName').value.trim() || 'Customer';
      const email = document.getElementById('custEmail').value.trim() || 'your email';
      document.getElementById('successName').textContent = name;
      document.getElementById('successEmail').textContent = email;

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ====== INIT ======
    showStep(1);
`;

export default function MarketingBlastOrderPage() {
  useEffect(() => {
    // Load Google Fonts
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap';
    document.head.appendChild(fontLink);

    // Load Stripe.js
    const stripeScript = document.createElement('script');
    stripeScript.src = 'https://js.stripe.com/v3/';
    document.head.appendChild(stripeScript);

    // Load Tailwind CDN then apply custom config
    const tailwindScript = document.createElement('script');
    tailwindScript.src = 'https://cdn.tailwindcss.com';
    tailwindScript.onload = () => {
      const configScript = document.createElement('script');
      configScript.textContent = `
        tailwind.config = {
          theme: {
            extend: {
              colors: {
                brand: '#00c851',
                'brand-dark': '#00b34a',
                'brand-deep': '#008738',
                'brand-light': '#d7f4e3',
              }
            }
          }
        }
      `;
      document.head.appendChild(configScript);

      // Run page logic after Tailwind and DOM are ready
      const pageScript = document.createElement('script');
      pageScript.textContent = inlineScript;
      document.body.appendChild(pageScript);
    };
    document.head.appendChild(tailwindScript);

    return () => {
      // Cleanup injected scripts on unmount
      document.querySelectorAll('[data-pwh-script]').forEach(el => el.remove());
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .StripeElement {
          padding: 12px 14px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          background: #fff;
          transition: border-color 0.15s;
        }
        .StripeElement--focus { border-color: #00c851; box-shadow: 0 0 0 3px rgba(0,200,81,0.18); }
        .StripeElement--invalid { border-color: #ef4444; }
        input[type="radio"]:checked + label,
        input[type="radio"]:checked + label > div { border-color: #00c851 !important; background: #d7f4e3 !important; }
        .step-active { background: #00c851; color: #fff; }
        .step-done { background: #00c851; color: #fff; }
        .step-pending { background: #e5e7eb; color: #6b7280; }
        .fade-in { animation: fadeIn 0.3s ease-in; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .radio-card { cursor: pointer; transition: all 0.15s; }
        .radio-card:hover { border-color: #00c851; }
        html { scroll-padding-top: 5rem; }
      `}</style>
      <div
        className="bg-white text-gray-900 min-h-screen flex flex-col"
        dangerouslySetInnerHTML={{ __html: bodyHTML }}
      />
    </>
  );
}
