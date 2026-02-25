/**
 * JSON utility functions for formatting, compressing, escaping, and converting
 */

/**
 * Format JSON string with indentation
 * @param input - JSON string to format
 * @param spaces - Number of spaces for indentation (default: 2)
 * @returns Formatted JSON string
 * @throws Error if input is invalid JSON
 */
export function formatJSON(input: string, spaces: number = 2): string {
  const parsed = JSON.parse(input)
  return JSON.stringify(parsed, null, spaces)
}

/**
 * Compress JSON by removing whitespace
 * @param input - JSON string to compress
 * @returns Compressed JSON string
 * @throws Error if input is invalid JSON
 */
export function compressJSON(input: string): string {
  const parsed = JSON.parse(input)
  return JSON.stringify(parsed)
}

/**
 * Escape a string for use in JSON
 * @param input - String to escape
 * @returns Escaped JSON string
 */
export function escapeJSON(input: string): string {
  return JSON.stringify(input)
}

/**
 * Unescape a JSON string
 * @param input - Escaped JSON string
 * @returns Unescaped string
 * @throws Error if input is invalid JSON string
 */
export function unescapeJSON(input: string): string {
  return JSON.parse(input)
}

/**
 * Convert Unicode escape sequences to Chinese characters
 * @param input - String with Unicode escapes (e.g., \u4e2d\u6587)
 * @returns String with Unicode converted to characters
 */
export function unicodeToChinese(input: string): string {
  return input.replace(/\\u[\dA-Fa-f]{4}/g, (match) => {
    return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16))
  })
}

/**
 * Validate if a string is valid JSON
 * @param input - String to validate
 * @returns true if valid JSON, false otherwise
 */
export function isValidJSON(input: string): boolean {
  try {
    JSON.parse(input)
    return true
  } catch {
    return false
  }
}

/**
 * Pretty print JSON with custom formatting
 * @param obj - Object to format
 * @param indent - Indentation level (default: 2)
 * @returns Formatted JSON string
 */
export function prettyPrintJSON(obj: any, indent: number = 2): string {
  return JSON.stringify(obj, null, indent)
}
