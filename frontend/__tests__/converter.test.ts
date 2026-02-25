import {
  inferGoType,
  inferRustType,
  jsonToGoStruct,
  jsonToRustStruct,
  capitalizeFirst
} from '@/utils/converter-utils'

describe('Type Inference', () => {
  describe('Go Type Inference', () => {
    it('infers string type', () => {
      expect(inferGoType('test')).toBe('string')
    })

    it('infers integer type', () => {
      expect(inferGoType(42)).toBe('int')
    })

    it('infers float type', () => {
      expect(inferGoType(3.14)).toBe('float64')
    })

    it('infers boolean type', () => {
      expect(inferGoType(true)).toBe('bool')
    })

    it('infers array type', () => {
      expect(inferGoType([1, 2, 3])).toBe('[]int')
    })

    it('infers empty array type', () => {
      expect(inferGoType([])).toBe('[]interface{}')
    })

    it('infers null type', () => {
      expect(inferGoType(null)).toBe('interface{}')
    })

    it('infers map type', () => {
      expect(inferGoType({ key: 'value' })).toBe('map[string]interface{}')
    })

    it('infers nested array type', () => {
      expect(inferGoType([['nested']])).toBe('[][]string')
    })

    it('infers float array type', () => {
      expect(inferGoType([1.5, 2.5])).toBe('[]float64')
    })

    it('infers undefined type as interface{}', () => {
      expect(inferGoType(undefined)).toBe('interface{}')
    })

    it('infers function type as interface{}', () => {
      expect(inferGoType(() => {})).toBe('interface{}')
    })
  })

  describe('Rust Type Inference', () => {
    it('infers String type', () => {
      expect(inferRustType('test')).toBe('String')
    })

    it('infers i64 type', () => {
      expect(inferRustType(42)).toBe('i64')
    })

    it('infers f64 type', () => {
      expect(inferRustType(3.14)).toBe('f64')
    })

    it('infers bool type', () => {
      expect(inferRustType(true)).toBe('bool')
    })

    it('infers Vec type', () => {
      expect(inferRustType([1, 2, 3])).toBe('Vec<i64>')
    })

    it('infers null type', () => {
      expect(inferRustType(null)).toBe('Option<serde_json::Value>')
    })

    it('infers empty Vec type', () => {
      expect(inferRustType([])).toBe('Vec<serde_json::Value>')
    })

    it('infers object type', () => {
      expect(inferRustType({ key: 'value' })).toBe('serde_json::Value')
    })

    it('infers nested Vec type', () => {
      expect(inferRustType([[1, 2]])).toBe('Vec<Vec<i64>>')
    })

    it('infers undefined type as serde_json::Value', () => {
      expect(inferRustType(undefined)).toBe('serde_json::Value')
    })

    it('infers function type as serde_json::Value', () => {
      expect(inferRustType(() => {})).toBe('serde_json::Value')
    })
  })

  describe('jsonToGoStruct', () => {
    it('generates Go struct from object', () => {
      const obj = { name: 'test', age: 25 }
      const result = jsonToGoStruct(obj)

      expect(result).toContain('type Root struct')
      expect(result).toContain('Name string')
      expect(result).toContain('Age int')
      expect(result).toContain('`json:"name"`')
    })

    it('uses custom struct name', () => {
      const obj = { id: 1 }
      const result = jsonToGoStruct(obj, 'User')

      expect(result).toContain('type User struct')
    })

    it('returns error message for invalid input', () => {
      const result = jsonToGoStruct([])
      expect(result).toContain('Invalid input')
    })

    it('returns error message for null input', () => {
      const result = jsonToGoStruct(null)
      expect(result).toContain('Invalid input')
    })

    it('handles nested objects', () => {
      const obj = { data: { key: 'value' } }
      const result = jsonToGoStruct(obj)

      expect(result).toContain('Data map[string]interface{}')
    })

    it('capitalizes field names', () => {
      const obj = { firstName: 'John' }
      const result = jsonToGoStruct(obj)

      expect(result).toContain('FirstName')
    })
  })

  describe('jsonToRustStruct', () => {
    it('generates Rust struct from object', () => {
      const obj = { name: 'test', age: 25 }
      const result = jsonToRustStruct(obj)

      expect(result).toContain('#[derive(Debug, Serialize, Deserialize)]')
      expect(result).toContain('struct Root')
      expect(result).toContain('name: String')
      expect(result).toContain('age: i64')
      expect(result).toContain('#[serde(rename = "name")]')
    })

    it('uses custom struct name', () => {
      const obj = { id: 1 }
      const result = jsonToRustStruct(obj, 'User')

      expect(result).toContain('struct User')
    })

    it('returns error message for invalid input', () => {
      const result = jsonToRustStruct([])
      expect(result).toContain('Invalid input')
    })

    it('returns error message for null input', () => {
      const result = jsonToRustStruct(null)
      expect(result).toContain('Invalid input')
    })

    it('handles boolean fields', () => {
      const obj = { active: true }
      const result = jsonToRustStruct(obj)

      expect(result).toContain('active: bool')
    })

    it('handles array fields', () => {
      const obj = { tags: ['tag1', 'tag2'] }
      const result = jsonToRustStruct(obj)

      expect(result).toContain('tags: Vec<String>')
    })
  })

  describe('capitalizeFirst', () => {
    it('capitalizes first letter', () => {
      expect(capitalizeFirst('hello')).toBe('Hello')
    })

    it('handles already capitalized string', () => {
      expect(capitalizeFirst('Hello')).toBe('Hello')
    })

    it('handles single character', () => {
      expect(capitalizeFirst('a')).toBe('A')
    })

    it('handles empty string', () => {
      expect(capitalizeFirst('')).toBe('')
    })

    it('preserves rest of string', () => {
      expect(capitalizeFirst('hELLO')).toBe('HELLO')
    })
  })
})
