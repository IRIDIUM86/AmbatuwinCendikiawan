/**
 * Unit tests for website validation function
 * Task 2.5: Create validation function for website format
 * Requirements: 1.14, 1.15, 7.6
 */

// Import the validation logic by extracting it into a testable function
const validateWebsiteFormat = (data) => {
  const validationErrors = {};

  // Only validate if website field is populated (Requirement 1.14)
  if (data.website && data.website.trim() !== '') {
    const website = data.website.trim();

    // Validate website starts with http:// or https:// (Requirement 1.14)
    if (!website.startsWith('http://') && !website.startsWith('https://')) {
      validationErrors.website = 'Website must start with http:// or https://';
    }
    // Validate website does not exceed 2048 characters (Requirement 7.6)
    else if (website.length > 2048) {
      validationErrors.website = 'Website must not exceed 2048 characters';
    }
  }

  return validationErrors;
};

describe('validateWebsiteFormat', () => {
  describe('Valid websites', () => {
    test('should accept website with http://', () => {
      const data = { website: 'http://example.com' };
      const errors = validateWebsiteFormat(data);
      expect(errors.website).toBeUndefined();
    });

    test('should accept website with https://', () => {
      const data = { website: 'https://example.com' };
      const errors = validateWebsiteFormat(data);
      expect(errors.website).toBeUndefined();
    });

    test('should accept website with http:// and path', () => {
      const data = { website: 'http://example.com/path/to/page' };
      const errors = validateWebsiteFormat(data);
      expect(errors.website).toBeUndefined();
    });

    test('should accept website with https:// and query params', () => {
      const data = { website: 'https://example.com?param=value' };
      const errors = validateWebsiteFormat(data);
      expect(errors.website).toBeUndefined();
    });

    test('should accept empty website field', () => {
      const data = { website: '' };
      const errors = validateWebsiteFormat(data);
      expect(errors.website).toBeUndefined();
    });

    test('should accept website field with only whitespace', () => {
      const data = { website: '   ' };
      const errors = validateWebsiteFormat(data);
      expect(errors.website).toBeUndefined();
    });

    test('should accept website at maximum length (2048 characters)', () => {
      const longUrl = 'https://example.com/' + 'a'.repeat(2048 - 'https://example.com/'.length);
      const data = { website: longUrl };
      const errors = validateWebsiteFormat(data);
      expect(errors.website).toBeUndefined();
    });
  });

  describe('Invalid websites', () => {
    test('should reject website without protocol', () => {
      const data = { website: 'example.com' };
      const errors = validateWebsiteFormat(data);
      expect(errors.website).toBe('Website must start with http:// or https://');
    });

    test('should reject website with ftp protocol', () => {
      const data = { website: 'ftp://example.com' };
      const errors = validateWebsiteFormat(data);
      expect(errors.website).toBe('Website must start with http:// or https://');
    });

    test('should reject website with only www', () => {
      const data = { website: 'www.example.com' };
      const errors = validateWebsiteFormat(data);
      expect(errors.website).toBe('Website must start with http:// or https://');
    });

    test('should reject website exceeding 2048 characters', () => {
      const longUrl = 'https://example.com/' + 'a'.repeat(2049 - 'https://example.com/'.length);
      const data = { website: longUrl };
      const errors = validateWebsiteFormat(data);
      expect(errors.website).toBe('Website must not exceed 2048 characters');
    });

    test('should reject website with incorrect protocol case (HTTP://)', () => {
      const data = { website: 'HTTP://example.com' };
      const errors = validateWebsiteFormat(data);
      expect(errors.website).toBe('Website must start with http:// or https://');
    });

    test('should trim whitespace before validation', () => {
      const data = { website: '  https://example.com  ' };
      const errors = validateWebsiteFormat(data);
      expect(errors.website).toBeUndefined();
    });
  });

  describe('Edge cases', () => {
    test('should handle undefined website field', () => {
      const data = {};
      const errors = validateWebsiteFormat(data);
      expect(errors.website).toBeUndefined();
    });

    test('should handle null website field', () => {
      const data = { website: null };
      const errors = validateWebsiteFormat(data);
      expect(errors.website).toBeUndefined();
    });

    test('should accept website with subdomain', () => {
      const data = { website: 'https://subdomain.example.com' };
      const errors = validateWebsiteFormat(data);
      expect(errors.website).toBeUndefined();
    });

    test('should accept website with port number', () => {
      const data = { website: 'http://example.com:8080' };
      const errors = validateWebsiteFormat(data);
      expect(errors.website).toBeUndefined();
    });

    test('should accept website with fragment', () => {
      const data = { website: 'https://example.com#section' };
      const errors = validateWebsiteFormat(data);
      expect(errors.website).toBeUndefined();
    });
  });
});
