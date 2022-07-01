export const deleteProperty = (key, { [key]: _, ...newObj }) => newObj;

export enum Z_INDEX {
  BACKDROP = 15,
  MENU = 25,
  MENU_BACKDROP = 20,
  MENU_BACKDROP_ELEVATED = 29,
  MODAL = 35,
  MODAL_BAKDROP = 30
}

export enum MenuEvents {
  opened = 'menu.opened',
  closed = 'menu.closed',
  resizingStarted = 'menu.resizing',
  resizingEnded = 'menu.resized'
}

export enum ModalEvents {
  opened = 'modal.opened',
  closed = 'modal.closed',
}

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 * https://stackoverflow.com/a/1527820/1427338
 * @param min
 * @param max
 */
export function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 * https://stackoverflow.com/a/1527820/1427338
 * @param min
 * @param max
 */
export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * https://stackoverflow.com/a/9541579/1427338
 * @param clientWidth
 * @param clientHeight
 * @param scrollWidth
 * @param scrollHeight
 */
export const isOverflown = ({ clientWidth, clientHeight, scrollWidth, scrollHeight }: HTMLElement) => {
  return scrollHeight > clientHeight || scrollWidth > clientWidth;
};



/**
 *
 * @param el
 */
export function getPosition(el: HTMLElement) {
  const rect = el.getBoundingClientRect();

  return {
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX,
    width: rect.width,
  };
}

export const animateCSS = (node: HTMLElement, animations: string[], prefix = 'animate__') =>
  // We create a Promise and return it
  new Promise((resolve, _reject) => {
   ;
    node.classList.add(`${prefix}animated`, ...animations.map( animation => `${prefix}${animation}`));

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, ...animations.map( animation => `${prefix}${animation}`));
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd, {once: true});
  });
