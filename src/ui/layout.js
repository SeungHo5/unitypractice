import { Dimensions } from 'react-native';

/**
 * Convert a number or percentage string to device pixels along the chosen axis.
 * @param {number|string} value number (dp) or percentage string like '40%'
 * @param {'width'|'height'} [axis='width']
 * @returns {number}
 */
export function toDP(value, axis = 'width') {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const m = /^(\d+(?:\.\d+)?)%$/.exec(value.trim());
    if (m) {
      const ratio = parseFloat(m[1]) / 100;
      const size = Dimensions.get('window')[axis];
      return Math.round(size * ratio);
    }
    const n = Number(value);
    if (!Number.isNaN(n)) return n;
  }
  return 0;
}

/** viewport width percentage to dp */
export const vw = (p) => toDP(`${p}%`, 'width');
/** viewport height percentage to dp */
export const vh = (p) => toDP(`${p}%`, 'height');
