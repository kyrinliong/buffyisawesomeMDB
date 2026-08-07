/**
 * INTEGRATION TESTS — Authentication Flow
 * Tests auth components within routing context: SignIn and Admin.
 *
 * @see TESTING.md for run instructions, dependency versions, and conventions.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import SignIn from '../pages/SignIn';
import Admin from '../pages/Admin';

// ── Mocks ──

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => Promise.resolve({ data: [], error: null })),
    })),
  })),
}));

// ── Helpers ──

function renderAtRoute(Component, route = '/') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/*" element={<Component />} />
      </Routes>
    </MemoryRouter>
  );
}

// ── Tests ──

describe('Authentication Integration', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  // ── Sign‑In Integration ──

  describe('Sign‑In Page', () => {
    it('renders the sign-in form', () => {
      renderAtRoute(SignIn, '/signin');
      expect(screen.getByText('Welcome to buffyisawesomeMDB')).toBeInTheDocument();
    });

    it('completes sign-in and shows welcome message', async () => {
      const user = userEvent.setup();
      renderAtRoute(SignIn, '/signin');

      await user.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(screen.getByText('Welcome back!')).toBeInTheDocument();
      });
      expect(screen.getByText('Redirecting you home...')).toBeInTheDocument();
    });

    it('has sign-up link pointing to /signin', () => {
      renderAtRoute(SignIn, '/signin');
      const signUpLink = screen.getByText('Sign up');
      expect(signUpLink).toBeInTheDocument();
      expect(signUpLink.closest('a')).toHaveAttribute('href', '/signin');
    });

    it('has pre-filled credentials', () => {
      renderAtRoute(SignIn, '/signin');
      expect(screen.getByPlaceholderText('you@example.com').value).toBe('kyrinliong');
      expect(screen.getByPlaceholderText('••••••••').value).toBe('buffyisawesome');
    });
  });

  // ── Admin Integration ──

  describe('Admin Page', () => {
    it('renders login form when not authenticated', () => {
      renderAtRoute(Admin, '/admin');
      expect(screen.getByText('CMS Access')).toBeInTheDocument();
      expect(screen.getByText('Sign in to manage your movie empire')).toBeInTheDocument();
    });

    it('shows error on wrong credentials', async () => {
      const user = userEvent.setup();
      renderAtRoute(Admin, '/admin');

      const usernameInput = screen.getByPlaceholderText('Username');
      const passwordInput = document.querySelector('input[type="password"]');

      await user.type(usernameInput, 'hacker');
      await user.type(passwordInput, 'wrong');

      const submitBtn = screen.getByRole('button', { name: /enter cms/i });
      await user.click(submitBtn);

      await waitFor(() => {
        expect(screen.getByText('Wrong credentials, darling! 💅')).toBeInTheDocument();
      });
    });

    it('authenticates with correct credentials', async () => {
      const user = userEvent.setup();
      renderAtRoute(Admin, '/admin');

      const usernameInput = screen.getByPlaceholderText('Username');
      const passwordInput = document.querySelector('input[type="password"]');

      await user.type(usernameInput, 'kyrinliong');
      await user.type(passwordInput, 'buffyisawesome');

      const submitBtn = screen.getByRole('button', { name: /enter cms/i });
      await user.click(submitBtn);

      await waitFor(() => {
        expect(screen.queryByText('CMS Access')).not.toBeInTheDocument();
      });
    });

    it('persists auth in sessionStorage after login', async () => {
      const user = userEvent.setup();
      renderAtRoute(Admin, '/admin');

      await user.type(screen.getByPlaceholderText('Username'), 'kyrinliong');
      await user.type(document.querySelector('input[type="password"]'), 'buffyisawesome');
      await user.click(screen.getByRole('button', { name: /enter cms/i }));

      await waitFor(() => {
        expect(sessionStorage.getItem('admin_auth')).toBe('true');
      });
    });
  });

  // ── Session Persistence ──

  describe('Session Persistence', () => {
    it('restores admin session from sessionStorage', () => {
      sessionStorage.setItem('admin_auth', 'true');
      renderAtRoute(Admin, '/admin');
      expect(screen.queryByText('CMS Access')).not.toBeInTheDocument();
    });

    it('shows login when sessionStorage is cleared', () => {
      sessionStorage.setItem('admin_auth', 'true');
      sessionStorage.clear();
      renderAtRoute(Admin, '/admin');
      expect(screen.getByText('CMS Access')).toBeInTheDocument();
    });
  });
});
