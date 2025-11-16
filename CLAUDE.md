# CLAUDE.md - FruitsBytes Development Guide

> **Last Updated**: 2025-11-16
> **For**: AI Assistants working with the FruitsBytes codebase

## Project Overview

**FruitsBytes** is a developer portfolio website built with StencilJS that features a Chrome DevTools-inspired interface. The application uses Web Components and includes a sophisticated resizable right panel with an adaptive menu system and integrated console viewer.

**Current Status**: Early development stage with core UI framework implemented. Game-related dependencies (Phaser, Three.js, Matter.js) are installed but not yet utilized.

## Tech Stack

### Core Framework
- **StencilJS 2.13.0**: Web Components compiler with TypeScript, JSX, and virtual DOM
- **@stencil/router 1.0.1**: Client-side routing
- **@stencil/sass 1.5.2**: SCSS support
- **TypeScript**: ES2017 target with experimental decorators

### Installed Dependencies (Currently Unused)
- **Phaser 3.55.2**: 2D game framework
- **Three.js 0.141.0**: 3D graphics library
- **Matter.js 0.18.0**: 2D physics engine
- **Howler 2.2.3**: Audio library
- **Tween.js 18.6.4**: Animation library

### Utilities
- **clean-deep**: Object cleaning utility
- **highlight.js**: Code syntax highlighting
- **material-symbols**: Material Design icons

## Directory Structure

```
/home/user/fruitbytes/
├── src/
│   ├── assets/
│   │   ├── icon/              # Favicons and app icons
│   │   ├── images/            # UI images, Chrome DevTools SVGs
│   │   ├── logos/             # 90+ technology logos
│   │   └── sounds/            # Audio files (physics sounds, UI feedback)
│   ├── components/
│   │   ├── app-root/          # Root component with layout
│   │   ├── app-home/          # Home page component
│   │   ├── app-profile/       # Profile page with route params
│   │   ├── right-panel/       # **PRIMARY FEATURE**: DevTools-style panel (358 lines)
│   │   ├── modal-backdrop/    # Backdrop overlay manager
│   │   ├── logo-text/         # ASCII art logo component
│   │   ├── simple-link/       # Custom link with History API
│   │   └── page-not-found/    # 404 page component
│   ├── global/
│   │   ├── app.ts             # Global script initialization
│   │   ├── app.css            # Global styles, fonts, theme
│   │   └── global.scss        # Dark color scheme
│   ├── interfaces/
│   │   ├── menuItem.ts        # Menu item data structure
│   │   ├── options.ts         # Backdrop options interface
│   │   └── log.ts             # Console log entry interface
│   ├── config.ts              # **IMPORTANT**: Menu config & route definitions
│   ├── utils.ts               # Utility functions, enums, constants
│   ├── index.html             # HTML template
│   └── manifest.json          # PWA manifest
├── package.json
├── tsconfig.json
├── stencil.config.ts          # Stencil configuration
├── .prettierrc.json           # Code formatting rules
└── .editorconfig              # Editor configuration
```

## Key Architectural Patterns

### 1. Web Components Architecture
- All components use Shadow DOM (`shadow: true`)
- Encapsulated styles per component
- Custom elements with `@Component()` decorator
- JSX with `h` factory function (React-style)

### 2. Event-Driven Communication

Components communicate via custom events:

```typescript
// Menu Events
'menu.opened'
'menu.closed'
'menu.resizing'
'menu.resized'

// Modal Events
'modal.opened'
'modal.closed'

// Console Events
'console.logged'

// Navigation Events
'state.pushed'
```

**Pattern**:
- Emit: `@Event()` decorator + `EventEmitter`
- Listen: `@Listen('eventName')` decorator
- Document-level event capture for global events

### 3. State Management

**Component State**: Uses `@State()` decorator for reactive local state
**Props**: Parent-to-child via `@Prop()` decorator
**Events**: Child-to-parent via custom events

Example:
```typescript
@State() width: number = 234;
@Prop() isOpened: boolean = false;
@Event() menuClosed: EventEmitter;
```

