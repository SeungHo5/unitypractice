import React from 'react';
import { View, Dimensions } from 'react-native';

/**
 * @typedef {number|string} GapValue  // number (dp) or percentage string like '5%'
 */

/**
 * Convert a gap value to pixels along the given axis.
 * @param {GapValue} gap
 * @param {'width'|'height'} axis
 * @returns {number}
 */
function gapPx(gap, axis) {
  if (typeof gap === 'number') return gap;
  if (typeof gap === 'string') {
    const m = /^(\d+(?:\.\d+)?)%$/.exec(gap.trim());
    if (m) {
      const ratio = parseFloat(m[1]) / 100;
      const size = Dimensions.get('window')[axis];
      return Math.round(size * ratio);
    }
  }
  return 0;
}

/**
 * Horizontal stack that emulates CSS `gap` on RN 0.71.
 * - If wrap=false: applies marginRight to all but the last child.
 * - If wrap=true: uses negative/positive margins technique for clean grid spacing.
 */
export const HStack = ({ gap = 0, align, justify, wrap = false, style, children }) => {
  const g = gapPx(gap, 'width');
  const base = { flexDirection: 'row', alignItems: align, justifyContent: justify };

  if (wrap) {
    return (
      <View style={[base, { flexWrap: 'wrap', marginHorizontal: -g / 2, marginVertical: -g / 2 }, style]}>
        {React.Children.toArray(children).map((child, i) => (
          <View key={i} style={{ marginHorizontal: g / 2, marginVertical: g / 2 }}>{child}</View>
        ))}
      </View>
    );
  }

  const arr = React.Children.toArray(children);
  return (
    <View style={[base, style]}>
      {arr.map((child, i) => (
        <View key={i} style={{ marginRight: i < arr.length - 1 ? g : 0 }}>{child}</View>
      ))}
    </View>
  );
};

/**
 * Vertical stack that emulates CSS `gap` on RN 0.71.
 */
export const VStack = ({ gap = 0, align, justify, wrap = false, style, children }) => {
  const g = gapPx(gap, 'height');
  const base = { flexDirection: 'column', alignItems: align, justifyContent: justify };

  if (wrap) {
    return (
      <View style={[base, { flexWrap: 'wrap', marginHorizontal: -g / 2, marginVertical: -g / 2 }, style]}>
        {React.Children.toArray(children).map((child, i) => (
          <View key={i} style={{ marginHorizontal: g / 2, marginVertical: g / 2 }}>{child}</View>
        ))}
      </View>
    );
  }

  const arr = React.Children.toArray(children);
  return (
    <View style={[base, style]}>
      {arr.map((child, i) => (
        <View key={i} style={{ marginBottom: i < arr.length - 1 ? g : 0 }}>{child}</View>
      ))}
    </View>
  );
};

/**
 * Utility container + child styles for when you cannot wrap each child manually.
 * @param {'row'|'column'} direction
 * @param {GapValue} gap
 */
export function applyGap(direction, gap) {
  const g = gapPx(gap, direction === 'row' ? 'width' : 'height');
  if (direction === 'row') {
    return {
      container: { flexDirection: 'row', marginHorizontal: -g / 2 },
      child: { marginHorizontal: g / 2 },
    };
  }
  return {
    container: { flexDirection: 'column', marginVertical: -g / 2 },
    child: { marginVertical: g / 2 },
  };
}
