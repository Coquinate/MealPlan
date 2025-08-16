/**
 * WCAG AA Contrast Audit Script for OKLCH Color Tokens
 * Validates contrast ratios for Modern Hearth theme across all color combinations
 */

import { oklchToRGB, calculateContrastRatio } from './color-utils';

// Import design tokens
import { modernHearthColors, darkModeTokens } from '@coquinate/config/tailwind/design-tokens';

interface ContrastTestCase {
  foreground: string;
  background: string;
  description: string;
  minRatio: number; // 4.5 for normal text, 3.0 for large text
  context: 'light' | 'dark' | 'both';
}

interface ContrastResult {
  testCase: ContrastTestCase;
  ratio: number;
  passes: boolean;
  recommendation?: string;
}

// Critical test cases for Phase 3 validation
const criticalTestCases: ContrastTestCase[] = [
  // Coral on dark surfaces (expert feedback requirement)
  {
    foreground: 'accent-coral',
    background: 'dark-surface',
    description: 'Coral accent on dark mode surface',
    minRatio: 4.5,
    context: 'dark',
  },
  {
    foreground: 'accent-coral',
    background: 'dark-surface-glass',
    description: 'Coral on dark glass morphism',
    minRatio: 4.5,
    context: 'dark',
  },
  {
    foreground: 'accent-coral-dark',
    background: 'dark-surface',
    description: 'Reduced coral saturation in dark mode',
    minRatio: 4.5,
    context: 'dark',
  },

  // Text over glass surfaces
  {
    foreground: 'text',
    background: 'surface-glass',
    description: 'Primary text on glass surface',
    minRatio: 4.5,
    context: 'light',
  },
  {
    foreground: 'text-secondary',
    background: 'surface-glass',
    description: 'Secondary text on glass',
    minRatio: 4.5,
    context: 'light',
  },
  {
    foreground: 'dark-text',
    background: 'dark-surface-glass',
    description: 'Dark mode text on glass',
    minRatio: 4.5,
    context: 'dark',
  },

  // Focus rings visibility
  {
    foreground: 'primary-warm',
    background: 'surface',
    description: 'Focus ring on light surface',
    minRatio: 3.0,
    context: 'light',
  },
  {
    foreground: 'primary-warm',
    background: 'surface-glass',
    description: 'Focus ring on glass surface',
    minRatio: 3.0,
    context: 'light',
  },
  {
    foreground: 'accent-coral',
    background: 'dark-surface',
    description: 'Coral focus ring in dark mode',
    minRatio: 3.0,
    context: 'dark',
  },

  // Button states
  {
    foreground: 'white',
    background: 'primary-warm',
    description: 'White text on primary button',
    minRatio: 4.5,
    context: 'both',
  },
  {
    foreground: 'white',
    background: 'accent-coral',
    description: 'White text on coral button',
    minRatio: 4.5,
    context: 'both',
  },

  // Error and success states
  {
    foreground: 'error',
    background: 'surface',
    description: 'Error text on surface',
    minRatio: 4.5,
    context: 'light',
  },
  {
    foreground: 'success',
    background: 'surface',
    description: 'Success text on surface',
    minRatio: 4.5,
    context: 'light',
  },
];

/**
 * Converts OKLCH string to RGB for contrast calculation
 */
function parseOKLCH(oklchString: string): { r: number; g: number; b: number } {
  // Parse OKLCH values from string like "oklch(58% 0.08 200)"
  const match = oklchString.match(/oklch\((\d+(?:\.\d+)?%?)\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)/);
  if (!match) {
    throw new Error(`Invalid OKLCH string: ${oklchString}`);
  }

  const l = parseFloat(match[1].replace('%', '')) / 100;
  const c = parseFloat(match[2]);
  const h = parseFloat(match[3]);

  return oklchToRGB(l, c, h);
}

/**
 * Get color value from token name
 */
function getColorValue(tokenName: string, isDarkMode: boolean = false): string {
  const tokens = isDarkMode
    ? { ...modernHearthColors, ...darkModeTokens.dark }
    : modernHearthColors;

  // Handle special cases
  if (tokenName === 'white') return 'oklch(100% 0 0)';
  if (tokenName === 'error') return 'oklch(50% 0.2 25)';
  if (tokenName === 'success') return 'oklch(55% 0.15 145)';

  // Add dark- prefix for dark mode tokens
  const key = isDarkMode && !tokenName.startsWith('dark-') ? `dark-${tokenName}` : tokenName;

  return tokens[key] || tokens[tokenName] || tokenName;
}

/**
 * Run contrast audit for all test cases
 */
