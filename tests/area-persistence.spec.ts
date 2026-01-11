
import { test, expect } from '@playwright/test';

const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');
const homePath = basePath ? `${basePath}/` : '/';

test('remembers last studied area in localStorage', async ({ page }) => {
  await page.goto(homePath);
  await page.evaluate(() => {
    localStorage.clear(); 
  });
  await page.waitForTimeout(200);
  await page.getByRole('button', { name: /Lógica I/ }).click();
  await page.getByRole('button', { name: 'Todas las preguntas' }).click();
  await page.getByRole('button', { name: 'Ver estado' }).click();
  await page.getByRole('button', { name: 'Cambiar área' }).click();
  await page.getByRole('button', { name: /Introducción al Pensamiento Científico/ }).click();
  await page.getByRole('button', { name: 'Todas las preguntas' }).click();
  // Check that currentArea is updated
  const currentArea = await page.evaluate(() => localStorage.getItem('currentArea'));
  expect(currentArea).toBe('Introducción al Pensamiento Científico');
});

test('automatically returns to last studied area on app reload', async ({ page }) => {
  await page.goto(homePath);
  await page.getByRole('button', { name: /Lógica I/ }).click();
  await page.getByRole('button', { name: 'Todas las preguntas' }).click();
  await page.getByRole('button', { name: 'Ver estado' }).click();
  await page.getByRole('button', { name: 'Cambiar área' }).click();
  await page.getByRole('button', { name: /Introducción al Pensamiento Científico/ }).click();
  await page.getByRole('button', { name: 'Todas las preguntas' }).click();
  // Reload page
  await page.reload();
  // Should be in IPC area
  await expect(page.getByText(/Introducción al Pensamiento Científico/)).toBeVisible();
});

test('restores to area selection if no previous area stored', async ({ page }) => {
  await page.goto(homePath);
  await page.evaluate(() => localStorage.removeItem('currentArea'));
  await page.reload();
  await expect(page.getByText('¿Qué quieres estudiar?')).toBeVisible();
});

test('preserves quiz progress when switching between areas', async ({ page }) => {
  await page.goto(homePath);
  // Start Lógica I quiz and answer a question
  await page.getByRole('button', { name: /Lógica I/ }).click();
  await page.getByRole('button', { name: 'Todas las preguntas' }).click();
  await page.getByRole('button', { name: 'V', exact: true }).click();
  await page.getByRole('button', { name: 'Continuar' }).click();
  // Check we have progress
  await expect(page.getByText(/Total: \d+ \| Correctas: 1/)).toBeVisible();
  // Switch to IPC area
  await page.getByRole('button', { name: 'Ver estado' }).click();
  await page.getByRole('button', { name: 'Cambiar área' }).click();
  await page.getByRole('button', { name: /Introducción al Pensamiento Científico/ }).click();
  await page.getByRole('button', { name: 'Todas las preguntas' }).click();
  // Answer a question in IPC
  await page.getByRole('button', { name: 'A', exact: true }).click();
  await page.getByRole('button', { name: 'Continuar' }).click();
  // Switch back to Lógica I
  await page.getByRole('button', { name: 'Ver estado' }).click();
  await page.getByRole('button', { name: 'Cambiar área' }).click();
  await page.getByRole('button', { name: /Lógica I/ }).click();
  await page.getByRole('button', { name: 'Todas las preguntas' }).click();
  // Should still have our original progress
  await expect(page.getByText(/Total: \d+ \| Correctas: 1/)).toBeVisible();
});
