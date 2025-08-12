#!/usr/bin/env tsx

/**
 * Translation Key Extraction Script
 * 
 * This script scans TypeScript/TSX files in the monorepo and extracts all translation keys
 * used in t('key') calls, organizing them by namespace for validation and completion.
 * 
 * Usage:
 *   npx tsx scripts/extract-keys.ts [--format=json|csv|summary] [--namespace=common,auth] [--missing-only]
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { resolve, relative, join } from 'path'
import { glob } from 'glob'

interface ExtractedKey {
  key: string
  namespace: string
  file: string
  line: number
  context: string
}

interface ExtractionOptions {
  format: 'json' | 'csv' | 'summary'
  namespaces: string[]
  missingOnly: boolean
  outputFile?: string
}

interface ExtractionResult {
  totalKeys: number
  totalFiles: number
  keysByNamespace: Record<string, ExtractedKey[]>
  missingKeys: ExtractedKey[]
  existingTranslations: Record<string, Record<string, any>>
}

/**
 * Extract translation keys from TypeScript/TSX source files
 */
class TranslationKeyExtractor {
  private readonly projectRoot: string
  private readonly translationsPath: string

  constructor() {
    this.projectRoot = resolve(__dirname, '../../../')
    this.translationsPath = resolve(__dirname, '../src/locales/ro')
  }

  /**
   * Main extraction method
   */
  async extract(options: ExtractionOptions): Promise<ExtractionResult> {
    console.log('🔍 Scanning for translation keys...')
    
    const sourceFiles = await this.findSourceFiles()
    const extractedKeys: ExtractedKey[] = []
    
    for (const file of sourceFiles) {
      const keys = await this.extractKeysFromFile(file)
      extractedKeys.push(...keys)
    }
    
    // Load existing translations for comparison
    const existingTranslations = await this.loadExistingTranslations()
    
    // Organize keys by namespace
    const keysByNamespace = this.organizeKeysByNamespace(extractedKeys)
    
    // Find missing keys
    const missingKeys = this.findMissingKeys(extractedKeys, existingTranslations)
    
    return {
      totalKeys: extractedKeys.length,
      totalFiles: sourceFiles.length,
      keysByNamespace,
      missingKeys,
      existingTranslations
    }
  }

  /**
   * Find all TypeScript/TSX source files in the monorepo
   */
  private async findSourceFiles(): Promise<string[]> {
    const patterns = [
      'packages/*/src/**/*.{ts,tsx}',
      'apps/*/src/**/*.{ts,tsx}',
      '!**/*.d.ts',
      '!**/*.test.{ts,tsx}',
      '!**/*.spec.{ts,tsx}',
      '!**/node_modules/**',
      '!**/dist/**'
    ]
    
    const files = await glob(patterns, { cwd: this.projectRoot })
    return files.map(file => resolve(this.projectRoot, file))
  }

