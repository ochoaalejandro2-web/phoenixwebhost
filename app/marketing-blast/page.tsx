'use client';

import { useEffect } from 'react';

const bodyHTML = `
  <!-- BLACK NAVBAR -->
  <header class="bg-brand-nav sticky top-0 z-50">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
      <a href="https://phoenixwebhost.com" class="flex items-center gap-2.5 group">
        <div class="w-8 h-8 rounded-lg bg-brand-green flex items-center justify-center text-white font-bold text-base">P</div>
        <div>
          <span class="text-lg font-bold text-white tracking-tight group-hover:text-brand-green transition-colors">Phoenixwebhost</span>
          <span class="hidden sm:inline text-xs text-gray-400 ml-1.5 font-medium">Inc.</span>
        </div>
      </a>
      <nav class="flex items-center gap-3">
        <a href="https://phoenixwebhost.com" class="text-sm text-gray-400 hover:text-white transition-colors hidden sm:inline">&larr; Back to site</a>
        <a href="#contact" class="text-sm bg-brand-green text-white px-4 py-2 rounded-lg hover:bg-brand-greenHover transition-all font-medium">Contact Us</a>
      </nav>
    </div>
  </header>

  <main>
    <!-- HERO -->
    <section class="pt-24 sm:pt-32 pb-10 sm:pb-14 px-4 sm:px-6 bg-white">
      <div class="max-w-3xl mx-auto text-center">
        <div class="inline-flex items-center gap-2 bg-brand-greenLight text-brand-green text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase border border-brand-greenBorder">
          <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"/></svg>
          Power-ups for your website
        </div>
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-5 leading-tight text-brand-dark">
          Add-ons &amp; Marketing
          <span class="text-brand-green"> Tools</span>
        </h1>
        <p class="text-lg sm:text-xl text-brand-muted max-w-2xl mx-auto leading-relaxed">
          Bolt-on features for any Phoenixwebhost website.<br class="hidden sm:block"> Pay only for what you use.
        </p>
      </div>
    </section>

    <!-- PRODUCT CARDS -->
    <section class="pb-20 sm:pb-28 px-4 sm:px-6">
      <div class="max-w-6xl mx-auto grid lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">

        <!-- CARD 1: Appointment Confirmation Calls -->
        <div class="card-lift rounded-2xl bg-white border-2 border-brand-green/20 p-6 sm:p-8 flex flex-col h-full relative shadow-sm">
          <div class="absolute -top-3.5 left-6 sm:left-8">
            <span class="badge-glow inline-flex items-center gap-1.5 bg-brand-green text-white text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wide">
              <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              Most Popular
            </span>
          </div>
          <div class="mt-4 mb-5">
            <div class="w-12 h-12 rounded-xl bg-brand-greenLight flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-brand-green" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
            </div>
            <h2 class="text-2xl sm:text-3xl font-bold tracking-tight mb-2 text-brand-dark">Appointment Confirmation Calls</h2>
            <p class="text-brand-muted leading-relaxed">Your customers get an automatic phone call confirming their appointment. Zero no-shows. Zero staff time.</p>
          </div>
          <div class="bg-brand-pageBg rounded-xl p-5 mb-6 border border-brand-border">
            <div class="flex flex-wrap gap-x-6 gap-y-3">
              <div>
                <span class="text-xs text-brand-subtle uppercase tracking-wide font-medium block mb-1">Setup</span>
                <span class="text-2xl font-bold text-brand-dark">$49</span>
                <span class="text-sm text-brand-muted ml-1">one-time</span>
              </div>
              <div class="border-l border-brand-border pl-6">
                <span class="text-xs text-brand-green uppercase tracking-wide font-semibold block mb-1">Monthly</span>
                <span class="text-2xl font-extrabold text-brand-green">$29</span>
                <span class="text-sm text-brand-dark font-semibold ml-1">/mo</span>
              </div>
            </div>
            <div class="mt-3 pt-3 border-t border-brand-border">
              <p class="text-sm font-semibold text-brand-dark mb-1.5">then $29/mo &middot; cancel anytime</p>
              <span class="text-sm text-brand-muted">Includes <strong class="text-brand-dark">100 calls/mo</strong> &middot; extra calls <strong class="text-brand-dark">$0.25 each</strong></span>
            </div>
          </div>
          <ul class="space-y-3 mb-8 flex-1">
            <li class="flex items-start gap-3">
              <svg class="w-5 h-5 text-brand-green shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
              <span class="text-gray-700 text-sm leading-relaxed">Cuts no-shows by up to <strong class="text-brand-dark">50%</strong></span>
            </li>
            <li class="flex items-start gap-3">
              <svg class="w-5 h-5 text-brand-green shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
              <span class="text-gray-700 text-sm leading-relaxed">Fully automated &mdash; fires the moment someone books</span>
            </li>
            <li class="flex items-start gap-3">
              <svg class="w-5 h-5 text-brand-green shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
              <span class="text-gray-700 text-sm leading-relaxed">Branded to your business name</span>
            </li>
            <li class="flex items-start gap-3">
              <svg class="w-5 h-5 text-brand-green shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
              <span class="text-gray-700 text-sm leading-relaxed">Works with any booking system</span>
            </li>
            <li class="flex items-start gap-3">
              <svg class="w-5 h-5 text-brand-green shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
              <span class="text-gray-700 text-sm leading-relaxed">Includes a live demo &mdash; <strong class="text-brand-dark">hear it before you buy</strong></span>
            </li>
          </ul>
          <div class="text-center mt-auto">
            <a href="#contact" class="green-glow inline-flex items-center justify-center w-full gap-2 bg-brand-green hover:bg-brand-greenHover text-white font-bold text-base px-6 py-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02]">
              Add Confirmation Calls &mdash; $49 now
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
            </a>
            <p class="text-sm font-semibold text-brand-dark mt-3">then $29/mo &middot; cancel anytime</p>
            <a href="#contact" class="inline-flex items-center gap-1.5 text-sm text-brand-green hover:text-brand-greenHover font-medium mt-3 transition-colors group">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Try a live demo
              <svg class="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
            </a>
          </div>
        </div>

        <!-- CARD 2: Marketing Campaign Blasts -->
        <div class="card-lift rounded-2xl bg-white border border-brand-border p-6 sm:p-8 flex flex-col h-full shadow-sm">
          <div class="mt-4 mb-5">
            <div class="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/></svg>
            </div>
            <h2 class="text-2xl sm:text-3xl font-bold tracking-tight mb-2 text-brand-dark">Marketing Campaign Blasts</h2>
            <p class="text-brand-muted leading-relaxed">Reach your whole customer list with calls, texts, and emails. Perfect for tax season, promos, grand openings, and appointment reminders.</p>
          </div>
          <div class="bg-white rounded-xl border border-brand-border mb-6 overflow-hidden">
            <div class="px-5 py-3 border-b border-brand-border bg-brand-pageBg">
              <span class="text-xs text-brand-subtle uppercase tracking-wide font-semibold">Pricing per 1,000 contacts</span>
            </div>
            <div class="divide-y divide-brand-border">
              <div class="pricing-row flex items-center justify-between px-5 py-3.5 transition-colors">
                <span class="text-sm text-gray-700 flex items-center gap-2">
                  <span class="text-lg">&#128222;</span> Calls only
                </span>
                <span class="text-sm font-bold text-brand-dark">$49</span>
              </div>
              <div class="pricing-row flex items-center justify-between px-5 py-3.5 transition-colors">
                <span class="text-sm text-gray-700 flex items-center gap-2">
                  <span class="text-lg">&#128241;</span> Texts only
                </span>
                <span class="text-sm font-bold text-brand-dark">$29</span>
              </div>
              <div class="pricing-row flex items-center justify-between px-5 py-3.5 transition-colors">
                <span class="text-sm text-gray-700 flex items-center gap-2">
                  <span class="text-lg">&#128231;</span> Emails only
                </span>
                <span class="text-sm font-bold text-brand-dark">$19</span>
              </div>
              <div class="flex items-center justify-between px-5 py-4 bg-brand-greenLight border-t-2 border-brand-green/30 rounded-b-xl">
                <span class="text-sm text-brand-dark font-semibold flex items-center gap-2">
                  <span class="text-lg">&#128293;</span> Full Bundle
                  <span class="text-[10px] bg-brand-green text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Best Value</span>
                </span>
                <span class="text-lg font-bold text-brand-green">$79</span>
              </div>
            </div>
          </div>
          <div class="bg-brand-greenLight border border-brand-greenBorder rounded-xl px-5 py-4 mb-6">
            <p class="text-sm text-gray-700">
              <span class="text-brand-green font-semibold">Example:</span> Got 5,000 contacts? Full bundle = <strong class="text-brand-dark">$395 total</strong>
            </p>
          </div>
          <ul class="space-y-3 mb-8 flex-1">
            <li class="flex items-start gap-3">
              <svg class="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
              <span class="text-gray-700 text-sm leading-relaxed">One blast reaches your whole list</span>
            </li>
            <li class="flex items-start gap-3">
              <svg class="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
              <span class="text-gray-700 text-sm leading-relaxed">Calls, texts, <strong class="text-brand-dark">AND</strong> emails in one campaign</span>
            </li>
            <li class="flex items-start gap-3">
              <svg class="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
              <span class="text-gray-700 text-sm leading-relaxed">Branded to your business</span>
            </li>
            <li class="flex items-start gap-3">
              <svg class="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
              <span class="text-gray-700 text-sm leading-relaxed">Works with any list (CSV, Google Sheet, CRM export)</span>
            </li>
            <li class="flex items-start gap-3">
              <svg class="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
              <span class="text-gray-700 text-sm leading-relaxed"><strong class="text-brand-dark">We set it up for you</strong></span>
            </li>
          </ul>
          <div class="text-center mt-auto">
            <a href="#contact" class="campaign-glow inline-flex items-center justify-center w-full gap-2 bg-brand-greenDeep hover:bg-brand-greenDeepHover text-white font-bold text-base px-6 py-4 rounded-xl border-2 border-brand-green/45 transition-all duration-200 transform hover:scale-[1.02]">
              Start a Campaign
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
            </a>
            <p class="text-sm font-medium text-brand-muted mt-3">Priced per 1,000 contacts &middot; no monthly fee</p>
          </div>
        </div>

      </div>
    </section>

    <!-- TRUST BAR -->
    <section class="border-t border-brand-border bg-brand-pageBg py-12 sm:py-16 px-4 sm:px-6">
      <div class="max-w-4xl mx-auto text-center">
        <p class="text-brand-subtle text-sm uppercase tracking-wider font-semibold mb-8">Trusted by Arizona small businesses</p>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <div class="text-3xl font-extrabold text-brand-dark mb-1">500+</div>
            <div class="text-sm text-brand-muted">Websites built &amp; hosted</div>
          </div>
          <div>
            <div class="text-3xl font-extrabold text-brand-green mb-1">50%</div>
            <div class="text-sm text-brand-muted">Fewer no-shows on average</div>
          </div>
          <div>
            <div class="text-3xl font-extrabold text-brand-dark mb-1">Phoenix, AZ</div>
            <div class="text-sm text-brand-muted">Locally owned &amp; operated</div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="py-16 sm:py-20 px-4 sm:px-6 bg-white border-t border-brand-border">
      <div class="max-w-3xl mx-auto">
        <h2 class="text-2xl sm:text-3xl font-bold text-center mb-10 text-brand-dark">Common Questions</h2>
        <div class="space-y-3">
          <details class="group bg-brand-pageBg border border-brand-border rounded-xl overflow-hidden">
            <summary class="cursor-pointer px-5 py-4 flex items-center justify-between text-sm font-semibold text-brand-dark hover:text-brand-green transition-colors">
              Do I need a Phoenixwebhost website to use these?
              <svg class="w-5 h-5 text-brand-subtle group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
            </summary>
            <div class="px-5 pb-4 text-sm text-brand-muted leading-relaxed">These add-ons work best with a Phoenixwebhost site, but Marketing Campaign Blasts work with any contact list regardless of your website provider.</div>
          </details>
          <details class="group bg-brand-pageBg border border-brand-border rounded-xl overflow-hidden">
            <summary class="cursor-pointer px-5 py-4 flex items-center justify-between text-sm font-semibold text-brand-dark hover:text-brand-green transition-colors">
              What happens if I go over 100 calls per month?
              <svg class="w-5 h-5 text-brand-subtle group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
            </summary>
            <div class="px-5 pb-4 text-sm text-brand-muted leading-relaxed">Extra calls are just $0.25 each &mdash; no surprise bills. You only pay for what you use beyond the included 100.</div>
          </details>
          <details class="group bg-brand-pageBg border border-brand-border rounded-xl overflow-hidden">
            <summary class="cursor-pointer px-5 py-4 flex items-center justify-between text-sm font-semibold text-brand-dark hover:text-brand-green transition-colors">
              Can I cancel anytime?
              <svg class="w-5 h-5 text-brand-subtle group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
            </summary>
            <div class="px-5 pb-4 text-sm text-brand-muted leading-relaxed">Yes. The Appointment Confirmation Calls plan is month-to-month with no contract. Campaign Blasts have no subscription at all &mdash; you pay per campaign.</div>
          </details>
          <details class="group bg-brand-pageBg border border-brand-border rounded-xl overflow-hidden">
            <summary class="cursor-pointer px-5 py-4 flex items-center justify-between text-sm font-semibold text-brand-dark hover:text-brand-green transition-colors">
              How fast can I get started?
              <svg class="w-5 h-5 text-brand-subtle group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
            </summary>
            <div class="px-5 pb-4 text-sm text-brand-muted leading-relaxed">Confirmation Calls can be live within 24 hours of sign-up. Campaign Blasts are typically set up and sent within 1&ndash;2 business days.</div>
          </details>
        </div>
      </div>
    </section>

    <!-- CONTACT CTA -->
    <section id="contact" class="scroll-mt-28 py-16 sm:py-20 px-4 sm:px-6 border-t border-brand-border bg-brand-pageBg">
      <div class="max-w-2xl mx-auto text-center">
        <div class="w-14 h-14 rounded-2xl bg-brand-greenLight border border-brand-greenBorder flex items-center justify-center mx-auto mb-6">
          <svg class="w-7 h-7 text-brand-green" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
        </div>
        <h2 class="text-2xl sm:text-3xl font-bold mb-3 text-brand-dark">Ready to get started?</h2>
        <p class="text-brand-muted mb-8 leading-relaxed">Call us, text us, or fill out the form &mdash; we&rsquo;ll have you up and running fast.</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="tel:4809532393" class="green-glow inline-flex items-center justify-center gap-2 bg-brand-green hover:bg-brand-greenHover text-white font-bold text-base px-8 py-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02]">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
            Call (480) 953-2393
          </a>
          <a href="/contact" class="inline-flex items-center justify-center gap-2 bg-brand-dark hover:bg-gray-800 text-white font-bold text-base px-8 py-4 rounded-xl transition-all duration-200">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            Send a Message
          </a>
        </div>
      </div>
    </section>
  </main>

  <!-- FOOTER -->
  <footer class="bg-brand-nav py-8 px-4 sm:px-6">
    <div class="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-2.5">
        <div class="w-7 h-7 rounded-md bg-brand-green flex items-center justify-center text-white font-bold text-sm">P</div>
        <span class="text-sm text-gray-400">&copy; 2026 Phoenixwebhost Inc. &middot; Phoenix, AZ</span>
      </div>
      <div class="flex items-center gap-6 text-sm text-gray-400">
        <a href="https://phoenixwebhost.com" class="hover:text-white transition-colors">Home</a>
        <a href="/contact" class="hover:text-white transition-colors">Contact</a>
        <a href="tel:4809532393" class="hover:text-white transition-colors">(480) 953-2393</a>
      </div>
    </div>
  </footer>
`;

