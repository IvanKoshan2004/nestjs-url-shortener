export function parseReferrerDomain(referrer: string): string {
    const regexp = new RegExp('http(?:s)?://(.*)/');
    const res = referrer.match(regexp);
    return res ? res[1] : '';
}
