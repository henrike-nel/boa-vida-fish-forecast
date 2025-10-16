module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true
  },
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'prettier'
  ],
  plugins: [
    'html',
    'jsdoc'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    // Code Quality
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'error',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'prefer-const': 'error',
    'no-var': 'error',
    
    // Function and Variable Naming
    'camelcase': ['error', { properties: 'never' }],
    'func-names': ['error', 'as-needed'],
    'prefer-arrow-callback': 'error',
    
    // Import/Export
    'import/prefer-default-export': 'off',
    'import/no-unresolved': 'off', // CDN imports
    'import/extensions': 'off',
    
    // JSDoc Requirements
    'jsdoc/require-description': 'error',
    'jsdoc/require-param': 'error',
    'jsdoc/require-param-description': 'error',
    'jsdoc/require-returns': 'error',
    'jsdoc/require-returns-description': 'error',
    'jsdoc/require-example': ['warn', {
      contexts: ['FunctionDeclaration']
    }],
    
    // Performance
    'no-loop-func': 'error',
    'no-inner-declarations': 'error',
    
    // Marine/Fishing Domain Specific
    'no-magic-numbers': ['error', { 
      ignore: [0, 1, -1, 100],
      ignoreArrayIndexes: true,
      detectObjects: false
    }],
    
    // Accessibility
    'jsx-a11y/alt-text': 'off', // Not using JSX
    
    // Security
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error'
  },
  overrides: [
    {
      files: ['*.html'],
      processor: 'html/html'
    },
    {
      files: ['tests/**/*.js'],
      env: {
        jest: true
      },
      rules: {
        'no-magic-numbers': 'off',
        'jsdoc/require-jsdoc': 'off'
      }
    },
    {
      files: ['scripts/**/*.js'],
      rules: {
        'no-console': 'off'
      }
    }
  ],
  globals: {
    // Browser globals
    'React': 'readonly',
    'ReactDOM': 'readonly',
    'Papa': 'readonly',
    '_': 'readonly',
    'lucideReact': 'readonly',
    
    // Custom globals for fishing domain
    'FishingData': 'readonly',
    'RecommendationEngine': 'readonly',
    'AnalyticsProcessor': 'readonly'
  },
  settings: {
    jsdoc: {
      mode: 'typescript'
    }
  }
};
