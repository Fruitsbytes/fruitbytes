import 'flowbite';
import { Nullable } from './interfaces/geneneral-types';

export const deleteProperty = (key: string, { [key]: _, ...newObj }) => newObj;

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
 * @param el
 */
export const isOverflown = (el: Nullable<HTMLElement>) => {
  if (!el) {
    return false;
  }

  const { clientWidth, clientHeight, scrollWidth, scrollHeight } = el;
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
    node.classList.add(`${prefix}animated`, ...animations.map(animation => `${prefix}${animation}`));

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event: AnimationEvent) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, ...animations.map(animation => `${prefix}${animation}`));
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd, { once: true });
  });


export const hexToRgb = (hex: string) => {
  return hex?.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
    , (_m, r, g, b) => '#' + r + r + g + g + b + b)
    ?.substring(1)
    ?.match(/.{2}/g)
    ?.map(x => parseInt(x, 16)) || [255, 255, 255];
};

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function text2Binary(string: string) {
  return string.split('').map(function(char) {
    return char.charCodeAt(0).toString(2);
  }).join(' ');
}

export function dec2bin(dec: number) {
  return (dec >>> 0).toString(2);
}

export function _2(n: number) {
  return Math.pow(n, 2);
}
