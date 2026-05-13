import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Profile from './Profile';
import { supabase } from '../supabaseClient';

// Mock the Supabase client
jest.mock('../supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: jest.fn()
    }
  }
}));

describe('Profile Component - Missing or Expired Session Handling (Task 4.2)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should display login prompt message when session is null', async () => {
    // Mock session retrieval returning null session (Requirement 6.2)
    supabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null
    });

    render(<Profile />);

    // Wait for session retrieval to complete and loading to be false
    await waitFor(() => {
      expect(supabase.auth.getSession).toHaveBeenCalled();
    });

    // Verify login prompt is displayed (Requirement 6.2)
    await waitFor(() => {
      expect(screen.getByText(/Please log in to create or edit your profile/i)).toBeInTheDocument();
    });
  });

  test('should display login prompt message when session is undefined', async () => {
    // Mock session retrieval returning undefined session (Requirement 6.2)
    supabase.auth.getSession.mockResolvedValue({
      data: { session: undefined },
      error: null
    });

    render(<Profile />);

    // Wait for session retrieval to complete
    await waitFor(() => {
      expect(supabase.auth.getSession).toHaveBeenCalled();
    });

    // Verify login prompt is displayed (Requirement 6.2)
    await waitFor(() => {
      expect(screen.getByText(/Please log in to create or edit your profile/i)).toBeInTheDocument();
    });
  });

  test('should disable all form inputs when no session exists', async () => {
    // Mock session retrieval returning null session (Requirement 6.3)
    supabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null
    });

    render(<Profile />);

    // Wait for session retrieval to complete
    await waitFor(() => {
      expect(supabase.auth.getSession).toHaveBeenCalled();
    });

    // Verify all text inputs are disabled (Requirement 6.3)
    expect(screen.getByLabelText(/Business Name/i)).toBeDisabled();
    expect(screen.getByLabelText(/Business Type/i)).toBeDisabled();
    expect(screen.getByLabelText(/Business Category/i)).toBeDisabled();
    expect(screen.getByLabelText(/Phone/i)).toBeDisabled();
    expect(screen.getByLabelText(/Email/i)).toBeDisabled();
    expect(screen.getByLabelText(/Website/i)).toBeDisabled();
    
    // Verify checkboxes are disabled (Requirement 6.3)
    expect(screen.getByLabelText(/Available to sponsor events/i)).toBeDisabled();
    expect(screen.getByLabelText(/Available as bazaar vendor/i)).toBeDisabled();
    
    // Verify dropdown is disabled (Requirement 6.3)
    expect(screen.getByLabelText(/Bazaar Booth Budget Range/i)).toBeDisabled();
  });

  test('should disable Save button when no session exists', async () => {
    // Mock session retrieval returning null session (Requirement 6.3)
    supabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null
    });

    render(<Profile />);

    // Wait for session retrieval to complete
    await waitFor(() => {
      expect(supabase.auth.getSession).toHaveBeenCalled();
    });

    // Verify Save Profile button is disabled (Requirement 6.3)
    const saveButton = screen.getByRole('button', { name: /Save Profile/i });
    expect(saveButton).toBeDisabled();
  });

  test('should display error message if session retrieval fails', async () => {
    // Mock session retrieval failure (Requirement 6.4)
    supabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: { message: 'Authentication service unavailable' }
    });

    render(<Profile />);

    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText(/Failed to retrieve session/i)).toBeInTheDocument();
    });
  });

  test('should display timeout error if session retrieval exceeds 5 seconds', async () => {
    // Mock session retrieval that takes longer than 5 seconds (Requirement 3.6)
    supabase.auth.getSession.mockImplementation(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({
          data: { session: { user: { id: 'test-user-id' } } },
          error: null
        }), 6000) // 6 seconds - exceeds 5 second timeout
      )
    );

    render(<Profile />);

    // Wait for timeout error to appear (Requirement 3.6)
    await waitFor(() => {
      expect(screen.getByText(/Session retrieval timed out/i)).toBeInTheDocument();
    }, { timeout: 6000 });
  }, 10000); // Increase test timeout to 10 seconds

  test('should enable form inputs when session exists', async () => {
    // Mock successful session retrieval
    const mockSession = { user: { id: 'test-user-id', email: 'test@example.com' } };
    
    supabase.auth.getSession.mockResolvedValue({
      data: { session: mockSession },
      error: null
    });

    render(<Profile />);

    // Wait for session retrieval to complete and session to be set
    await waitFor(() => {
      expect(supabase.auth.getSession).toHaveBeenCalled();
    });

    // Wait for form inputs to be enabled
    await waitFor(() => {
      expect(screen.getByLabelText(/Business Name/i)).not.toBeDisabled();
    });

    // Verify form inputs are NOT disabled when session exists
    expect(screen.getByLabelText(/Business Type/i)).not.toBeDisabled();
    expect(screen.getByRole('button', { name: /Save Profile/i })).not.toBeDisabled();
  });

  test('should not display login prompt when session exists', async () => {
    // Mock successful session retrieval
    const mockSession = { user: { id: 'test-user-id', email: 'test@example.com' } };
    
    supabase.auth.getSession.mockResolvedValue({
      data: { session: mockSession },
      error: null
    });

    render(<Profile />);

    // Wait for session retrieval to complete
    await waitFor(() => {
      expect(supabase.auth.getSession).toHaveBeenCalled();
    });

    // Verify login prompt is NOT displayed when session exists
    expect(screen.queryByText(/Please log in to create or edit your profile/i)).not.toBeInTheDocument();
  });

  test('should not display login prompt while loading', async () => {
    // Mock session retrieval with a delay
    supabase.auth.getSession.mockImplementation(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({
          data: { session: null },
          error: null
        }), 100)
      )
    );

    render(<Profile />);

    // Login prompt should not be displayed while loading
    expect(screen.queryByText(/Please log in to create or edit your profile/i)).not.toBeInTheDocument();

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByText(/Please log in to create or edit your profile/i)).toBeInTheDocument();
    });
  });
});
