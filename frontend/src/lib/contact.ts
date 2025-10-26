export type Primitive = string | number | boolean | null | undefined;

export type ContactEntry = {
  type?: string; // e.g. "email", "phone", "facebook"
  label?: string; // e.g. "อีเมล", "โทร"
  value?: Primitive | Primitive[];
  url?: string; // if backend already provides a URL
};

export type ContactInfo =
  | Primitive
  | ContactEntry
  | (Primitive | ContactEntry)[]
  | Record<string, Primitive | Primitive[]>;

export type ContactToken =
  | { kind: "text"; text: string }
  | { kind: "link"; text: string; href: string };

export function isPrimitive(x: unknown): x is Primitive {
  const t = typeof x;
  return x == null || t === "string" || t === "number" || t === "boolean";
}

export function isEmailLike(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export function isPhoneLike(s: string) {
  return /^(\+?\d{1,3}[-\s]?)?(\(?\d{2,4}\)?[-\s]?)?\d{3,4}[-\s]?\d{3,4}$/.test(
    s
  );
}

export function isUrlLike(s: string) {
  if (!s) return false;
  try {
    const u = new URL(s.startsWith("http") ? s : `https://${s}`);
    return !!u.host;
  } catch {
    return false;
  }
}

export function ensureHttp(s: string) {
  return s.startsWith("http://") || s.startsWith("https://")
    ? s
    : `https://${s}`;
}

export function toContactTokens(v: Primitive): ContactToken[] {
  const text = v == null ? "" : String(v).trim();
  if (!text) return [];

  if (isEmailLike(text))
    return [{ kind: "link", text, href: `mailto:${text}` }];
  if (isPhoneLike(text)) {
    const tel = text.replace(/[^\d+]/g, "");
    return [{ kind: "link", text, href: `tel:${tel}` }];
  }
  if (isUrlLike(text)) return [{ kind: "link", text, href: ensureHttp(text) }];

  return [{ kind: "text", text }];
}

export function toContactTokenList(list: Primitive[]): ContactToken[] {
  const out: ContactToken[] = [];
  list.forEach((it, i) => {
    out.push(...toContactTokens(it));
    if (i < list.length - 1) out.push({ kind: "text", text: ", " });
  });
  return out;
}

export function normalizeContactInfo(
  info: ContactInfo
): Array<{ label?: string; tokens: ContactToken[] }> {
  if (!info && info !== 0 && info !== false) return [];

  if (isPrimitive(info)) {
    return [{ tokens: toContactTokens(info) }];
  }

  if (Array.isArray(info)) {
    return info.map((item) => {
      if (isPrimitive(item)) return { tokens: toContactTokens(item) };

      const { label, type, value, url } = item as ContactEntry;
      const left = label ?? type;
      const tokens: ContactToken[] =
        url && isUrlLike(url)
          ? [{ kind: "link", text: url, href: ensureHttp(url) }]
          : Array.isArray(value)
          ? toContactTokenList(value)
          : toContactTokens(value);

      return { label: left, tokens };
    });
  }

  const obj = info as Record<string, Primitive | Primitive[]>;
  return Object.entries(obj).map(([k, v]) => {
    const tokens = Array.isArray(v)
      ? toContactTokenList(v)
      : toContactTokens(v);
    return { label: k, tokens };
  });
}
