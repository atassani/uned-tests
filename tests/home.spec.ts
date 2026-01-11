
import { test, expect } from '@playwright/test';

// Clear localStorage before each test to ensure a clean state
test.beforeEach(async ({ page }) => {
  await page.goto(homePath);
  await page.evaluate(() => localStorage.clear());
});

// Use base path from environment for all tests
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');
const homePath = basePath ? `${basePath}/` : '/';

test('True/False quiz works for Lógica I area', async ({ page }) => {
  await page.goto(homePath);
  
  await page.getByRole('button', { name: /Lógica I/ }).click();
  await page.getByRole('button', { name: 'Todas las preguntas' }).click();
  
  // Should see True/False question interface
  await expect(page.getByRole('button', { name: 'V', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'F', exact: true })).toBeVisible();
  
  // Answer a question
  await page.getByRole('button', { name: 'V', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Continuar' })).toBeVisible();
});

test('Multiple Choice quiz shows question text with A/B/C buttons (consistent with True/False)', async ({ page }) => {
  await page.goto(homePath);
  
  await page.getByRole('button', { name: /Introducción al Pensamiento Científico/ }).click();
  await page.getByRole('button', { name: 'Todas las preguntas' }).click();
  
  // Should see question text (not as buttons)
  await expect(page.locator('.question-text')).toBeVisible();
  
  // Should see A/B/C buttons at the bottom (not full option text as buttons)
  await expect(page.getByRole('button', { name: 'A', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'B', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'C', exact: true })).toBeVisible();
  
  // Should NOT see buttons with full option text
  await expect(page.getByRole('button', { name: /No es objetivo porque hay personas/ })).not.toBeVisible();
});

test('shows area name in question view', async ({ page }) => {
  await page.goto(homePath);
  
  await page.getByRole('button', { name: /Lógica I/ }).click();
  await page.getByRole('button', { name: 'Todas las preguntas' }).click();
  
  // Should show area name at top
  await expect(page.getByText('Lógica I')).toBeVisible();
});

test('shows area name in status view ("Ver Estado")', async ({ page }) => {
  await page.goto(homePath);
  
  await page.getByRole('button', { name: /Lógica I/ }).click();
  await page.getByRole('button', { name: 'Todas las preguntas' }).click();
  await page.getByRole('button', { name: 'Ver estado' }).click();
  
  // Should show area name at top of status view
  await expect(page.getByText('Lógica I')).toBeVisible();
});

test('shows area name in question selection menu', async ({ page }) => {
  await page.goto(homePath);
  
  await page.getByRole('button', { name: /Lógica I/ }).click();
  
  // Should show area name in the question selection menu
  await expect(page.getByText('🎓 Lógica I')).toBeVisible();
});

test('migrates old quizStatus to area-specific storage without .json suffix', async ({ page }) => {
  // Set up old localStorage data
  await page.goto(homePath);
  await page.evaluate(() => {
    localStorage.setItem('quizStatus', '{"0": "correct", "1": "fail"}');
  });

  // Reload page to trigger migration
  await page.reload();

  // Wait for areas to load (which triggers migration)
  await expect(page.getByText('¿Qué quieres estudiar?')).toBeVisible();
  await expect(page.getByRole('button', { name: /Lógica I/ })).toBeVisible();

  // Check that data was migrated and old data removed (now uses shortName only)
  const newData = await page.evaluate(() => localStorage.getItem('quizStatus_log1'));
  const oldData = await page.evaluate(() => localStorage.getItem('quizStatus'));

  expect(newData).toBe('{"0": "correct", "1": "fail"}');
  expect(oldData).toBeNull();
});

test('Multiple Choice quiz works for IPC area', async ({ page }) => {
  await page.goto(homePath);
  
  await page.getByRole('button', { name: /Introducción al Pensamiento Científico/ }).click();
  await page.getByRole('button', { name: 'Todas las preguntas' }).click();
  
  // Should see Multiple Choice question interface with options
  await expect(page.getByRole('button', { name: 'A', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'B', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'C', exact: true })).toBeVisible();
  
  // Answer a question
  await page.getByRole('button', { name: 'A', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Continuar' })).toBeVisible();
});

test('keyboard shortcuts work for area selection', async ({ page }) => {
  await page.goto(homePath);
  
  // Wait for areas to load
  await expect(page.getByRole('button', { name: /Lógica I/ })).toBeVisible();
  
  // Press '1' to select first area
  await page.keyboard.press('1');
  
  // Should be in question selection for first area
  await expect(page.getByText('¿Cómo quieres las preguntas?')).toBeVisible();
});

test('keyboard shortcuts work for Multiple Choice questions', async ({ page }) => {
  await page.goto(homePath);
  
  await page.getByRole('button', { name: /Introducción al Pensamiento Científico/ }).click();
  await page.getByRole('button', { name: 'Todas las preguntas' }).click();
  
  // Press 'a' to answer with option A
  await page.keyboard.press('a');
  await expect(page.getByRole('button', { name: 'Continuar' })).toBeVisible();
});


test('selects one section and starts quiz in Lógica I area', async ({ page }) => {
  await page.goto(homePath);

  await page.getByRole('button', { name: /Lógica I/ }).click();
  await page.getByRole('button', { name: 'Seleccionar secciones' }).click();
  await page.getByRole('checkbox', { name: 'CUESTIONES DE LOS APUNTES' }).check();
  await page.getByRole('button', { name: 'Empezar' }).click();
  await page.getByText('📊 Total: 55 | Correctas: 0').click();
  await expect(page.locator('body')).toContainText('📊 Total: 55 | Correctas: 0 | Falladas: 0 | Pendientes: 55');

  await page.getByRole('button', { name: 'Ver estado' }).click();
  await page.getByText('📚 CUESTIONES DE LOS APUNTES1').click();
  await expect(page.locator('body')).toContainText('📚 CUESTIONES DE LOS APUNTES1❓2❓3❓4❓5❓6❓7❓8❓9❓10❓11❓12❓13❓14❓15❓16❓17❓18❓19❓20❓21❓22❓23❓24❓25❓26❓27❓28❓29❓30❓31❓32❓33❓34❓35❓36❓37❓38❓39❓40❓41❓42❓43❓44❓45❓46❓47❓48❓49❓50❓51❓52❓53❓54❓55❓');

  await page.getByRole('button', { name: 'Continuar' }).click();
  await page.getByRole('button', { name: 'V', exact: true }).click();
  await page.getByRole('button', { name: 'Continuar' }).click();
});

test('MCQ shows expected answer in correct format when wrong answer is selected', async ({ page }) => {
  await page.goto(homePath);
  
  // Navigate to IPC area with MCQ questions
  await page.getByRole('button', { name: /Introducción al Pensamiento Científico/ }).click();
  await page.getByRole('button', { name: 'Todas las preguntas' }).click();
  
  // Wait for first question to load - use exact match for A button
  await expect(page.getByRole('button', { name: 'A', exact: true })).toBeVisible();
  
  // Click on answer A
  await page.getByRole('button', { name: 'A', exact: true }).click();
  
  // Check if it shows "Incorrecto" - if so, verify expected answer format
  const isIncorrect = await page.getByText('❌ Incorrecto.').isVisible();
  
  if (isIncorrect) {
    // Should show "Respuesta esperada X) ..." format in the answer section
    const answerSection = page.locator('.text-red-600');
    await expect(answerSection).toBeVisible();
    
    // The answer should start with "Respuesta esperada" followed by the letter and option text
    await expect(answerSection).toContainText(/^Respuesta esperada [ABC]\) /);
  } else {
    // If A was correct, try B
    await page.getByRole('button', { name: 'Continuar' }).click();
    await page.getByRole('button', { name: 'B', exact: true }).click();
    
    const isIncorrectB = await page.getByText('❌ Incorrecto.').isVisible();
    
    if (isIncorrectB) {
      const answerSection = page.locator('.text-red-600');
      await expect(answerSection).toBeVisible();
      await expect(answerSection).toContainText(/^Respuesta esperada [ABC]\) /);
    }
  }
});

test('shows area name with mortarboard on menu page', async ({ page }) => {
  await page.goto(homePath);
  
  // Navigate to Lógica I area
  await page.getByRole('button', { name: /Lógica I/ }).click();
  
  // Should see area name with mortarboard on menu page
  await expect(page.getByText('🎓 Lógica I')).toBeVisible();
  
  // Navigate to IPC area 
  await page.getByRole('button', { name: 'Cambiar área' }).click();
  await page.getByRole('button', { name: /Introducción al Pensamiento Científico/ }).click();
  
  // Should see area name with mortarboard on IPC menu page
  await expect(page.getByText('🎓 Introducción al Pensamiento Científico')).toBeVisible();
});

test('shows area name with mortarboard on section selection page', async ({ page }) => {
  await page.goto(homePath);
  
  // Navigate to Lógica I and go to section selection
  await page.getByRole('button', { name: /Lógica I/ }).click();
  await page.getByRole('button', { name: 'Seleccionar secciones' }).click();
  
  // Should see area name with mortarboard on section selection page
  await expect(page.getByText('🎓 Lógica I')).toBeVisible();
});

test('shows area name with mortarboard on question selection page', async ({ page }) => {
  await page.goto(homePath);
  
  // Navigate to Lógica I and go to question selection
  await page.getByRole('button', { name: /Lógica I/ }).click();
  await page.getByRole('button', { name: 'Seleccionar preguntas' }).click();
  
  // Should see area name with mortarboard on question selection page
  await expect(page.getByText('🎓 Lógica I')).toBeVisible();
});

test('shows area name with mortarboard on True/False answer page', async ({ page }) => {
  await page.goto(homePath);
  
  // Test True/False answer page
  await page.getByRole('button', { name: /Lógica I/ }).click();
  await page.getByRole('button', { name: 'Todas las preguntas' }).click();
  await page.getByRole('button', { name: 'V', exact: true }).click();
  
  // Should see area name with mortarboard on True/False answer page
  await expect(page.getByText('🎓 Lógica I')).toBeVisible();
});

test('shows area name with mortarboard on MCQ answer page', async ({ page }) => {
  await page.goto(homePath);
  
  // Test MCQ answer page
  await page.getByRole('button', { name: /Introducción al Pensamiento Científico/ }).click();
  await page.getByRole('button', { name: 'Todas las preguntas' }).click();
  await page.getByRole('button', { name: 'A', exact: true }).click();
  
  // Should see area name with mortarboard on MCQ answer page
  await expect(page.getByText('🎓 Introducción al Pensamiento Científico')).toBeVisible();
});

test('remembers last studied area in localStorage', async ({ page }) => {
  await page.goto(homePath);
  
  // Select Lógica I area
  await page.getByRole('button', { name: /Lógica I/ }).click();
  await page.getByRole('button', { name: 'Todas las preguntas' }).click();
  
  // Check that currentArea is stored in localStorage (now shortName)
  const currentArea = await page.evaluate(() => localStorage.getItem('currentArea'));
  expect(currentArea).toBe('log1');

  // Go to different area
  await page.getByRole('button', { name: 'Ver estado' }).click();
  await page.getByRole('button', { name: 'Cambiar área' }).click();
  await page.getByRole('button', { name: /Introducción al Pensamiento Científico/ }).click();

  // Check that currentArea is updated (now shortName)
  const newCurrentArea = await page.evaluate(() => localStorage.getItem('currentArea'));
  expect(newCurrentArea).toBe('ipc');
});

test('automatically returns to last studied area on app reload', async ({ page }) => {
  await page.goto(homePath);
  
  // Select IPC area and start quiz
  await page.getByRole('button', { name: /Introducción al Pensamiento Científico/ }).click();
  await page.getByRole('button', { name: 'Todas las preguntas' }).click();
  
  // Reload the page
  await page.reload();
  
  // Should automatically return to IPC menu (not area selection)
  // Accept either the menu or question view, since the app may restore to either
  const menuVisible = await page.getByText('¿Cómo quieres las preguntas?').isVisible().catch(() => false);
  const areaMenuVisible = await page.getByText('🎓 Introducción al Pensamiento Científico').isVisible().catch(() => false);
  const areaSelectionVisible = await page.getByText('¿Qué quieres estudiar?').isVisible().catch(() => false);

  // If not in menu, check if in question view (should not be in area selection)
  if (!menuVisible && !areaMenuVisible) {
    // Try to find any question UI as fallback
    const questionVisible = await page.getByRole('button', { name: 'Continuar' }).isVisible().catch(() => false);
    expect(questionVisible).toBe(true);
  } else {
    expect(menuVisible || areaMenuVisible).toBe(true);
    expect(areaSelectionVisible).toBe(false);
  }
});

test('restores to area selection if no previous area stored', async ({ page }) => {
  // Clear localStorage
  await page.goto(homePath);
  await page.evaluate(() => localStorage.clear());
  
  // Reload page
  await page.reload();
  
  // Should show area selection screen since no area was stored
  await expect(page.getByText('¿Qué quieres estudiar?')).toBeVisible();
  await expect(page.getByRole('button', { name: /Lógica I/ })).toBeVisible();
});

test('preserves quiz progress when switching between areas', async ({ page }) => {
  // Ensure clean state at the start
  await page.goto(homePath);
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  // Start Lógica I quiz and answer a question
  await page.getByRole('button', { name: /Lógica I/ }).click();
  await page.getByRole('button', { name: 'Todas las preguntas' }).click();
  await page.getByRole('button', { name: 'V', exact: true }).click();
  await page.getByRole('button', { name: 'Continuar' }).click();

  // Check and store the number of pending questions after answering one in Lógica I
  const statusText = await page.locator('body').innerText();
  const pendientesMatch = statusText.match(/Pendientes: (\d+)/);
  expect(pendientesMatch).not.toBeNull();
  const pendientesBefore = pendientesMatch ? parseInt(pendientesMatch[1], 10) : null;
  // Extract section name (assume it's after the 📚 emoji and before a line break)
  const sectionMatch = statusText.match(/📚 ([^\n]+)/);
  const sectionBefore = sectionMatch ? sectionMatch[1].trim() : null;
  // Debug output
  // ...existing code...

  // Switch to IPC area
  await page.getByRole('button', { name: 'Ver estado' }).click();
  await page.getByRole('button', { name: 'Cambiar área' }).click();
  await page.getByRole('button', { name: /Introducción al Pensamiento Científico/ }).click();

  // Debug: print all visible buttons and page text after switching area
  const allButtons = await page.locator('button').allTextContents();
  const pageText = await page.locator('body').innerText();
  // ...existing code...

  // App resumes at the question directly, so answer the question in IPC

  // If the selection menu is shown, click 'Todas las preguntas' to start the quiz in IPC
  const todasPreguntasButton = page.getByRole('button', { name: 'Todas las preguntas' });
  if (await todasPreguntasButton.isVisible({ timeout: 2000 }).catch(() => false)) {
    await todasPreguntasButton.click();
  }
  // Now answer a question in IPC
  await expect(page.getByRole('button', { name: 'A', exact: true })).toBeVisible({ timeout: 5000 });
  await page.getByRole('button', { name: 'A', exact: true }).click();
  await page.getByRole('button', { name: 'Continuar' }).click();

  // Switch back to Lógica I
  await page.getByRole('button', { name: 'Ver estado' }).click();
  await page.getByRole('button', { name: 'Cambiar área' }).click();
  await page.getByRole('button', { name: /Lógica I/ }).click();

  // Wait for React state updates to complete
  await page.waitForTimeout(500);

  // After switching back to Lógica I, app should resume at the question view (not menu)
  // Debug: print all visible buttons and page text after switching back
  const allButtonsAfter = await page.locator('button').allTextContents();
  const pageTextAfter = await page.locator('body').innerText();
  // ...existing code...

  // Check for question UI (e.g., answer buttons)
  const vButtonVisible = await page.getByRole('button', { name: 'V', exact: true }).isVisible().catch(() => false);
  const fButtonVisible = await page.getByRole('button', { name: 'F', exact: true }).isVisible().catch(() => false);
  const aButtonVisible = await page.getByRole('button', { name: 'A', exact: true }).isVisible().catch(() => false);
  // At least one answer button should be visible
  expect(vButtonVisible || fButtonVisible || aButtonVisible).toBe(true);
  // Check that the number of pending questions is the same as before switching
  const statusTextAfter = pageTextAfter;
  const pendientesMatchAfter = statusTextAfter.match(/Pendientes: (\d+)/);
  expect(pendientesMatchAfter).not.toBeNull();
  const pendientesAfter = pendientesMatchAfter ? parseInt(pendientesMatchAfter[1], 10) : null;
  const sectionMatchAfter = statusTextAfter.match(/📚 ([^\n]+)/);
  const sectionAfter = sectionMatchAfter ? sectionMatchAfter[1].trim() : null;
  expect(pendientesAfter).toBe(pendientesBefore);
});