  /**
   * Extract translation keys from a single file
   */
  private async extractKeysFromFile(filePath: string): Promise<ExtractedKey[]> {
    const content = readFileSync(filePath, 'utf-8')
    const lines = content.split('\n')
    const keys: ExtractedKey[] = []
    
    // Regular expressions to match translation key patterns
    const patterns = [
      // t('key') or t("key")
      /\bt\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g,
      // t('namespace.key') or t("namespace.key")
      /\bt\s*\(\s*['"`]([^'"`]+\.[^'"`]+)['"`]\s*(?:,|\))/g,
      // useTranslation('namespace') calls
      /useTranslation\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g,
      // Trans component i18nKey prop
      /i18nKey\s*=\s*['"`]([^'"`]+)['"`]/g
    ]
    
    lines.forEach((line, lineIndex) => {
      patterns.forEach(pattern => {
        let match
        while ((match = pattern.exec(line)) !== null) {
          const fullKey = match[1]
          const [namespace, ...keyParts] = fullKey.includes('.') 
            ? fullKey.split('.')
            : ['common', fullKey]
          const key = keyParts.length > 0 ? keyParts.join('.') : fullKey
          
          keys.push({
            key,
            namespace,
            file: relative(this.projectRoot, filePath),
            line: lineIndex + 1,
            context: line.trim()
          })
        }
      })
    })
    
    return keys
  }

  /**
   * Load existing translation files
   */
  private async loadExistingTranslations(): Promise<Record<string, Record<string, any>>> {
    const translations: Record<string, Record<string, any>> = {}
    
    const translationFiles = await glob('*.json', { cwd: this.translationsPath })
    
    for (const file of translationFiles) {
      const namespace = file.replace('.json', '')
      const filePath = join(this.translationsPath, file)
      
      try {
        const content = readFileSync(filePath, 'utf-8')
        translations[namespace] = JSON.parse(content)
      } catch (error) {
        console.warn(`⚠️  Failed to load translations from ${file}:`, error)
        translations[namespace] = {}
      }
    }
    
    return translations
  }

  /**
   * Organize extracted keys by namespace
   */
  private organizeKeysByNamespace(keys: ExtractedKey[]): Record<string, ExtractedKey[]> {
    const organized: Record<string, ExtractedKey[]> = {}
    
    keys.forEach(key => {
      if (!organized[key.namespace]) {
        organized[key.namespace] = []
      }
      organized[key.namespace].push(key)
    })
    
    // Sort keys within each namespace
    Object.keys(organized).forEach(namespace => {
      organized[namespace].sort((a, b) => a.key.localeCompare(b.key))
    })
    
    return organized
  }

  /**
   * Find keys that are used in code but missing from translation files
   */
  private findMissingKeys(
    extractedKeys: ExtractedKey[], 
    existingTranslations: Record<string, Record<string, any>>
  ): ExtractedKey[] {
    const missing: ExtractedKey[] = []
    
    extractedKeys.forEach(extracted => {
      const namespaceTranslations = existingTranslations[extracted.namespace]
      if (!namespaceTranslations) {
        missing.push(extracted)
        return
      }
      
      // Check if the key exists in translations (handle nested keys)
      const keyExists = this.checkNestedKeyExists(namespaceTranslations, extracted.key)
      if (!keyExists) {
        missing.push(extracted)
      }
    })
    
    return missing
  }

  /**
   * Check if a nested key exists in translations object
   */
  private checkNestedKeyExists(translations: Record<string, any>, key: string): boolean {
    const keyParts = key.split('.')
    let current = translations
    
    for (const part of keyParts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part]
      } else {
        return false
      }
    }
    
    return true
  }

  /**
   * Output results in different formats
   */
  outputResults(result: ExtractionResult, options: ExtractionOptions): void {
    switch (options.format) {
      case 'json':
        this.outputJSON(result, options.outputFile)
        break
      case 'csv':
        this.outputCSV(result, options.outputFile)
        break
      case 'summary':
      default:
        this.outputSummary(result, options)
        break
    }
  }

  private outputJSON(result: ExtractionResult, outputFile?: string): void {
    const output = JSON.stringify(result, null, 2)
    
    if (outputFile) {
      writeFileSync(outputFile, output)
      console.log(`📄 JSON output written to ${outputFile}`)
    } else {
      console.log(output)
    }
  }

  private outputCSV(result: ExtractionResult, outputFile?: string): void {
    const csvLines = ['Namespace,Key,File,Line,Context']
    
    Object.entries(result.keysByNamespace).forEach(([namespace, keys]) => {
      keys.forEach(key => {
        const csvLine = [
          namespace,
          key.key,
          key.file,
          key.line.toString(),
          `"${key.context.replace(/"/g, '""')}"`
        ].join(',')
        csvLines.push(csvLine)
      })
    })
    
    const output = csvLines.join('\n')
    
    if (outputFile) {
      writeFileSync(outputFile, output)
      console.log(`📊 CSV output written to ${outputFile}`)
    } else {
      console.log(output)
    }
  }

  private outputSummary(result: ExtractionResult, options: ExtractionOptions): void {
    console.log('\n📊 Translation Key Extraction Summary')
    console.log('=====================================')
    console.log(`Total keys found: ${result.totalKeys}`)
    console.log(`Total files scanned: ${result.totalFiles}`)
    console.log(`Missing keys: ${result.missingKeys.length}`)
    console.log('')
    
    // Summary by namespace
    console.log('📂 Keys by namespace:')
    Object.entries(result.keysByNamespace).forEach(([namespace, keys]) => {
      const existingCount = Object.keys(result.existingTranslations[namespace] || {}).length
      console.log(`  ${namespace}: ${keys.length} used (${existingCount} existing)`)
    })
    
    // Show missing keys if any
    if (result.missingKeys.length > 0) {
      console.log('\n❌ Missing translation keys:')
      const missingByNamespace = this.organizeKeysByNamespace(result.missingKeys)
      
      Object.entries(missingByNamespace).forEach(([namespace, keys]) => {
        console.log(`\n  📁 ${namespace}:`)
        keys.forEach(key => {
          console.log(`    - ${key.key} (${key.file}:${key.line})`)
        })
      })
    } else {
      console.log('\n✅ All translation keys have corresponding translations!')
    }
  }
}

/**
 * Parse command line arguments
 */
function parseArgs(): ExtractionOptions {
  const args = process.argv.slice(2)
  const options: ExtractionOptions = {
    format: 'summary',
    namespaces: [],
    missingOnly: false
  }
  
  args.forEach(arg => {
    if (arg.startsWith('--format=')) {
      const format = arg.split('=')[1] as 'json' | 'csv' | 'summary'
      if (['json', 'csv', 'summary'].includes(format)) {
        options.format = format
      }
    } else if (arg.startsWith('--namespace=')) {
      options.namespaces = arg.split('=')[1].split(',')
    } else if (arg === '--missing-only') {
      options.missingOnly = true
    } else if (arg.startsWith('--output=')) {
      options.outputFile = arg.split('=')[1]
    }
  })
  
  return options
}

/**
 * Main execution
 */
async function main() {
  try {
    const options = parseArgs()
    const extractor = new TranslationKeyExtractor()
    
    console.log('🌍 Translation Key Extraction Tool')
    console.log('==================================')
    
    const result = await extractor.extract(options)
    
    // Filter by namespace if specified
    if (options.namespaces.length > 0) {
      const filtered = { ...result }
      filtered.keysByNamespace = {}
      options.namespaces.forEach(ns => {
        if (result.keysByNamespace[ns]) {
          filtered.keysByNamespace[ns] = result.keysByNamespace[ns]
        }
      })
      filtered.totalKeys = Object.values(filtered.keysByNamespace).flat().length
      extractor.outputResults(filtered, options)
    } else {
      extractor.outputResults(result, options)
    }
    
  } catch (error) {
    console.error('❌ Extraction failed:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}