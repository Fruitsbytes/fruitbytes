# Building Scalable Web Components with StencilJS

Discover why StencilJS is the perfect tool for creating reusable, framework-agnostic web components that work everywhere.

## Why StencilJS?

StencilJS combines the best ideas from popular frameworks into a simple compiler that generates standard Web Components. The result? Components that work in any framework - or no framework at all.

### The StencilJS Advantage

1. **Framework Agnostic**: Your components work in React, Vue, Angular, or vanilla JS
2. **TypeScript First**: Full TypeScript support out of the box
3. **Tiny Runtime**: Components compile to native Web Components with minimal overhead
4. **Developer Experience**: JSX, decorators, and modern tooling

## Creating Your First Component

```typescript
import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'my-button',
  styleUrl: 'my-button.scss',
  shadow: true,
})
export class MyButton {
  @Prop() label: string;
  @Prop() variant: 'primary' | 'secondary' = 'primary';

  render() {
    return (
      <button class={`btn btn-${this.variant}`}>
        {this.label}
      </button>
    );
  }
}
```

Use it anywhere:

```html
<!-- In any HTML -->
<my-button label="Click Me" variant="primary"></my-button>

<!-- In React -->
<MyButton label="Click Me" variant="primary" />

<!-- In Vue -->
<my-button label="Click Me" variant="primary"></my-button>
```

## Advanced Patterns

### State Management

```typescript
import { Component, State, h } from '@stencil/core';

@Component({
  tag: 'counter-button',
  shadow: true,
})
export class CounterButton {
  @State() count = 0;

  increment = () => {
    this.count++;
  };

  render() {
    return (
      <button onClick={this.increment}>
        Clicked {this.count} times
      </button>
    );
  }
}
```

### Events

```typescript
import { Component, Event, EventEmitter, h } from '@stencil/core';

@Component({
  tag: 'custom-input',
  shadow: true,
})
export class CustomInput {
  @Event() valueChanged: EventEmitter<string>;

  handleInput = (e: Event) => {
    const value = (e.target as HTMLInputElement).value;
    this.valueChanged.emit(value);
  };

  render() {
    return <input type="text" onInput={this.handleInput} />;
  }
}
```

## Real-World Use Case: Design Systems

StencilJS excels at building design systems that need to work across multiple frameworks:

```typescript
@Component({
  tag: 'ds-card',
  styleUrl: 'ds-card.scss',
  shadow: true,
})
export class Card {
  @Prop() elevated: boolean = false;
  @Prop() padding: 'sm' | 'md' | 'lg' = 'md';

  render() {
    return (
      <div
        class={{
          'card': true,
          'card--elevated': this.elevated,
          [`card--padding-${this.padding}`]: true,
        }}
      >
        <slot />
      </div>
    );
  }
}
```

## Performance Benefits

StencilJS components are:
- **Lazy Loaded**: Only load what you need
- **Efficiently Updated**: Virtual DOM with optimized diffing
- **Small Bundle**: Native Web Components with minimal runtime

## Conclusion

StencilJS represents the future of component development: write once, use anywhere. Whether you're building a design system, reusable widgets, or a full application, StencilJS provides the perfect balance of power and simplicity.

---

**Metadata:**
```json
{
  "title": "Building Scalable Web Components with StencilJS",
  "description": "Learn why StencilJS is the perfect tool for creating reusable, framework-agnostic web components that work everywhere.",
  "author": "Jeffrey Nicholson Carré",
  "date": "2024-11-10",
  "category": "Web Development",
  "tags": ["StencilJS", "Web Components", "TypeScript", "Frontend"],
  "image": "/assets/images/blog/stenciljs.jpg",
  "readTime": 6
}
```
