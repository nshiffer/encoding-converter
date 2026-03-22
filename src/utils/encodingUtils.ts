/**
 * Encoding, decoding, and utility functions for various formats.
 * All operations run client-side for privacy.
 */

// ─── Base64 ──────────────────────────────────────────────────────────────────

export const encodeBase64 = (input: string): string => {
  // Use TextEncoder for full Unicode support
  const bytes = new TextEncoder().encode(input);
  const binary = Array.from(bytes, (b) => String.fromCharCode(b)).join('');
  return btoa(binary);
};

export const decodeBase64 = (input: string): string => {
  const binary = atob(input.trim());
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};

// ─── Base32 (RFC 4648) ──────────────────────────────────────────────────────

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

export const encodeBase32 = (input: string): string => {
  const bytes = new TextEncoder().encode(input);
  let result = '';
  let bits = 0;
  let value = 0;

  for (const byte of bytes) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      result += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    result += BASE32_ALPHABET[(value << (5 - bits)) & 31];
  }

  const padding = 8 - (result.length % 8);
  if (padding < 8) {
    result += '='.repeat(padding);
  }

  return result;
};

export const decodeBase32 = (input: string): string => {
  const cleaned = input.toUpperCase().replace(/=+$/, '');
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];

  for (const char of cleaned) {
    const index = BASE32_ALPHABET.indexOf(char);
    if (index === -1) throw new Error(`Invalid Base32 character: ${char}`);
    value = (value << 5) | index;
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return new TextDecoder().decode(new Uint8Array(bytes));
};

// ─── URL Encoding ────────────────────────────────────────────────────────────

export const encodeUrl = (input: string): string => encodeURIComponent(input);
export const decodeUrl = (input: string): string => decodeURIComponent(input.trim());

// ─── HTML Entities ───────────────────────────────────────────────────────────

const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
};

