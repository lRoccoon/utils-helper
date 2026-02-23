// Converter utility tests
describe('Type Inference', () => {
  const inferGoType = (value: any): string => {
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

  const inferRustType = (value: any): string => {
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
  })
})
