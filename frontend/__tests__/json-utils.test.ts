import {
  formatJSON,
  compressJSON,
  escapeJSON,
  unescapeJSON,
  unicodeToChinese,
  isValidJSON,
  prettyPrintJSON
} from '@/utils/json-utils'

describe('JSON Utils', () => {
  describe('formatJSON', () => {
    it('formats valid JSON correctly', () => {
      const input = '{"key":"value"}'
      const expected = '{\n  "key": "value"\n}'
      const result = formatJSON(input)
      expect(result).toBe(expected)
    })

    it('formats JSON with custom spacing', () => {
      const input = '{"key":"value"}'
      const result = formatJSON(input, 4)
      expect(result).toContain('    ')
    })

    it('throws error for invalid JSON', () => {
      const input = '{invalid json}'
      expect(() => formatJSON(input)).toThrow()
    })

    it('formats nested JSON', () => {
      const input = '{"outer":{"inner":"value"}}'
      const result = formatJSON(input)
      expect(result).toContain('"outer"')
      expect(result).toContain('"inner"')
    })
  })

  describe('compressJSON', () => {
    it('compresses JSON by removing whitespace', () => {
      const input = '{\n  "key": "value"\n}'
      const result = compressJSON(input)
      expect(result).toBe('{"key":"value"}')
    })

    it('handles already compressed JSON', () => {
      const input = '{"key":"value"}'
      const result = compressJSON(input)
      expect(result).toBe('{"key":"value"}')
    })

    it('throws error for invalid JSON', () => {
      const input = '{invalid}'
      expect(() => compressJSON(input)).toThrow()
    })
  })

  describe('escapeJSON', () => {
    it('escapes strings with quotes', () => {
      const input = 'test "quoted" string'
      const result = escapeJSON(input)
      expect(result).toContain('\\"')
    })

    it('escapes newlines', () => {
      const input = 'line1\nline2'
      const result = escapeJSON(input)
      expect(result).toContain('\\n')
    })

    it('handles empty string', () => {
      const input = ''
      const result = escapeJSON(input)
      expect(result).toBe('""')
    })
  })

  describe('unescapeJSON', () => {
    it('unescapes JSON strings', () => {
      const input = '"test \\"quoted\\" string"'
      const result = unescapeJSON(input)
      expect(result).toBe('test "quoted" string')
    })

    it('throws error for invalid escaped JSON', () => {
      const input = '"unclosed'
      expect(() => unescapeJSON(input)).toThrow()
    })
  })

  describe('unicodeToChinese', () => {
    it('converts Unicode to Chinese characters', () => {
      const input = '\\u4e2d\\u6587'
      const result = unicodeToChinese(input)
      expect(result).toBe('中文')
    })

    it('handles mixed content', () => {
      const input = 'Hello \\u4e2d\\u6587'
      const result = unicodeToChinese(input)
      expect(result).toBe('Hello 中文')
    })

    it('handles string without Unicode', () => {
      const input = 'plain text'
      const result = unicodeToChinese(input)
      expect(result).toBe('plain text')
    })

    it('handles multiple Unicode sequences', () => {
      const input = '\\u4e2d\\u6587\\u6d4b\\u8bd5'
      const result = unicodeToChinese(input)
      expect(result).toBe('中文测试')
    })
  })

  describe('isValidJSON', () => {
    it('returns true for valid JSON', () => {
      expect(isValidJSON('{"key":"value"}')).toBe(true)
    })

    it('returns true for valid JSON array', () => {
      expect(isValidJSON('[1,2,3]')).toBe(true)
    })

    it('returns false for invalid JSON', () => {
      expect(isValidJSON('{invalid}')).toBe(false)
    })

    it('returns true for valid JSON with numbers', () => {
      expect(isValidJSON('{"num":123}')).toBe(true)
    })

    it('returns false for empty string', () => {
      expect(isValidJSON('')).toBe(false)
    })
  })

  describe('prettyPrintJSON', () => {
    it('pretty prints object with default indent', () => {
      const obj = { key: 'value' }
      const result = prettyPrintJSON(obj)
      expect(result).toBe('{\n  "key": "value"\n}')
    })

    it('pretty prints with custom indent', () => {
      const obj = { key: 'value' }
      const result = prettyPrintJSON(obj, 4)
      expect(result).toContain('    ')
    })

    it('handles nested objects', () => {
      const obj = { outer: { inner: 'value' } }
      const result = prettyPrintJSON(obj)
      expect(result).toContain('"outer"')
      expect(result).toContain('"inner"')
    })

    it('handles arrays', () => {
      const obj = { arr: [1, 2, 3] }
      const result = prettyPrintJSON(obj)
      expect(result).toContain('[')
      expect(result).toContain(']')
    })
  })
})
