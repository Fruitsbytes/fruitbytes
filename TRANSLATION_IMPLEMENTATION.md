# Translation Support Implementation

This document describes the internationalization (i18n) system implemented for the FruitsBytes website.

## Supported Languages

- **English (en)** - Default language
- **Haitian Creole (ht)**
- **Spanish (es)**
- **French (fr)**

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
- `setLanguage(language)` - Change the current language
- `getCurrentLanguage()` - Get the current language
- `loadTranslations(language)` - Load translation file for a language
- `subscribeToLanguageChange(callback)` - Subscribe to language changes
- `preloadLanguages(languages)` - Preload multiple language files

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

#### right-panel Component
- Uses `getTranslatedMenuItems()` for menu items
- Listens to `language.changed` events
- Updates menu items when language changes
- Recalculates menu layout after language change
- Includes language-selector in top navigation

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

## Next Steps

To complete the translation system:

1. **Translate remaining content**: Update all page components to use `t()` function
2. **Add more translation keys**: Expand translation files with all site content
3. **Implement API integration**: Connect to AI translation service for dynamic translations
4. **Add RTL support**: If you plan to support right-to-left languages in the future
5. **Create translation management UI**: Build an interface for managing translations
6. **Add language detection**: Improve browser language detection
7. **Add more languages**: Expand language support as needed
