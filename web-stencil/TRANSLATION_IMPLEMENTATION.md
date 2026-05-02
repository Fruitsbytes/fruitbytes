# Translation Support Implementation

This document describes the internationalization (i18n) system implemented for the FruitsBytes website.

## Supported Languages

- **English (en)** - Default language
- **Haitian Creole (ht)**
- **Spanish (es)**
- **French (fr)**

## URL-Based Language Routing

The translation system uses URL prefixes to maintain language consistency across navigation:

**URL Format:** `/:language/:page`

Examples:
- `/en/welcome` - English welcome page
- `/ht/about-me` - Haitian Creole about page
- `/es/my-blog` - Spanish blog page
- `/fr/contact-me` - French contact page

**Language Detection Priority:**
1. **URL parameter** (e.g., `/en/welcome`) - Highest priority
2. **LocalStorage** (`fruitbytes_language`) - Saved user preference
3. **Browser language** - Auto-detected from `navigator.language`
4. **Default** (`en`) - Fallback when none of the above apply

**Automatic URL Updates:**
- When user selects a language, the URL updates automatically
- Navigation links include the current language prefix
- Back/forward browser buttons maintain language context
- Refreshing the page preserves language from URL

**URL Redirects:**
- `/` → `/:language/welcome` (based on detected language)
- `/welcome` → `/:language/welcome` (adds missing language prefix)
- Invalid paths show 404 while maintaining language

## Architecture Overview

The translation system consists of the following components:

### 1. Translation Files (`/src/translations/` and `/src/assets/translations/`)

JSON files containing translations for each language:
- `en.json` - English translations
- `ht.json` - Haitian Creole translations
- `es.json` - Spanish translations
- `fr.json` - French translations

**Structure:**
```json
{
  "common": { ... },
  "nav": { ... },
  "welcome": { ... },
  "about": { ... },
  "contact": { ... },
  "blog": { ... },
  "projects": { ... },
  "console": { ... },
  "errors": { ... },
  "language": { ... }
}
```

### 2. TypeScript Interfaces (`/src/interfaces/translation.ts`)

Defines types for the translation system:
- `Language` - Type for supported language codes
- `TranslationKeys` - Interface defining the structure of translation objects
- `LanguageInfo` - Interface for language metadata
- `AVAILABLE_LANGUAGES` - Array of available languages with native names
- `DEFAULT_LANGUAGE` - Default language constant ('en')

### 3. i18n Service (`/src/services/i18n.ts`)

Core translation service with the following features:

**Key Functions:**
- `t(key, variables?, language?)` - Translate a key to the current language
- `setLanguage(language, updateURL?)` - Change the current language and optionally update URL
- `getCurrentLanguage()` - Get the current language
- `loadTranslations(language)` - Load translation file for a language
- `subscribeToLanguageChange(callback)` - Subscribe to language changes
- `preloadLanguages(languages)` - Preload multiple language files
- `getLanguageFromURL()` - Extract language code from current URL
- `getPathWithoutLanguage(pathname?)` - Get page path without language prefix
- `buildURLWithLanguage(path, language?)` - Build URL with language prefix

**Features:**
- Automatic language detection from browser settings
- LocalStorage persistence of language preference
- Lazy loading of translation files
- Dot notation for nested keys (e.g., `t('nav.home')`)
- Variable interpolation (e.g., `t('greeting', {name: 'John'})`)
- Fallback to default language for missing keys
- Observable pattern for reactive updates
- Prepared for future API integration

### 4. Language Selector Component (`/src/components/language-selector/`)

User interface for language selection:

**Features:**
- Dropdown menu with all available languages
- Shows current language in button
- Displays native language names
- Material Symbols icons
- Keyboard accessible (ARIA compliant)
- Dark theme styling matching the DevTools aesthetic
- Responsive design

**Location:** Integrated into the right-panel's top navigation bar

### 5. Updated Components

#### app-root Component
- Added `currentLanguage` state
- Loads translations on initialization
- Subscribes to language change events
- Emits `language.changed` event to all components
- Logs language changes to console
- **Handles URL language routing:**
  - Redirects URLs without language prefix
  - Syncs language state from URL changes
  - Updates language on browser back/forward navigation

#### right-panel Component
- Uses `getTranslatedMenuItems()` for menu items
- Listens to `language.changed` events
- Updates menu items when language changes
- Recalculates menu layout after language change
- Includes language-selector in top navigation
- **Extracts page paths without language prefix for route matching**

#### simple-link Component
- **Automatically adds language prefix to all navigation links**
- Subscribes to language changes to update hrefs
- Builds URLs with current language using `buildURLWithLanguage()`
- Ensures consistent language across all navigation

