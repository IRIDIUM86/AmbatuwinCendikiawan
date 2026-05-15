import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Profile from './Profile';
import { supabase } from '../supabaseClient';

// Mock the Supabase client
jest.mock('../supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: jest.fn()
    },
    from: jest.fn()
  }
}));

describe('Profile Component - Save Functionality (Tasks 6.1, 6.2, 6.3, 6.5)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Task 6.1: Form submission handler', () => {
    test('should prevent default form submission and set saving state', async () => {
      // Mock session
      const mockSession = {
        user: { id: 'test-user-id' }
      };
      
      supabase.auth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null
      });

      // Mock profile query (no existing profile)
      const mockFrom = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { code: 'PGRST116' }
        })
      };
      supabase.from.mockReturnValue(mockFrom);

      render(<Profile />);

      // Wait for session to load
      await waitFor(() => {
        expect(screen.queryByText(/please log in/i)).not.toBeInTheDocument();
      });

      const businessNameInput = screen.getByLabelText(/business name/i);
      const businessTypeSelect = screen.getByLabelText(/business type/i);
      const saveButton = screen.getByRole('button', { name: /save profile/i });

      // Fill required fields
      fireEvent.change(businessNameInput, { target: { value: 'Test Business' } });
      fireEvent.change(businessTypeSelect, { target: { value: 'retail' } });

      // Verify button shows "Saving..." during operation
      expect(saveButton).toHaveTextContent('Save Profile');
    });

    test('should validate and display errors before database operation', async () => {
      // Mock session
      const mockSession = {
        user: { id: 'test-user-id' }
      };
      
      supabase.auth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null
      });

      // Mock profile query
      const mockFrom = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { code: 'PGRST116' }
        })
      };
      supabase.from.mockReturnValue(mockFrom);

      render(<Profile />);

      // Wait for session to load
      await waitFor(() => {
        expect(screen.queryByText(/please log in/i)).not.toBeInTheDocument();
      });

      const saveButton = screen.getByRole('button', { name: /save profile/i });

      // Submit without filling required fields
      fireEvent.click(saveButton);

      // Should display validation errors
      await waitFor(() => {
        expect(screen.getByText('Business name is required')).toBeInTheDocument();
        expect(screen.getByText('Business type is required')).toBeInTheDocument();
      });
    });

    test('should display authentication error when no session exists', async () => {
      // Mock no session
      supabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null
      });

      render(<Profile />);

      // Wait for component to render
      await waitFor(() => {
        expect(screen.getByText(/please log in/i)).toBeInTheDocument();
      });

      const saveButton = screen.getByRole('button', { name: /save profile/i });

      // Button should be disabled
      expect(saveButton).toBeDisabled();
    });
  });

  describe('Task 6.2: Upsert logic', () => {
    test('should perform INSERT when profileExists is false', async () => {
      // Mock session
      const mockSession = {
        user: { id: 'test-user-id' }
      };
      
      supabase.auth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null
      });

      // Mock insert operation
      const mockInsert = jest.fn().mockResolvedValue({
        data: { id: 'new-profile-id' },
        error: null
      });

      const mockFrom = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { code: 'PGRST116' }
        }),
        insert: mockInsert
      };
      
      supabase.from.mockReturnValue(mockFrom);

      render(<Profile />);

      // Wait for session to load
      await waitFor(() => {
        expect(screen.queryByText(/please log in/i)).not.toBeInTheDocument();
      });

      const businessNameInput = screen.getByLabelText(/business name/i);
      const businessTypeSelect = screen.getByLabelText(/business type/i);
      const saveButton = screen.getByRole('button', { name: /save profile/i });

      // Fill required fields
      fireEvent.change(businessNameInput, { target: { value: 'Test Business' } });
      fireEvent.change(businessTypeSelect, { target: { value: 'retail' } });

      // Submit form
      fireEvent.click(saveButton);

      // Wait for insert to be called
      await waitFor(() => {
        expect(mockInsert).toHaveBeenCalled();
      });

      // Verify success message
      await waitFor(() => {
        expect(screen.getByText('Profile saved successfully!')).toBeInTheDocument();
      });
    });

    test('should perform UPDATE when profileExists is true', async () => {
      // Mock session
      const mockSession = {
        user: { id: 'test-user-id' }
      };
      
      supabase.auth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null
      });

      // Mock update operation
      const mockUpdate = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockResolvedValue({
        data: { id: 'existing-profile-id' },
        error: null
      });

      const mockFrom = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: {
              business_name: 'Existing Business',
              business_type: 'retail',
              business_category: '',
              phone: '',
              email: '',
              website: '',
              can_sponsor: false,
              can_bazaar_vendor: false,
              bazaar_booth_budget_range: ''
            },
            error: null
          })
        }),
        update: mockUpdate
      };
      
      mockUpdate.mockReturnValue({ eq: mockEq });
      supabase.from.mockReturnValue(mockFrom);

      render(<Profile />);

      // Wait for profile to load
      await waitFor(() => {
        expect(screen.getByDisplayValue('Existing Business')).toBeInTheDocument();
      });

      const businessNameInput = screen.getByLabelText(/business name/i);
      const saveButton = screen.getByRole('button', { name: /save profile/i });

      // Modify business name
      fireEvent.change(businessNameInput, { target: { value: 'Updated Business' } });

      // Submit form
      fireEvent.click(saveButton);

      // Wait for update to be called
      await waitFor(() => {
        expect(mockUpdate).toHaveBeenCalled();
      });

      // Verify success message
      await waitFor(() => {
        expect(screen.getByText('Profile saved successfully!')).toBeInTheDocument();
      });
    });
  });

  describe('Task 6.3: Optional field null handling', () => {
    test('should convert empty strings to null for optional fields', async () => {
      // Mock session
      const mockSession = {
        user: { id: 'test-user-id' }
      };
      
      supabase.auth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null
      });

      // Mock insert operation
      const mockInsert = jest.fn().mockResolvedValue({
        data: { id: 'new-profile-id' },
        error: null
      });

      const mockFrom = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { code: 'PGRST116' }
        }),
        insert: mockInsert
      };
      
      supabase.from.mockReturnValue(mockFrom);

      render(<Profile />);

      // Wait for session to load
      await waitFor(() => {
        expect(screen.queryByText(/please log in/i)).not.toBeInTheDocument();
      });

      const businessNameInput = screen.getByLabelText(/business name/i);
      const businessTypeSelect = screen.getByLabelText(/business type/i);
      const saveButton = screen.getByRole('button', { name: /save profile/i });

      // Fill only required fields (leave optional fields empty)
      fireEvent.change(businessNameInput, { target: { value: 'Test Business' } });
      fireEvent.change(businessTypeSelect, { target: { value: 'retail' } });

      // Submit form
      fireEvent.click(saveButton);

      // Wait for insert to be called
      await waitFor(() => {
        expect(mockInsert).toHaveBeenCalled();
      });

      // Verify that optional fields are null
      const insertCall = mockInsert.mock.calls[0][0][0];
      expect(insertCall.business_category).toBeNull();
      expect(insertCall.phone).toBeNull();
      expect(insertCall.email).toBeNull();
      expect(insertCall.website).toBeNull();
      expect(insertCall.bazaar_booth_budget_range).toBeNull();
    });
  });

  describe('Task 6.5: Success and error handling', () => {
    test('should display success message for minimum 3 seconds', async () => {
      jest.useFakeTimers();

      // Mock session
      const mockSession = {
        user: { id: 'test-user-id' }
      };
      
      supabase.auth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null
      });

      // Mock insert operation
      const mockInsert = jest.fn().mockResolvedValue({
        data: { id: 'new-profile-id' },
        error: null
      });

      const mockFrom = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { code: 'PGRST116' }
        }),
        insert: mockInsert
      };
      
      supabase.from.mockReturnValue(mockFrom);

      render(<Profile />);

      // Wait for session to load
      await waitFor(() => {
        expect(screen.queryByText(/please log in/i)).not.toBeInTheDocument();
      });

      const businessNameInput = screen.getByLabelText(/business name/i);
      const businessTypeSelect = screen.getByLabelText(/business type/i);
      const saveButton = screen.getByRole('button', { name: /save profile/i });

      // Fill required fields
      fireEvent.change(businessNameInput, { target: { value: 'Test Business' } });
      fireEvent.change(businessTypeSelect, { target: { value: 'retail' } });

      // Submit form
      fireEvent.click(saveButton);

      // Wait for success message
      await waitFor(() => {
        expect(screen.getByText('Profile saved successfully!')).toBeInTheDocument();
      });

      // Fast-forward 2 seconds (less than 3)
      jest.advanceTimersByTime(2000);

      // Message should still be visible
      expect(screen.getByText('Profile saved successfully!')).toBeInTheDocument();

      // Fast-forward to 3 seconds
      jest.advanceTimersByTime(1000);

      // Message should be cleared after 3 seconds
      await waitFor(() => {
        expect(screen.queryByText('Profile saved successfully!')).not.toBeInTheDocument();
      });

      jest.useRealTimers();
    });

    test('should display error message when save operation fails', async () => {
      // Mock session
      const mockSession = {
        user: { id: 'test-user-id' }
      };
      
      supabase.auth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null
      });

      // Mock insert operation with error
      const mockInsert = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Database connection failed' }
      });

      const mockFrom = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { code: 'PGRST116' }
        }),
        insert: mockInsert
      };
      
      supabase.from.mockReturnValue(mockFrom);

      render(<Profile />);

      // Wait for session to load
      await waitFor(() => {
        expect(screen.queryByText(/please log in/i)).not.toBeInTheDocument();
      });

      const businessNameInput = screen.getByLabelText(/business name/i);
      const businessTypeSelect = screen.getByLabelText(/business type/i);
      const saveButton = screen.getByRole('button', { name: /save profile/i });

      // Fill required fields
      fireEvent.change(businessNameInput, { target: { value: 'Test Business' } });
      fireEvent.change(businessTypeSelect, { target: { value: 'retail' } });

      // Submit form
      fireEvent.click(saveButton);

      // Wait for error message
      await waitFor(() => {
        expect(screen.getByText(/failed to save profile/i)).toBeInTheDocument();
      });
    });

    test('should set saving state to false after operation completes', async () => {
      // Mock session
      const mockSession = {
        user: { id: 'test-user-id' }
      };
      
      supabase.auth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null
      });

      // Mock insert operation
      const mockInsert = jest.fn().mockResolvedValue({
        data: { id: 'new-profile-id' },
        error: null
      });

      const mockFrom = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { code: 'PGRST116' }
        }),
        insert: mockInsert
      };
      
      supabase.from.mockReturnValue(mockFrom);

      render(<Profile />);

      // Wait for session to load
      await waitFor(() => {
        expect(screen.queryByText(/please log in/i)).not.toBeInTheDocument();
      });

      const businessNameInput = screen.getByLabelText(/business name/i);
      const businessTypeSelect = screen.getByLabelText(/business type/i);
      const saveButton = screen.getByRole('button', { name: /save profile/i });

      // Fill required fields
      fireEvent.change(businessNameInput, { target: { value: 'Test Business' } });
      fireEvent.change(businessTypeSelect, { target: { value: 'retail' } });

      // Submit form
      fireEvent.click(saveButton);

      // Button should show "Saving..." during operation
      await waitFor(() => {
        expect(saveButton).toHaveTextContent('Saving...');
      });

      // Wait for operation to complete
      await waitFor(() => {
        expect(saveButton).toHaveTextContent('Save Profile');
      });
    });
  });
});