export const encodeHtml = (input: string): string =>
  input.replace(/[&<>"']/g, (char) => HTML_ENTITIES[char] ?? char);

export const decodeHtml = (input: string): string => {
  const el = document.createElement('div');
  el.innerHTML = input;
  return el.textContent ?? '';
};

// ─── Unicode Escape Sequences ────────────────────────────────────────────────

export const encodeUnicode = (input: string): string =>
  Array.from(input)
    .map((char) => {
      const cp = char.codePointAt(0)!;
      return cp > 127 ? `\\u{${cp.toString(16)}}` : char;
    })
    .join('');

export const decodeUnicode = (input: string): string =>
  input.replace(/\\u\{([0-9a-fA-F]+)\}|\\u([0-9a-fA-F]{4})/g, (_, cpBrace, cp4) =>
    String.fromCodePoint(parseInt(cpBrace ?? cp4, 16)),
  );

// ─── Hex ─────────────────────────────────────────────────────────────────────

export const encodeHex = (input: string): string => {
  const bytes = new TextEncoder().encode(input);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join(' ');
};

export const decodeHex = (input: string): string => {
  const cleaned = input.replace(/\s+/g, '');
  if (cleaned.length % 2 !== 0) throw new Error('Hex string must have even length');
  const bytes = new Uint8Array(cleaned.length / 2);
  for (let i = 0; i < cleaned.length; i += 2) {
    const val = parseInt(cleaned.substring(i, i + 2), 16);
    if (isNaN(val)) throw new Error(`Invalid hex at position ${i}`);
    bytes[i / 2] = val;
  }
  return new TextDecoder().decode(bytes);
};

// ─── Binary ──────────────────────────────────────────────────────────────────

export const encodeBinary = (input: string): string => {
  const bytes = new TextEncoder().encode(input);
  return Array.from(bytes, (b) => b.toString(2).padStart(8, '0')).join(' ');
};

export const decodeBinary = (input: string): string => {
  const groups = input.trim().split(/\s+/);
  const bytes = new Uint8Array(groups.map((g) => parseInt(g, 2)));
  return new TextDecoder().decode(bytes);
};

// ─── Octal ───────────────────────────────────────────────────────────────────

export const encodeOctal = (input: string): string => {
  const bytes = new TextEncoder().encode(input);
  return Array.from(bytes, (b) => b.toString(8).padStart(3, '0')).join(' ');
};

export const decodeOctal = (input: string): string => {
  const groups = input.trim().split(/\s+/);
  const bytes = new Uint8Array(groups.map((g) => parseInt(g, 8)));
  return new TextDecoder().decode(bytes);
};

// ─── ROT13 ───────────────────────────────────────────────────────────────────

export const encodeRot13 = (input: string): string =>
  input.replace(/[a-zA-Z]/g, (c) => {
    const base = c <= 'Z' ? 65 : 97;
    return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
  });

// ROT13 is its own inverse
export const decodeRot13 = encodeRot13;

// ─── Morse Code ──────────────────────────────────────────────────────────────

const MORSE_MAP: Record<string, string> = {
  A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....',
  I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.',
  Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-',
  Y: '-.--', Z: '--..', '0': '-----', '1': '.----', '2': '..---', '3': '...--',
  '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--',
  '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...',
  ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-',
  '"': '.-..-.', '$': '...-..-', '@': '.--.-.', ' ': '/',
};

const MORSE_REVERSE = Object.fromEntries(Object.entries(MORSE_MAP).map(([k, v]) => [v, k]));

export const encodeMorse = (input: string): string =>
  input
    .toUpperCase()
    .split('')
    .map((c) => MORSE_MAP[c] ?? c)
    .join(' ');

export const decodeMorse = (input: string): string =>
  input
    .trim()
    .split(' ')
    .map((code) => MORSE_REVERSE[code] ?? code)
    .join('');

// ─── ASCII / Decimal ─────────────────────────────────────────────────────────

export const encodeAscii = (input: string): string =>
  Array.from(input, (c) => c.charCodeAt(0).toString()).join(' ');

export const decodeAscii = (input: string): string =>
  input
    .trim()
    .split(/\s+/)
    .map((n) => String.fromCharCode(parseInt(n, 10)))
    .join('');

// ─── Hash Functions (Web Crypto API) ─────────────────────────────────────────

async function hashDigest(algorithm: string, input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  return Array.from(new Uint8Array(hashBuffer), (b) => b.toString(16).padStart(2, '0')).join('');
}

export const hashSha256 = (input: string): string | Promise<string> => hashDigest('SHA-256', input);
export const hashSha512 = (input: string): string | Promise<string> => hashDigest('SHA-512', input);
export const hashSha1 = (input: string): string | Promise<string> => hashDigest('SHA-1', input);

// ─── Timestamp Converter ─────────────────────────────────────────────────────

export const encodeTimestamp = (input: string): string => {
  const date = new Date(input.trim());
  if (isNaN(date.getTime())) throw new Error('Invalid date string. Use ISO 8601 format (e.g., 2024-01-15T10:30:00Z)');
  return JSON.stringify(
    {
      unix_seconds: Math.floor(date.getTime() / 1000),
      unix_milliseconds: date.getTime(),
      iso8601: date.toISOString(),
      utc: date.toUTCString(),
      local: date.toString(),
    },
    null,
    2,
  );
};

export const decodeTimestamp = (input: string): string => {
  const trimmed = input.trim();
  const num = Number(trimmed);
  if (isNaN(num)) throw new Error('Enter a Unix timestamp (seconds or milliseconds)');
  // Heuristic: if > year 3000 in seconds, it's milliseconds
  const ms = num > 32503680000 ? num : num * 1000;
  const date = new Date(ms);
  if (isNaN(date.getTime())) throw new Error('Invalid timestamp');
  return JSON.stringify(
    {
      iso8601: date.toISOString(),
      utc: date.toUTCString(),
      local: date.toString(),
      unix_seconds: Math.floor(date.getTime() / 1000),
      unix_milliseconds: date.getTime(),
    },
    null,
    2,
  );
};

// ─── Color Converter ─────────────────────────────────────────────────────────

export const encodeColor = (input: string): string => {
  const trimmed = input.trim();

  // Parse hex
  const hexMatch = trimmed.match(/^#?([0-9a-fA-F]{3,8})$/);
  if (hexMatch) {
    let hex = hexMatch[1];
    if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
    if (hex.length === 6) hex += 'ff';
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const a = parseInt(hex.substring(6, 8), 16) / 255;
    const [h, s, l] = rgbToHsl(r, g, b);
    return JSON.stringify({ hex: `#${hex.substring(0, 6)}`, rgb: `rgb(${r}, ${g}, ${b})`, hsl: `hsl(${h}, ${s}%, ${l}%)`, opacity: Math.round(a * 100) + '%' }, null, 2);
  }

  // Parse rgb/rgba
  const rgbMatch = trimmed.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)$/);
  if (rgbMatch) {
    const [, rs, gs, bs] = rgbMatch;
    const r = parseInt(rs), g = parseInt(gs), b = parseInt(bs);
    const hexStr = `#${[r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')}`;
    const [h, s, l] = rgbToHsl(r, g, b);
    return JSON.stringify({ hex: hexStr, rgb: `rgb(${r}, ${g}, ${b})`, hsl: `hsl(${h}, ${s}%, ${l}%)` }, null, 2);
  }

  // Parse hsl
  const hslMatch = trimmed.match(/^hsla?\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?\s*(?:,\s*([\d.]+))?\s*\)$/);
  if (hslMatch) {
    const [, hs, ss, ls] = hslMatch;
    const h = parseInt(hs), s = parseInt(ss), l = parseInt(ls);
    const [r, g, b] = hslToRgb(h, s, l);
    const hexStr = `#${[r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')}`;
    return JSON.stringify({ hex: hexStr, rgb: `rgb(${r}, ${g}, ${b})`, hsl: `hsl(${h}, ${s}%, ${l}%)` }, null, 2);
  }

  throw new Error('Unsupported format. Use hex (#ff0000), rgb(255,0,0), or hsl(0,100%,50%)');
};

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, Math.round(l * 100)];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360; s /= 100; l /= 100;
  if (s === 0) { const v = Math.round(l * 255); return [v, v, v]; }
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [Math.round(hue2rgb(p, q, h + 1 / 3) * 255), Math.round(hue2rgb(p, q, h) * 255), Math.round(hue2rgb(p, q, h - 1 / 3) * 255)];
}

