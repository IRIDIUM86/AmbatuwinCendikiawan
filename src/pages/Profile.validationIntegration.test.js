import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Profile from './Profile';

describe('Profile Component - Validation Integration (Task 2.9)', () => {
  describe('Form Submission Handler with Validation', () => {
    test('should call all validation functions and prevent submission when business_name is empty', async () => {
      // This test validates Requirements 1.11, 1.12, 5.4, 5.5
      render(<Profile />);
      
      // Find the Save Profile button
      const saveButton = screen.getByRole('button', { name: /save profile/i });
      
      // Submit the form without filling required fields
      fireEvent.click(saveButton);
      
      // Wait for validation errors to appear
      await waitFor(() => {
        expect(screen.getByText('Business name is required')).toBeInTheDocument();
        expect(screen.getByText('Business type is required')).toBeInTheDocument();
      });
    });

    test('should clear previous errors before new validation', async () => {
      // This test validates Requirement 5.6
      render(<Profile />);
      
      const businessNameInput = screen.getByLabelText(/business name/i);
      const businessTypeSelect = screen.getByLabelText(/business type/i);
      const saveButton = screen.getByRole('button', { name: /save profile/i });
      
      // First submission - trigger errors
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        expect(screen.getByText('Business name is required')).toBeInTheDocument();
      });
      
      // Fill in business_name but leave business_type empty
      fireEvent.change(businessNameInput, { target: { value: 'Test Business' } });
      
      // Second submission - should clear previous errors and show only business_type error
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        expect(screen.queryByText('Business name is required')).not.toBeInTheDocument();
        expect(screen.getByText('Business type is required')).toBeInTheDocument();
      });
    });

    test('should display email format validation errors on submission', async () => {
      // This test validates Requirements 1.13, 1.15, 5.3, 5.4
      render(<Profile />);
      
      const businessNameInput = screen.getByLabelText(/business name/i);
      const businessTypeSelect = screen.getByLabelText(/business type/i);
      const emailInput = screen.getByLabelText(/email/i);
      const saveButton = screen.getByRole('button', { name: /save profile/i });
      
      // Fill required fields
      fireEvent.change(businessNameInput, { target: { value: 'Test Business' } });
      fireEvent.change(businessTypeSelect, { target: { value: 'retail' } });
      
      // Enter invalid email (no @ symbol)
      fireEvent.change(emailInput, { target: { value: 'invalidemail.com' } });
      
      // Submit form
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        expect(screen.getByText(/email must contain @ with characters before and after/i)).toBeInTheDocument();
      });
    });

    test('should display website format validation errors on submission', async () => {
      // This test validates Requirements 1.14, 1.15, 5.4
      render(<Profile />);
      
      const businessNameInput = screen.getByLabelText(/business name/i);
      const businessTypeSelect = screen.getByLabelText(/business type/i);
      const websiteInput = screen.getByLabelText(/website/i);
      const saveButton = screen.getByRole('button', { name: /save profile/i });
      
      // Fill required fields
      fireEvent.change(businessNameInput, { target: { value: 'Test Business' } });
      fireEvent.change(businessTypeSelect, { target: { value: 'retail' } });
      
      // Enter invalid website (no protocol)
      fireEvent.change(websiteInput, { target: { value: 'www.example.com' } });
      
      // Submit form
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        expect(screen.getByText(/website must start with http:\/\/ or https:\/\//i)).toBeInTheDocument();
      });
    });

    test('should display field length validation errors on submission', async () => {
      // This test validates Requirements 2.3, 7.1, 7.3, 7.4, 7.5, 7.6, 7.13, 5.4
      render(<Profile />);
      
      const businessNameInput = screen.getByLabelText(/business name/i);
      const businessTypeSelect = screen.getByLabelText(/business type/i);
      const businessCategoryInput = screen.getByLabelText(/business category/i);
      const phoneInput = screen.getByLabelText(/phone/i);
      const saveButton = screen.getByRole('button', { name: /save profile/i });
      
      // Fill required fields
      fireEvent.change(businessNameInput, { target: { value: 'Test Business' } });
      fireEvent.change(businessTypeSelect, { target: { value: 'retail' } });
      
      // Enter values that exceed length constraints
      fireEvent.change(businessCategoryInput, { target: { value: 'a'.repeat(101) } });
      fireEvent.change(phoneInput, { target: { value: '123' } }); // Too short
      
      // Submit form
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        expect(screen.getByText(/business category must not exceed 100 characters/i)).toBeInTheDocument();
        expect(screen.getByText(/phone must be at least 10 characters/i)).toBeInTheDocument();
      });
    });

    test('should prevent submission and display multiple validation errors simultaneously', async () => {
      // This test validates Requirements 5.4, 5.5 - multiple errors at once
      render(<Profile />);
      
      const emailInput = screen.getByLabelText(/email/i);
      const websiteInput = screen.getByLabelText(/website/i);
      const saveButton = screen.getByRole('button', { name: /save profile/i });
      
      // Enter invalid values for multiple fields
      fireEvent.change(emailInput, { target: { value: 'invalidemail' } });
      fireEvent.change(websiteInput, { target: { value: 'invalidwebsite' } });
      
      // Submit form
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        // Should show errors for all invalid fields
        expect(screen.getByText('Business name is required')).toBeInTheDocument();
        expect(screen.getByText('Business type is required')).toBeInTheDocument();
        expect(screen.getByText(/email must contain @ with characters before and after/i)).toBeInTheDocument();
        expect(screen.getByText(/website must start with http:\/\/ or https:\/\//i)).toBeInTheDocument();
      });
    });

    test('should not display errors when all validations pass', async () => {
      // This test validates Requirement 5.6 - successful validation
      render(<Profile />);
      
      const businessNameInput = screen.getByLabelText(/business name/i);
      const businessTypeSelect = screen.getByLabelText(/business type/i);
      const emailInput = screen.getByLabelText(/email/i);
      const websiteInput = screen.getByLabelText(/website/i);
      const saveButton = screen.getByRole('button', { name: /save profile/i });
      
      // Fill all fields with valid data
      fireEvent.change(businessNameInput, { target: { value: 'Test Business' } });
      fireEvent.change(businessTypeSelect, { target: { value: 'retail' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(websiteInput, { target: { value: 'https://www.example.com' } });
      
      // Submit form
      fireEvent.click(saveButton);
      
      // Wait a bit to ensure no errors appear
      await waitFor(() => {
        expect(screen.queryByText(/is required/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/must contain/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/must start with/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/must not exceed/i)).not.toBeInTheDocument();
      }, { timeout: 1000 });
    });

    test('should validate all fields in correct order', async () => {
      // This test validates that all validation functions are called
      render(<Profile />);
      
      const businessNameInput = screen.getByLabelText(/business name/i);
      const businessTypeSelect = screen.getByLabelText(/business type/i);
      const businessCategoryInput = screen.getByLabelText(/business category/i);
      const emailInput = screen.getByLabelText(/email/i);
      const websiteInput = screen.getByLabelText(/website/i);
      const saveButton = screen.getByRole('button', { name: /save profile/i });
      
      // Create a scenario that triggers all validation types
      fireEvent.change(businessNameInput, { target: { value: 'a'.repeat(256) } }); // Too long
      fireEvent.change(businessTypeSelect, { target: { value: '' } }); // Empty
      fireEvent.change(businessCategoryInput, { target: { value: 'a'.repeat(101) } }); // Too long
      fireEvent.change(emailInput, { target: { value: 'invalidemail' } }); // Invalid format
      fireEvent.change(websiteInput, { target: { value: 'invalidwebsite' } }); // Invalid format
      
      // Submit form
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        // All validation errors should be displayed
        expect(screen.getByText(/business name must not exceed 255 characters/i)).toBeInTheDocument();
        expect(screen.getByText('Business type is required')).toBeInTheDocument();
        expect(screen.getByText(/business category must not exceed 100 characters/i)).toBeInTheDocument();
        expect(screen.getByText(/email must contain @ with characters before and after/i)).toBeInTheDocument();
        expect(screen.getByText(/website must start with http:\/\/ or https:\/\//i)).toBeInTheDocument();
      });
    });
  });
});
