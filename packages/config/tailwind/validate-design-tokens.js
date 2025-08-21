#!/usr/bin/env node
/**
 * Design Tokens Validation Script
 * 
 * Automatically detects OKLCH color duplications to prevent:
 * - Bundle size overhead
 * - Design inconsistencies
 * - Color management complexity
 * 
 * Usage:
 *   node validate-design-tokens.js
 *   pnpm validate:tokens
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

/**
 * Extract OKLCH values from design tokens and CSS files
 */
class ColorValidator {
  constructor() {
    this.colorMap = new Map(); // oklch value -> array of token names
    this.errors = [];
    this.warnings = [];
    this.stats = {
      totalColors: 0,
      uniqueColors: 0,
      duplicates: 0,
      filesScanned: 0
    };
  }

  /**
   * Normalize OKLCH strings for comparison
   * oklch(60% 0.2 25) -> "60,0.2,25"
   * oklch(98% 0 0 / 0.8) -> "98,0,0" (ignore alpha)
   */
  normalizeOklch(oklchStr) {
    const match = oklchStr.match(/oklch\(([^)]+)\)/);
    if (!match) return null;
    
    // Extract values and handle different formats
    let valueStr = match[1];
    
    // Remove alpha if present (everything after /)
    valueStr = valueStr.split('/')[0];
    
    // Split by whitespace and/or commas, handling various separators
    const values = valueStr
      .trim()
      .split(/[\s,]+/)
      .map(v => v.replace('%', ''))
      .map(v => parseFloat(v))
      .filter(v => !isNaN(v))
      .slice(0, 3); // Only L, C, H
    
    if (values.length !== 3) return null;
    