### 4. Routing Structure

Routes defined in `/src/config.ts`:

| Route | Title | Purpose |
|-------|-------|---------|
| `/welcome` | Home | Landing page (default) |
| `/console-log` | Console | Console log viewer |
| `/about-me` | About | About section |
| `/contact-me` | Contact | Contact information |
| `/my-blog` | Blog | Blog posts |
| `/my-projects` | Projects | Project showcase |

**IMPORTANT**: Default route is `/welcome`, redirected from `/` in app-root.tsx:8

## Component Guide

### app-root (`/src/components/app-root/app-root.tsx`)
**Purpose**: Root layout component
- Manages menu open/closed state
- Handles initial routing to `/welcome`
- Contains background and modal backdrop
- Listens for `menu.closed` events

**Key Props**: None (root component)

### right-panel (`/src/components/right-panel/right-panel.tsx`)
**Purpose**: Main UI feature - resizable DevTools-style panel
**Complexity**: HIGH (358 lines)

**Features**:
- Resizable panel (234px - 800px range)
- Adaptive menu system (hides items when space limited)
- Console log viewer integration
- Mouse drag-to-resize functionality
- Material Symbols icons

**Key Props**:
- `isOpened: boolean` - Panel open/closed state

**State**:
- `width: number` - Current panel width
- `logs: Log[]` - Console log entries
- `menuItems: MenuItem[]` - Menu configuration

**Events Emitted**:
- `menuOpened`
- `menuClosed`
- `menuResizing`
- `menuResized`

**Critical Logic**:
- Menu crunching algorithm (`src/components/right-panel/right-panel.tsx:190-240`)
- Resize handlers (`src/components/right-panel/right-panel.tsx:130-160`)

### modal-backdrop (`/src/components/modal-backdrop/modal-backdrop.tsx`)
**Purpose**: Manages multiple backdrop overlays
- Unique backdrop IDs for layering
- Menu resizing visual feedback
- Console logging integration
- Uses `clean-deep` for object cleaning

**Key Props**:
- `backdropId: string` - Unique identifier
- `options: Options` - Backdrop configuration

### simple-link (`/src/components/simple-link/simple-link.tsx`)
**Purpose**: Custom routing link component
- Uses History API for client-side navigation
- Prevents default anchor behavior
- Emits `state.pushed` events

**Usage**:
```tsx
<simple-link url="/about-me">About</simple-link>
```

### logo-text (`/src/components/logo-text/logo-text.tsx`)
**Purpose**: Displays ASCII art logo
- Imports from `logo.txt` (19 lines)
- Console-style monospace rendering

## Console Logging System

Custom logging interface (`/src/interfaces/log.ts`):

```typescript
interface Log {
  line: number;
  message: string;  // HTML allowed (innerHTML)
  file: string;
  time: Date;
  level?: 'info' | 'warning' | 'error' | 'default';
  payload?: any;
}
```

**Usage**: Logged entries display in right-panel when route is `/console-log`

## Utility Functions (`/src/utils.ts`)

### Helper Functions
- `getRandomArbitrary(min, max)`: Random float generator
- `getRandomInt(min, max)`: Random integer generator
- `isOverflown(element)`: Detect element overflow
- `deleteProperty(obj, prop)`: Immutable property deletion

### Enums
- `Z_INDEX`: Layer management constants
- `MenuEvents`: Menu event type constants
- `ModalEvents`: Modal event type constants

## Development Workflow

### Setup
```bash
npm install
```

### Development Server
```bash
npm start
# Runs on http://localhost:3333
# Hot reload enabled
```

### Build
```bash
npm run build
# Outputs to www/ directory
```

### Testing
```bash
npm test                    # Run all tests once
npm run test.watch          # Watch mode for TDD
```

### Component Generation
```bash
npm run generate
# Creates new component with boilerplate
```

## Coding Conventions

### Code Style (Enforced by Prettier)
- **Indent**: 2 spaces (no tabs)
- **Quotes**: Single quotes
- **Line Length**: 180 characters
- **Semicolons**: Required
- **Trailing Commas**: Always
- **Arrow Parens**: Avoid when possible

