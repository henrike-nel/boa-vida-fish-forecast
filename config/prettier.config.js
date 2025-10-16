module.exports = {
  // Basic formatting
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  
  // JSX (if we add React components later)
  jsxSingleQuote: true,
  jsxBracketSameLine: false,
  
  // Arrays and Objects
  trailingComma: 'es5',
  bracketSpacing: true,
  bracketSameLine: false,
  
  // Functions
  arrowParens: 'avoid',
  
  // HTML/CSS
  htmlWhitespaceSensitivity: 'css',
  
  // Line endings
  endOfLine: 'lf',
  
  // Embedded languages
  embeddedLanguageFormatting: 'auto',
  
  // File-specific overrides
  overrides: [
    {
      files: '*.html',
      options: {
        printWidth: 120,
        htmlWhitespaceSensitivity: 'ignore'
      }
    },
    {
      files: '*.md',
      options: {
        printWidth: 80,
        proseWrap: 'always'
      }
    },
    {
      files: '*.json',
      options: {
        printWidth: 80,
        tabWidth: 2
      }
    },
    {
      files: '*.css',
      options: {
        printWidth: 120,
        singleQuote: false
      }
    }
  ]
};
