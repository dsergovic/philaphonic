// iPadOS 13+ reports as "MacIntel" but has touch support, unlike real Macs.
const isApplePlatform =
  typeof navigator !== 'undefined' &&
  (/iP(hone|od|ad)/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));

/** Maps link for a place: opens native Apple Maps on iOS/iPadOS, Google Maps elsewhere. */
export function mapsUrl(query: string): string {
  return isApplePlatform
    ? `https://maps.apple.com/?q=${encodeURIComponent(query)}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
