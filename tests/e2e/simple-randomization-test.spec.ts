import { test, expect } from '@playwright/test';
import { setupFreshTest } from './helpers';

test.describe('Simple Randomization Test', () => {
  test.beforeEach(async ({ page }) => {
    await setupFreshTest(page, '42');
  });

  test('question order demonstrates the bug', async ({ page }) => {
    // Go to IPC area and select random order
    await page.getByRole('button', { name: /Introducción al Pensamiento Científico/ }).click();
    await page.getByRole('button', { name: 'Orden aleatorio' }).click();
    await page.getByRole('button', { name: 'Todas las preguntas' }).click();

    // Log all visible .question-text elements before waiting
    const allQuestions = await page.locator('.question-text').allInnerTexts();
    console.log('All .question-text before waiting:', allQuestions);
    // Wait for the quiz to load
    await page.waitForSelector('.question-text');

    // Get the first question number - first attempt
    let questionElement1;
    let questionText1;
    try {
      questionElement1 = await page.locator('.question-text').first();
      questionText1 = await questionElement1.innerText();
    } catch (e) {
      console.log('Failed to find .question-text (first attempt). Current URL:', page.url());
      const html = await page.content();
      console.log('Current page HTML (first attempt):', html);
      throw e;
    }
    const match1 = questionText1.match(/^(\d+)\./);
    const firstQuestionNum1 = match1 ? parseInt(match1[1], 10) : null;

    // Go back to start a new quiz
    await page.getByRole('button', { name: 'Options' }).click();
    await page.getByRole('button', { name: 'Volver a empezar' }).first().click();
    await page.getByRole('button', { name: 'Todas las preguntas' }).click();
    // Log all visible .question-text elements before waiting (second attempt)
    const allQuestions2 = await page.locator('.question-text').allInnerTexts();
    console.log('All .question-text before waiting (second attempt):', allQuestions2);
    await page.waitForSelector('.question-text');

    // Get the first question number - second attempt
    let questionElement2;
    let questionText2;
    try {
      questionElement2 = await page.locator('.question-text').first();
      questionText2 = await questionElement2.innerText();
    } catch (e) {
      console.log('Failed to find .question-text (second attempt). Current URL:', page.url());
      const html = await page.content();
      console.log('Current page HTML (second attempt):', html);
      throw e;
    }
    const match2 = questionText2.match(/^(\d+)\./);
    const firstQuestionNum2 = match2 ? parseInt(match2[1], 10) : null;

    console.log('First attempt first question:', firstQuestionNum1);
    console.log('Second attempt first question:', firstQuestionNum2);

    // If randomization works, these should be different
    expect(firstQuestionNum1).not.toBe(firstQuestionNum2); // This should fail, showing the bug
  });
});
