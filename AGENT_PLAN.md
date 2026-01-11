# Agent Implementation Plan: Multi-Area Quiz Support

## Phase 1: Project Familiarization
- [x] Create AGENT_PLAN.md
- [x] Inspect current QuizApp.tsx structure and question loading logic
- [x] Examine existing Playwright tests in tests/home.spec.ts
- [x] Review public/ directory and existing JSON files
- [x] Check version history page structure
- [x] Examine GitHub workflows for CI configuration

## Phase 2: Data Structure Setup
- [x] Create areas.json index file in public/
- [x] Rename public/questions.json to public/questions_logica1.json
- [x] Update any hardcoded references to questions.json
- [x] Verify questions_ipc.json structure matches expected format

## Phase 3: Core Logic Implementation
- [x] Design localStorage structure for multiple quiz progress tracking
- [x] Create types/interfaces for areas and different question types
- [x] Implement area selection UI ("¿Qué quieres estudiar?")
- [x] Add question type detection and routing logic
- [x] Implement multiple choice question display with options a, b, c
- [x] Add button and keyboard input handling for multiple choice (**COMPLETED**)

## Phase 4: State Management Updates
- [x] Refactor localStorage to support multiple areas (quizStatusByArea)
- [x] Update quiz progress tracking to work per area
- [x] Ensure resume functionality works across different areas
- [x] Test switching between areas without losing progress (**COMPLETED**)

## Phase 5: UI/UX Implementation
- [ ] Update feedback UI to work with both question types
- [ ] Ensure mobile responsiveness for new multiple choice interface
- [ ] Maintain existing True/False UI for backward compatibility
- [ ] Keep basePath support for static export

## Phase 6: Testing
- [x] Update existing Playwright tests for area selection flow
- [x] Add new Playwright test for Multiple Choice workflow
- [x] Add keyboard shortcuts tests for multi-area navigation (**ALL TESTS PASSING - 27/27**)

## Phase 7: UI/UX Consistency & Backward Compatibility (**NEW REQUIREMENTS**)
- [x] **UI Consistency**: Change Multiple Choice display from option buttons to text + A/B/C buttons
  - [x] Write failing test for MCQ text display format
  - [x] Implement MCQ text display with A/B/C buttons at bottom
  - [x] Ensure A/B/C buttons work correctly
- [x] **Backward Compatibility**: Migrate existing localStorage data
  - [x] Write test for localStorage migration from `quizStatus` to `quizStatus_questions_logica1`
  - [x] Implement migration logic on app startup
  - [x] Remove `.json` suffix from localStorage keys (use `quizStatus_questions_logica1` not `quizStatus_questions_logica1.json`)
  - [x] Delete old `quizStatus` after successful migration
- [x] **Area Name Display**: Show area name at top of screens
  - [x] Write tests for area name display in question view
  - [x] Write tests for area name display in status view ("Ver Estado")
  - [x] Write tests for area name display in menu screens
  - [x] Implement area name display across all relevant screens
  - [x] **Icon Update**: Change area display icon from 📚 to 🎓 (mortarboard)

## Phase 8: Final Status (**COMPLETED**)
- [x] All 42 Playwright tests passing ✅
- [x] TDD process followed for all new requirements
- [x] UI consistency achieved between True/False and Multiple Choice
- [x] Backward compatibility maintained with localStorage migration
- [x] Area names displayed with mortarboard icon 🎓
- [x] Ready for production deployment
- [ ] Update GitHub Actions workflow to run unit tests
- [ ] Verify all tests pass and app builds correctly

## Phase 9: MCQ Expected Answer Display (**COMPLETED**)
- [x] **Enhanced MCQ Results Display**: Show expected answer in specific format
  - [x] Write failing test for expected answer display format
  - [x] Format should be: "Respuesta esperada A) The text of the option"
  - [x] Implement expected answer display for incorrect MCQ answers
  - [x] Verify correct formatting with all MCQ option letters (A, B, C)
  - [x] Ensure feature works across all MCQ areas
  - [x] All 45 Playwright tests passing ✅

## Phase 10: Complete Area Name Display (**COMPLETED**)
- [x] **Missing Area Name with Mortarboard**: Add area name display to remaining pages
  - [x] Write tests for area name display on menu page (below "¿Cómo quieres las preguntas?")
  - [x] Write tests for area name display on "Seleccionar secciones" screen
  - [x] Write tests for area name display on "Seleccionar preguntas" screen  
  - [x] Write tests for area name display on MCQ answer page
  - [x] Write tests for area name display on True/False answer page
  - [x] Implement area name with 🎓 icon on all missing pages
  - [x] Ensure consistent styling and positioning across all screens
  - [x] All 60 Playwright tests passing ✅

## Phase 11: Area Memory and Persistence (**NEW REQUIREMENT**)
- [ ] **localStorage Area Memory**: Remember and restore user's area
  - [ ] Write tests for area persistence in localStorage
  - [ ] Write tests for returning to last studied area on app reload
  - [ ] Write tests for migration from old "quizStatus" to Lógica I area
  - [ ] Implement localStorage key for current area (e.g., "currentArea")
  - [ ] Implement automatic area restoration on app startup
  - [ ] Implement backward compatibility: old "quizStatus" → migrate to Lógica I
  - [ ] Ensure quiz progress is preserved when switching areas

## Phase 12: Enhanced "Cambiar área" Navigation (**NEW REQUIREMENT**)
- [ ] **Expanded Area Switching**: Add "Cambiar área" buttons throughout app
  - [ ] Write tests for "Cambiar área" button on question page (next to "Ver estado")
  - [ ] Write tests for "Cambiar área" button on answer pages (both MCQ and True/False)
  - [ ] Write tests for "Cambiar área" button on "Seleccionar secciones" page
  - [ ] Write tests for "Cambiar área" button on "Seleccionar preguntas" page
  - [ ] Write tests for "Cambiar área" button on "Quiz completado" page
  - [ ] Write tests for continuing where you left off after area change
  - [ ] Implement "Cambiar área" buttons with consistent styling
  - [ ] Implement logic to preserve progress in both areas when switching
  - [ ] Ensure area switching works from any screen in the app

## Phase 13: Short Area Names in Selection (**NEW REQUIREMENT**)
- [ ] **Compact Area Selection**: Add short names for better UX
  - [ ] Write tests for short area names display in area selection
  - [ ] Add "short" field to areas.json (LOG1, IPC)
  - [ ] Write tests for short names with full names below in smaller font
  - [ ] Update area selection UI to show short names prominently
  - [ ] Display full area names in smaller text below short names
  - [ ] Ensure responsive design works with new layout
  - [ ] Consider scalability for future additional areas

## Phase 14: Sequential Question Order Option (**NEW REQUIREMENT**)
- [ ] **Question Order Control**: Allow sequential vs random question presentation
  - [ ] Write tests for sequential question order option
  - [ ] Write tests for question order selection UI
  - [ ] Add question order preference to localStorage
  - [ ] Implement UI toggle for "Orden secuencial" vs "Orden aleatorio"
  - [ ] Implement sequential question logic (by question number)
  - [ ] Ensure both random and sequential modes work correctly
  - [ ] Update existing tests to account for question order modes

## Phase 7: Documentation and Versioning
- [ ] Update version history page with new feature description
- [ ] Bump package.json version to 1.3.0
- [ ] Create git commits at each major milestone
- [ ] Final verification and cleanup

## Current Status: Ready to begin Phase 10 - Complete Area Name Display