#### config.ts
- Added `getTranslatedMenuItems()` function
- Maps menu item keys to translation keys in nav namespace
- Maintains backward compatibility

## Usage Guide

### Using Translations in Components

Import the translation function:

```typescript
import { t } from '../../services/i18n';
```

Use in your component:

```tsx
render() {
  return (
    <div>
      <h1>{t('welcome.title')}</h1>
      <p>{t('welcome.description')}</p>
      <p>{t('greeting', { name: 'John' })}</p>
    </div>
  );
}
```

### Listening to Language Changes

```typescript
import { subscribeToLanguageChange } from '../../services/i18n';

connectedCallback() {
  subscribeToLanguageChange((language) => {
    console.log('Language changed to:', language);
    this.forceUpdate(); // Re-render component
  });
}
```

Or use the document event:

```typescript
@Listen('language.changed', { target: 'document' })
handleLanguageChange(event: CustomEvent<Language>) {
  // Update component state
  this.currentLanguage = event.detail;
}
```

### Adding New Translation Keys

1. Add the key to all language files:

```json
// en.json
{
  "mySection": {
    "newKey": "English text"
  }
}
```

```json
// ht.json
{
  "mySection": {
    "newKey": "Teks Kreyòl"
  }
}
```

2. Update the `TranslationKeys` interface in `/src/interfaces/translation.ts`:

```typescript
export interface TranslationKeys {
  // ... existing keys
  mySection: {
    newKey: string;
  };
}
```

3. Use the key in your components:

```tsx
{t('mySection.newKey')}
```

## How Language Switching Works

1. User clicks the language selector button
2. Dropdown menu appears with all available languages
3. User selects a language
4. `setLanguage(language)` is called
5. i18n service loads the translation file (if not already loaded)
6. Service updates current language and saves to localStorage
7. Service emits notifications to all subscribers
8. app-root receives notification and emits `language.changed` event
9. All listening components update their content
10. Menu items are re-translated and menu layout is recalculated

## Future Enhancements

The system is designed to support future API-based translation:

### API Integration Hook

The i18n service includes a placeholder method for AI-based translation:

```typescript
async fetchTranslationFromAPI(key: string, language: Language, context?: string): Promise<string>
```

**Implementation Steps:**
1. Create a translation API endpoint
2. Implement the `fetchTranslationFromAPI` method
3. Call this method when a translation key is missing
4. Cache the result in the translation file or localStorage

**Example API Call:**
```typescript
async fetchTranslationFromAPI(key: string, language: Language, context?: string): Promise<string> {
  const response = await fetch('/api/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      key,
      language,
      context,
      sourceLanguage: this.fallbackLanguage
    })
  });

  const data = await response.json();

  // Optionally cache the translation
  if (data.translation) {
    const translations = this.translations.get(language);
    if (translations) {
      // Update the translation object with the new key
      this.setNestedProperty(translations, key, data.translation);
    }
  }

  return data.translation || key;
}
```

## File Structure Summary

```
src/
├── assets/
│   └── translations/          # Translation files served to browser
│       ├── en.json
│       ├── ht.json
│       ├── es.json
│       └── fr.json
├── translations/              # Source translation files
│   ├── en.json
│   ├── ht.json
│   ├── es.json
│   └── fr.json
├── interfaces/
│   └── translation.ts         # TypeScript interfaces
├── services/
│   └── i18n.ts               # Translation service
├── components/
│   ├── app-root/
│   │   └── app-root.tsx      # Updated with language state
│   ├── right-panel/
│   │   ├── right-panel.tsx   # Updated with translations
│   │   └── right-panel.scss  # Added language-selector styles
│   └── language-selector/    # Language selector component
│       ├── language-selector.tsx
│       └── language-selector.scss
└── config.ts                  # Added getTranslatedMenuItems()
```

## Testing

To test the translation system:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open the application in your browser

4. Click the language selector in the top-right corner of the right panel

5. Select different languages and verify:
   - Menu items update immediately
   - Language preference persists on page reload
   - Console log shows language change message

## Browser Compatibility

The translation system works in all modern browsers that support:
- ES2017 features
- Fetch API
- LocalStorage
- Custom Events
- Web Components

## Performance Considerations

- **Lazy Loading**: Translation files are only loaded when needed
- **Caching**: Loaded translations are cached in memory
- **LocalStorage**: User's language preference is stored locally
- **Minimal Bundle Size**: Translation files are not included in the main bundle

## Accessibility

The language selector component is fully accessible:
- Keyboard navigation supported
- ARIA labels and roles
- Focus indicators
- Screen reader friendly

## Notes

