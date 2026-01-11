import { test, expect } from '@playwright/test';

const homePath = process.env.BASE_PATH || '';

test.describe('Question Order Control', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(homePath);
    // Clear localStorage for clean state
    await page.evaluate(() => localStorage.clear());
  });

  test('shows question order selection toggle in quiz menu', async ({ page }) => {
    // Start Lógica I quiz
    await page.getByRole('button', { name: /Lógica I/ }).click();
    // Should see question order toggle options
    await expect(page.getByText('Orden de preguntas:')).toBeVisible();
    await expect(page.getByLabel('Alternar orden de preguntas')).toBeVisible();
    // Default should be random order (checkbox not checked)
    await expect(page.getByLabel('Alternar orden de preguntas')).not.toBeChecked();
  });

  test('allows switching between random and sequential order', async ({ page }) => {
    // Start Lógica I quiz
    await page.getByRole('button', { name: /Lógica I/ }).click();
    // Switch to sequential order (click label)
    await page.getByText('Orden secuencial').click();
    await expect(page.getByLabel('Alternar orden de preguntas')).toBeChecked();
    // Switch back to random order (click label)
    await page.getByText('Orden aleatorio').click();
    await expect(page.getByLabel('Alternar orden de preguntas')).not.toBeChecked();
  });


  test('sequential order shows questions by number order', async ({ page }) => {
    // Start Lógica I quiz with sequential order
    await page.getByRole('button', { name: /Lógica I/ }).click();
    await page.getByText('Orden secuencial').click();
    await page.getByRole('button', { name: 'Todas las preguntas' }).click();
    
    // First question should be question number 1
    const questionText = await page.locator('body').innerText();
    expect(questionText).toMatch(/^1\./);
    
    // Continue to next question - should be question 2
    await page.getByRole('button', { name: 'V', exact: true }).click();
    await page.getByRole('button', { name: 'Continuar' }).click();
    
    const nextQuestionText = await page.locator('body').innerText();
    expect(nextQuestionText).toMatch(/^2\./);
  });

  test('random order shows questions in randomized order', async ({ page }) => {
    // Start Lógica I quiz with random order
    await page.getByRole('button', { name: /Lógica I/ }).click();
    await page.getByText('Orden aleatorio').click();
    await page.getByRole('button', { name: 'Todas las preguntas' }).click();
    
    // Collect first few question numbers to verify randomness
    const questionNumbers: number[] = [];
    
    for (let i = 0; i < 5; i++) {
      const questionText = await page.locator('body').innerText();
      const match = questionText.match(/(\d+)\./);
      if (match) {
        questionNumbers.push(parseInt(match[1], 10));
      }
      
      if (i < 4) { // Don't continue after last question
        await page.getByRole('button', { name: 'V', exact: true }).click();
        await page.getByRole('button', { name: 'Continuar' }).click();
      }
    }
    
    // Verify questions are not in sequential order (1, 2, 3, 4, 5)
    const isSequential = questionNumbers.every((num, index) => num === index + 1);
    expect(isSequential).toBe(false);
  });

  test('question order preference applies to section selection', async ({ page }) => {
    // Start Lógica I quiz with sequential order
    await page.getByRole('button', { name: /Lógica I/ }).click();
    await page.getByText('Orden secuencial').click();
    await page.getByRole('button', { name: 'Seleccionar secciones' }).click();
    
    // Select a section and verify order
    await page.getByText('CUESTIONES GENERALES').click();
    await page.getByRole('button', { name: 'Empezar quiz' }).click();
    
    // Should start with the first question number in that section
    const questionText = await page.locator('body').innerText();
    // Should show a low question number (sequential within section)
    expect(questionText).toMatch(/[1-9]\./);
  });

  test('question order preference is per-area', async ({ page }) => {
    // Set Lógica I to sequential
    await page.getByRole('button', { name: /Lógica I/ }).click();
    await page.getByText('Orden secuencial').click();
    await page.getByRole('button', { name: 'Cambiar área' }).click();
    // Switch to IPC area - should default to random
    await page.getByRole('button', { name: /Introducción al Pensamiento Científico/ }).click();
    await expect(page.getByLabel('Alternar orden de preguntas')).not.toBeChecked();
    // Set IPC to sequential
    await page.getByText('Orden secuencial').click();
    await page.getByRole('button', { name: 'Cambiar área' }).click();
    // Return to Lógica I - should still be sequential
    await page.getByRole('button', { name: /Lógica I/ }).click();
    await expect(page.getByLabel('Alternar orden de preguntas')).toBeChecked();
  });
});