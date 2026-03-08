export interface BundleLink {
  id: string;
  url: string;
  title?: string;
  favicon?: string;
  ogImage?: string;
}

export interface Bundle {
  links: BundleLink[];
  createdAt: number;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function encodeBundleToUrl(bundle: Bundle): string {
  const data = JSON.stringify(bundle);
  const encoded = btoa(encodeURIComponent(data));
  return `${window.location.origin}/b/${encoded}`;
}

export function decodeBundleFromParam(param: string): Bundle | null {
  try {
    const decoded = decodeURIComponent(atob(param));
    return JSON.parse(decoded) as Bundle;
  } catch {
    return null;
  }
}

export function extractDomain(url: string): string {
  try {
    const u = new URL(url.startsWith('http') ? url : `https://${url}`);
    return u.hostname;
  } catch {
    return url;
  }
}

export function getFaviconUrl(url: string): string {
  const domain = extractDomain(url);
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}

export function getOgImageUrl(url: string): string {
  // Use a free OG image proxy
  const encoded = encodeURIComponent(url.startsWith('http') ? url : `https://${url}`);
  return `https://api.microlink.io/?url=${encoded}&screenshot=true&meta=false&embed=screenshot.url`;
}

export function normalizeUrl(url: string): string {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
}
