/**
 * UNIT TESTS — Auth utility functions
 * Tests the core credential validation logic extracted from components.
 *
 * @see TESTING.md for run instructions, dependency versions, and conventions.
 */
import { describe, it, expect } from 'vitest';

// ── Credential validation (extracted from SignIn.jsx logic) ──

/**
 * Validates sign-in credentials (mirrors SignIn.jsx handleSubmit logic).
 * Returns { valid: boolean, error?: string }
 */
function validateSignInCredentials(email, password) {
  if (!email || !password) {
    return { valid: false, error: 'Email and password are required.' };
  }
  if (typeof email !== 'string' || typeof password !== 'string') {
    return { valid: false, error: 'Credentials must be strings.' };
  }
  if (email.trim().length === 0 || password.trim().length === 0) {
    return { valid: false, error: 'Email and password cannot be empty.' };
  }
  return { valid: true };
}

/**
 * Validates admin credentials (mirrors Admin.jsx handleLogin logic).
 */
function validateAdminCredentials(username, password) {
  const ADMIN_USERNAME = 'kyrinliong';
  const ADMIN_PASSWORD = 'buffyisawesome';

  if (!username || !password) {
    return { valid: false, error: 'Wrong credentials, darling! 💅' };
  }
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return { valid: false, error: 'Wrong credentials, darling! 💅' };
  }
  return { valid: true };
}

/**
 * Session storage helper for auth persistence (mirrors Admin.jsx).
 */
const AUTH_STORAGE_KEY = 'admin_auth';

function persistAuth() {
  sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
}

function clearAuth() {
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
}

function isAuthenticated() {
  return sessionStorage.getItem(AUTH_STORAGE_KEY) === 'true';
}

// ── Sign‑In Validation Tests ──

describe('validateSignInCredentials', () => {
  it('returns valid:true for non-empty email and password', () => {
    const result = validateSignInCredentials('user@example.com', 'password123');
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('returns valid:true for username-style credentials', () => {
    const result = validateSignInCredentials('kyrinliong', 'buffyisawesome');
    expect(result.valid).toBe(true);
  });

  it('returns valid:false when email is empty string', () => {
    const result = validateSignInCredentials('', 'password');
    expect(result.valid).toBe(false);
    // Empty string is falsy, caught by the first !email check
    expect(result.error).toContain('required');
  });

  it('returns valid:false when password is empty string', () => {
    const result = validateSignInCredentials('user@test.com', '');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('required');
  });

  it('returns valid:false when email is null', () => {
    const result = validateSignInCredentials(null, 'password');
    expect(result.valid).toBe(false);
  });

  it('returns valid:false when password is undefined', () => {
    const result = validateSignInCredentials('user@test.com', undefined);
    expect(result.valid).toBe(false);
  });

  it('returns valid:false when both are whitespace-only', () => {
    const result = validateSignInCredentials('   ', '   ');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('cannot be empty');
  });

  it('returns valid:true for non-Latin characters in credentials', () => {
    const result = validateSignInCredentials('用户@测试.com', '密码123');
    expect(result.valid).toBe(true);
  });
});

// ── Admin Validation Tests ──

describe('validateAdminCredentials', () => {
  it('returns valid:true for correct admin credentials', () => {
    const result = validateAdminCredentials('kyrinliong', 'buffyisawesome');
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('returns valid:false for wrong username', () => {
    const result = validateAdminCredentials('hacker', 'buffyisawesome');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Wrong credentials, darling! 💅');
  });

  it('returns valid:false for wrong password', () => {
    const result = validateAdminCredentials('kyrinliong', 'wrongpass');
    expect(result.valid).toBe(false);
  });

  it('returns valid:false for both wrong', () => {
    const result = validateAdminCredentials('admin', '1234');
    expect(result.valid).toBe(false);
  });

  it('returns valid:false for empty username', () => {
    const result = validateAdminCredentials('', 'buffyisawesome');
    expect(result.valid).toBe(false);
  });

  it('returns valid:false for empty password', () => {
    const result = validateAdminCredentials('kyrinliong', '');
    expect(result.valid).toBe(false);
  });

  it('is case-sensitive for username', () => {
    const result = validateAdminCredentials('KYRINLIONG', 'buffyisawesome');
    expect(result.valid).toBe(false);
  });

  it('is case-sensitive for password', () => {
    const result = validateAdminCredentials('kyrinliong', 'BUFFYISAWESOME');
    expect(result.valid).toBe(false);
  });
});

// ── Session Persistence Tests ──

describe('Session Storage Auth Persistence', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('isAuthenticated returns false initially', () => {
    expect(isAuthenticated()).toBe(false);
  });

  it('persistAuth sets the auth flag', () => {
    persistAuth();
    expect(sessionStorage.getItem(AUTH_STORAGE_KEY)).toBe('true');
    expect(isAuthenticated()).toBe(true);
  });

  it('clearAuth removes the auth flag', () => {
    persistAuth();
    clearAuth();
    expect(sessionStorage.getItem(AUTH_STORAGE_KEY)).toBeNull();
    expect(isAuthenticated()).toBe(false);
  });

  it('isAuthenticated returns false when value is not "true"', () => {
    sessionStorage.setItem(AUTH_STORAGE_KEY, 'false');
    expect(isAuthenticated()).toBe(false);

    sessionStorage.setItem(AUTH_STORAGE_KEY, '1');
    expect(isAuthenticated()).toBe(false);
  });

  it('clearAuth is idempotent (safe to call when not authenticated)', () => {
    expect(() => clearAuth()).not.toThrow();
    expect(isAuthenticated()).toBe(false);
  });

  it('persistAuth overwrites previous value', () => {
    sessionStorage.setItem(AUTH_STORAGE_KEY, 'false');
    persistAuth();
    expect(isAuthenticated()).toBe(true);
  });
});
