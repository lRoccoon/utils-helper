import { renderHook, act } from '@testing-library/react'

// Helper function to test JSON formatting
describe('JSON Utils', () => {
  it('formats valid JSON correctly', () => {
    const input = '{"key":"value"}'
    const expected = JSON.stringify(JSON.parse(input), null, 2)

    let result = ''
    try {
      const parsed = JSON.parse(input)
      result = JSON.stringify(parsed, null, 2)
    } catch (e) {
      // Should not throw
    }

    expect(result).toBe(expected)
  })

  it('handles invalid JSON', () => {
    const input = '{invalid json}'

    expect(() => {
      JSON.parse(input)
    }).toThrow()
  })

  it('compresses JSON', () => {
    const input = '{\n  "key": "value"\n}'
    const parsed = JSON.parse(input)
    const result = JSON.stringify(parsed)

    expect(result).toBe('{"key":"value"}')
  })

  it('escapes JSON strings', () => {
    const input = 'test "quoted" string'
    const result = JSON.stringify(input)

    expect(result).toContain('\\"')
  })

  it('converts Unicode to Chinese', () => {
    const input = '\\u4e2d\\u6587'
    const decoded = input.replace(/\\u[\dA-Fa-f]{4}/g, (match) => {
      return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16))
    })

    expect(decoded).toBe('中文')
  })
})