// ─── Number Base Converter ───────────────────────────────────────────────────

export const encodeNumberBase = (input: string): string => {
  const trimmed = input.trim();
  let num: number;

  if (trimmed.startsWith('0x') || trimmed.startsWith('0X')) {
    num = parseInt(trimmed, 16);
  } else if (trimmed.startsWith('0b') || trimmed.startsWith('0B')) {
    num = parseInt(trimmed.substring(2), 2);
  } else if (trimmed.startsWith('0o') || trimmed.startsWith('0O')) {
    num = parseInt(trimmed.substring(2), 8);
  } else {
    num = parseInt(trimmed, 10);
  }

  if (isNaN(num)) throw new Error('Invalid number. Use decimal, 0x hex, 0b binary, or 0o octal prefix');

  return JSON.stringify(
    {
      decimal: num,
      hexadecimal: '0x' + num.toString(16).toUpperCase(),
      binary: '0b' + num.toString(2),
      octal: '0o' + num.toString(8),
    },
    null,
    2,
  );
};

// ─── Lorem Ipsum Generator ───────────────────────────────────────────────────

const LOREM_WORDS = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum'.split(' ');

export const generateLoremIpsum = (input: string): string => {
  const count = Math.max(1, Math.min(50, parseInt(input.trim()) || 3));
  const paragraphs: string[] = [];

  for (let p = 0; p < count; p++) {
    const sentenceCount = 4 + Math.floor(Math.random() * 4);
    const sentences: string[] = [];
    for (let s = 0; s < sentenceCount; s++) {
      const wordCount = 8 + Math.floor(Math.random() * 12);
      const words: string[] = [];
      for (let w = 0; w < wordCount; w++) {
        words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
      }
      words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
      sentences.push(words.join(' ') + '.');
    }
    paragraphs.push(sentences.join(' '));
  }

  return paragraphs.join('\n\n');
};

// ─── Text Statistics ─────────────────────────────────────────────────────────

export const textStatistics = (input: string): string => {
  const chars = input.length;
  const charsNoSpaces = input.replace(/\s/g, '').length;
  const words = input.trim() ? input.trim().split(/\s+/).length : 0;
  const lines = input ? input.split(/\r?\n/).length : 0;
  const sentences = input.trim() ? input.split(/[.!?]+\s*/g).filter(Boolean).length : 0;
  const paragraphs = input.trim() ? input.split(/\n\s*\n/).filter((p) => p.trim()).length : 0;

  const freq: Record<string, number> = {};
  for (const c of input.toLowerCase()) {
    if (/[a-z]/.test(c)) freq[c] = (freq[c] || 0) + 1;
  }
  const topChars = Object.entries(freq)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([ch, n]) => `${ch}: ${n}`)
    .join(', ');

  return JSON.stringify(
    {
      characters: chars,
      characters_no_spaces: charsNoSpaces,
      words,
      lines,
      sentences,
      paragraphs: Math.max(paragraphs, lines > 0 ? 1 : 0),
      top_letters: topChars || 'N/A',
    },
    null,
    2,
  );
};

