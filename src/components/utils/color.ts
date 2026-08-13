// Guarantees a color is never too dark to read as text, while keeping its hue/saturation —
// used for potion names, since accentColor comes from whatever an ingredient's sheet color is
// (can legitimately be near-black, e.g. a "Shadow Potion" flavor) and unlike the potion icon's
// tint, name text has no baked-in shading to fall back on for contrast.
export function withMinLightness(hex: string, minLightness: number): string {
    const [h, s, l] = hexToHsl(hex);
    return `hsl(${h}deg ${s}% ${Math.max(l, minLightness)}%)`;
}

function hexToHsl(hex: string): [number, number, number] {
    const normalized = hex.replace("#", "");
    const full =
        normalized.length === 3
            ? normalized
                  .split("")
                  .map((c) => c + c)
                  .join("")
            : normalized;

    const r = parseInt(full.substring(0, 2), 16) / 255;
    const g = parseInt(full.substring(2, 4), 16) / 255;
    const b = parseInt(full.substring(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;

    if (max === min) {
        return [0, 0, l * 100];
    }

    const d = max - min;
    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    let h: number;
    if (max === r) {
        h = (g - b) / d + (g < b ? 6 : 0);
    } else if (max === g) {
        h = (b - r) / d + 2;
    } else {
        h = (r - g) / d + 4;
    }
    h *= 60;

    return [h, s * 100, l * 100];
}
