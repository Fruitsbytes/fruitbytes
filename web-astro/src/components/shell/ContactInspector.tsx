// Contact form rendered as a DevTools-style inspector pane on the right
// when the active route is /contact-me. Mimics DevTools' compact form
// chrome (small uppercase labels, thin borders, low-chrome inputs) while
// preserving the same web3forms POST behavior the page-side ContactForm
// had.

import { createSignal, Show } from 'solid-js';
import { addLog } from '../../stores/shell';

const ACCESS_KEY = '7743979c-0846-4e19-90da-7898c0d56251';
const ENDPOINT = 'https://api.web3forms.com/submit';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function ContactInspector() {
  const [status, setStatus] = createSignal<Status>('idle');
  const [name, setName] = createSignal('');
  const [email, setEmail] = createSignal('');
  const [subject, setSubject] = createSignal('');
  const [message, setMessage] = createSignal('');

  const submitting = () => status() === 'submitting';

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
      const formEl = e.target as HTMLFormElement;
      const formData = new FormData(formEl);
      const res = await fetch(ENDPOINT, { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        setStatus('success');
        addLog({
          message: `<b style="color:#5aff5f">✓ Message sent</b> from ${name()} &lt;${email()}&gt;`,
          file: 'contact.ts',
          time: new Date(),
          line: 42,
          level: 'info',
        });
        reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
    setTimeout(() => setStatus('idle'), 5000);
  };

  return (
    <div class="h-full flex flex-col">
      {/* Sub-toolbar — Reset button */}
      <div class="flex items-center min-h-[26px] bg-[var(--panel-toolbar)] border-b border-[var(--panel-border)] px-1.5 select-none">
        <span class="text-[10px] uppercase tracking-wider text-[var(--panel-text)] opacity-80 px-1.5">
          New message
        </span>
        <span class="flex-1" />
        <button
          type="button"
          onClick={reset}
          disabled={submitting()}
          title="Clear form"
          class="w-7 h-6 flex items-center justify-center text-[var(--panel-icon)] hover:text-[var(--panel-text-strong)] disabled:opacity-50 transition-colors"
        >
          <span class="material-symbols-rounded thick text-[14px]">block</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} class="flex-1 overflow-y-auto p-3 space-y-3">
        <input type="hidden" name="access_key" value={ACCESS_KEY} />
        <input type="hidden" name="subject" value={`New Contact from ${name() || 'FruitsBytes Website'}`} />
        <input type="hidden" name="from_name" value="FruitsBytes Contact Form" />
        <input type="checkbox" name="botcheck" class="hidden" tabindex="-1" autocomplete="off" />

        <Field label="Name" htmlFor="ci-name">
          <input
            id="ci-name"
            type="text"
            name="name"
            required
            disabled={submitting()}
            value={name()}
            onInput={(e) => setName(e.currentTarget.value)}
            placeholder="Your name"
            class={inputClass()}
          />
        </Field>

        <Field label="Email" htmlFor="ci-email">
          <input
            id="ci-email"
            type="email"
            name="email"
            required
            disabled={submitting()}
            value={email()}
            onInput={(e) => setEmail(e.currentTarget.value)}
            placeholder="you@example.com"
            class={inputClass()}
          />
        </Field>

        <Field label="Subject" htmlFor="ci-subject">
          <input
            id="ci-subject"
            type="text"
            name="custom_subject"
            disabled={submitting()}
            value={subject()}
            onInput={(e) => setSubject(e.currentTarget.value)}
            placeholder="What's this about?"
            class={inputClass()}
          />
        </Field>

        <Field label="Message" htmlFor="ci-message">
          <textarea
            id="ci-message"
            name="message"
            rows={6}
            required
            disabled={submitting()}
            value={message()}
            onInput={(e) => setMessage(e.currentTarget.value)}
            placeholder="Your message…"
            class={`${inputClass()} resize-y min-h-[120px] leading-relaxed`}
          />
        </Field>

        <Show when={status() === 'success'}>
          <div class="flex items-center gap-2 px-2 py-1.5 rounded text-[11px] bg-[var(--console-error-bg)] border border-[var(--console-success-text)]/40 text-[var(--console-success-text)]">
            <span class="material-symbols-sharp text-[14px]">check_circle</span>
            Message sent. I'll get back to you.
          </div>
        </Show>

        <Show when={status() === 'error'}>
          <div class="flex items-center gap-2 px-2 py-1.5 rounded text-[11px] bg-[var(--console-error-bg)] border border-[var(--console-error-text)]/40 text-[var(--console-error-text)]">
            <span class="material-symbols-sharp text-[14px]">error</span>
            Something went wrong. Try again or email me directly.
          </div>
        </Show>

        <div class="pt-1">
          <button
            type="submit"
            disabled={submitting()}
            class="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-[12px] font-medium text-white bg-[#0078d7] hover:bg-[#1e90ff] focus:outline-none focus:ring-2 focus:ring-[#0078d7]/40 rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Show
              when={submitting()}
              fallback={
                <>
                  <span class="material-symbols-sharp text-[14px]">send</span>
                  <span>Send message</span>
                </>
              }
            >
              <span class="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Sending…</span>
            </Show>
          </button>
        </div>
      </form>
    </div>
  );
}

function Field(props: { label: string; htmlFor: string; children: any }) {
  return (
    <div class="flex flex-col gap-1">
      <label
        for={props.htmlFor}
        class="text-[10px] uppercase tracking-wider text-[var(--panel-text)] opacity-80"
      >
        {props.label}
      </label>
      {props.children}
    </div>
  );
}

function inputClass() {
  return `
    w-full px-2 py-1.5 text-[12px]
    text-[var(--panel-text-strong)]
    bg-[var(--panel-input-bg)]
    border border-[var(--panel-border)] rounded-sm
    outline-none
    placeholder:text-[var(--panel-icon)]
    transition-colors
    focus:border-[#0078d7] focus:bg-[var(--panel-bg)]
    focus:ring-2 focus:ring-[#0078d7]/15
    disabled:opacity-50 disabled:cursor-not-allowed
    font-mono
  `.replace(/\s+/g, ' ').trim();
}
