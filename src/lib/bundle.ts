const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export interface BundleLink {
  id: string;
  url: string;
  title?: string;
  favicon?: string;
  ogImage?: string;
}

export interface Bundle {
  title: string;
  links: BundleLink[];
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export async function createBundle(bundle: Bundle, token: string, captcha: string): Promise<{ data?: string; error?: string }>  {
  try {
    const headers: any = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const res = await fetch (`${BACKEND_URL}/api/project`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        projectName: bundle.title,
        urls: bundle.links,
        captcha
      })
    });
    const result = await res.json();
    if (res.ok) {
      return { data: `${window.location.origin}/b/${result.slug}` };
    }
    return { error: result.error.toString() || "Something went wrong" };
  } catch {
    return null;
  }
}

export async function fetchBundleBySlug(slug: string): Promise<Bundle | null> {
  try {
    const res = await fetch (`${BACKEND_URL}/api/project/${slug}`);
    if (res.ok) {
      const result = await res.json();
      return {
        title: result.projectName,
        links: result.urls
      };
    }
    return null;
  } catch {
    return null;
  }
}

export async function updateProject(token, slug, projectName, urls) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/project/${slug}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ projectName, urls }),
    });
    const data = await response.json();
    if (!response.ok) {
      return { error: data.error || "Something went wrong" };
    }
    return data;
  } catch (error) {
    return { error: error.message || "Something went wrong" };
  }
};

export async function deleteProject(token, slug) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/project/${slug}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      return { error: data.error || "Something went wrong" };
    }
    return data;
  } catch (error) {
    return { error: error.message || "Something went wrong" };
  }
};

export function extractDomain(url: string): string {
  try {
    const u = new URL(url.startsWith('http') ? url : `https://${url}`);
    return u.hostname;
  } catch (error) {
    console.log(error.message)
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