### TypeScript Rules
- **noUnusedLocals**: Enabled
- **noUnusedParameters**: Enabled
- **Experimental Decorators**: Required for Stencil

### Component Structure
```typescript
import { Component, State, Prop, Event, Listen, h } from '@stencil/core';

@Component({
  tag: 'component-name',
  styleUrl: 'component-name.scss',
  shadow: true,
})
export class ComponentName {
  @Prop() propName: type;
  @State() stateName: type;
  @Event() eventName: EventEmitter;

  @Listen('eventName')
  handleEvent() { }

  componentWillLoad() { }
  componentDidLoad() { }

  render() {
    return <div>...</div>;
  }
}
```

### File Naming
- Components: `component-name/component-name.tsx`
- Styles: `component-name.scss` or `component-name.css`
- Tests: `test/component-name.spec.tsx`, `test/component-name.e2e.ts`
- Interfaces: `interfaces/interfaceName.ts` (camelCase)

## Common Development Tasks

### Adding a New Route

1. **Update config** (`/src/config.ts`):
```typescript
export const AVAILABLE_PATHS: MenuItem[] = [
  // ... existing routes
  { url: '/new-route', title: 'New Route', key: 'newroute' },
];
```

2. **Create component**:
```bash
npm run generate
# Choose component name: page-new-route
```

3. **Add route** in `app-root.tsx`:
```tsx
<stencil-route url="/new-route" component="page-new-route" />
```

### Adding a Menu Item

Update `/src/config.ts`:
```typescript
export const AVAILABLE_PATHS: MenuItem[] = [
  {
    url: '/path',
    title: 'Display Title',
    key: 'uniquekey',  // Used for identification
  },
];
```

Menu items automatically appear in right-panel with adaptive display.

### Emitting Custom Events

```typescript
@Event() customEvent: EventEmitter<DataType>;

this.customEvent.emit({ data: 'value' });
```

### Listening to Custom Events

```typescript
@Listen('customEvent')
handleCustomEvent(event: CustomEvent<DataType>) {
  console.log(event.detail);
}
```

### Adding Console Logs

```typescript
const logEntry: Log = {
  line: 1,
  message: 'Log message with <strong>HTML</strong>',
  file: 'component-name.tsx',
  time: new Date(),
  level: 'info',  // 'info' | 'warning' | 'error' | 'default'
  payload: { /* optional data */ },
};

// Emit via custom event or add to state
this.logs = [...this.logs, logEntry];
```

## Important Files Reference

### Configuration Files

| File | Purpose | Key Settings |
|------|---------|--------------|
| `stencil.config.ts` | Stencil build config | Global styles, output targets, plugins |
| `tsconfig.json` | TypeScript compiler | ES2017 target, experimental decorators |
| `.prettierrc.json` | Code formatting | 180 char width, single quotes, 2 space indent |
| `.editorconfig` | Editor settings | LF line endings, UTF-8, trim whitespace |

### Application Files

| File | Purpose | Critical Info |
|------|---------|---------------|
| `/src/config.ts` | Route & menu definitions | **Update when adding routes** |
| `/src/utils.ts` | Shared utilities | Constants, enums, helper functions |
| `/src/global/app.css` | Global styles | Font imports, CSS variables, theme |
| `/src/global/app.ts` | Global initialization | Runs on app startup |

## Chrome DevTools UI Pattern

The application mimics Chrome DevTools aesthetic:

**Color Scheme**: Dark theme with Chrome-inspired colors
- Background: `#16161d`
- Panel: `#1e1e1e`
- Borders: Subtle grays

**Styling Location**: `/src/global/global.scss`

**Icons**: Material Symbols (outlined style)

**Resize Behavior**: Follows Chrome DevTools panel resize UX:
- Drag handle on left edge
- Min width: 234px
- Max width: 800px
- Cursor changes to `col-resize`

## Known TODOs & Limitations

