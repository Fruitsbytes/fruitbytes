// PORT TARGET: web-stencil/src/components/gui-contact/gui-contact.tsx
//
// Behavioral parity:
// - POSTs to https://api.web3forms.com/submit with the same access_key
// - Same field names: access_key, subject, from_name, botcheck, name, email, custom_subject, message
// - Status states: idle / submitting / success / error
// - Success/error alerts auto-dismiss after 5s
// - Disabled inputs while submitting
// - Honeypot botcheck field (hidden)

import { createSignal, Show } from 'solid-js';

const ACCESS_KEY = '7743979c-0846-4e19-90da-7898c0d56251';
const ENDPOINT = 'https://api.web3forms.com/submit';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function ContactForm() {
  const [status, setStatus] = createSignal<Status>('idle');
  const [name, setName] = createSignal('');
  const [email, setEmail] = createSignal('');
  const [subject, setSubject] = createSignal('');
  const [message, setMessage] = createSignal('');

  const reset = () => {
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const formElement = e.target as HTMLFormElement;
      const formData = new FormData(formElement);
      const response = await fetch(ENDPOINT, { method: 'POST', body: formData });
      const data = await response.json();

      if (data.success) {
        setStatus('success');
        reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }

    setTimeout(() => setStatus('idle'), 5000);
  };

  const submitting = () => status() === 'submitting';

  return (
    <form onSubmit={handleSubmit} class="flex flex-col gap-6">
      <input type="hidden" name="access_key" value={ACCESS_KEY} />
      <input type="hidden" name="subject" value={`New Contact from ${name() || 'FruitsBytes Website'}`} />
      <input type="hidden" name="from_name" value="FruitsBytes Contact Form" />
      <input type="checkbox" name="botcheck" class="hidden" tabindex="-1" autocomplete="off" />

      <div class="flex flex-col gap-2">
        <label for="name" class="flex items-center gap-2 text-sm font-medium text-[var(--panel-text-strong)]">
          <span class="material-symbols-sharp text-[18px] text-[var(--panel-text)]">person</span>
          Name
        </label>
        <input
          id="name"
          type="text"
          name="name"
          required
          disabled={submitting()}
          value={name()}
          onInput={(e) => setName(e.currentTarget.value)}
          placeholder="Your name"
          class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-[var(--panel-text-strong)] bg-[var(--panel-input-bg)] border border-[var(--panel-border)] rounded outline-none transition-all placeholder:text-[var(--panel-icon)] focus:border-[#0078d7] focus:ring-2 focus:ring-[#0078d7]/10 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label for="email" class="flex items-center gap-2 text-sm font-medium text-[var(--panel-text-strong)]">
          <span class="material-symbols-sharp text-[18px] text-[var(--panel-text)]">email</span>
          Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          required
          disabled={submitting()}
          value={email()}
          onInput={(e) => setEmail(e.currentTarget.value)}
          placeholder="you@example.com"
          class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-[var(--panel-text-strong)] bg-[var(--panel-input-bg)] border border-[var(--panel-border)] rounded outline-none transition-all placeholder:text-[var(--panel-icon)] focus:border-[#0078d7] focus:ring-2 focus:ring-[#0078d7]/10 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label for="subject" class="flex items-center gap-2 text-sm font-medium text-[var(--panel-text-strong)]">
          <span class="material-symbols-sharp text-[18px] text-[var(--panel-text)]">subject</span>
          Subject
        </label>
        <input
          id="subject"
          type="text"
          name="custom_subject"
          disabled={submitting()}
          value={subject()}
          onInput={(e) => setSubject(e.currentTarget.value)}
          placeholder="What's this about?"
          class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-[var(--panel-text-strong)] bg-[var(--panel-input-bg)] border border-[var(--panel-border)] rounded outline-none transition-all placeholder:text-[var(--panel-icon)] focus:border-[#0078d7] focus:ring-2 focus:ring-[#0078d7]/10 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label for="message" class="flex items-center gap-2 text-sm font-medium text-[var(--panel-text-strong)]">
          <span class="material-symbols-sharp text-[18px] text-[var(--panel-text)]">chat</span>
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          disabled={submitting()}
          value={message()}
          onInput={(e) => setMessage(e.currentTarget.value)}
          placeholder="Your message..."
          class="w-full px-4 py-3 text-sm text-[#e8eaed] bg-[#292a2d] border border-[#494c50] rounded outline-none transition-all leading-relaxed resize-y min-h-[120px] placeholder:text-[#787b7f] focus:border-[#0078d7] focus:bg-[#202124] focus:ring-2 focus:ring-[#0078d7]/10 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      <Show when={status() === 'success'}>
        <div class="flex items-center gap-3 px-4 py-3 rounded text-sm bg-green-700/15 border border-green-700/30 text-green-300 animate-slide-down">
          <span class="material-symbols-sharp text-[20px]">check_circle</span>
          Message sent. I'll get back to you soon.
        </div>
      </Show>

      <Show when={status() === 'error'}>
        <div class="flex items-center gap-3 px-4 py-3 rounded text-sm bg-red-700/15 border border-red-700/30 text-red-300 animate-slide-down">
          <span class="material-symbols-sharp text-[20px]">error</span>
          Something went wrong. Try again or email me directly.
        </div>
      </Show>

      <button
        type="submit"
        disabled={submitting()}
        class="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 text-sm font-medium text-white bg-[#0078d7] rounded outline-none transition-all hover:bg-[#1e90ff] hover:shadow-[0_4px_12px_rgba(0,120,215,0.3)] hover:-translate-y-px active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none w-full @sm:w-auto @sm:self-start"
      >
        <Show
          when={submitting()}
          fallback={
            <>
              <span class="material-symbols-sharp text-[20px]">send</span>
              <span>Send message</span>
            </>
          }
        >
          <span class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span>Sending…</span>
        </Show>
      </button>
    </form>
  );
}
