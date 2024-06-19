/**
 * Credits:
 * - Based on: https://github.com/coffee-cup/gradient-avatars
 * - Some ideas: https://github.com/brandonsueur/react-gradient-avatar
*/
import ColorHash from "color-hash";
import { UID } from "$lib/types/uid";

export function getInitials(name: string): string {
  const names = name.split(" ");
  let initials = names[0].substring(0, 1).toUpperCase();
  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
};


export function buildGradient(initials: string, size = 'lg') {

  const sizeMap: any = {
    'sm': 20, // px
    'md': 30,
    'lg': 44, // h-11
    'xl': 72,
  };
  
  const colorHash = new ColorHash({ saturation: 1.0 });
  
  const stringToColour = (s: string): string => colorHash.hex(s);
  
  const generateColours = (s: string): [string, string] => {
    const s1 = s.substring(0, s.length / 2);
    const s2 = s.substring(s.length / 2);
    const c1 = stringToColour(s1);
    const c2 = stringToColour(s2);
    return [c1, c2];
  };
  
  function generateSVG(s: string, size = 256): string {
    const [c1, c2] = generateColours(s);
    const gradientId = `gradient-${UID.uuid4()}`
    const svg = `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="${size / 2}" cy="${size / 2}" r="${
          size / 2
        }" fill="url(#${gradientId})" />
        <defs>
        <linearGradient id="${gradientId}" x1="0" y1="0" x2="${size}" y2="${size}" gradientUnits="userSpaceOnUse">
            <stop stop-color="${c1}" />
            <stop offset="1" stop-color="${c2}" />
          </linearGradient>
        </defs>
      </svg>
    `.trim();
  
    return svg;
  };

  return generateSVG(initials, sizeMap[size]);
}
