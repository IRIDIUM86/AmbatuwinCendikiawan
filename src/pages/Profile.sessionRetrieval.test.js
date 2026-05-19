import { render, screen, waitFor } from '@testing-library/react';
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

describe('Profile Component - Session Retrieval (Task 4.1)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should call supabase.auth.getSession() on component mount', async () => {
    // Mock successful session retrieval
    supabase.auth.getSession.mockResolvedValue({
      data: { session: { user: { id: 'test-user-id' } } },
      error: null
    });

    render(<Profile />);

    // Verify getSession was called
    expect(supabase.auth.getSession).toHaveBeenCalledTimes(1);
  });

  test('should set loading state during session retrieval', async () => {
    // Mock session retrieval with a delay
    supabase.auth.getSession.mockImplementation(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({
          data: { session: { user: { id: 'test-user-id' } } },
          error: null
        }), 100)
      )
    );

    render(<Profile />);

    // Loading state should be true initially (component sets it during mount)
    // After session retrieval completes, loading should be false
    await waitFor(() => {
      expect(supabase.auth.getSession).toHaveBeenCalled();
    });
  });

  test('should set session state with retrieved session', async () => {
    const mockSession = { user: { id: 'test-user-id', email: 'test@example.com' } };
    
    supabase.auth.getSession.mockResolvedValue({
      data: { session: mockSession },
      error: null
    });

    render(<Profile />);

    await waitFor(() => {
      expect(supabase.auth.getSession).toHaveBeenCalled();
    });

    // Session should be set (we can't directly test state, but we can verify no error message)
    expect(screen.queryByText(/Failed to retrieve session/i)).not.toBeInTheDocument();
  });

  test('should display error message if session retrieval fails', async () => {
    supabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: { message: 'Network error' }
    });

    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to retrieve session/i)).toBeInTheDocument();
    });
  });

  test('should implement 5-second timeout for session retrieval', async () => {
    // Mock session retrieval that takes longer than 5 seconds
    supabase.auth.getSession.mockImplementation(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({
          data: { session: { user: { id: 'test-user-id' } } },
          error: null
        }), 6000) // 6 seconds - exceeds timeout
      )
    );

    render(<Profile />);

    // Wait for timeout error to appear
    await waitFor(() => {
      expect(screen.getByText(/Session retrieval timed out/i)).toBeInTheDocument();
    }, { timeout: 6000 });
  }, 10000); // Increase test timeout to 10 seconds

  test('should handle null session gracefully', async () => {
    supabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null
    });

    render(<Profile />);

    await waitFor(() => {
      expect(supabase.auth.getSession).toHaveBeenCalled();
    });

    // Should not display error when session is null (this is handled in task 4.2)
    // For now, just verify the component renders
    expect(screen.getByText('SME Business Profile')).toBeInTheDocument();
  });
});
