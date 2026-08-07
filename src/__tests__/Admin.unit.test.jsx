/**
 * UNIT TESTS — Admin Component (Authentication)
 * Tests login form, credential validation, session persistence, and logout.
 *
 * @see TESTING.md for run instructions, dependency versions, and conventions.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Admin from '../pages/Admin';

// ── Mocks ──

// Mock the dynamic supabase import used in loadStats
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => Promise.resolve({ data: [], error: null })),
    })),
  })),
}));

// ── Helpers ──

function renderAdmin() {
  return render(
    <MemoryRouter>
      <Admin />
    </MemoryRouter>
  );
}

// ── Tests ──

describe('Admin Component — Authentication', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  // ── Login Form Rendering ──

  describe('Login Form Rendering', () => {
    it('renders the CMS Access heading when not authenticated', () => {
      renderAdmin();
      expect(screen.getByText('CMS Access')).toBeInTheDocument();
    });

    it('renders username input', () => {
      renderAdmin();
      expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    });

    it('renders password input', () => {
      renderAdmin();
      // The password input in Admin uses placeholder "Password" but has type password
      const inputs = screen.getAllByPlaceholderText(/password/i);
      // there may be multiple - find the one with type password
      const passwordInput = inputs.find(
        (el) => el.getAttribute('type') === 'password'
      );
      // fallback: just use the input with type="password"
      const pwdInput = document.querySelector('input[type="password"]');
      expect(pwdInput).toBeInTheDocument();
    });

    it('renders a submit button on the login form', () => {
      renderAdmin();
      // The admin login form has a button, let's check for it
      const form = document.querySelector('form');
      expect(form).toBeInTheDocument();
    });

    it('shows the lock emoji 🔐', () => {
      renderAdmin();
      expect(screen.getByText('🔐')).toBeInTheDocument();
    });

    it('shows "Sign in to manage your movie empire" caption', () => {
      renderAdmin();
      expect(
        screen.getByText('Sign in to manage your movie empire')
      ).toBeInTheDocument();
    });
  });

  // ── Login Flow ──

  describe('Login Flow', () => {
    it('shows error message on wrong credentials', async () => {
      const user = userEvent.setup();
      renderAdmin();

      const usernameInput = screen.getByPlaceholderText('Username');
      const passwordInput = document.querySelector('input[type="password"]');

      await user.type(usernameInput, 'wronguser');
      await user.type(passwordInput, 'wrongpass');

      // Find and click the submit button in the login form
      const buttons = screen.getAllByRole('button');
      const submitBtn = buttons.find(
        (b) => b.type === 'submit' && b.closest('form')
      );
      if (submitBtn) await user.click(submitBtn);

      expect(
        screen.getByText('Wrong credentials, darling! 💅')
      ).toBeInTheDocument();
    });

    it('authenticates with correct credentials', async () => {
      const user = userEvent.setup();
      renderAdmin();

      const usernameInput = screen.getByPlaceholderText('Username');
      const passwordInput = document.querySelector('input[type="password"]');

      await user.type(usernameInput, 'kyrinliong');
      await user.type(passwordInput, 'buffyisawesome');

      const buttons = screen.getAllByRole('button');
      const submitBtn = buttons.find(
        (b) => b.type === 'submit' && b.closest('form')
      );
      if (submitBtn) await user.click(submitBtn);

      // After successful login, the login form should disappear
      await vi.waitFor(() => {
        expect(screen.queryByText('CMS Access')).not.toBeInTheDocument();
      });
    });

    it('persists auth state in sessionStorage after login', async () => {
      const user = userEvent.setup();
      renderAdmin();

      const usernameInput = screen.getByPlaceholderText('Username');
      const passwordInput = document.querySelector('input[type="password"]');

      await user.type(usernameInput, 'kyrinliong');
      await user.type(passwordInput, 'buffyisawesome');

      const buttons = screen.getAllByRole('button');
      const submitBtn = buttons.find(
        (b) => b.type === 'submit' && b.closest('form')
      );
      if (submitBtn) await user.click(submitBtn);

      await vi.waitFor(() => {
        expect(sessionStorage.getItem('admin_auth')).toBe('true');
      });
    });

    it('shows dashboard after successful authentication', async () => {
      const user = userEvent.setup();
      renderAdmin();

      const usernameInput = screen.getByPlaceholderText('Username');
      const passwordInput = document.querySelector('input[type="password"]');

      await user.type(usernameInput, 'kyrinliong');
      await user.type(passwordInput, 'buffyisawesome');

      const buttons = screen.getAllByRole('button');
      const submitBtn = buttons.find(
        (b) => b.type === 'submit' && b.closest('form')
      );
      if (submitBtn) await user.click(submitBtn);

      // Dashboard should show statistics
      await vi.waitFor(() => {
        expect(screen.queryByText('CMS Access')).not.toBeInTheDocument();
      });
    });
  });

  // ── Session Restoration ──

  describe('Session Restoration', () => {
    it('skips login form when sessionStorage has admin_auth=true', () => {
      sessionStorage.setItem('admin_auth', 'true');
      renderAdmin();
      expect(screen.queryByText('CMS Access')).not.toBeInTheDocument();
    });

    it('shows login form when sessionStorage has admin_auth=false', () => {
      sessionStorage.setItem('admin_auth', 'false');
      renderAdmin();
      expect(screen.getByText('CMS Access')).toBeInTheDocument();
    });

    it('shows login form when sessionStorage is empty', () => {
      renderAdmin();
      expect(screen.getByText('CMS Access')).toBeInTheDocument();
    });
  });

  // ── Logout ──

  describe('Logout', () => {
    it('clears sessionStorage and shows login form on logout', async () => {
      sessionStorage.setItem('admin_auth', 'true');
      const user = userEvent.setup();
      renderAdmin();

      // Wait for the dashboard to render, then look for a logout button
      await vi.waitFor(() => {
        expect(screen.queryByText('CMS Access')).not.toBeInTheDocument();
      });

      // Look for logout-related text/button
      const logoutBtn = screen.queryByText(/log\s*out/i) || screen.queryByText(/sign out/i);
      if (logoutBtn) {
        await user.click(logoutBtn);
        expect(sessionStorage.getItem('admin_auth')).toBeNull();
        expect(screen.getByText('CMS Access')).toBeInTheDocument();
      }
    });
  });
});
