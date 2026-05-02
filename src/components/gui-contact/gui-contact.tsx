import { Component, h, Host, Prop, State, Listen } from '@stencil/core';
import { t, getCurrentLanguage } from '../../services/i18n';
import { Language } from '../../interfaces/translation';

@Component({
  tag: 'gui-contact',
  styleUrl: 'gui-contact.scss',
  shadow: true,
})
export class GuiContact {
  @Prop() menuOpened!: boolean;
  @Prop() menuWidth!: number;
  @Prop() isMobile?: boolean = false;
  @State() currentLanguage: Language = getCurrentLanguage();
  @State() formStatus: 'idle' | 'submitting' | 'success' | 'error' = 'idle';
  @State() formData = {
    name: '',
    email: '',
    subject: '',
    message: '',
  };

  formRef?: HTMLFormElement;

  @Listen('language.changed', { target: 'document' })
  handleLanguageChange(event: CustomEvent<Language>) {
    this.currentLanguage = event.detail;
  }

  handleInputChange = (field: keyof typeof this.formData, value: string) => {
    this.formData = {
      ...this.formData,
      [field]: value,
    };
  };

  handleSubmit = async (e: Event) => {
    e.preventDefault();
    this.formStatus = 'submitting';

    try {
      const formElement = e.target as HTMLFormElement;
      const formData = new FormData(formElement);

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        this.formStatus = 'success';
        this.formData = {
          name: '',
          email: '',
          subject: '',
          message: '',
        };
        // Reset form after 5 seconds
        setTimeout(() => {
          this.formStatus = 'idle';
        }, 5000);
      } else {
        this.formStatus = 'error';
        setTimeout(() => {
          this.formStatus = 'idle';
        }, 5000);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      this.formStatus = 'error';
      setTimeout(() => {
        this.formStatus = 'idle';
      }, 5000);
    }
  };

  render() {
    const hostStyle = this.isMobile
      ? { width: '100vw', paddingBottom: 'var(--mobile-drawer-collapsed)' }
      : { width: `calc(100vw - ${this.menuOpened ? this.menuWidth : 0}px)` };

    return (
      <Host style={hostStyle}>
        <div class="contact-container animate__animated animate__fadeInUp">
          <div class="contact-header">
            <span class="material-symbols-sharp icon">mail</span>
            <h1>{t('contact.title')}</h1>
          </div>

          <div class="contact-content">
            <div class="contact-info">
              <h2>{t('contact.info.title')}</h2>
              <p>{t('contact.info.description')}</p>

              <div class="info-items">
                <div class="info-item">
                  <span class="material-symbols-sharp">email</span>
                  <div>
                    <strong>Email</strong>
                    <a href="mailto:jeffrey.carre@anbapyezanman.com">jeffrey.carre@anbapyezanman.com</a>
                  </div>
                </div>

                <div class="info-item">
                  <span class="material-symbols-sharp">location_on</span>
                  <div>
                    <strong>{t('contact.info.location')}</strong>
                    <span>Montréal, QC, Canada</span>
                  </div>
                </div>

                <div class="info-item">
                  <span class="material-symbols-sharp">link</span>
                  <div>
                    <strong>{t('contact.info.social')}</strong>
                    <div class="social-links">
                      <a href="https://github.com/fruitsbytes" target="_blank" rel="noopener noreferrer">
                        GitHub
                      </a>
                      <span class="separator">•</span>
                      <a href="https://linkedin.com/in/jeffrey-carre" target="_blank" rel="noopener noreferrer">
                        LinkedIn
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="contact-form-wrapper">
              <form
                ref={(el) => (this.formRef = el as HTMLFormElement)}
                onSubmit={this.handleSubmit}
                class="contact-form"
              >
                <input type="hidden" name="access_key" value="7743979c-0846-4e19-90da-7898c0d56251" />
                <input type="hidden" name="subject" value={`New Contact from ${this.formData.name || 'FruitsBytes Website'}`} />
                <input type="hidden" name="from_name" value="FruitsBytes Contact Form" />
                <input type="checkbox" name="botcheck" class="hidden" style={{ display: 'none' }} />

                <div class="form-group">
                  <label htmlFor="name">
                    <span class="material-symbols-sharp">person</span>
                    {t('contact.form.name')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={this.formData.name}
                    onInput={(e) => this.handleInputChange('name', (e.target as HTMLInputElement).value)}
                    required
                    disabled={this.formStatus === 'submitting'}
                    placeholder={t('contact.form.namePlaceholder')}
                  />
                </div>

                <div class="form-group">
                  <label htmlFor="email">
                    <span class="material-symbols-sharp">email</span>
                    {t('contact.form.email')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={this.formData.email}
                    onInput={(e) => this.handleInputChange('email', (e.target as HTMLInputElement).value)}
                    required
                    disabled={this.formStatus === 'submitting'}
                    placeholder={t('contact.form.emailPlaceholder')}
                  />
                </div>

                <div class="form-group">
                  <label htmlFor="subject">
                    <span class="material-symbols-sharp">subject</span>
                    {t('contact.form.subject')}
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="custom_subject"
                    value={this.formData.subject}
                    onInput={(e) => this.handleInputChange('subject', (e.target as HTMLInputElement).value)}
                    disabled={this.formStatus === 'submitting'}
                    placeholder={t('contact.form.subjectPlaceholder')}
                  />
                </div>

                <div class="form-group">
                  <label htmlFor="message">
                    <span class="material-symbols-sharp">chat</span>
                    {t('contact.form.message')}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={this.formData.message}
                    onInput={(e) => this.handleInputChange('message', (e.target as HTMLTextAreaElement).value)}
                    required
                    disabled={this.formStatus === 'submitting'}
                    placeholder={t('contact.form.messagePlaceholder')}
                  ></textarea>
                </div>

                {this.formStatus === 'success' && (
                  <div class="alert alert-success">
                    <span class="material-symbols-sharp">check_circle</span>
                    {t('contact.form.success')}
                  </div>
                )}

                {this.formStatus === 'error' && (
                  <div class="alert alert-error">
                    <span class="material-symbols-sharp">error</span>
                    {t('contact.form.error')}
                  </div>
                )}

                <button
                  type="submit"
                  class="submit-button"
                  disabled={this.formStatus === 'submitting'}
                >
                  {this.formStatus === 'submitting' ? (
                    <span class="loading">
                      <span class="spinner"></span>
                      {t('contact.form.sending')}
                    </span>
                  ) : (
                    <span>
                      <span class="material-symbols-sharp">send</span>
                      {t('contact.form.send')}
                    </span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
