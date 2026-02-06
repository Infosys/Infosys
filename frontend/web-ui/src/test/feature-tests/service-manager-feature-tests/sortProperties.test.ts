import { describe, it, expect } from 'vitest'
import { sortProperties } from '../../../app/features/service-manager-app-features/search-property/utils/sortProperties'


describe('sortProperties', () => {
  const mockProperties = [
    { id: 1, CreatedAt: '2024-01-15T10:00:00Z', name: 'Property 1' },
    { id: 2, CreatedAt: '2024-01-10T10:00:00Z', name: 'Property 2' },
    { id: 3, CreatedAt: '2024-01-20T10:00:00Z', name: 'Property 3' },
  ]

  it('should sort properties from newest to oldest when "New - Old" is selected', () => {
    const result = sortProperties([...mockProperties], 'New - Old')
    
    expect(result[0].id).toBe(3) // Jan 20 (newest)
    expect(result[1].id).toBe(1) // Jan 15
    expect(result[2].id).toBe(2) // Jan 10 (oldest)
  })

  it('should sort properties from oldest to newest when "Old - New" is selected', () => {
    const result = sortProperties([...mockProperties], 'Old - New')
    
    expect(result[0].id).toBe(2) // Jan 10 (oldest)
    expect(result[1].id).toBe(1) // Jan 15
    expect(result[2].id).toBe(3) // Jan 20 (newest)
  })

  it('should return properties as-is when no recognized sort option is provided', () => {
    const result = sortProperties([...mockProperties], 'Invalid Sort')
    
    expect(result).toEqual(mockProperties)
  })

  it('should handle empty array', () => {
    const result = sortProperties([], 'New - Old')
    
    expect(result).toEqual([])
  })

  it('should handle single property', () => {
    const singleProperty = [{ id: 1, CreatedAt: '2024-01-15T10:00:00Z' }]
    const result = sortProperties(singleProperty, 'New - Old')
    
    expect(result).toEqual(singleProperty)
  })

  it('should handle properties with same CreatedAt date', () => {
    const sameDate = [
      { id: 1, CreatedAt: '2024-01-15T10:00:00Z' },
      { id: 2, CreatedAt: '2024-01-15T10:00:00Z' },
    ]
    const result = sortProperties([...sameDate], 'New - Old')
    
    expect(result).toHaveLength(2)
  })
})