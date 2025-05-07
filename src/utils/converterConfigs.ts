import type { ConverterType } from '../hooks/useConverter';
import {
  encodeBase64,
  decodeBase64,
  encodeUrl,
  decodeUrl,
  encodeHtml,
  decodeHtml,
  validateJson,
  encodeHex,
  decodeHex,
  encodeBinary,
  decodeBinary,
  decodeJwt,
  validateXml,
  formatCsv,
  formatMarkdown,
  encodeBase32,
  decodeBase32,
  encodeUuid,
  validateEmail,
  validateIpAddress,
  formatSql,
  encodeUnicode,
  decodeUnicode
} from './encodingUtils';

export const converters: ConverterType[] = [
  // Encoding Category
  {
    name: 'Base64',
    encode: encodeBase64,
    decode: decodeBase64,
    description: 'Convert text to and from Base64 encoding. Useful for encoding binary data for transfer over text protocols.',
    category: 'encoding'
  },
  {
    name: 'URL',
    encode: encodeUrl,
    decode: decodeUrl,
    description: 'Encode/decode text for URLs. Converts special characters to %XX format for safe transmission in URLs.',
    category: 'encoding'
  },
  {
    name: 'HTML',
    encode: encodeHtml,
    decode: decodeHtml,
    description: 'Convert text to and from HTML entities. Useful for safely displaying text in HTML documents.',
    category: 'encoding'
  },
  {
    name: 'Hex',
    encode: encodeHex,
    decode: decodeHex,
    description: 'Convert text to and from hexadecimal encoding. Represents each character as a two-digit hex value.',
    category: 'encoding'
  },
  {
    name: 'Binary',
    encode: encodeBinary,
    decode: decodeBinary,
    description: 'Convert text to and from binary representation. Each character is converted to its 8-bit binary form.',
    category: 'encoding'
  },
  {
    name: 'Base32',
    encode: encodeBase32,
    decode: decodeBase32,
    description: 'Convert text to and from Base32 encoding. Uses a 32-character set that is case-insensitive and avoids confusing characters.',
    category: 'encoding'
  },
  {
    name: 'Unicode',
    encode: encodeUnicode,
    decode: decodeUnicode,
    description: 'Convert text to and from Unicode escape sequences (\\uXXXX format). Useful for encoding special characters.',
    category: 'encoding'
  },
  
  // Format Category
  {
    name: 'JSON',
    validate: validateJson,
    description: 'Validate and format JSON data. Checks syntax and provides pretty-printing for valid JSON.',
    category: 'format'
  },
  {
    name: 'XML',
    validate: validateXml,
    description: 'Validate and format XML data. Checks syntax and provides pretty-printing for valid XML.',
    category: 'format'
  },
  {
    name: 'CSV',
    validate: formatCsv,
    description: 'Format and validate CSV data. Provides basic validation and formatting for CSV files.',
    category: 'format'
  },
  {
    name: 'Markdown',
    validate: formatMarkdown,
    description: 'Format markdown text. Makes markdown more readable with consistent spacing and indentation.',
    category: 'format'
  },
  {
    name: 'SQL',
    validate: formatSql,
    description: 'Format SQL queries. Makes SQL more readable with proper indentation and keyword formatting.',
    category: 'format'
  },
  
  // Crypto Category
  {
    name: 'JWT Decoder',
    decode: decodeJwt,
    description: 'Decode JSON Web Tokens. Extracts header and payload data from JWT tokens (signature not verified).',
    category: 'crypto'
  },
  {
    name: 'UUID Generator',
    encode: encodeUuid,
    description: 'Generate a new random UUID (Universally Unique Identifier) in standard format.',
    category: 'crypto'
  },
  
  // Miscellaneous Category
  {
    name: 'Email Validator',
    validate: validateEmail,
    description: 'Validate email addresses. Checks if an email address follows the correct format.',
    category: 'misc'
  },
  {
    name: 'IP Address Validator',
    validate: validateIpAddress,
    description: 'Validate IPv4 and IPv6 addresses. Checks if an IP address follows the correct format.',
    category: 'misc'
  }
]; 