    // Round to avoid floating point precision issues
    const normalized = values.map(v => Math.round(v * 1000) / 1000).join(',');
    return normalized;
  }

  /**
   * Extract colors from JavaScript design tokens
   */
  extractFromJS(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Match oklch() values in various contexts
      const oklchRegex = /oklch\([^)]+\)/g;
      const matches = content.match(oklchRegex) || [];
      
      matches.forEach(oklchStr => {
        const normalized = this.normalizeOklch(oklchStr);
        if (!normalized) return;
        
        // Try to extract the token name from context
        const lines = content.split('\n');
        const lineIndex = content.indexOf(oklchStr);
        const beforeOklch = content.substring(0, lineIndex);
        const lastNewline = beforeOklch.lastIndexOf('\n');
        const line = beforeOklch.substring(lastNewline + 1) + oklchStr;
        
        // Extract token name from line
        const tokenMatch = line.match(/['"`]?([a-zA-Z][a-zA-Z0-9-_]*)\s*[:=]/);
        const tokenName = tokenMatch ? tokenMatch[1] : `line-${this.getLineNumber(content, lineIndex)}`;
        
        this.addColor(normalized, `${path.basename(filePath)}:${tokenName}`, oklchStr);
      });

      this.stats.filesScanned++;
    } catch (error) {
      this.errors.push(`Failed to parse ${filePath}: ${error.message}`);
    }
  }

  /**
   * Extract colors from CSS variables
   */
  extractFromCSS(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const processedOklchValues = new Set(); // Track processed values to avoid duplicates
      
      // Match CSS custom properties with oklch values
      const cssVarRegex = /--color-([a-zA-Z0-9-_]+):\s*(oklch\([^)]+\))/g;
      let match;
      
      while ((match = cssVarRegex.exec(content)) !== null) {
        const [fullMatch, tokenName, oklchStr] = match;
        
        const normalized = this.normalizeOklch(oklchStr);
        if (!normalized) continue;
        
        // Track this OKLCH value as processed
        processedOklchValues.add(oklchStr);
        
        this.addColor(normalized, `${path.basename(filePath)}:--color-${tokenName}`, oklchStr);
      }

      // Match standalone oklch() values that weren't already found as CSS variables
      const standaloneRegex = /oklch\([^)]+\)/g;
      const standaloneMatches = content.match(standaloneRegex) || [];
      
      standaloneMatches.forEach((oklchStr, index) => {
        // Skip if this OKLCH value was already processed as a CSS variable
        if (processedOklchValues.has(oklchStr)) {
          return;
        }
        
        const normalized = this.normalizeOklch(oklchStr);
        if (!normalized) return;
        
        this.addColor(normalized, `${path.basename(filePath)}:standalone-${index}`, oklchStr);
      });

      this.stats.filesScanned++;
    } catch (error) {
      this.errors.push(`Failed to parse ${filePath}: ${error.message}`);
    }
  }

  /**
   * Add color to map and track duplications
   */
  addColor(normalizedOklch, tokenName, originalOklch) {
    if (!this.colorMap.has(normalizedOklch)) {
      this.colorMap.set(normalizedOklch, []);
    }
    
    this.colorMap.get(normalizedOklch).push({
      token: tokenName,
      original: originalOklch
    });
    
    this.stats.totalColors++;
  }

  /**
   * Get line number for error reporting
   */
  getLineNumber(content, charIndex) {
    return content.substring(0, charIndex).split('\n').length;
  }

  /**
   * Analyze duplications and generate report
   */
  analyze() {
    const duplicates = [];
    
    for (const [oklch, tokens] of this.colorMap.entries()) {
      if (tokens.length > 1) {
        duplicates.push({
          oklch,
          count: tokens.length,
          tokens: tokens.map(t => t.token),
          original: tokens[0].original
        });
        this.stats.duplicates += tokens.length - 1; // Subtract 1 for the original
      }
    }
    
    this.stats.uniqueColors = this.colorMap.size;
    
    return duplicates;
  }

  /**
   * Generate human-readable report
   */
  generateReport(duplicates) {
    console.log(`\n${colors.bold}${colors.cyan}🎨 Design Tokens Validation Report${colors.reset}`);
    console.log(`${colors.blue}═══════════════════════════════════════════════${colors.reset}\n`);
    
    // Statistics
    console.log(`${colors.bold}Statistics:${colors.reset}`);
    console.log(`  📁 Files scanned: ${colors.white}${this.stats.filesScanned}${colors.reset}`);
    console.log(`  🎯 Total colors: ${colors.white}${this.stats.totalColors}${colors.reset}`);
    console.log(`  ✨ Unique colors: ${colors.white}${this.stats.uniqueColors}${colors.reset}`);
    console.log(`  🔄 Duplicates: ${colors.white}${this.stats.duplicates}${colors.reset}\n`);
    
    if (duplicates.length === 0) {
      console.log(`${colors.green}${colors.bold}✅ No OKLCH duplications found!${colors.reset}`);
      console.log(`${colors.green}All colors are unique and properly organized.${colors.reset}\n`);
      return true;
    }
    
    // Duplications found
    console.log(`${colors.red}${colors.bold}❌ Found ${duplicates.length} OKLCH color duplications:${colors.reset}\n`);
    
    duplicates.forEach((dup, index) => {
      console.log(`${colors.yellow}${colors.bold}${index + 1}. OKLCH(${dup.oklch})${colors.reset} ${colors.magenta}(used ${dup.count} times)${colors.reset}`);
      console.log(`   ${colors.white}Original: ${dup.original}${colors.reset}`);
      console.log(`   ${colors.red}Duplicated in:${colors.reset}`);
      
      dup.tokens.forEach(token => {
        console.log(`     • ${colors.cyan}${token}${colors.reset}`);
      });
      console.log('');
    });
    
    // Recommendations
    console.log(`${colors.yellow}${colors.bold}💡 Recommendations:${colors.reset}`);
    console.log(`  1. ${colors.white}Consolidate duplicate OKLCH values into shared variables${colors.reset}`);
    console.log(`  2. ${colors.white}Use CSS variable references instead of hardcoded values${colors.reset}`);
    console.log(`  3. ${colors.white}Consider using semantic color names for better maintainability${colors.reset}\n`);
    
    return false;
  }

  /**
   * Print any errors encountered
   */
  printErrors() {
    if (this.errors.length > 0) {
      console.log(`${colors.red}${colors.bold}Errors encountered:${colors.reset}`);
      this.errors.forEach(error => {
        console.log(`  ${colors.red}• ${error}${colors.reset}`);
      });
      console.log('');
    }
  }
}

/**
 * Main validation function
 */
async function validateDesignTokens() {
  const validator = new ColorValidator();
  
  console.log(`${colors.cyan}${colors.bold}🚀 Starting Design Tokens Validation...${colors.reset}\n`);
  
  // Files to scan
  const filesToScan = [
    path.join(__dirname, 'design-tokens.js'),
    path.join(__dirname, 'context-variables.css')
  ];
  
  // Extract colors from all files
  for (const file of filesToScan) {
    if (!fs.existsSync(file)) {
      validator.errors.push(`File not found: ${file}`);
      continue;
    }
    
    console.log(`${colors.blue}📄 Scanning: ${colors.white}${path.relative(__dirname, file)}${colors.reset}`);
    
    if (file.endsWith('.js')) {
      validator.extractFromJS(file);
    } else if (file.endsWith('.css')) {
      validator.extractFromCSS(file);
    }
  }
  
  // Analyze duplications
  const duplicates = validator.analyze();
  
  // Generate report
  const isValid = validator.generateReport(duplicates);
  
  // Print any errors
  validator.printErrors();
  
  // Exit with appropriate code
  if (!isValid || validator.errors.length > 0) {
    console.log(`${colors.red}${colors.bold}💥 Validation failed! Fix duplications before proceeding.${colors.reset}`);
    process.exit(1);
  } else {
    console.log(`${colors.green}${colors.bold}🎉 All design tokens are valid!${colors.reset}`);
    process.exit(0);
  }
}

// Run validation if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  validateDesignTokens().catch(console.error);
}

export { validateDesignTokens, ColorValidator };