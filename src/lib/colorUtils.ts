// Map common color names to hex values
const colorNameToHex: Record<string, string> = {
  // Basic colors
  black: '#000000',
  white: '#FFFFFF',
  red: '#FF0000',
  green: '#008000',
  blue: '#0000FF',
  yellow: '#FFFF00',
  orange: '#FFA500',
  purple: '#800080',
  pink: '#FFC0CB',
  brown: '#8B4513',
  gray: '#808080',
  grey: '#808080',
  
  // Extended colors
  navy: '#000080',
  maroon: '#800000',
  olive: '#808000',
  teal: '#008080',
  aqua: '#00FFFF',
  cyan: '#00FFFF',
  magenta: '#FF00FF',
  fuchsia: '#FF00FF',
  lime: '#00FF00',
  silver: '#C0C0C0',
  gold: '#FFD700',
  beige: '#F5F5DC',
  ivory: '#FFFFF0',
  coral: '#FF7F50',
  salmon: '#FA8072',
  khaki: '#F0E68C',
  lavender: '#E6E6FA',
  turquoise: '#40E0D0',
  tan: '#D2B48C',
  chocolate: '#D2691E',
  crimson: '#DC143C',
  indigo: '#4B0082',
  violet: '#EE82EE',
  plum: '#DDA0DD',
  orchid: '#DA70D6',
  
  // Common shoe colors
  'dark brown': '#5C4033',
  'light brown': '#A0522D',
  'dark blue': '#00008B',
  'light blue': '#ADD8E6',
  'dark green': '#006400',
  'light green': '#90EE90',
  'dark gray': '#A9A9A9',
  'light gray': '#D3D3D3',
  'dark grey': '#A9A9A9',
  'light grey': '#D3D3D3',
  camel: '#C19A6B',
  cognac: '#9A463D',
  burgundy: '#800020',
  charcoal: '#36454F',
  cream: '#FFFDD0',
  nude: '#E3BC9A',
  mustard: '#FFDB58',
  rust: '#B7410E',
  wine: '#722F37',
  coffee: '#6F4E37',
  espresso: '#3C2415',
  sand: '#C2B280',
  taupe: '#483C32',
  slate: '#708090',
  denim: '#1560BD',
  pewter: '#8F8F8F',
  bronze: '#CD7F32',
  copper: '#B87333',
  rose: '#FF007F',
  mint: '#98FF98',
  peach: '#FFCBA4',
  
  // Multi-color
  multicolor: 'linear-gradient(135deg, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #8B00FF)',
  rainbow: 'linear-gradient(135deg, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #8B00FF)',
};

export function getColorFromName(colorName: string): string {
  if (!colorName) return '#666666';
  
  const normalized = colorName.toLowerCase().trim();
  
  // Direct match
  if (colorNameToHex[normalized]) {
    return colorNameToHex[normalized];
  }
  
  // Partial match - check if color name contains any known color
  for (const [key, value] of Object.entries(colorNameToHex)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value;
    }
  }
  
  // Default fallback
  return '#666666';
}
