import { test, expect } from '@playwright/test';

const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');
const homePath = basePath ? `${basePath}/` : '/';

test('Cambiar área button is visible and works on question page', async ({ page }) => {
  await page.goto(homePath);
  await page.getByRole('button', { name: /Lógica I/ }).click();
  await page.getByRole('button', { name: 'Todas las preguntas' }).click();
  // Should see "Cambiar área" next to "Ver estado"
  await expect(page.getByRole('button', { name: 'Cambiar área' })).toBeVisible();
  // Click "Cambiar área" and verify area selection screen
  await page.getByRole('button', { name: 'Cambiar área' }).click();
  await expect(page.getByText('¿Qué quieres estudiar?')).toBeVisible();
});

// More tests for answer pages, section selection, question selection, and completion will follow

  
