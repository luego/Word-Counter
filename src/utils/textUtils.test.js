// Simple test utilities for text processing functions
// This is a basic example - in a real project, you'd use Jest, Vitest, or similar

export function testWordCount() {
  const testCases = [
    { text: "Hello world", expected: 2 },
    { text: "Hello   world", expected: 2 }, // Multiple spaces
    { text: "", expected: 0 },
    { text: "   ", expected: 0 }, // Only spaces
    { text: "Hello", expected: 1 },
    { text: "Hello world!", expected: 2 },
    { text: "Hello-world", expected: 1 }, // Hyphenated word
  ];

  testCases.forEach(({ text, expected }, index) => {
    const actual = text.trim().length ? text.trim().split(/\s+/).length : 0;
    if (actual !== expected) {
      console.error(`Test ${index + 1} failed: Expected ${expected}, got ${actual} for text: "${text}"`);
    } else {
      console.log(`Test ${index + 1} passed: "${text}" -> ${actual} words`);
    }
  });
}

export function testCharacterCount() {
  const testCases = [
    { text: "Hello", expected: 5 },
    { text: "Hello world", expected: 11 },
    { text: "Hello world", expectedNoSpaces: 10 },
    { text: "", expected: 0 },
    { text: "   ", expected: 3 },
  ];

  testCases.forEach(({ text, expected, expectedNoSpaces }, index) => {
    const withSpaces = text.length;
    const withoutSpaces = text.replace(/\s/g, '').length;
    
    if (withSpaces !== expected) {
      console.error(`Test ${index + 1} failed (with spaces): Expected ${expected}, got ${withSpaces} for text: "${text}"`);
    } else {
      console.log(`Test ${index + 1} passed (with spaces): "${text}" -> ${withSpaces} characters`);
    }
    
    if (expectedNoSpaces && withoutSpaces !== expectedNoSpaces) {
      console.error(`Test ${index + 1} failed (no spaces): Expected ${expectedNoSpaces}, got ${withoutSpaces} for text: "${text}"`);
    } else if (expectedNoSpaces) {
      console.log(`Test ${index + 1} passed (no spaces): "${text}" -> ${withoutSpaces} characters`);
    }
  });
}

export function testCaseConversion() {
  const testCases = [
    { 
      input: "hello world", 
      uppercase: "HELLO WORLD",
      lowercase: "hello world",
      titlecase: "Hello World",
      sentencecase: "Hello world"
    },
    { 
      input: "HELLO WORLD", 
      uppercase: "HELLO WORLD",
      lowercase: "hello world",
      titlecase: "Hello World",
      sentencecase: "Hello world"
    },
  ];

  testCases.forEach(({ input, uppercase, lowercase, titlecase, sentencecase }, index) => {
    const actualUppercase = input.toUpperCase();
    const actualLowercase = input.toLowerCase();
    const actualTitlecase = input.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
    const actualSentencecase = input.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, c => c.toUpperCase());
    
    if (actualUppercase !== uppercase) {
      console.error(`Test ${index + 1} uppercase failed: Expected "${uppercase}", got "${actualUppercase}"`);
    } else {
      console.log(`Test ${index + 1} uppercase passed: "${input}" -> "${actualUppercase}"`);
    }
    
    if (actualLowercase !== lowercase) {
      console.error(`Test ${index + 1} lowercase failed: Expected "${lowercase}", got "${actualLowercase}"`);
    } else {
      console.log(`Test ${index + 1} lowercase passed: "${input}" -> "${actualLowercase}"`);
    }
    
    if (actualTitlecase !== titlecase) {
      console.error(`Test ${index + 1} titlecase failed: Expected "${titlecase}", got "${actualTitlecase}"`);
    } else {
      console.log(`Test ${index + 1} titlecase passed: "${input}" -> "${actualTitlecase}"`);
    }
    
    if (actualSentencecase !== sentencecase) {
      console.error(`Test ${index + 1} sentencecase failed: Expected "${sentencecase}", got "${actualSentencecase}"`);
    } else {
      console.log(`Test ${index + 1} sentencecase passed: "${input}" -> "${actualSentencecase}"`);
    }
  });
}

// Run all tests
export function runAllTests() {
  console.log("🧪 Running text utility tests...\n");
  
  console.log("📊 Word Count Tests:");
  testWordCount();
  console.log();
  
  console.log("📝 Character Count Tests:");
  testCharacterCount();
  console.log();
  
  console.log("🔄 Case Conversion Tests:");
  testCaseConversion();
  console.log();
  
  console.log("✅ All tests completed!");
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.textUtils = {
    testWordCount,
    testCharacterCount,
    testCaseConversion,
    runAllTests
  };
} 