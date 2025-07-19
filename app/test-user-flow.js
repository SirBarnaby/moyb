#!/usr/bin/env node

/**
 * Test Runner for User Flow Tests
 * 
 * This script runs the specific user flow tests we created.
 * Usage: node test-user-flow.js
 */

import { execSync } from 'child_process';

console.log('🧪 Running User Flow Tests...\n');

try {
  // Run only our specific test files
  const testFiles = [
    'src/__tests__/UserFlow.e2e.test.ts',
    'src/components/__tests__/AppIntegration.test.ts',
    'src/components/__tests__/ExerciseSelectorMain.test.ts',
    'src/components/__tests__/MuscleInteraction.test.ts'
  ];

  for (const testFile of testFiles) {
    console.log(`\n📋 Running: ${testFile}`);
    console.log('='.repeat(50));
    
    try {
      const result = execSync(`npx vitest run ${testFile}`, { 
        encoding: 'utf8',
        stdio: 'inherit'
      });
      console.log(`✅ ${testFile} - PASSED`);
    } catch (error) {
      console.log(`❌ ${testFile} - FAILED`);
      console.error(error.stdout || error.message);
    }
  }

  console.log('\n🎉 Test run completed!');
  
} catch (error) {
  console.error('❌ Error running tests:', error.message);
  process.exit(1);
}
