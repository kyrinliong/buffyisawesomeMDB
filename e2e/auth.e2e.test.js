/**
 * E2E / UI TESTS — Authentication
 *
 * These tests exercise the real browser UI using Playwright.
 * Run: npx playwright test e2e/auth.e2e.test.js
 *
 * Prerequisites: dev server running on http://localhost:3000
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

// ── Sign‑In Page UI Tests ──

test.describe('Sign‑In Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/signin`);
  });

  test('displays the sign-in form with heading', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Welcome to buffyisawesomeMDB');
  });

  test('has email/username input pre-filled with kyrinliong', async ({ page }) => {
    const emailInput = page.locator('input[type="text"]');
    await expect(emailInput).toHaveValue('kyrinliong');
  });

  test('has password input pre-filled with buffyisawesome', async ({ page }) => {
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toHaveValue('buffyisawesome');
  });

  test('shows the Sign In button', async ({ page }) => {
    await expect(page.locator('button[type="submit"]')).toContainText('Sign In');
  });

  test('displays welcome message after clicking Sign In', async ({ page }) => {
    await page.click('button[type="submit"]');
    await expect(page.locator('h2')).toContainText('Welcome back!');
  });

  test('shows redirect message after sign-in', async ({ page }) => {
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Redirecting you home...')).toBeVisible();
  });

  test('navigates to home page after sign-in delay', async ({ page }) => {
    await page.click('button[type="submit"]');
    // Wait for the redirect (1.5s timeout in the app)
    await page.waitForURL(`${BASE_URL}/`, { timeout: 5000 });
    expect(page.url()).toBe(`${BASE_URL}/`);
  });

  test('has a sign-up link that points to /signin', async ({ page }) => {
    const signUpLink = page.locator('a:has-text("Sign up")');
    await expect(signUpLink).toHaveAttribute('href', '/signin');
  });

  test('form inputs are marked as required', async ({ page }) => {
    const emailInput = page.locator('input[type="text"]');
    const passwordInput = page.locator('input[type="password"]');
    await expect(emailInput).toHaveAttribute('required', '');
    await expect(passwordInput).toHaveAttribute('required', '');
  });

  test('password field is of type password (masked)', async ({ page }) => {
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('header and footer are visible on sign-in page', async ({ page }) => {
    // Header should be present
    await expect(page.locator('header')).toBeVisible();
    // Footer should be present
    await expect(page.locator('footer')).toBeVisible();
  });
});

// ── Admin Login Page UI Tests ──

test.describe('Admin Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`);
  });

  test('displays CMS Access heading', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('CMS Access');
  });

  test('shows the lock emoji 🔐', async ({ page }) => {
    await expect(page.locator('text=🔐')).toBeVisible();
  });

  test('has username and password inputs', async ({ page }) => {
    await expect(page.locator('input[placeholder="Username"]')).toBeVisible();
    const passwordInputs = page.locator('input[type="password"]');
    await expect(passwordInputs.first()).toBeVisible();
  });

  test('shows error with wrong credentials', async ({ page }) => {
    await page.fill('input[placeholder="Username"]', 'wrong');
    await page.fill('input[type="password"]', 'credentials');
    // Click the submit button in the login form
    await page.locator('form button[type="submit"]').click();

    await expect(page.locator('text=Wrong credentials, darling! 💅')).toBeVisible();
  });

  test('successfully logs in with correct credentials', async ({ page }) => {
    await page.fill('input[placeholder="Username"]', 'kyrinliong');
    await page.fill('input[type="password"]', 'buffyisawesome');
    await page.locator('form button[type="submit"]').click();

    // The CMS Access heading should disappear
    await expect(page.locator('h1:has-text("CMS Access")')).not.toBeVisible({ timeout: 5000 });
  });

  // Note: These tests clear sessionStorage before running
  test.use({ storageState: undefined });
});

// ── Cross‑Page Auth Flow ──

test.describe('Cross‑Page Auth Flow', () => {
  test('navigating from home to sign-in preserves app chrome', async ({ page }) => {
    await page.goto(BASE_URL);
    // Click the sign-in link in the header
    const signInLink = page.locator('a[href="/signin"]').first();
    if (await signInLink.isVisible()) {
      await signInLink.click();
      await expect(page).toHaveURL(`${BASE_URL}/signin`);
      await expect(page.locator('h1')).toContainText('Welcome to buffyisawesomeMDB');
    }
  });

  test('admin page is accessible and shows login when not authenticated', async ({ page }) => {
    // Clear any session storage by evaluating
    await page.goto(BASE_URL);
    await page.evaluate(() => sessionStorage.clear());
    await page.goto(`${BASE_URL}/admin`);

    await expect(page.locator('h1:has-text("CMS Access")')).toBeVisible();
    await expect(page.locator('text=Sign in to manage your movie empire')).toBeVisible();
  });
});