- The default language is English (en)
- Language preference is stored in localStorage as `fruitbytes_language`
- If no preference is saved, the system attempts to detect the browser language
- If browser language is not supported, English is used as default
- All translation keys use dot notation for nested objects
- Missing translation keys display the key itself as fallback

## Translation Coverage

Current translations include:
- Navigation menu items
- Common UI elements (buttons, labels)
- Welcome page content
- About page labels
- Contact page labels
- Blog page labels
- Projects page labels
- Console log interface
- Error messages
- Language selector labels

## Multilingual Blog Support

The blog system fully supports multiple languages:

### Blog Post Structure

Each blog post can have multiple language versions with the same ID:

```typescript
{
  id: 'claude-code-ai-assistant', // Same ID for all language versions
  metadata: {
    title: 'Claude Code: The AI-Powered Development Assistant',
    language: 'en', // Language indicator
    // ... other metadata
  },
  content: '...',
  excerpt: '...'
}
```

### Blog Service Methods

All blog service methods support language filtering:

- `getAllPosts(language?)` - Get all posts for a language
- `getPostById(id, language?)` - Get specific post in a language
- `getPostsByCategory(category, language?)` - Filter by category and language
- `getPostsByTag(tag, language?)` - Filter by tag and language
- `getAvailableLanguages(postId)` - Check which languages a post is available in
- `getPostWithFallback(id, language)` - Get post with English fallback

### Adding Multilingual Blog Posts

1. Create blog posts with the same `id` but different `language` values
2. The blog service automatically filters posts by current language
3. Users only see posts in their selected language
4. Fallback to English if post not available in current language

## SEO & Meta Tags

Complete SEO support with automatic meta tag management:

### Meta Tags Service

Location: `/src/services/metaTagsService.ts`

**Features:**
- Automatic HTML `lang` attribute updates
- Standard meta tags (description, keywords, author)
- Open Graph tags for social media previews
- Twitter Card tags for Twitter sharing
- Alternate language links (`hreflang`)
- Canonical URLs
- Article-specific meta tags

### Auto-Generated Meta Tags

The system automatically generates:

1. **Language-Specific Tags:**
   - `<html lang="xx">` - Current language
   - `<meta name="language" content="xx">`
   - `<meta property="og:locale" content="xx_XX">`
   - `<meta property="og:locale:alternate">` for other languages

2. **Alternate Language Links:**
   ```html
   <link rel="alternate" hreflang="en" href="/en/welcome">
   <link rel="alternate" hreflang="ht" href="/ht/welcome">
   <link rel="alternate" hreflang="es" href="/es/welcome">
   <link rel="alternate" hreflang="fr" href="/fr/welcome">
   <link rel="alternate" hreflang="x-default" href="/en/welcome">
   ```

3. **Open Graph Tags:**
   ```html
   <meta property="og:title" content="...">
   <meta property="og:description" content="...">
   <meta property="og:url" content="...">
   <meta property="og:image" content="...">
   <meta property="og:type" content="website|article">
   <meta property="og:locale" content="en_US">
   <meta property="og:locale:alternate" content="es_ES">
   ```

4. **Twitter Card Tags:**
   ```html
   <meta name="twitter:card" content="summary_large_image">
   <meta name="twitter:title" content="...">
   <meta name="twitter:description" content="...">
   <meta name="twitter:image" content="...">
   ```

### Route-Specific Meta Tags

Meta tags update automatically based on current route:

- **Welcome Page:** Uses `welcome.title` and `welcome.description` translations
- **About Page:** Uses `about.title` and `about.description` translations
- **Blog Page:** Uses `blog.title` and `blog.description` translations
- **Projects Page:** Uses `projects.title` and `projects.description` translations
- **Contact Page:** Uses `contact.title` and `contact.description` translations

### Meta Tags Update on:
- Page load
- Language change
- Route navigation

### SEO Benefits

- **Language-Specific URLs:** `/en/welcome`, `/es/welcome` help search engines index content properly
- **Hreflang Tags:** Tell search engines about language versions
- **Open Graph:** Rich previews when shared on Facebook, LinkedIn
- **Twitter Cards:** Rich previews when shared on Twitter
- **Canonical URLs:** Prevent duplicate content issues
- **Responsive Images:** OG images optimized for social sharing (1200x630)

## Next Steps

To complete the translation system:

1. **Translate remaining content**: Update all page components to use `t()` function
2. **Add more translation keys**: Expand translation files with all site content
3. **Implement API integration**: Connect to AI translation service for dynamic translations
4. **Add RTL support**: If you plan to support right-to-left languages in the future
5. **Create translation management UI**: Build an interface for managing translations
6. **Add language detection**: Improve browser language detection
7. **Add more languages**: Expand language support as needed
