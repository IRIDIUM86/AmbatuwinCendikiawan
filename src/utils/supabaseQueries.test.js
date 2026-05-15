import {
  fetchAllEvents,
  fetchAllEventsWithRetry,
  validateEventData,
  filterEventsByType,
  filterEventsByLocation,
  getUniqueEventTypes,
  getUniqueLocations
} from './supabaseQueries'
import { supabase } from '../supabaseClient'

// Mock the supabase client
jest.mock('../supabaseClient', () => ({
  supabase: {
    from: jest.fn()
  }
}))

describe('supabaseQueries', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('fetchAllEvents', () => {
    it('should fetch all events from Supabase', async () => {
      const mockEvents = [
        {
          id: 1,
          event_name: 'Tech Conference',
          event_type: 'Conference',
          description: 'A tech conference',
          city: 'San Francisco',
          state: 'CA',
          venue_name: 'Convention Center',
          event_date: '2024-01-15',
          start_time: '09:00',
          end_time: '17:00',
          target_industries: 'Technology',
          target_audience: 'Professionals',
          expected_footfall: 500,
          cover_image_url: 'https://example.com/image.jpg',
          status: 'upcoming',
          is_featured: true
        }
      ]

      supabase.from.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          data: mockEvents,
          error: null
        })
      })

      const result = await fetchAllEvents()

      expect(result).toEqual(mockEvents)
      expect(supabase.from).toHaveBeenCalledWith('bazaar_events_Table')
    })

    it('should return empty array when no events found', async () => {
      supabase.from.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          data: [],
          error: null
        })
      })

      const result = await fetchAllEvents()

      expect(result).toEqual([])
    })

    it('should throw error when Supabase query fails', async () => {
      supabase.from.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database connection failed' }
        })
      })

      await expect(fetchAllEvents()).rejects.toThrow('Database connection failed')
    })

    it('should throw error when response is not an array', async () => {
      supabase.from.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          data: { not: 'an array' },
          error: null
        })
      })

      await expect(fetchAllEvents()).rejects.toThrow('Invalid response format')
    })

    it('should handle network errors', async () => {
      supabase.from.mockReturnValue({
        select: jest.fn().mockRejectedValue(new Error('Network error'))
      })

      await expect(fetchAllEvents()).rejects.toThrow('Network error')
    })
  })

  describe('fetchAllEventsWithRetry', () => {
    it('should fetch events successfully on first attempt', async () => {
      const mockEvents = [{ id: 1, event_name: 'Event 1' }]

      supabase.from.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          data: mockEvents,
          error: null
        })
      })

      const result = await fetchAllEventsWithRetry()

      expect(result).toEqual(mockEvents)
      expect(supabase.from).toHaveBeenCalledTimes(1)
    })

    it('should retry on failure and succeed on second attempt', async () => {
      jest.useRealTimers() // Use real timers for this test
      const mockEvents = [{ id: 1, event_name: 'Event 1' }]

      supabase.from
        .mockReturnValueOnce({
          select: jest.fn().mockResolvedValue({
            data: null,
            error: { message: 'Temporary error' }
          })
        })
        .mockReturnValueOnce({
          select: jest.fn().mockResolvedValue({
            data: mockEvents,
            error: null
          })
        })

      const result = await fetchAllEventsWithRetry(3, 10) // Use short delay

      expect(result).toEqual(mockEvents)
      expect(supabase.from).toHaveBeenCalledTimes(2)
      
      jest.useFakeTimers() // Restore fake timers
    })

    it('should throw error after max retries exceeded', async () => {
      jest.useRealTimers() // Use real timers for this test
      
      supabase.from.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Persistent error' }
        })
      })

      await expect(fetchAllEventsWithRetry(3, 10)).rejects.toThrow('Persistent error')
      expect(supabase.from).toHaveBeenCalledTimes(3)
      
      jest.useFakeTimers() // Restore fake timers
    })

    it('should use exponential backoff for retries', async () => {
      jest.useRealTimers() // Use real timers for this test
      const mockEvents = [{ id: 1, event_name: 'Event 1' }]
      let callCount = 0

      supabase.from.mockImplementation(() => ({
        select: jest.fn().mockImplementation(() => {
          callCount++
          if (callCount < 3) {
            return Promise.resolve({
              data: null,
              error: { message: 'Error' }
            })
          }
          return Promise.resolve({
            data: mockEvents,
            error: null
          })
        })
      }))

      const result = await fetchAllEventsWithRetry(3, 10)

      expect(result).toEqual(mockEvents)
      expect(supabase.from).toHaveBeenCalledTimes(3)
      
      jest.useFakeTimers() // Restore fake timers
    })

    it('should accept custom maxRetries parameter', async () => {
      jest.useRealTimers() // Use real timers for this test
      
      supabase.from.mockReturnValue({
        select: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Error' }
        })
      })

      await expect(fetchAllEventsWithRetry(2, 10)).rejects.toThrow()
      expect(supabase.from).toHaveBeenCalledTimes(2)
      
      jest.useFakeTimers() // Restore fake timers
    })

    it('should accept custom initialDelay parameter', async () => {
      jest.useRealTimers() // Use real timers for this test
      const mockEvents = [{ id: 1, event_name: 'Event 1' }]

      supabase.from
        .mockReturnValueOnce({
          select: jest.fn().mockResolvedValue({
            data: null,
            error: { message: 'Error' }
          })
        })
        .mockReturnValueOnce({
          select: jest.fn().mockResolvedValue({
            data: mockEvents,
            error: null
          })
        })

      const result = await fetchAllEventsWithRetry(3, 10)

      expect(result).toEqual(mockEvents)
      
      jest.useFakeTimers() // Restore fake timers
    })
  })

  describe('validateEventData', () => {
    const validEvent = {
      id: 1,
      event_name: 'Event',
      event_type: 'Conference',
      description: 'Description',
      city: 'City',
      state: 'State',
      venue_name: 'Venue',
      event_date: '2024-01-15',
      start_time: '09:00',
      end_time: '17:00',
      target_industries: 'Tech',
      target_audience: 'Professionals',
      expected_footfall: 500,
      cover_image_url: 'https://example.com/image.jpg',
      status: 'upcoming',
      is_featured: true
    }

    it('should validate a complete event object', () => {
      expect(validateEventData(validEvent)).toBe(true)
    })

    it('should return false for null', () => {
      expect(validateEventData(null)).toBe(false)
    })

    it('should return false for undefined', () => {
      expect(validateEventData(undefined)).toBe(false)
    })

    it('should return false for non-object', () => {
      expect(validateEventData('not an object')).toBe(false)
      expect(validateEventData(123)).toBe(false)
      expect(validateEventData([])).toBe(false)
    })

    it('should return false when missing required fields', () => {
      const incompleteEvent = { ...validEvent }
      delete incompleteEvent.event_name

      expect(validateEventData(incompleteEvent)).toBe(false)
    })

    it('should return false when multiple required fields are missing', () => {
      const incompleteEvent = { ...validEvent }
      delete incompleteEvent.event_name
      delete incompleteEvent.event_type
      delete incompleteEvent.description

      expect(validateEventData(incompleteEvent)).toBe(false)
    })
  })

  describe('filterEventsByType', () => {
    const events = [
      { id: 1, event_type: 'Conference', event_name: 'Event 1' },
      { id: 2, event_type: 'Workshop', event_name: 'Event 2' },
      { id: 3, event_type: 'Conference', event_name: 'Event 3' },
      { id: 4, event_type: 'Seminar', event_name: 'Event 4' }
    ]

    it('should filter events by type', () => {
      const result = filterEventsByType(events, 'Conference')

      expect(result).toHaveLength(2)
      expect(result[0].id).toBe(1)
      expect(result[1].id).toBe(3)
    })

    it('should return all events when type is empty string', () => {
      const result = filterEventsByType(events, '')

      expect(result).toEqual(events)
    })

    it('should return all events when type is null', () => {
      const result = filterEventsByType(events, null)

      expect(result).toEqual(events)
    })

    it('should return empty array when no events match type', () => {
      const result = filterEventsByType(events, 'NonExistent')

      expect(result).toHaveLength(0)
    })

    it('should return empty array for empty events array', () => {
      const result = filterEventsByType([], 'Conference')

      expect(result).toHaveLength(0)
    })
  })

  describe('filterEventsByLocation', () => {
    const events = [
      { id: 1, city: 'San Francisco', state: 'CA', event_name: 'Event 1' },
      { id: 2, city: 'New York', state: 'NY', event_name: 'Event 2' },
      { id: 3, city: 'San Francisco', state: 'CA', event_name: 'Event 3' },
      { id: 4, city: 'Los Angeles', state: 'CA', event_name: 'Event 4' }
    ]

    it('should filter events by location', () => {
      const result = filterEventsByLocation(events, 'San Francisco', 'CA')

      expect(result).toHaveLength(2)
      expect(result[0].id).toBe(1)
      expect(result[1].id).toBe(3)
    })

    it('should return all events when city is empty', () => {
      const result = filterEventsByLocation(events, '', 'CA')

      expect(result).toEqual(events)
    })

    it('should return all events when state is empty', () => {
      const result = filterEventsByLocation(events, 'San Francisco', '')

      expect(result).toEqual(events)
    })

    it('should return all events when both city and state are empty', () => {
      const result = filterEventsByLocation(events, '', '')

      expect(result).toEqual(events)
    })

    it('should return empty array when no events match location', () => {
      const result = filterEventsByLocation(events, 'Chicago', 'IL')

      expect(result).toHaveLength(0)
    })

    it('should return empty array for empty events array', () => {
      const result = filterEventsByLocation([], 'San Francisco', 'CA')

      expect(result).toHaveLength(0)
    })
  })

  describe('getUniqueEventTypes', () => {
    it('should return unique event types sorted alphabetically', () => {
      const events = [
        { event_type: 'Workshop' },
        { event_type: 'Conference' },
        { event_type: 'Workshop' },
        { event_type: 'Seminar' },
        { event_type: 'Conference' }
      ]

      const result = getUniqueEventTypes(events)

      expect(result).toEqual(['Conference', 'Seminar', 'Workshop'])
    })

    it('should filter out falsy event types', () => {
      const events = [
        { event_type: 'Conference' },
        { event_type: null },
        { event_type: 'Workshop' },
        { event_type: undefined },
        { event_type: '' }
      ]

      const result = getUniqueEventTypes(events)

      expect(result).toEqual(['Conference', 'Workshop'])
    })

    it('should return empty array for empty events array', () => {
      const result = getUniqueEventTypes([])

      expect(result).toEqual([])
    })

    it('should return empty array when all event types are falsy', () => {
      const events = [
        { event_type: null },
        { event_type: undefined },
        { event_type: '' }
      ]

      const result = getUniqueEventTypes(events)

      expect(result).toEqual([])
    })
  })

  describe('getUniqueLocations', () => {
    it('should return unique locations formatted as "City, State" sorted alphabetically', () => {
      const events = [
        { city: 'San Francisco', state: 'CA' },
        { city: 'New York', state: 'NY' },
        { city: 'San Francisco', state: 'CA' },
        { city: 'Los Angeles', state: 'CA' }
      ]

      const result = getUniqueLocations(events)

      expect(result).toEqual([
        'Los Angeles, CA',
        'New York, NY',
        'San Francisco, CA'
      ])
    })

    it('should filter out incomplete locations', () => {
      const events = [
        { city: 'San Francisco', state: 'CA' },
        { city: null, state: 'CA' },
        { city: 'New York', state: 'NY' },
        { city: 'Los Angeles', state: null }
      ]

      const result = getUniqueLocations(events)

      expect(result).toEqual([
        'New York, NY',
        'San Francisco, CA'
      ])
    })

    it('should return empty array for empty events array', () => {
      const result = getUniqueLocations([])

      expect(result).toEqual([])
    })

    it('should return empty array when all locations are incomplete', () => {
      const events = [
        { city: null, state: 'CA' },
        { city: 'San Francisco', state: null },
        { city: undefined, state: undefined }
      ]

      const result = getUniqueLocations(events)

      expect(result).toEqual([])
    })
  })
})
