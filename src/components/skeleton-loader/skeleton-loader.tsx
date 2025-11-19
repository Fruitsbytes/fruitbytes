import { Component, Host, h, Prop } from '@stencil/core';

export type SkeletonType = 'text' | 'circle' | 'rectangle' | 'card' | 'avatar' | 'button';

@Component({
  tag: 'skeleton-loader',
  styleUrl: 'skeleton-loader.scss',
  shadow: true,
})
export class SkeletonLoader {
  @Prop() type: SkeletonType = 'text';
  @Prop() width: string = '100%';
  @Prop() height: string = '20px';
  @Prop() count: number = 1;
  @Prop() animated: boolean = true;

  private renderSkeleton(index: number) {
    const style = {
      width: this.width,
      height: this.height,
    };

    let className = `skeleton skeleton-${this.type}`;
    if (this.animated) {
      className += ' skeleton-animated';
    }

    switch (this.type) {
      case 'circle':
      case 'avatar':
        return <div key={index} class={className} style={{ width: this.width, height: this.width }}></div>;

      case 'card':
        return (
          <div key={index} class="skeleton-card">
            <div class="skeleton skeleton-rectangle skeleton-animated" style={{ height: '200px', marginBottom: '16px' }}></div>
            <div class="skeleton skeleton-text skeleton-animated" style={{ width: '80%', marginBottom: '8px' }}></div>
            <div class="skeleton skeleton-text skeleton-animated" style={{ width: '60%', marginBottom: '8px' }}></div>
            <div class="skeleton skeleton-text skeleton-animated" style={{ width: '90%' }}></div>
          </div>
        );

      case 'button':
        return <div key={index} class={className} style={{ width: this.width || '120px', height: this.height || '40px' }}></div>;

      default:
        return <div key={index} class={className} style={style}></div>;
    }
  }

  render() {
    return (
      <Host role="status" aria-label="Loading content" aria-live="polite">
        <div class="skeleton-wrapper">
          {Array.from({ length: this.count }, (_, i) => this.renderSkeleton(i))}
        </div>
        <span class="sr-only">Loading...</span>
      </Host>
    );
  }
}
