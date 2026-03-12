import { test, expect } from '@playwright/test'

test('unauthenticated user is redirected to login from protected routes', async ({
  page,
}) => {
  await page.goto('/company')
  await expect(page).toHaveURL(/\/login/)

  await page.goto('/freelancer')
  await expect(page).toHaveURL(/\/login/)
})

