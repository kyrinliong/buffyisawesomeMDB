/**
 * UNIT TESTS — SignIn Component
 * Tests rendering, form interaction, and auth state transitions.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import SignIn from '../pages/SignIn';

// ── Mocks ──

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// ── Helpers ──

function renderSignIn() {
  return render(
    <MemoryRouter>
      <SignIn />
    </MemoryRouter>
  );
}

// ── Tests ──

describe('SignIn Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  // ── Rendering ──

  describe('Rendering', () => {
    it('renders the sign-in form with heading', () => {
      renderSignIn();
      expect(screen.getByText('Welcome to buffyisawesomeMDB')).toBeInTheDocument();
    });

    it('renders email/username input', () => {
      renderSignIn();
      expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
    });

    it('renders password input', () => {
      renderSignIn();
      expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    });

    it('renders the sign-in button', () => {
      renderSignIn();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('renders the sign-up link', () => {
      renderSignIn();
      expect(screen.getByText('Sign up')).toBeInTheDocument();
    });

    it('pre-fills email field with default value "kyrinliong"', () => {
      renderSignIn();
      const emailInput = screen.getByPlaceholderText('you@example.com');
      expect(emailInput.value).toBe('kyrinliong');
    });

    it('pre-fills password field with default value "buffyisawesome"', () => {
      renderSignIn();
      const passwordInput = screen.getByPlaceholderText('••••••••');
      expect(passwordInput.value).toBe('buffyisawesome');
    });
  });

  // ── Form Interaction ──

  describe('Form Interaction', () => {
    it('updates email value on user input', async () => {
      const user = userEvent.setup();
      renderSignIn();
      const input = screen.getByPlaceholderText('you@example.com');
      await user.clear(input);
      await user.type(input, 'test@test.com');
      expect(input.value).toBe('test@test.com');
    });

    it('updates password value on user input', async () => {
      const user = userEvent.setup();
      renderSignIn();
      const input = screen.getByPlaceholderText('••••••••');
      await user.clear(input);
      await user.type(input, 'newpassword');
      expect(input.value).toBe('newpassword');
    });

    it('shows welcome message after successful sign-in', async () => {
      const user = userEvent.setup();
      renderSignIn();
      await user.click(screen.getByRole('button', { name: /sign in/i }));
      await waitFor(() => {
        expect(screen.getByText('Welcome back!')).toBeInTheDocument();
      });
      expect(screen.getByText('Redirecting you home...')).toBeInTheDocument();
    });

    it('hides the form after successful sign-in', async () => {
      const user = userEvent.setup();
      renderSignIn();
      await user.click(screen.getByRole('button', { name: /sign in/i }));
      await waitFor(() => {
        expect(screen.queryByText('Welcome to buffyisawesomeMDB')).not.toBeInTheDocument();
      });
    });

    it('navigates to home after 1.5 second delay', async () => {
      vi.useFakeTimers();
      renderSignIn();

      // Click the sign-in button directly with fireEvent (avoids userEvent timer issues)
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

      expect(mockNavigate).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(1500);
      });
      expect(mockNavigate).toHaveBeenCalledWith('/');
      expect(mockNavigate).toHaveBeenCalledTimes(1);
      vi.useRealTimers();
    });
  });

  // ── Edge Cases ──

  describe('Edge Cases', () => {
    it('renders the 🌸 emoji decoration', () => {
      renderSignIn();
      const emojis = screen.getAllByText('🌸');
      expect(emojis.length).toBeGreaterThanOrEqual(1);
    });

    it('has required attribute on both inputs', () => {
      renderSignIn();
      expect(screen.getByPlaceholderText('you@example.com')).toBeRequired();
      expect(screen.getByPlaceholderText('••••••••')).toBeRequired();
    });

    it('password input has type="password"', () => {
      renderSignIn();
      expect(screen.getByPlaceholderText('••••••••')).toHaveAttribute('type', 'password');
    });
  });
});
