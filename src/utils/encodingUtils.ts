/**
 * Encoding and decoding utilities for various formats
 */

// Base64 encoding/decoding
export const encodeBase64 = (input: string): string => {
  try {
    return btoa(input);
  } catch (error) {
    console.error('Base64 encoding error:', error);
    return '';
  }
};

export const decodeBase64 = (input: string): string => {
  try {
    return atob(input);
  } catch (error) {
    console.error('Base64 decoding error:', error);
    return '';
  }
};

// Base32 encoding/decoding
export const encodeBase32 = (input: string): string => {
  try {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let result = '';
    let bits = 0;
    let value = 0;
    
    for (let i = 0; i < input.length; i++) {
      value = (value << 8) | input.charCodeAt(i);
      bits += 8;
      
      while (bits >= 5) {
        result += alphabet[(value >>> (bits - 5)) & 31];
        bits -= 5;
      }
    }
    
    if (bits > 0) {
      result += alphabet[(value << (5 - bits)) & 31];
    }
    
    // Padding
    const padding = 8 - (result.length % 8);
    if (padding < 8) {
      result += '='.repeat(padding);
    }
    
    return result;
  } catch (error) {
    console.error('Base32 encoding error:', error);
    return '';
  }
};

export const decodeBase32 = (input: string): string => {
  try {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    input = input.toUpperCase().replace(/=+$/, '');
    let result = '';
    let bits = 0;
    let value = 0;
    
    for (let i = 0; i < input.length; i++) {
      const char = input.charAt(i);
      const index = alphabet.indexOf(char);
      if (index === -1) {
        throw new Error('Invalid Base32 character: ' + char);
      }
      
      value = (value << 5) | index;
      bits += 5;
      
      if (bits >= 8) {
        result += String.fromCharCode((value >>> (bits - 8)) & 255);
        bits -= 8;
      }
    }
    
    return result;
  } catch (error) {
    console.error('Base32 decoding error:', error);
    return '';
  }
};

// URL encoding/decoding
export const encodeUrl = (input: string): string => {
  try {
    return encodeURIComponent(input);
  } catch (error) {
    console.error('URL encoding error:', error);
    return '';
  }
};

export const decodeUrl = (input: string): string => {
  try {
    return decodeURIComponent(input);
  } catch (error) {
    console.error('URL decoding error:', error);
    return '';
  }
};

// HTML encoding/decoding
export const encodeHtml = (input: string): string => {
  try {
    const element = document.createElement('div');
    element.innerText = input;
    return element.innerHTML;
  } catch (error) {
    console.error('HTML encoding error:', error);
    return '';
  }
};

export const decodeHtml = (input: string): string => {
  try {
    const element = document.createElement('div');
    element.innerHTML = input;
    return element.innerText;
  } catch (error) {
    console.error('HTML decoding error:', error);
    return '';
  }
};

// Unicode encoding/decoding
export const encodeUnicode = (input: string): string => {
  try {
    return input.split('').map(char => {
      const codePoint = char.codePointAt(0);
      if (codePoint && codePoint > 127) {
        return `\\u${codePoint.toString(16).padStart(4, '0')}`;
      }
      return char;
    }).join('');
  } catch (error) {
    console.error('Unicode encoding error:', error);
    return '';
  }
};

export const decodeUnicode = (input: string): string => {
  try {
    return input.replace(/\\u([0-9a-fA-F]{4})/g, (_, codePoint) => 
      String.fromCodePoint(parseInt(codePoint, 16))
    );
  } catch (error) {
    console.error('Unicode decoding error:', error);
    return '';
  }
};

// JSON validation and formatting
export const validateJson = (input: string): { valid: boolean; formatted?: string; error?: string } => {
  try {
    const parsed = JSON.parse(input);
    return {
      valid: true,
      formatted: JSON.stringify(parsed, null, 2)
    };
  } catch (error) {
    return {
      valid: false,
      error: (error as Error).message
    };
  }
};

