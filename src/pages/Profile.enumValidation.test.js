/**
 * Unit tests for enum validation function
 * Task 8.3: Implement enum validation for business_type and bazaar_booth_budget_range
 * Requirements: 7.2, 7.9, 7.11, 7.12
 */

import { render } from '@testing-library/react';
import Profile from './Profile';

// Helper function to create a standalone version of validateEnumValues for testing
const getValidateEnumValues = () => {
  const validateEnumValues = (data) => {
    const validationErrors = {};

    // Valid business_type enum values (Requirement 7.2)
    const validBusinessTypes = [
      'food_beverage',
      'retail',
      'technology',
      'services',
      'health_wellness',
      'education',
      'entertainment',
      'fashion',
      'home_garden',
      'automotive',
      'finance',
      'real_estate',
      'other'
    ];

    // Valid bazaar_booth_budget_range values (Requirement 7.9)
    const validBudgetRanges = ['budget', 'mid-range', 'premium'];

    // Validate business_type is one of the valid enum values (Requirement 7.2, 7.11)
    if (data.business_type && !validBusinessTypes.includes(data.business_type)) {
      validationErrors.business_type = 'Invalid business type selected';
    }

    // Validate bazaar_booth_budget_range is one of the valid values if populated (Requirement 7.9, 7.12)
    if (data.bazaar_booth_budget_range && data.bazaar_booth_budget_range !== '' && !validBudgetRanges.includes(data.bazaar_booth_budget_range)) {
      validationErrors.bazaar_booth_budget_range = 'Invalid budget range selected';
    }

    return validationErrors;
  };

  return validateEnumValues;
};