### Not Yet Implemented
1. **404 Routing**: Component exists but route handling incomplete
2. **Game Features**: Physics/game dependencies installed but unused
3. **Audio System**: Howler.js available but no integration
4. **Profile Routes**: Basic template but not fully integrated

### Future Enhancement Areas
Based on dependencies:
- Physics-based interactive demos (Matter.js, Phaser)
- 3D visualizations (Three.js, enable3d)
- Audio feedback for UI interactions (Howler.js)
- Code syntax highlighting in console (highlight.js)

## Testing Approach

### Unit Tests (`.spec.tsx`)
- Located in `test/` subdirectories
- Uses Jest + Stencil testing utilities
- Tests component behavior and logic

### E2E Tests (`.e2e.ts`)
- Puppeteer-based browser testing
- Tests full component rendering
- Located in `test/` subdirectories

**Run Tests**:
```bash
npm test           # All tests
npm run test.watch # Watch mode
```

## Git Workflow

**Current Branch**: `claude/claude-md-mi26s2ii802gvx17-01PQvdQENUa2EG3VaLsiWPwD`

### Commit Guidelines
- Clear, descriptive commit messages
- Reference issue/task when applicable
- Use conventional commits format preferred

### Pushing Changes
```bash
git add .
git commit -m "Description of changes"
git push -u origin claude/claude-md-mi26s2ii802gvx17-01PQvdQENUa2EG3VaLsiWPwD
```

**IMPORTANT**: Branch must start with `claude/` and end with session ID, or push will fail with 403.

## Performance Considerations

### Lazy Loading
- Stencil supports lazy loading out of the box
- Components load on-demand

### Shadow DOM
- Encapsulated styles prevent global CSS pollution
- Better performance through style scoping

### Async Rendering
- Task queue set to `async` in stencil.config.ts
- Improves perceived performance

## Browser Support

Target: Modern browsers supporting Custom Elements v1
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

**Note**: IE11 not supported (uses Web Components)

## PWA Features

**Manifest**: `/src/manifest.json`
- Standalone display mode
- Dark theme color: `#16161d`
- 512x512 app icon

**Service Worker**: Disabled in current config
- Can be enabled in `stencil.config.ts`

## Tips for AI Assistants

### When Making Changes

1. **Always read the file first** using the Read tool before editing
2. **Check `/src/config.ts`** when working with routes or menu items
3. **Use existing patterns** - follow the component structure established
4. **Respect the event system** - don't break event-driven communication
5. **Test adaptive UI** - ensure menu crunching works after changes to right-panel
6. **Check TypeScript strict mode** - no unused variables/parameters allowed

### Common Pitfalls

- **Don't modify component tag names** - breaks existing usage
- **Don't remove shadow: true** - changes component encapsulation
- **Don't break event names** - other components may listen to them
- **Don't hardcode widths** - right-panel uses dynamic sizing
- **Don't add tabs** - EditorConfig enforces spaces

### When Adding Features

1. Consider if it belongs in an existing component or needs a new one
2. Update `/src/config.ts` if adding routes
3. Emit appropriate custom events for cross-component communication
4. Add TypeScript interfaces for new data structures
5. Follow the existing Shadow DOM + SCSS pattern
6. Include unit and E2E tests

### When Debugging

1. Check browser console for Web Component errors
2. Verify Shadow DOM is rendering correctly
3. Use Chrome DevTools to inspect custom element properties
4. Check event listeners in DevTools Event Listeners panel
5. Verify routes in `/src/config.ts` match usage

## Resources

### Stencil Documentation
- **Official Docs**: https://stenciljs.com/docs/introduction
- **Component API**: https://stenciljs.com/docs/component
- **Decorators**: https://stenciljs.com/docs/decorators

### Project Files
- **Main Config**: `/home/user/fruitbytes/stencil.config.ts`
- **Route Config**: `/home/user/fruitbytes/src/config.ts`
- **Utils**: `/home/user/fruitbytes/src/utils.ts`

---

**Generated**: 2025-11-16 | **Project**: FruitsBytes | **Framework**: StencilJS 2.13.0
