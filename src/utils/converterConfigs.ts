import type { ConverterType } from '../hooks/useConverter';
import {
  encodeBase64, decodeBase64,
  encodeBase32, decodeBase32,
  encodeUrl, decodeUrl,
  encodeHtml, decodeHtml,
  encodeUnicode, decodeUnicode,
  encodeHex, decodeHex,
  encodeBinary, decodeBinary,
  encodeOctal, decodeOctal,
  encodeRot13, decodeRot13,
  encodeMorse, decodeMorse,
  encodeAscii, decodeAscii,
  hashSha256, hashSha512, hashSha1,
  encodeTimestamp, decodeTimestamp,
  encodeColor,
  encodeNumberBase,
  generateLoremIpsum,
  textStatistics,
  validateJson, validateXml,
  formatCsv, formatMarkdown, formatSql,
  decodeJwt,
  encodeUuid,
  validateEmail, validateIpAddress,
  testRegex, parseCron, parseUrl,
  jsonToYaml, yamlToJson,
  convertStringCase,
  escapeString, unescapeString,
  generatePassword,
  sortLines, dedupeLines,
  slugify,
  markdownToHtml,
  minifyJson,
  generatePlaceholderUrl,
} from './encodingUtils';

export const converters: ConverterType[] = [
  // ─── Encoding ────────────────────────────────────────────────────────────
  {
    name: 'Base64',
    encode: encodeBase64,
    decode: decodeBase64,
    description: 'Encode and decode text using Base64. Supports full Unicode via UTF-8.',
    category: 'encoding',
  },
  {
    name: 'Base32',
    encode: encodeBase32,
    decode: decodeBase32,
    description: 'RFC 4648 Base32 encoding. Case-insensitive and avoids ambiguous characters.',
    category: 'encoding',
  },
  {
    name: 'URL Encoding',
    encode: encodeUrl,
    decode: decodeUrl,
    description: 'Percent-encode special characters for safe use in URLs and query strings.',
    category: 'encoding',
  },
  {
    name: 'HTML Entities',
    encode: encodeHtml,
    decode: decodeHtml,
    description: 'Convert special characters to HTML entities and back for safe rendering.',
    category: 'encoding',
  },
  {
    name: 'Unicode Escape',
    encode: encodeUnicode,
    decode: decodeUnicode,
    description: 'Convert non-ASCII characters to \\u{XXXX} escape sequences and back.',
    category: 'encoding',
  },
  {
    name: 'Hex',
    encode: encodeHex,
    decode: decodeHex,
    description: 'Convert text to space-separated hexadecimal bytes and back.',
    category: 'encoding',
  },
  {
    name: 'Binary',
    encode: encodeBinary,
    decode: decodeBinary,
    description: 'Convert text to 8-bit binary representation and back.',
    category: 'encoding',
  },
  {
    name: 'Octal',
    encode: encodeOctal,
    decode: decodeOctal,
    description: 'Convert text to octal byte representation and back.',
    category: 'encoding',
  },
  {
    name: 'ROT13',
    encode: encodeRot13,
    decode: decodeRot13,
    description: 'Apply ROT13 letter substitution cipher. Letters shift 13 positions; self-reversing.',
    category: 'encoding',
  },
  {
    name: 'Morse Code',
    encode: encodeMorse,
    decode: decodeMorse,
    description: 'Convert text to International Morse Code using dots and dashes.',
    category: 'encoding',
  },
  {
    name: 'ASCII / Decimal',
    encode: encodeAscii,
    decode: decodeAscii,
    description: 'Convert characters to their decimal ASCII/Unicode code points and back.',
    category: 'encoding',
  },

  // ─── Formatting ──────────────────────────────────────────────────────────
  {
    name: 'JSON Formatter',
    validate: validateJson,
    description: 'Validate and pretty-print JSON with proper indentation.',
    category: 'format',
  },
  {
    name: 'XML Formatter',
    validate: validateXml,
    description: 'Validate and format XML documents with indentation.',
    category: 'format',
  },
  {
    name: 'CSV Formatter',
    validate: formatCsv,
    description: 'Parse and align CSV data into neatly formatted columns.',
    category: 'format',
  },
  {
    name: 'Markdown Formatter',
    validate: formatMarkdown,
    description: 'Clean up markdown with consistent spacing around headers, lists, and paragraphs.',
    category: 'format',
  },
  {
    name: 'SQL Formatter',
    validate: formatSql,
    description: 'Format SQL queries with uppercase keywords and proper line breaks.',
    category: 'format',
  },
  {
    name: 'JSON to YAML',
    encode: jsonToYaml,
    decode: yamlToJson,
    description: 'Convert between JSON and YAML formats. Encode: JSON to YAML. Decode: YAML to JSON.',
    category: 'format',
  },

  // ─── Cryptography & Hashing ──────────────────────────────────────────────
  {
    name: 'JWT Decoder',
    decode: (input: string) => {
      const result = decodeJwt(input);
      if (result.error) throw new Error(result.error);
      return JSON.stringify({ header: result.header, payload: result.payload }, null, 2);
    },
    description: 'Decode JWT tokens to inspect header and payload claims (signature not verified).',
    category: 'crypto',
  },
  {
    name: 'UUID Generator',
    encode: encodeUuid,
    description: 'Generate cryptographically random UUID v4 identifiers.',
    category: 'crypto',
  },
  {
    name: 'SHA-256 Hash',
    encode: hashSha256 as (input: string) => string,
    description: 'Generate SHA-256 cryptographic hash digest of text using Web Crypto API.',
    category: 'crypto',
  },
  {
    name: 'SHA-512 Hash',
    encode: hashSha512 as (input: string) => string,
    description: 'Generate SHA-512 cryptographic hash digest of text using Web Crypto API.',
    category: 'crypto',
  },
  {
    name: 'SHA-1 Hash',
    encode: hashSha1 as (input: string) => string,
    description: 'Generate SHA-1 hash digest. Note: SHA-1 is deprecated for security use.',
    category: 'crypto',
  },

  // ─── Developer Tools ─────────────────────────────────────────────────────
  {
    name: 'Timestamp Converter',
    encode: encodeTimestamp,
    decode: decodeTimestamp,
    description: 'Convert dates to Unix timestamps (encode) or timestamps to dates (decode).',
    category: 'devtools',
  },
  {
    name: 'Color Converter',
    encode: encodeColor,
    description: 'Convert between hex, RGB, and HSL color formats. Enter any supported format.',
    category: 'devtools',
  },
  {
    name: 'Number Base',
    encode: encodeNumberBase,
    description: 'Convert numbers between decimal, hex (0x), binary (0b), and octal (0o).',
    category: 'devtools',
  },
  {
    name: 'URL Parser',
    validate: parseUrl,
    description: 'Break down a URL into its components: protocol, host, path, query params, and more.',
    category: 'devtools',
  },
  {
    name: 'Regex Tester',
    validate: testRegex,
    description: 'Test regex patterns. Format: /pattern/flags then --- then test string on separate lines.',
    category: 'devtools',
  },
  {
    name: 'Cron Parser',
    validate: parseCron,
    description: 'Parse and explain cron expressions. Enter 5 or 6 space-separated fields.',
    category: 'devtools',
  },

  // ─── Generators & Validators ─────────────────────────────────────────────
  {
    name: 'Lorem Ipsum',
    encode: generateLoremIpsum,
    description: 'Generate placeholder text. Enter a number (1-50) for paragraph count.',
    category: 'misc',
  },
  {
    name: 'Text Statistics',
    encode: textStatistics,
    description: 'Count characters, words, lines, sentences, and analyze letter frequency.',
    category: 'misc',
  },
  {
    name: 'Email Validator',
    validate: validateEmail,
    description: 'Check if an email address has a valid format.',
    category: 'misc',
  },
  {
    name: 'IP Address Validator',
    validate: validateIpAddress,
    description: 'Validate IPv4 and IPv6 address formats.',
    category: 'misc',
  },

  // ─── Text Tools ─────────────────────────────────────────────────────────
  {
    name: 'String Case Converter',
    encode: convertStringCase,
    description: 'Convert text to camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, and more.',
    category: 'devtools',
  },
  {
    name: 'Backslash Escape',
    encode: escapeString,
    decode: unescapeString,
    description: 'Escape special characters (\\n, \\t, quotes) for use in code strings, or unescape them back.',
    category: 'encoding',
  },
  {
    name: 'Password Generator',
    encode: generatePassword,
    description: 'Generate a cryptographically secure random password. Enter desired length (default 16).',
    category: 'crypto',
  },
  {
    name: 'Line Sort & Dedupe',
    encode: sortLines,
    decode: dedupeLines,
    description: 'Encode: sort lines alphabetically. Decode: remove duplicate lines.',
    category: 'devtools',
  },
  {
    name: 'Slugify',
    encode: slugify,
    description: 'Convert text to a URL-friendly slug (lowercase, hyphens, no special chars).',
    category: 'devtools',
  },
  {
    name: 'Markdown to HTML',
    encode: markdownToHtml,
    description: 'Convert Markdown text to HTML. Supports headers, bold, italic, code, links, and lists.',
    category: 'format',
  },
  {
    name: 'JSON Minifier',
    encode: minifyJson,
    description: 'Minify JSON by removing all whitespace. Shows bytes saved.',
    category: 'format',
  },
  {
    name: 'Placeholder Image',
    encode: generatePlaceholderUrl,
    description: 'Generate placeholder image URLs. Enter dimensions like "300x200" or just "400".',
    category: 'devtools',
  },
];