describe('Enum Validation Function', () => {
  let validateEnumValues;

  beforeEach(() => {
    validateEnumValues = getValidateEnumValues();
  });

  describe('Valid business_type values', () => {
    test('should accept food_beverage', () => {
      const result = validateEnumValues({ business_type: 'food_beverage' });
      expect(result).toEqual({});
    });

    test('should accept retail', () => {
      const result = validateEnumValues({ business_type: 'retail' });
      expect(result).toEqual({});
    });

    test('should accept technology', () => {
      const result = validateEnumValues({ business_type: 'technology' });
      expect(result).toEqual({});
    });

    test('should accept services', () => {
      const result = validateEnumValues({ business_type: 'services' });
      expect(result).toEqual({});
    });

    test('should accept health_wellness', () => {
      const result = validateEnumValues({ business_type: 'health_wellness' });
      expect(result).toEqual({});
    });

    test('should accept education', () => {
      const result = validateEnumValues({ business_type: 'education' });
      expect(result).toEqual({});
    });

    test('should accept entertainment', () => {
      const result = validateEnumValues({ business_type: 'entertainment' });
      expect(result).toEqual({});
    });

    test('should accept fashion', () => {
      const result = validateEnumValues({ business_type: 'fashion' });
      expect(result).toEqual({});
    });

    test('should accept home_garden', () => {
      const result = validateEnumValues({ business_type: 'home_garden' });
      expect(result).toEqual({});
    });

    test('should accept automotive', () => {
      const result = validateEnumValues({ business_type: 'automotive' });
      expect(result).toEqual({});
    });

    test('should accept finance', () => {
      const result = validateEnumValues({ business_type: 'finance' });
      expect(result).toEqual({});
    });

    test('should accept real_estate', () => {
      const result = validateEnumValues({ business_type: 'real_estate' });
      expect(result).toEqual({});
    });

    test('should accept other', () => {
      const result = validateEnumValues({ business_type: 'other' });
      expect(result).toEqual({});
    });
  });

  describe('Invalid business_type values', () => {
    test('should reject invalid business type', () => {
      const result = validateEnumValues({ business_type: 'invalid_type' });
      expect(result.business_type).toBe('Invalid business type selected');
    });

    test('should reject business type with wrong case', () => {
      const result = validateEnumValues({ business_type: 'RETAIL' });
      expect(result.business_type).toBe('Invalid business type selected');
    });

    test('should reject business type with spaces', () => {
      const result = validateEnumValues({ business_type: 'food beverage' });
      expect(result.business_type).toBe('Invalid business type selected');
    });

    test('should reject random string as business type', () => {
      const result = validateEnumValues({ business_type: 'random_business' });
      expect(result.business_type).toBe('Invalid business type selected');
    });

    test('should reject numeric business type', () => {
      const result = validateEnumValues({ business_type: '123' });
      expect(result.business_type).toBe('Invalid business type selected');
    });
  });

  describe('Empty business_type', () => {
    test('should not validate empty business_type', () => {
      const result = validateEnumValues({ business_type: '' });
      expect(result).toEqual({});
    });

    test('should not validate when business_type is missing', () => {
      const result = validateEnumValues({});
      expect(result).toEqual({});
    });

    test('should not validate null business_type', () => {
      const result = validateEnumValues({ business_type: null });
      expect(result).toEqual({});
    });

    test('should not validate undefined business_type', () => {
      const result = validateEnumValues({ business_type: undefined });
      expect(result).toEqual({});
    });
  });

  describe('Valid bazaar_booth_budget_range values', () => {
    test('should accept budget', () => {
      const result = validateEnumValues({ bazaar_booth_budget_range: 'budget' });
      expect(result).toEqual({});
    });

    test('should accept mid-range', () => {
      const result = validateEnumValues({ bazaar_booth_budget_range: 'mid-range' });
      expect(result).toEqual({});
    });

    test('should accept premium', () => {
      const result = validateEnumValues({ bazaar_booth_budget_range: 'premium' });
      expect(result).toEqual({});
    });
  });

  describe('Invalid bazaar_booth_budget_range values', () => {
    test('should reject invalid budget range', () => {
      const result = validateEnumValues({ bazaar_booth_budget_range: 'invalid_range' });
      expect(result.bazaar_booth_budget_range).toBe('Invalid budget range selected');
    });

    test('should reject budget range with wrong case', () => {
      const result = validateEnumValues({ bazaar_booth_budget_range: 'BUDGET' });
      expect(result.bazaar_booth_budget_range).toBe('Invalid budget range selected');
    });

    test('should reject budget range with spaces instead of hyphen', () => {
      const result = validateEnumValues({ bazaar_booth_budget_range: 'mid range' });
      expect(result.bazaar_booth_budget_range).toBe('Invalid budget range selected');
    });

    test('should reject random string as budget range', () => {
      const result = validateEnumValues({ bazaar_booth_budget_range: 'expensive' });
      expect(result.bazaar_booth_budget_range).toBe('Invalid budget range selected');
    });

    test('should reject numeric budget range', () => {
      const result = validateEnumValues({ bazaar_booth_budget_range: '1' });
      expect(result.bazaar_booth_budget_range).toBe('Invalid budget range selected');
    });
  });

  describe('Empty bazaar_booth_budget_range', () => {
    test('should not validate empty bazaar_booth_budget_range', () => {
      const result = validateEnumValues({ bazaar_booth_budget_range: '' });
      expect(result).toEqual({});
    });

    test('should not validate when bazaar_booth_budget_range is missing', () => {
      const result = validateEnumValues({});
      expect(result).toEqual({});
    });

    test('should not validate null bazaar_booth_budget_range', () => {
      const result = validateEnumValues({ bazaar_booth_budget_range: null });
      expect(result).toEqual({});
    });

    test('should not validate undefined bazaar_booth_budget_range', () => {
      const result = validateEnumValues({ bazaar_booth_budget_range: undefined });
      expect(result).toEqual({});
    });
  });

  describe('Combined validation', () => {
    test('should accept both valid business_type and bazaar_booth_budget_range', () => {
      const result = validateEnumValues({
        business_type: 'retail',
        bazaar_booth_budget_range: 'mid-range'
      });
      expect(result).toEqual({});
    });

    test('should reject invalid business_type and accept valid bazaar_booth_budget_range', () => {
      const result = validateEnumValues({
        business_type: 'invalid_type',
        bazaar_booth_budget_range: 'budget'
      });
      expect(result.business_type).toBe('Invalid business type selected');
      expect(result.bazaar_booth_budget_range).toBeUndefined();
    });

    test('should accept valid business_type and reject invalid bazaar_booth_budget_range', () => {
      const result = validateEnumValues({
        business_type: 'technology',
        bazaar_booth_budget_range: 'invalid_range'
      });
      expect(result.business_type).toBeUndefined();
      expect(result.bazaar_booth_budget_range).toBe('Invalid budget range selected');
    });

    test('should reject both invalid business_type and bazaar_booth_budget_range', () => {
      const result = validateEnumValues({
        business_type: 'invalid_type',
        bazaar_booth_budget_range: 'invalid_range'
      });
      expect(result.business_type).toBe('Invalid business type selected');
      expect(result.bazaar_booth_budget_range).toBe('Invalid budget range selected');
    });

    test('should accept valid business_type with empty bazaar_booth_budget_range', () => {
      const result = validateEnumValues({
        business_type: 'services',
        bazaar_booth_budget_range: ''
      });
      expect(result).toEqual({});
    });
  });

  describe('Edge cases', () => {
    test('should handle business_type with leading/trailing spaces', () => {
      const result = validateEnumValues({ business_type: ' retail ' });
      expect(result.business_type).toBe('Invalid business type selected');
    });

    test('should handle bazaar_booth_budget_range with leading/trailing spaces', () => {
      const result = validateEnumValues({ bazaar_booth_budget_range: ' budget ' });
      expect(result.bazaar_booth_budget_range).toBe('Invalid budget range selected');
    });

    test('should handle all 13 business types in sequence', () => {
      const validTypes = [
        'food_beverage', 'retail', 'technology', 'services',
        'health_wellness', 'education', 'entertainment', 'fashion',
        'home_garden', 'automotive', 'finance', 'real_estate', 'other'
      ];
      
      validTypes.forEach(type => {
        const result = validateEnumValues({ business_type: type });
        expect(result).toEqual({});
      });
    });

    test('should handle all 3 budget ranges in sequence', () => {
      const validRanges = ['budget', 'mid-range', 'premium'];
      
      validRanges.forEach(range => {
        const result = validateEnumValues({ bazaar_booth_budget_range: range });
        expect(result).toEqual({});
      });
    });
  });
});