// ─── JSON Validation/Formatting ──────────────────────────────────────────────

export const validateJson = (input: string): { valid: boolean; formatted?: string; error?: string } => {
  try {
    const parsed = JSON.parse(input);
    return { valid: true, formatted: JSON.stringify(parsed, null, 2) };
  } catch (error) {
    return { valid: false, error: (error as Error).message };
  }
};

// ─── XML Validation/Formatting ───────────────────────────────────────────────

export const validateXml = (input: string): { valid: boolean; formatted?: string; error?: string } => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(input, 'text/xml');
    const errorNode = xmlDoc.querySelector('parsererror');
    if (errorNode) throw new Error('XML parsing error');

    const serializer = new XMLSerializer();
    const raw = serializer.serializeToString(xmlDoc).replace(/></g, '>\n<');

    let result = '';
    let indent = 0;
    for (const line of raw.split('\n')) {
      if (line.match(/<\/[^>]*>/) && !line.match(/<[^>]*>[^<]*<\/[^>]*>/)) indent--;
      result += ' '.repeat(Math.max(0, indent) * 2) + line + '\n';
      if (line.match(/<[^/][^>]*[^/]>/) && !line.match(/<[^>]*\/>/)) indent++;
    }

    return { valid: true, formatted: result };
  } catch (error) {
    return { valid: false, error: (error as Error).message };
  }
};

// ─── CSV Formatting ──────────────────────────────────────────────────────────

export const formatCsv = (input: string): { valid: boolean; formatted?: string; error?: string } => {
  try {
    if (!input.trim()) throw new Error('Empty CSV input');

    const lines = input.trim().split(/\r?\n/);
    const rows = lines.map((line) => {
      const result: string[] = [];
      let inQuotes = false;
      let currentValue = '';

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          if (inQuotes && line[i + 1] === '"') { currentValue += '"'; i++; }
          else inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(currentValue.trim());
          currentValue = '';
        } else {
          currentValue += char;
        }
      }
      result.push(currentValue.trim());
      return result;
    });

    const columnWidths: number[] = [];
    for (let i = 0; i < rows[0].length; i++) {
      columnWidths.push(Math.max(...rows.map((row) => (row[i] || '').length)));
    }

    const formatted = rows
      .map((row) => row.map((cell, i) => cell.padEnd(columnWidths[i] + 2, ' ')).join(','))
      .join('\n');

    return { valid: true, formatted };
  } catch (error) {
    return { valid: false, error: (error as Error).message };
  }
};

// ─── Markdown Formatting ─────────────────────────────────────────────────────

