import fc from 'fast-check'
import {
  filterEventsByType,
  filterEventsByLocation,
  getUniqueEventTypes,
  getUniqueLocations,
  validateEventData
} from './supabaseQueries'

/**
 * Property-Based Tests for Supabase Queries
 * 
 * These tests verify universal properties that should hold
 * across all possible inputs, not just specific examples.
 */

describe('supabaseQueries - Property-Based Tests', () => {
  /**
   * Property 1: Event Filtering by Type
   * 
   * **Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8**
   * 
   * Universal properties:
   * 1. Filtered results contain only events matching the selected type
   * 2. No non-matching events are included in filtered results
   * 3. Filtering with empty type returns all events
   * 4. Filtering with non-existent type returns empty array
   */
  describe('Property 1: Event Filtering by Type', () => {
    it('should only include events matching the selected type', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              id: fc.integer(),
              event_type: fc.oneof(
                fc.constant('Conference'),
                fc.constant('Workshop'),
                fc.constant('Seminar'),
                fc.constant('Networking')
              ),
              event_name: fc.string()
            }),
            { minLength: 0, maxLength: 100 }
          ),
          fc.oneof(
            fc.constant('Conference'),
            fc.constant('Workshop'),
            fc.constant('Seminar'),
            fc.constant('Networking')
          ),
          (events, selectedType) => {
            const filtered = filterEventsByType(events, selectedType)

            // All filtered events must have the selected type
            const allMatch = filtered.every(event => event.event_type === selectedType)
            expect(allMatch).toBe(true)

            // No non-matching events should be included
            const noNonMatching = filtered.length === events.filter(e => e.event_type === selectedType).length
            expect(noNonMatching).toBe(true)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should return all events when filtering with empty type', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              id: fc.integer(),
              event_type: fc.string(),
              event_name: fc.string()
            }),
            { minLength: 0, maxLength: 100 }
          ),
          (events) => {
            const filtered = filterEventsByType(events, '')

            expect(filtered).toEqual(events)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should return empty array when filtering with non-existent type', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              id: fc.integer(),
              event_type: fc.oneof(
                fc.constant('Conference'),
                fc.constant('Workshop')
              ),
              event_name: fc.string()
            }),
            { minLength: 1, maxLength: 100 }
          ),
          (events) => {
            const filtered = filterEventsByType(events, 'NonExistentType')

            expect(filtered).toHaveLength(0)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should maintain event data integrity during filtering', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              id: fc.integer(),
              event_type: fc.string(),
              event_name: fc.string(),
              description: fc.string(),
              city: fc.string(),
              state: fc.string()
            }),
            { minLength: 0, maxLength: 100 }
          ),
          fc.string(),
          (events, selectedType) => {
            const filtered = filterEventsByType(events, selectedType)

            // All filtered events should have all original properties
            filtered.forEach(event => {
              expect(event).toHaveProperty('id')
              expect(event).toHaveProperty('event_type')
              expect(event).toHaveProperty('event_name')
              expect(event).toHaveProperty('description')
              expect(event).toHaveProperty('city')
              expect(event).toHaveProperty('state')
            })
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  /**
   * Property 2: Event Filtering by Location
   * 
   * **Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8**
   * 
   * Universal properties:
   * 1. Filtered results contain only events matching the selected location
   * 2. No non-matching events are included in filtered results
   * 3. Filtering with empty city or state returns all events
   * 4. Filtering with non-existent location returns empty array
   * 5. AND logic is applied when both city and state are specified
   */
  describe('Property 2: Event Filtering by Location', () => {
    it('should only include events matching the selected location', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              id: fc.integer(),
              city: fc.oneof(
                fc.constant('San Francisco'),
                fc.constant('New York'),
                fc.constant('Los Angeles')
              ),
              state: fc.oneof(
                fc.constant('CA'),
                fc.constant('NY'),
                fc.constant('TX')
              ),
              event_name: fc.string()
            }),
            { minLength: 0, maxLength: 100 }
          ),
          fc.oneof(
            fc.constant('San Francisco'),
            fc.constant('New York'),
            fc.constant('Los Angeles')
          ),
          fc.oneof(
            fc.constant('CA'),
            fc.constant('NY'),
            fc.constant('TX')
          ),
          (events, selectedCity, selectedState) => {
            const filtered = filterEventsByLocation(events, selectedCity, selectedState)

            // All filtered events must match both city and state
            const allMatch = filtered.every(
              event => event.city === selectedCity && event.state === selectedState
            )
            expect(allMatch).toBe(true)

            // No non-matching events should be included
            const expectedCount = events.filter(
              e => e.city === selectedCity && e.state === selectedState
            ).length
            expect(filtered).toHaveLength(expectedCount)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should return all events when filtering with empty city or state', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              id: fc.integer(),
              city: fc.string(),
              state: fc.string(),
              event_name: fc.string()
            }),
            { minLength: 0, maxLength: 100 }
          ),
          (events) => {
            const filteredEmptyCity = filterEventsByLocation(events, '', 'CA')
            const filteredEmptyState = filterEventsByLocation(events, 'San Francisco', '')
            const filteredBothEmpty = filterEventsByLocation(events, '', '')

            expect(filteredEmptyCity).toEqual(events)
            expect(filteredEmptyState).toEqual(events)
            expect(filteredBothEmpty).toEqual(events)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should return empty array when filtering with non-existent location', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              id: fc.integer(),
              city: fc.oneof(
                fc.constant('San Francisco'),
                fc.constant('New York')
              ),
              state: fc.oneof(
                fc.constant('CA'),
                fc.constant('NY')
              ),
              event_name: fc.string()
            }),
            { minLength: 1, maxLength: 100 }
          ),
          (events) => {
            const filtered = filterEventsByLocation(events, 'NonExistent', 'XX')

            expect(filtered).toHaveLength(0)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should apply AND logic for city and state filters', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              id: fc.integer(),
              city: fc.string(),
              state: fc.string(),
              event_name: fc.string()
            }),
            { minLength: 0, maxLength: 100 }
          ),
          fc.string(),
          fc.string(),
          (events, city, state) => {
            const filtered = filterEventsByLocation(events, city, state)

            // Verify AND logic: all events must match BOTH city AND state
            // Note: filterEventsByLocation returns empty if city or state is empty
            if (!city || !state) {
              expect(filtered).toEqual(events)
            } else {
              const expectedFiltered = events.filter(e => e.city === city && e.state === state)
              expect(filtered).toEqual(expectedFiltered)
            }
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  /**
   * Property 3: Unique Event Types Extraction
   * 
   * **Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8**
   * 
   * Universal properties:
   * 1. Result contains no duplicate types
   * 2. Result is sorted alphabetically
   * 3. All types in result exist in original events
   * 4. No falsy types are included
   */
  describe('Property 3: Unique Event Types Extraction', () => {
    it('should return unique types without duplicates', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              event_type: fc.oneof(
                fc.constant('Conference'),
                fc.constant('Workshop'),
                fc.constant('Seminar'),
                fc.constant('Networking')
              )
            }),
            { minLength: 0, maxLength: 100 }
          ),
          (events) => {
            const result = getUniqueEventTypes(events)

            // Check for duplicates
            const hasDuplicates = result.length !== new Set(result).size
            expect(hasDuplicates).toBe(false)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should return types sorted alphabetically', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              event_type: fc.string()
            }),
            { minLength: 0, maxLength: 100 }
          ),
          (events) => {
            const result = getUniqueEventTypes(events)

            // Check if sorted
            const sorted = [...result].sort()
            expect(result).toEqual(sorted)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should only include types that exist in original events', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              event_type: fc.string()
            }),
            { minLength: 0, maxLength: 100 }
          ),
          (events) => {
            const result = getUniqueEventTypes(events)
            const originalTypes = events.map(e => e.event_type).filter(Boolean)

            // All result types must exist in original
            result.forEach(type => {
              expect(originalTypes).toContain(type)
            })
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should not include falsy types', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              event_type: fc.oneof(
                fc.string(),
                fc.constant(null),
                fc.constant(undefined),
                fc.constant('')
              )
            }),
            { minLength: 0, maxLength: 100 }
          ),
          (events) => {
            const result = getUniqueEventTypes(events)

            // No falsy values should be in result
            result.forEach(type => {
              expect(type).toBeTruthy()
            })
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  /**
   * Property 4: Unique Locations Extraction
   * 
   * **Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8**
   * 
   * Universal properties:
   * 1. Result contains no duplicate locations
   * 2. Result is sorted alphabetically
   * 3. All locations in result exist in original events
   * 4. Locations are formatted as "City, State"
   * 5. No incomplete locations are included
   */
  describe('Property 4: Unique Locations Extraction', () => {
    it('should return unique locations without duplicates', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              city: fc.oneof(
                fc.constant('San Francisco'),
                fc.constant('New York'),
                fc.constant('Los Angeles')
              ),
              state: fc.oneof(
                fc.constant('CA'),
                fc.constant('NY'),
                fc.constant('TX')
              )
            }),
            { minLength: 0, maxLength: 100 }
          ),
          (events) => {
            const result = getUniqueLocations(events)

            // Check for duplicates
            const hasDuplicates = result.length !== new Set(result).size
            expect(hasDuplicates).toBe(false)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should return locations sorted alphabetically', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              city: fc.string(),
              state: fc.string()
            }),
            { minLength: 0, maxLength: 100 }
          ),
          (events) => {
            const result = getUniqueLocations(events)

            // Check if sorted
            const sorted = [...result].sort()
            expect(result).toEqual(sorted)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should format locations as "City, State"', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              city: fc.string(),
              state: fc.string()
            }),
            { minLength: 0, maxLength: 100 }
          ),
          (events) => {
            const result = getUniqueLocations(events)

            // All locations should match "City, State" format
            result.forEach(location => {
              expect(location).toMatch(/^.+, .+$/)
            })
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should not include incomplete locations', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              city: fc.oneof(
                fc.string(),
                fc.constant(null),
                fc.constant(undefined),
                fc.constant('')
              ),
              state: fc.oneof(
                fc.string(),
                fc.constant(null),
                fc.constant(undefined),
                fc.constant('')
              )
            }),
            { minLength: 0, maxLength: 100 }
          ),
          (events) => {
            const result = getUniqueLocations(events)

            // All locations should have both city and state
            result.forEach(location => {
              const [city, state] = location.split(', ')
              expect(city).toBeTruthy()
              expect(state).toBeTruthy()
            })
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  /**
   * Property 5: Event Data Validation
   * 
   * **Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8**
   * 
   * Universal properties:
   * 1. Valid events with all required fields return true
   * 2. Events missing any required field return false
   * 3. Non-object values return false
   * 4. Null and undefined return false
   */
  describe('Property 5: Event Data Validation', () => {
    it('should validate complete event objects', () => {
      fc.assert(
        fc.property(
          fc.record({
            id: fc.integer(),
            event_name: fc.string(),
            event_type: fc.string(),
            description: fc.string(),
            city: fc.string(),
            state: fc.string(),
            venue_name: fc.string(),
            event_date: fc.string(),
            start_time: fc.string(),
            end_time: fc.string(),
            target_industries: fc.string(),
            target_audience: fc.string(),
            expected_footfall: fc.integer(),
            cover_image_url: fc.string(),
            status: fc.string(),
            is_featured: fc.boolean()
          }),
          (event) => {
            expect(validateEventData(event)).toBe(true)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should reject non-object values', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.string(),
            fc.integer(),
            fc.boolean(),
            fc.array(fc.string())
          ),
          (value) => {
            expect(validateEventData(value)).toBe(false)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should reject null and undefined', () => {
      expect(validateEventData(null)).toBe(false)
      expect(validateEventData(undefined)).toBe(false)
    })
  })
})
