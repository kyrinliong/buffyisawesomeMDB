/**
 * INTEGRATION TESTS — Authentication Flow
 * Tests auth across multiple components: SignIn → Home, Admin login → dashboard → logout.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

// Mock supabase for all data-fetching components
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        not: vi.fn(() => ({
          order: vi.fn(() => ({
            limit: vi.fn(() =>
              Promise.resolve({ data: [], error: null })
            ),
          })),
        })),
        gte: vi.fn(() => ({
          order: vi.fn(() => ({
            limit: vi.fn(() =>
              Promise.resolve({ data: [], error: null })
            ),
          })),
        })),
        eq: vi.fn(() => ({
          order: vi.fn(() =>
            Promise.resolve({ data: [], error: null })
          ),
        })),
        order: vi.fn(() => ({
          limit: vi.fn(() =>
            Promise.resolve({ data: [], error: null })
          ),
        })),
      })),
    })),
  })),
}));

// ── Helpers ──

function renderApp(initialRoute = '/') {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <App />
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

  // ── Sign‑In Flow ──

  describe('Sign‑In Page Flow', () => {
    it('renders the sign-in page at /signin route', () => {
      renderApp('/signin');
      expect(screen.getByText('Welcome to buffyisawesomeMDB')).toBeInTheDocument();
    });

    it('completes sign-in and shows welcome message', async () => {
      const user = userEvent.setup();
      renderApp('/signin');

      await user.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(screen.getByText('Welcome back!')).toBeInTheDocument();
      });
      expect(screen.getByText('Redirecting you home...')).toBeInTheDocument();
    });

    it('SignIn page has navigation link back to sign in (sign up link)', () => {
      renderApp('/signin');
      const signUpLink = screen.getByText('Sign up');
      expect(signUpLink).toBeInTheDocument();
      expect(signUpLink.closest('a')).toHaveAttribute('href', '/signin');
    });
  });

  // ── Admin Flow ──

  describe('Admin Page Flow', () => {
    it('renders login form at /admin when not authenticated', () => {
      renderApp('/admin');
      expect(screen.getByText('CMS Access')).toBeInTheDocument();
    });

    it('completes admin login successfully', async () => {
      const user = userEvent.setup();
      renderApp('/admin');

      const usernameInput = screen.getByPlaceholderText('Username');
      const passwordInput = document.querySelector('input[type="password"]');

      await user.type(usernameInput, 'kyrinliong');
      await user.type(passwordInput, 'buffyisawesome');

      const buttons = screen.getAllByRole('button');
      const submitBtn = buttons.find(
        (b) => b.type === 'submit' && b.closest('form')
      );
      if (submitBtn) await user.click(submitBtn);

      await waitFor(() => {
        expect(screen.queryByText('CMS Access')).not.toBeInTheDocument();
      });
    });

    it('shows error on admin login with wrong credentials', async () => {
      const user = userEvent.setup();
      renderApp('/admin');

      const usernameInput = screen.getByPlaceholderText('Username');
      const passwordInput = document.querySelector('input[type="password"]');

      await user.type(usernameInput, 'hacker');
      await user.type(passwordInput, 'wrong');

      const buttons = screen.getAllByRole('button');
      const submitBtn = buttons.find(
        (b) => b.type === 'submit' && b.closest('form')
      );
      if (submitBtn) await user.click(submitBtn);

      await waitFor(() => {
        expect(
          screen.getByText('Wrong credentials, darling! 💅')
        ).toBeInTheDocument();
      });
    });
  });

  // ── Session Persistence Integration ──

  describe('Session Persistence', () => {
    it('admin auth persists across re-renders via sessionStorage', () => {
      sessionStorage.setItem('admin_auth', 'true');
      renderApp('/admin');
      expect(screen.queryByText('CMS Access')).not.toBeInTheDocument();
    });

    it('clearing sessionStorage shows login form on admin route', () => {
      sessionStorage.setItem('admin_auth', 'true');
      sessionStorage.clear();
      renderApp('/admin');
      expect(screen.getByText('CMS Access')).toBeInTheDocument();
    });
  });

  // ── Route Protection (UI‑level) ──

  describe('Route Access', () => {
    it('admin route is accessible regardless of auth (shows login form)', () => {
      renderApp('/admin');
      // The page itself is accessible; it just shows login when not authed
      expect(screen.getByText('CMS Access')).toBeInTheDocument();
    });

    it('signin route is always accessible', () => {
      renderApp('/signin');
      expect(screen.getByText('Welcome to buffyisawesomeMDB')).toBeInTheDocument();
    });

    it('404 page renders for unknown routes', () => {
      renderApp('/nonexistent-route');
      expect(screen.getByText('404')).toBeInTheDocument();
    });
  });
});