// XML validation and formatting
export const validateXml = (input: string): { valid: boolean; formatted?: string; error?: string } => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(input, 'text/xml');
    
    const errorNode = xmlDoc.querySelector('parsererror');
    if (errorNode) {
      throw new Error('XML parsing error');
    }
    
    // Format XML with line breaks and indentation
    const serializer = new XMLSerializer();
    const formatted = serializer.serializeToString(xmlDoc)
      .replace(/></g, '>\n<')
      .replace(/><\//, '>\n</');
      
    // Simple indentation
    let indentedResult = '';
    let indentLevel = 0;
    
    formatted.split('\n').forEach(line => {
      if (line.match(/<\/[^>]*>/) && !line.match(/<[^>]*>[^<]*<\/[^>]*>/)) {
        indentLevel--;
      }
      
      indentedResult += ' '.repeat(indentLevel * 2) + line + '\n';
      
      if (line.match(/<[^\/][^>]*[^\/]>/) && !line.match(/<[^>]*\/>/)) {
        indentLevel++;
      }
    });
    
    return {
      valid: true,
      formatted: indentedResult
    };
  } catch (error) {
    return {
      valid: false,
      error: (error as Error).message
    };
  }
};

// CSV formatting
export const formatCsv = (input: string): { valid: boolean; formatted?: string; error?: string } => {
  try {
    if (!input.trim()) {
      throw new Error('Empty CSV input');
    }
    
    const lines = input.trim().split(/\r?\n/);
    if (lines.length === 0) {
      throw new Error('Invalid CSV format');
    }
    
    const rows = lines.map(line => {
      // Basic CSV parsing that handles quotes
      const result: string[] = [];
      let inQuotes = false;
      let currentValue = '';
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
          if (inQuotes && line[i+1] === '"') {
            // Double quotes inside quoted field
            currentValue += '"';
            i++;
          } else {
            // Toggle quote mode
            inQuotes = !inQuotes;
          }
        } else if (char === ',' && !inQuotes) {
          // End of field
          result.push(currentValue.trim());
          currentValue = '';
        } else {
          currentValue += char;
        }
      }
      
      // Add the last field
      result.push(currentValue.trim());
      return result;
    });
    
    // Format with consistent column widths
    const columnWidths: number[] = [];
    for (let i = 0; i < rows[0].length; i++) {
      const width = Math.max(...rows.map(row => (row[i] || '').length));
      columnWidths.push(width);
    }
    
    const formatted = rows.map(row => 
      row.map((cell, i) => cell.padEnd(columnWidths[i] + 2, ' ')).join(',')
    ).join('\n');
    
    return {
      valid: true,
      formatted
    };
  } catch (error) {
    return {
      valid: false,
      error: (error as Error).message
    };
  }
};

