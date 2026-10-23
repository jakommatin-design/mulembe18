/**
 * Smart image URL normalizer and sanitizer for Mulembe18.
 *
 * Automatically detects and extracts direct image links from search engine
 * result pages (Bing Images, Google Images, Yahoo, DuckDuckGo, etc.)
 * when users copy links directly from their browser address bar.
 */

export function normalizeImageUrl(
  rawUrl: string | null | undefined,
  fallback: string = "/images/landing-hero.png"
): string {
  if (!rawUrl || typeof rawUrl !== "string") {
    return fallback;
  }

  let url = rawUrl.trim();
  if (!url) return fallback;

  // Local static paths (e.g., /images/logo.png)
  if (url.startsWith("/") && !url.startsWith("//")) {
    return url;
  }

  // Handle data URIs or blob URLs
  if (url.startsWith("data:image/") || url.startsWith("blob:")) {
    return url;
  }

  try {
    // If protocol is missing, add https
    if (url.startsWith("//")) {
      url = "https:" + url;
    } else if (!/^https?:\/\//i.test(url)) {
      url = "https://" + url;
    }

    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    const params = parsed.searchParams;

    // 1. Bing Images Search Result Page
    // Example: https://www.bing.com/images/search?...&mediaurl=https%3a%2f%2fexample.com%2fimg.png&...
    if (host.includes("bing.com")) {
      const mediaUrl = params.get("mediaurl") || params.get("mediaUrl");
      if (mediaUrl) {
        return cleanDecodedUrl(mediaUrl);
      }
      const cdnUrl = params.get("cdnurl") || params.get("cdnUrl");
      if (cdnUrl) {
        return cleanDecodedUrl(cdnUrl);
      }
    }

    // 2. Google Images
    // Example: https://www.google.com/imgres?imgurl=https%3A%2F%2Fexample.com%2Fphoto.jpg&...
    if (host.includes("google.")) {
      const imgUrl = params.get("imgurl") || params.get("imgUrl");
      if (imgUrl) {
        return cleanDecodedUrl(imgUrl);
      }
    }

    // 3. Yahoo Images
    // Example: https://images.search.yahoo.com/search/images;?...&imgurl=...
    if (host.includes("yahoo.com")) {
      const imgUrl = params.get("imgurl") || params.get("imgUrl") || params.get("rurl");
      if (imgUrl) {
        return cleanDecodedUrl(imgUrl);
      }
    }

    // 4. DuckDuckGo Images
    // Example: https://duckduckgo.com/?q=...&iax=images&ia=images&iai=https%3A%2F%2F...
    if (host.includes("duckduckgo.com")) {
      const iai = params.get("iai");
      if (iai) {
        return cleanDecodedUrl(iai);
      }
    }

    // 5. Yandex Images
    if (host.includes("yandex.")) {
      const imgUrl = params.get("img_url");
      if (imgUrl) {
        return cleanDecodedUrl(imgUrl);
      }
    }

    // 6. Generic Query Parameter Scanner
    // Look for any parameter that looks like a direct image URL (jpg, png, webp, gif, svg)
    for (const [, val] of params.entries()) {
      if (/^https?:\/\/[^\s]+?\.(png|jpg|jpeg|webp|gif|svg)(\?.*)?$/i.test(val)) {
        return cleanDecodedUrl(val);
      }
    }

    // 7. Wikimedia Commons File page
    // e.g. https://commons.wikimedia.org/wiki/File:Example.jpg
    if (host.includes("commons.wikimedia.org") && parsed.pathname.startsWith("/wiki/File:")) {
      const fileName = parsed.pathname.replace("/wiki/File:", "");
      return `https://commons.wikimedia.org/wiki/Special:FilePath/${fileName}`;
    }

    return url;
  } catch {
    return url || fallback;
  }
}

function cleanDecodedUrl(encoded: string): string {
  try {
    let decoded = decodeURIComponent(encoded.trim());
    // In case it was doubly encoded
    if (decoded.includes("%3A") || decoded.includes("%2F") || decoded.includes("%3a") || decoded.includes("%2f")) {
      decoded = decodeURIComponent(decoded);
    }
    return decoded;
  } catch {
    return encoded;
  }
}
