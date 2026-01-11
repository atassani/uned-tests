
import { test, expect } from '@playwright/test';

const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');
const homePath = basePath ? `${basePath}/` : '/';

test('Clicking area resumes at last question if progress exists', async ({ page }) => {
  await page.goto(homePath);
  // Go to Lógica I, answer 3 questions
  await page.getByRole('button', { name: /Lógica I/ }).click();
  await page.getByRole('button', { name: 'Todas las preguntas' }).click();
  for (let i = 0; i < 2; i++) {
    await page.getByRole('button', { name: 'Continuar' }).click();
  }
  // Go back to area selection
  await page.getByRole('button', { name: 'Cambiar área' }).click();
  // Click Lógica I again
  await page.getByRole('button', { name: /Lógica I/ }).click();
  // Should resume at question 3 (index 2)
  await expect(page.getByText(/3\./)).toBeVisible();
});

test('Clicking "Todas las preguntas" always starts fresh', async ({ page }) => {
  await page.goto(homePath);
  // Go to IPC, answer 2 questions
  await page.getByRole('button', { name: /Introducción al Pensamiento Científico/ }).click();
  await page.getByRole('button', { name: 'Todas las preguntas' }).click();
  for (let i = 0; i < 2; i++) {
    await page.getByRole('button', { name: 'Continuar' }).click();
  }
  // Go back to menu
  await page.getByRole('button', { name: 'Ver estado' }).click();
  await page.getByRole('button', { name: 'Menú' }).click();
  // Click "Todas las preguntas" again
  await page.getByRole('button', { name: 'Todas las preguntas' }).click();
  // Should be on question 1
  await expect(page.getByText(/1\./)).toBeVisible();
});