// Markdown formatting
export const formatMarkdown = (input: string): { valid: boolean; formatted?: string; error?: string } => {
  try {
    if (!input.trim()) {
      throw new Error('Empty markdown input');
    }
    
    // Basic markdown formatting
    const lines = input.trim().split(/\r?\n/);
    
    // Format with consistent spacing
    const formatted = lines
      // Add space after # for headers if missing
      .map(line => line.replace(/^(#{1,6})([^#\s])/g, '$1 $2'))
      // Ensure lists have space after marker
      .map(line => line.replace(/^(\s*[*+-])([^\s])/g, '$1 $2'))
      // Ensure numbered lists have space after number
      .map(line => line.replace(/^(\s*\d+\.)([^\s])/g, '$1 $2'))
      // Add empty line before headers (except at start)
      .map((line, i, arr) => {
        if (i > 0 && line.match(/^#{1,6}\s/) && !arr[i-1].match(/^\s*$/)) {
          return '\n' + line;
        }
        return line;
      })
      .join('\n');
    
    return {
      valid: true,
      formatted
    };
  } catch (error) {
    return {
      valid: false,
      error: (error as Error).message
    };
  }
};

// SQL formatting
export const formatSql = (input: string): { valid: boolean; formatted?: string; error?: string } => {
  try {
    if (!input.trim()) {
      throw new Error('Empty SQL input');
    }
    
    // Basic SQL formatting with keywords
    const keywords = [
      'SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN',
      'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET', 'INSERT INTO', 'VALUES',
      'UPDATE', 'SET', 'DELETE', 'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE',
      'AND', 'OR', 'NOT', 'IN', 'BETWEEN', 'LIKE', 'IS NULL', 'IS NOT NULL'
    ];
    
    // Replace keywords with uppercase versions
    let formattedSql = input;
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      formattedSql = formattedSql.replace(regex, keyword.toUpperCase());
    });
    
    // Add line breaks and indentation
    formattedSql = formattedSql
      // Add line break before major clauses
      .replace(/\b(SELECT|FROM|WHERE|GROUP BY|ORDER BY|HAVING|JOIN|LEFT JOIN|RIGHT JOIN|INNER JOIN|LIMIT|OFFSET)\b/gi, '\n$1')
      // Add line break and indent for AND/OR
      .replace(/\b(AND|OR)\b/gi, '\n  $1')
      // Trim extra whitespace
      .replace(/\s+/g, ' ')
      .trim();
    
    return {
      valid: true,
      formatted: formattedSql
    };
  } catch (error) {
    return {
      valid: false,
      error: (error as Error).message
    };
  }
};

// UUID generator
export const encodeUuid = (): string => {
  try {
    // Simple UUID v4 generator
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  } catch (error) {
    console.error('UUID generation error:', error);
    return '';
  }
};

// Email validator
export const validateEmail = (input: string): { valid: boolean; error?: string } => {
  try {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid = emailRegex.test(input);
    
    return {
      valid: isValid,
      error: isValid ? undefined : 'Invalid email format'
    };
  } catch (error) {
    return {
      valid: false,
      error: (error as Error).message
    };
  }
};

// IP Address validator
export const validateIpAddress = (input: string): { valid: boolean; error?: string } => {
  try {
    // IPv4 regex
    const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    
    // Basic IPv6 regex
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^([0-9a-fA-F]{1,4}:){1,7}:|^([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}$|^([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}$|^([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}$|^([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}$|^([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}$|^[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})$|^:((:[0-9a-fA-F]{1,4}){1,7}|:)$/;
    
    const isValid = ipv4Regex.test(input) || ipv6Regex.test(input);
    
    return {
      valid: isValid,
      error: isValid ? undefined : 'Invalid IP address format'
    };
  } catch (error) {
    return {
      valid: false,
      error: (error as Error).message
    };
  }
};

// Hex encoding/decoding
export const encodeHex = (input: string): string => {
  try {
    let result = '';
    for (let i = 0; i < input.length; i++) {
      result += input.charCodeAt(i).toString(16).padStart(2, '0');
    }
    return result;
  } catch (error) {
    console.error('Hex encoding error:', error);
    return '';
  }
};

export const decodeHex = (input: string): string => {
  try {
    if (input.length % 2 !== 0) {
      throw new Error('Hex string must have an even length');
    }
    
    let result = '';
    for (let i = 0; i < input.length; i += 2) {
      result += String.fromCharCode(parseInt(input.substr(i, 2), 16));
    }
    return result;
  } catch (error) {
    console.error('Hex decoding error:', error);
    return '';
  }
};

// Binary encoding/decoding
export const encodeBinary = (input: string): string => {
  try {
    return input.split('').map(char => 
      char.charCodeAt(0).toString(2).padStart(8, '0')
    ).join(' ');
  } catch (error) {
    console.error('Binary encoding error:', error);
    return '';
  }
};

export const decodeBinary = (input: string): string => {
  try {
    return input.trim().split(/\s+/).map(binary => 
      String.fromCharCode(parseInt(binary, 2))
    ).join('');
  } catch (error) {
    console.error('Binary decoding error:', error);
    return '';
  }
};

// JWT decode (header and payload only)
export const decodeJwt = (token: string): { header: any; payload: any; error?: string } => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }
    
    const header = JSON.parse(atob(parts[0]));
    const payload = JSON.parse(atob(parts[1]));
    
    return { header, payload };
  } catch (error) {
    return { 
      header: null, 
      payload: null, 
      error: (error as Error).message 
    };
  }
}; 