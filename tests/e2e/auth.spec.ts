import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('shows login form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /iniciar sesión/i })).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/contraseña/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /iniciar sesión/i })).toBeVisible()
  })

  test('shows validation errors for empty submit', async ({ page }) => {
    await page.getByRole('button', { name: /iniciar sesión/i }).click()
    await expect(page.getByText(/email.*requerido/i)).toBeVisible()
    await expect(page.getByText(/contraseña.*requerida/i)).toBeVisible()
  })

  test('shows error for invalid credentials', async ({ page }) => {
    await page.getByLabel(/email/i).fill('invalid@test.com')
    await page.getByLabel(/contraseña/i).fill('wrongpassword')
    await page.getByRole('button', { name: /iniciar sesión/i }).click()

    await expect(page.getByText(/no pudimos iniciar sesión/i)).toBeVisible()
  })

  test('redirects to intended page after login', async ({ page }) => {
    await page.goto('/login?next=/admin/dashboard')
    await page.getByLabel(/email/i).fill('valid@test.com')
    await page.getByLabel(/contraseña/i).fill('validpassword')
    await page.getByRole('button', { name: /iniciar sesión/i }).click()

    await expect(page).toHaveURL(/\/admin\/dashboard/)
  })
})

test.describe('Public Access Navigation', () => {
  test('shows login/register links when not authenticated', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('link', { name: /publicar mi negocio/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /iniciar sesión/i })).toBeVisible()
  })

  test('shows business admin link when authenticated as business user', async ({ page }) => {
    // This test would require setting up auth state
    // Using storageState for authenticated tests
  })
})

test.describe('Site Entry Gate', () => {
  test('shows entry gate on first visit to public page', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { name: /qué quieres hacer hoy/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /iniciar sesión/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /crear tu negocio/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /continuar comprando/i })).toBeVisible()
  })

  test('dismisses entry gate and sets sessionStorage', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('button', { name: /continuar comprando/i }).click()

    await expect(page.getByRole('heading', { name: /qué quieres hacer hoy/i })).not.toBeVisible()

    const entrySeen = await page.evaluate(() => sessionStorage.getItem('el-bisne:entry-seen'))
    expect(entrySeen).toBe('true')
  })
})