export function runContrastAudit(options?: {
  verbose?: boolean;
  outputFormat?: 'json' | 'table' | 'markdown';
}): {
  results: ContrastResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    criticalFailures: ContrastResult[];
  };
} {
  const results: ContrastResult[] = [];
  const { verbose = false, outputFormat = 'table' } = options || {};

  for (const testCase of criticalTestCases) {
    // Test in appropriate context(s)
    const contexts = testCase.context === 'both' ? ['light', 'dark'] : [testCase.context];

    for (const context of contexts) {
      const isDark = context === 'dark';

      try {
        const fgColor = getColorValue(testCase.foreground, isDark);
        const bgColor = getColorValue(testCase.background, isDark);

        const fgRGB = parseOKLCH(fgColor);
        const bgRGB = parseOKLCH(bgColor);

        const ratio = calculateContrastRatio(fgRGB, bgRGB);
        const passes = ratio >= testCase.minRatio;

        const result: ContrastResult = {
          testCase: {
            ...testCase,
            context: context as 'light' | 'dark',
          },
          ratio: Math.round(ratio * 100) / 100,
          passes,
        };

        // Add recommendation for failures
        if (!passes) {
          const deficit = testCase.minRatio - ratio;
          if (deficit < 0.5) {
            result.recommendation = 'Add veil token (surface-veil-30) to increase contrast';
          } else if (deficit < 1.5) {
            result.recommendation = 'Use darker background or lighter foreground variant';
          } else {
            result.recommendation = 'Major contrast issue - consider alternative color pairing';
          }
        }

        results.push(result);

        if (verbose) {
          console.log(formatResult(result, outputFormat));
        }
      } catch (error) {
        console.error(`Failed to test ${testCase.description}:`, {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          testCase,
          context: {
            isDark,
            foreground: testCase.foreground,
            background: testCase.background,
            minRatio: testCase.minRatio,
          },
        });
      }
    }
  }

  // Generate summary
  const criticalFailures = results.filter(
    (r) => !r.passes && r.testCase.description.includes('coral')
  );

  const summary = {
    total: results.length,
    passed: results.filter((r) => r.passes).length,
    failed: results.filter((r) => !r.passes).length,
    criticalFailures,
  };

  return { results, summary };
}

/**
 * Format result for output
 */
function formatResult(result: ContrastResult, format: 'json' | 'table' | 'markdown'): string {
  const { testCase, ratio, passes } = result;
  const status = passes ? '✅' : '❌';

  switch (format) {
    case 'json':
      return JSON.stringify(result, null, 2);

    case 'markdown':
      return `| ${testCase.description} | ${testCase.context} | ${ratio}:1 | ${testCase.minRatio}:1 | ${status} |`;

    case 'table':
    default:
      return `${status} ${testCase.description} (${testCase.context}): ${ratio}:1 / ${testCase.minRatio}:1 required`;
  }
}

/**
 * Generate contrast report
 */
export function generateContrastReport(): string {
  const { results, summary } = runContrastAudit();

  let report = `# WCAG AA Contrast Audit Report\n\n`;
  report += `Date: ${new Date().toISOString()}\n`;
  report += `Theme: Modern Hearth\n\n`;

  report += `## Summary\n`;
  report += `- Total Tests: ${summary.total}\n`;
  report += `- Passed: ${summary.passed} (${Math.round((summary.passed / summary.total) * 100)}%)\n`;
  report += `- Failed: ${summary.failed}\n`;

  if (summary.criticalFailures.length > 0) {
    report += `\n### ⚠️ Critical Failures (Coral in Dark Mode)\n`;
    report += `| Test | Context | Ratio | Required | Status |\n`;
    report += `|------|---------|-------|----------|--------|\n`;

    for (const failure of summary.criticalFailures) {
      report += formatResult(failure, 'markdown') + '\n';
    }
  }

  report += `\n## All Test Results\n`;
  report += `| Test | Context | Ratio | Required | Status |\n`;
  report += `|------|---------|-------|----------|--------|\n`;

  for (const result of results) {
    report += formatResult(result, 'markdown') + '\n';
    if (!result.passes && result.recommendation) {
      report += `| → Recommendation: ${result.recommendation} | | | | |\n`;
    }
  }

  return report;
}

/**
 * CLI executable
 */
async function runCli() {
  console.log('🎨 Running Modern Hearth Contrast Audit...\n');

  const report = generateContrastReport();
  console.log(report);

  // Write report to file
  const fs = await import('fs/promises');
  const path = await import('path');
  const reportPath = path.join(process.cwd(), 'contrast-audit-report.md');

  await fs.writeFile(reportPath, report, 'utf-8');
  console.log(`\n📄 Report saved to: ${reportPath}`);

  // Exit with error code if critical failures
  const { summary } = runContrastAudit();
  if (summary.criticalFailures.length > 0) {
    console.error('\n❌ Critical contrast failures detected!');
    process.exit(1);
  }
}

if (require.main === module) {
  runCli().catch((error) => {
    console.error('Error running contrast audit:', error);
    process.exit(1);
  });
}