export default function MarketingBlastPage() {
  useEffect(() => {
    // Load Google Fonts preconnect
    const preconnect1 = document.createElement('link');
    preconnect1.rel = 'preconnect';
    preconnect1.href = 'https://fonts.googleapis.com';
    document.head.appendChild(preconnect1);

    const preconnect2 = document.createElement('link');
    preconnect2.rel = 'preconnect';
    preconnect2.href = 'https://fonts.gstatic.com';
    preconnect2.crossOrigin = 'anonymous';
    document.head.appendChild(preconnect2);

    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap';
    document.head.appendChild(fontLink);

    // Load Tailwind CDN then apply custom config
    const tailwindScript = document.createElement('script');
    tailwindScript.src = 'https://cdn.tailwindcss.com';
    tailwindScript.onload = () => {
      const tw = (window as Window & { tailwind?: { config: Record<string, unknown> } }).tailwind;
      if (tw) {
        tw.config = {
          theme: {
            extend: {
              colors: {
                brand: {
                  green: '#00c851',
                  greenHover: '#00b34a',
                  greenDeep: '#008738',
                  greenDeepHover: '#006e2e',
                  greenLight: '#d7f4e3',
                  greenBorder: '#6fc492',
                  dark: '#111111',
                  nav: '#0a0a0a',
                  muted: '#6b7280',
                  subtle: '#9ca3af',
                  border: '#e5e7eb',
                  cardBg: '#ffffff',
                  pageBg: '#fafafa',
                }
              },
              fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
              }
            }
          }
        };
      }
    };
    document.head.appendChild(tailwindScript);
  }, []);

  return (
    <>
      <style>{`
        body { font-family: 'Inter', system-ui, -apple-system, sans-serif; }
        .green-glow { box-shadow: 0 4px 20px rgba(0,200,81,0.32); }
        .green-glow:hover { box-shadow: 0 6px 30px rgba(0,200,81,0.48); }
        .campaign-glow { box-shadow: 0 4px 16px rgba(0,135,56,0.28); }
        .campaign-glow:hover { box-shadow: 0 6px 24px rgba(0,135,56,0.4); }
        .card-lift { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .card-lift:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.08); }
        .pricing-row:hover { background: #f9fafb; }
        .badge-glow { animation: glow 2s ease-in-out infinite; }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 8px rgba(0,200,81,0.28); }
          50% { box-shadow: 0 0 16px rgba(0,200,81,0.5); }
        }
        details summary::-webkit-details-marker { display: none; }
        details summary { list-style: none; }
        html { scroll-behavior: smooth; scroll-padding-top: 6rem; }
      `}</style>
      <div
        className="bg-white text-gray-900 min-h-screen"
        dangerouslySetInnerHTML={{ __html: bodyHTML }}
      />
    </>
  );
}
