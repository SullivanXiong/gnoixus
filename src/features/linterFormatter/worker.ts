/**
 * Web Worker for heavy linting/formatting operations
 * This keeps the main thread responsive during code processing
 */

interface WorkerMessage {
  action: 'format' | 'lint';
  code: string;
  language: string;
}

interface WorkerResponse {
  success: boolean;
  formatted?: string;
  errors?: Array<{
    line: number;
    column: number;
    message: string;
    severity: 'error' | 'warning';
  }>;
}

self.addEventListener('message', (event: MessageEvent<WorkerMessage>) => {
  const { action, code, language } = event.data;

  try {
    if (action === 'format') {
      const result = formatCode(code, language);
      self.postMessage(result);
    } else if (action === 'lint') {
      const result = lintCode(code, language);
      self.postMessage(result);
    }
  } catch (error) {
    self.postMessage({
      success: false,
      errors: [{
        line: 0,
        column: 0,
        message: error instanceof Error ? error.message : 'Unknown error',
        severity: 'error'
      }]
    });
  }
});

function formatCode(code: string, language: string): WorkerResponse {
  // Simplified formatting logic
  // In a production environment, this would integrate Prettier
  let formatted = code;

  switch (language) {
    case 'javascript':
    case 'typescript':
      formatted = formatJavaScript(code);
      break;
    case 'json':
      try {
        const parsed = JSON.parse(code);
        formatted = JSON.stringify(parsed, null, 2);
      } catch {
        return {
          success: false,
          errors: [{
            line: 0,
            column: 0,
            message: 'Invalid JSON',
            severity: 'error'
          }]
        };
      }
      break;
    case 'css':
      formatted = formatCSS(code);
      break;
    default:
      formatted = code;
  }

  return {
    success: true,
    formatted
  };
}

function formatJavaScript(code: string): string {
  // Basic JavaScript formatting
  let formatted = code;
  
  // Normalize line endings
  formatted = formatted.replace(/\r\n/g, '\n');
  
  // Add spacing around operators
  formatted = formatted.replace(/([^=!<>])=([^=])/g, '$1 = $2');
  
  // Format function declarations
  formatted = formatted.replace(/function\s*\(/g, 'function (');
  
  return formatted;
}

function formatCSS(code: string): string {
  // Basic CSS formatting
  let formatted = code;
  
  // Add newlines after braces
  formatted = formatted.replace(/\{/g, ' {\n  ');
  formatted = formatted.replace(/\}/g, '\n}\n');
  formatted = formatted.replace(/;/g, ';\n  ');
  
  return formatted;
}

function lintCode(code: string, language: string): WorkerResponse {
  const errors: Array<{
    line: number;
    column: number;
    message: string;
    severity: 'error' | 'warning';
  }> = [];

  // Basic linting rules
  const lines = code.split('\n');
  
  lines.forEach((line, index) => {
    // Check for console.log (warning)
    if (line.includes('console.log')) {
      errors.push({
        line: index + 1,
        column: line.indexOf('console.log'),
        message: 'Unexpected console statement',
        severity: 'warning'
      });
    }
    
    // Check for debugger statements (error)
    if (line.includes('debugger')) {
      errors.push({
        line: index + 1,
        column: line.indexOf('debugger'),
        message: 'Debugger statement found',
        severity: 'error'
      });
    }
  });

  return {
    success: true,
    errors: errors.length > 0 ? errors : undefined
  };
}

export {};
