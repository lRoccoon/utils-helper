/**
 * Type inference and conversion utilities for multiple programming languages
 */

/**
 * Infer Go type from JavaScript value
 * @param value - JavaScript value to infer type from
 * @returns Go type as string
 */
export function inferGoType(value: any): string {
  if (value === null) return 'interface{}'
  if (typeof value === 'string') return 'string'
  if (typeof value === 'number') {
    return Number.isInteger(value) ? 'int' : 'float64'
  }
  if (typeof value === 'boolean') return 'bool'
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]interface{}'
    return '[]' + inferGoType(value[0])
  }
  if (typeof value === 'object') return 'map[string]interface{}'
  return 'interface{}'
}

/**
 * Infer Rust type from JavaScript value
 * @param value - JavaScript value to infer type from
 * @returns Rust type as string
 */
export function inferRustType(value: any): string {
  if (value === null) return 'Option<serde_json::Value>'
  if (typeof value === 'string') return 'String'
  if (typeof value === 'number') {
    return Number.isInteger(value) ? 'i64' : 'f64'
  }
  if (typeof value === 'boolean') return 'bool'
  if (Array.isArray(value)) {
    if (value.length === 0) return 'Vec<serde_json::Value>'
    return 'Vec<' + inferRustType(value[0]) + '>'
  }
  if (typeof value === 'object') return 'serde_json::Value'
  return 'serde_json::Value'
}

/**
 * Convert JSON object to Go struct definition
 * @param obj - JavaScript object to convert
 * @param structName - Name of the struct (default: 'Root')
 * @returns Go struct definition as string
 */
export function jsonToGoStruct(obj: any, structName: string = 'Root'): string {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    return '// Invalid input for struct generation'
  }

  let result = `type ${structName} struct {\n`

  for (const [key, value] of Object.entries(obj)) {
    const fieldName = key.charAt(0).toUpperCase() + key.slice(1)
    const goType = inferGoType(value)
    result += `\t${fieldName} ${goType} \`json:"${key}"\`\n`
  }

  result += '}\n'
  return result
}

/**
 * Convert JSON object to Rust struct definition
 * @param obj - JavaScript object to convert
 * @param structName - Name of the struct (default: 'Root')
 * @returns Rust struct definition as string
 */
export function jsonToRustStruct(obj: any, structName: string = 'Root'): string {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    return '// Invalid input for struct generation'
  }

  let result = `#[derive(Debug, Serialize, Deserialize)]\n`
  result += `struct ${structName} {\n`

  for (const [key, value] of Object.entries(obj)) {
    const rustType = inferRustType(value)
    result += `    #[serde(rename = "${key}")]\n`
    result += `    ${key}: ${rustType},\n`
  }

  result += '}\n'
  return result
}

/**
 * Capitalize first letter of a string
 * @param str - String to capitalize
 * @returns Capitalized string
 */
export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