export const formatMarkdown = (input: string): { valid: boolean; formatted?: string; error?: string } => {
  try {
    if (!input.trim()) throw new Error('Empty markdown input');

    const formatted = input
      .trim()
      .split(/\r?\n/)
      .map((line) => line.replace(/^(#{1,6})([^#\s])/g, '$1 $2'))
      .map((line) => line.replace(/^(\s*[*+-])([^\s])/g, '$1 $2'))
      .map((line) => line.replace(/^(\s*\d+\.)([^\s])/g, '$1 $2'))
      .map((line, i, arr) => {
        if (i > 0 && line.match(/^#{1,6}\s/) && !arr[i - 1].match(/^\s*$/)) {
          return '\n' + line;
        }
        return line;
      })
      .join('\n');

    return { valid: true, formatted };
  } catch (error) {
    return { valid: false, error: (error as Error).message };
  }
};

// ─── SQL Formatting ──────────────────────────────────────────────────────────

export const formatSql = (input: string): { valid: boolean; formatted?: string; error?: string } => {
  try {
    if (!input.trim()) throw new Error('Empty SQL input');

    const keywords = [
      'SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN',
      'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET', 'INSERT INTO', 'VALUES',
      'UPDATE', 'SET', 'DELETE', 'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE',
      'AND', 'OR', 'NOT', 'IN', 'BETWEEN', 'LIKE', 'IS NULL', 'IS NOT NULL',
      'UNION', 'EXCEPT', 'INTERSECT', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
      'ON', 'AS', 'DISTINCT', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX',
    ];

    let formatted = input;
    keywords.forEach((kw) => {
      formatted = formatted.replace(new RegExp(`\\b${kw}\\b`, 'gi'), kw);
    });

    formatted = formatted
      .replace(/\b(SELECT|FROM|WHERE|GROUP BY|ORDER BY|HAVING|JOIN|LEFT JOIN|RIGHT JOIN|INNER JOIN|LIMIT|OFFSET|UNION|EXCEPT|INTERSECT)\b/gi, '\n$1')
      .replace(/\b(AND|OR)\b/gi, '\n  $1')
      .replace(/\s+/g, ' ')
      .trim();

    return { valid: true, formatted };
  } catch (error) {
    return { valid: false, error: (error as Error).message };
  }
};

// ─── UUID Generator ──────────────────────────────────────────────────────────

export const encodeUuid = (): string => {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// ─── Email Validator ─────────────────────────────────────────────────────────

export const validateEmail = (input: string): { valid: boolean; error?: string } => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isValid = emailRegex.test(input.trim());
  return { valid: isValid, error: isValid ? undefined : 'Invalid email format' };
};

// ─── IP Address Validator ────────────────────────────────────────────────────

export const validateIpAddress = (input: string): { valid: boolean; error?: string } => {
  const trimmed = input.trim();
  const ipv4Regex = /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^([0-9a-fA-F]{1,4}:){1,7}:|^([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}$|^([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}$|^([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}$|^([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}$|^([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}$|^[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})$|^:((:[0-9a-fA-F]{1,4}){1,7}|:)$/;

  const isValid = ipv4Regex.test(trimmed) || ipv6Regex.test(trimmed);
  return { valid: isValid, error: isValid ? undefined : 'Invalid IP address format' };
};

// ─── JWT Decoder ─────────────────────────────────────────────────────────────

export const decodeJwt = (token: string): { header: unknown; payload: unknown; error?: string } => {
  const parts = token.trim().split('.');
  if (parts.length !== 3) throw new Error('Invalid JWT format: expected 3 parts separated by dots');

  const decodeSegment = (segment: string) => {
    // Handle URL-safe base64
    const padded = segment.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(padded));
  };

  const header = decodeSegment(parts[0]);
  const payload = decodeSegment(parts[1]);
  return { header, payload };
};

// ─── Regex Tester ────────────────────────────────────────────────────────────

export const testRegex = (input: string): { valid: boolean; formatted?: string; error?: string } => {
  // Expected input format: /pattern/flags\n---\ntest string
  const separatorIndex = input.indexOf('\n---\n');
  if (separatorIndex === -1) {
    throw new Error('Format: /pattern/flags\\n---\\ntest string');
  }

  const regexPart = input.substring(0, separatorIndex).trim();
  const testString = input.substring(separatorIndex + 5);

  const regexMatch = regexPart.match(/^\/(.+)\/([gimsuy]*)$/);
  if (!regexMatch) throw new Error('Invalid regex format. Use: /pattern/flags');

  const regex = new RegExp(regexMatch[1], regexMatch[2]);
  const matches: string[] = [];

  if (regex.global) {
    let match;
    while ((match = regex.exec(testString)) !== null) {
      matches.push(`Match at ${match.index}: "${match[0]}"`);
      if (match.groups) {
        for (const [name, value] of Object.entries(match.groups)) {
          matches.push(`  Group "${name}": "${value}"`);
        }
      }
    }
  } else {
    const match = regex.exec(testString);
    if (match) {
      matches.push(`Match at ${match.index}: "${match[0]}"`);
      for (let i = 1; i < match.length; i++) {
        matches.push(`  Group ${i}: "${match[i]}"`);
      }
    }
  }

  const result = matches.length > 0 ? matches.join('\n') : 'No matches found';
  return { valid: matches.length > 0, formatted: result };
};

// ─── Cron Expression Parser ──────────────────────────────────────────────────

export const parseCron = (input: string): { valid: boolean; formatted?: string; error?: string } => {
  const parts = input.trim().split(/\s+/);
  if (parts.length < 5 || parts.length > 6) {
    return { valid: false, error: 'Expected 5 or 6 fields: minute hour day-of-month month day-of-week [year]' };
  }

  const fieldNames = ['Minute (0-59)', 'Hour (0-23)', 'Day of Month (1-31)', 'Month (1-12)', 'Day of Week (0-6)', 'Year (optional)'];
  const descriptions = parts.map((part, i) => {
    let desc = '';
    if (part === '*') desc = 'every value';
    else if (part.includes('/')) desc = `every ${part.split('/')[1]} starting from ${part.split('/')[0] === '*' ? '0' : part.split('/')[0]}`;
    else if (part.includes('-')) desc = `range ${part}`;
    else if (part.includes(',')) desc = `values: ${part}`;
    else desc = `at ${part}`;
    return `${fieldNames[i]}: ${part} (${desc})`;
  });

  return { valid: true, formatted: descriptions.join('\n') };
};

// ─── URL Parser ──────────────────────────────────────────────────────────────

export const parseUrl = (input: string): { valid: boolean; formatted?: string; error?: string } => {
  try {
    const url = new URL(input.trim());
    const params: Record<string, string> = {};
    url.searchParams.forEach((value, key) => { params[key] = value; });

    const result = {
      protocol: url.protocol,
      hostname: url.hostname,
      port: url.port || '(default)',
      pathname: url.pathname,
      search: url.search || '(none)',
      hash: url.hash || '(none)',
      origin: url.origin,
      parameters: Object.keys(params).length > 0 ? params : '(none)',
    };

    return { valid: true, formatted: JSON.stringify(result, null, 2) };
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }
};

// ─── JSON to YAML-like ──────────────────────────────────────────────────────

export const jsonToYaml = (input: string): string => {
  const parsed = JSON.parse(input);
  return toYamlString(parsed, 0);
};

function toYamlString(value: unknown, indent: number): string {
  const prefix = '  '.repeat(indent);
  if (value === null) return 'null';
  if (typeof value === 'boolean' || typeof value === 'number') return String(value);
  if (typeof value === 'string') {
    if (value.includes('\n') || value.includes(':') || value.includes('#')) return `"${value.replace(/"/g, '\\"')}"`;
    return value;
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    return value.map((item) => `${prefix}- ${toYamlString(item, indent + 1).trimStart()}`).join('\n');
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return '{}';
    return entries
      .map(([key, val]) => {
        const valStr = toYamlString(val, indent + 1);
        if (typeof val === 'object' && val !== null) {
          return `${prefix}${key}:\n${valStr}`;
        }
        return `${prefix}${key}: ${valStr}`;
      })
      .join('\n');
  }
  return String(value);
}

export const yamlToJson = (input: string): string => {
  // Simple YAML-like to JSON converter for basic structures
  // This handles simple key: value pairs and nested objects
  const lines = input.trim().split('\n');
  const result = parseYamlLines(lines, 0);
  return JSON.stringify(result.value, null, 2);
};

function parseYamlLines(lines: string[], startIndent: number): { value: unknown; consumed: number } {
  if (lines.length === 0) return { value: null, consumed: 0 };

  const firstLine = lines[0];

  // Array detection
  if (firstLine.trimStart().startsWith('- ')) {
    const arr: unknown[] = [];
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      const indent = line.length - line.trimStart().length;
      if (indent < startIndent && i > 0) break;
      if (line.trimStart().startsWith('- ')) {
        arr.push(parseYamlValue(line.trimStart().substring(2).trim()));
        i++;
      } else {
        break;
      }
    }
    return { value: arr, consumed: i };
  }

  // Object detection
  const obj: Record<string, unknown> = {};
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    const indent = line.length - line.trimStart().length;
    if (indent < startIndent && i > 0) break;

    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) { i++; continue; }

    const key = line.substring(0, colonIndex).trim();
    const valueStr = line.substring(colonIndex + 1).trim();

    if (valueStr) {
      obj[key] = parseYamlValue(valueStr);
      i++;
    } else {
      // Nested object or array
      const sub = parseYamlLines(lines.slice(i + 1), indent + 2);
      obj[key] = sub.value;
      i += 1 + sub.consumed;
    }
  }
  return { value: obj, consumed: i };
}

function parseYamlValue(str: string): unknown {
  if (str === 'null' || str === '~') return null;
  if (str === 'true') return true;
  if (str === 'false') return false;
  if (/^-?\d+$/.test(str)) return parseInt(str, 10);
  if (/^-?\d+\.\d+$/.test(str)) return parseFloat(str);
  if ((str.startsWith('"') && str.endsWith('"')) || (str.startsWith("'") && str.endsWith("'"))) {
    return str.slice(1, -1);
  }
  if (str === '[]') return [];
  if (str === '{}') return {};
  return str;
}
