import { test, expect } from '@playwright/test';

const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');
const homePath = basePath ? `${basePath}/` : '/';

test('Test area switching preserves progress', async ({ page }) => {
  await page.goto(homePath);
  await page.getByRole('button', { name: /Lógica I/ }).click();
  await page.getByRole('button', { name: 'Todas las preguntas' }).click();
  await page.getByRole('button', { name: 'V', exact: true }).click();
  await page.getByRole('button', { name: 'Continuar' }).click();
  await expect(page.getByText(/Total: \d+ \| Correctas: 1/)).toBeVisible();
  await page.getByRole('button', { name: 'Ver estado' }).click();
  await page.getByRole('button', { name: 'Cambiar área' }).click();
  await page.getByRole('button', { name: /Introducción al Pensamiento Científico/ }).click();
  await page.getByRole('button', { name: 'Todas las preguntas' }).click();
  await page.getByRole('button', { name: 'A', exact: true }).click();
  await page.getByRole('button', { name: 'Continuar' }).click();
  await page.getByRole('button', { name: 'Ver estado' }).click();
  await page.getByRole('button', { name: 'Cambiar área' }).click();
  await page.getByRole('button', { name: /Lógica I/ }).click();
  await page.getByRole('button', { name: 'Todas las preguntas' }).click();
  await expect(page.getByText(/Total: \d+ \| Correctas: 1/)).toBeVisible();
});

