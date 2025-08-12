#!/usr/bin/env tsx

/**
 * Missing Translation Detection Script
 * 
 * This script detects missing translations by comparing:
 * 1. Translation keys used in source code vs. available translations
 * 2. Translation keys available in Romanian vs. English (for future internationalization)
 * 3. Orphaned translations that aren't used in code
 * 
 * Usage:
 *   npx tsx scripts/detect-missing.ts [--fix] [--namespace=common,auth] [--lang=en,ro]
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { resolve, join } from 'path'
import { glob } from 'glob'

interface MissingTranslation {
  namespace: string
  key: string
  language: string
  usedInFiles: string[]
  context?: string
}

interface OrphanedTranslation {
  namespace: string
  key: string
  language: string
  value: string
}

interface DetectionOptions {
  fix: boolean
  namespaces: string[]
  languages: string[]
  verbose: boolean
}

interface DetectionResult {
  missingTranslations: MissingTranslation[]
  orphanedTranslations: OrphanedTranslation[]
  summary: {
    totalMissing: number
    totalOrphaned: number
    missingByLanguage: Record<string, number>
    missingByNamespace: Record<string, number>
  }
}

/**
 * Missing Translation Detector
 */
class MissingTranslationDetector {
  private readonly projectRoot: string
  private readonly localesPath: string

  constructor() {
    this.projectRoot = resolve(__dirname, '../../../')
    this.localesPath = resolve(__dirname, '../src/locales')
  }

  /**
   * Main detection method
   */
  async detect(options: DetectionOptions): Promise<DetectionResult> {
    console.log('🔍 Detecting missing translations...')

    // Extract all translation keys from source code
    const usedKeys = await this.extractUsedTranslationKeys()
    
    // Load all existing translations
    const existingTranslations = await this.loadAllTranslations(options.languages)
    
    // Find missing translations
    const missingTranslations = this.findMissingTranslations(
      usedKeys, 
      existingTranslations, 
      options.languages,
      options.namespaces
    )
    
    // Find orphaned translations
    const orphanedTranslations = this.findOrphanedTranslations(
      usedKeys,
      existingTranslations,
      options.languages,
      options.namespaces
    )
    
    // Generate summary
    const summary = this.generateSummary(missingTranslations, orphanedTranslations)
    
    return {
      missingTranslations,
      orphanedTranslations,
      summary
    }
  }

  /**
   * Extract all translation keys used in source code
   */
  private async extractUsedTranslationKeys(): Promise<Map<string, Set<string>>> {
    const usedKeys = new Map<string, Set<string>>()
    
    // Find all source files
    const sourceFiles = await glob([
      'packages/*/src/**/*.{ts,tsx}',
      'apps/*/src/**/*.{ts,tsx}',
      '!**/*.d.ts',
      '!**/*.test.{ts,tsx}',
      '!**/*.spec.{ts,tsx}',
      '!**/node_modules/**',
      '!**/dist/**'
    ], { cwd: this.projectRoot })
    
    for (const file of sourceFiles) {
      const filePath = resolve(this.projectRoot, file)
      const content = readFileSync(filePath, 'utf-8')
      
      // Extract translation keys from this file
      const fileKeys = this.extractKeysFromContent(content, file)
      
      // Merge with overall used keys
      fileKeys.forEach((keys, namespace) => {
        if (!usedKeys.has(namespace)) {
          usedKeys.set(namespace, new Set())
        }
        keys.forEach(key => usedKeys.get(namespace)!.add(key))
      })
    }
    
    return usedKeys
  }

  /**
   * Extract translation keys from file content
   */
  private extractKeysFromContent(content: string, filePath: string): Map<string, Set<string>> {
    const keys = new Map<string, Set<string>>()
    
    // Regular expressions for different translation patterns
    const patterns = [
      // t('key') or t("key") - assumes 'common' namespace
      { pattern: /\bt\s*\(\s*['"`]([^'"`\.]+)['"`]\s*\)/g, defaultNamespace: 'common' },
      // t('namespace.key') or t("namespace.key")
      { pattern: /\bt\s*\(\s*['"`]([^'"`]+\.[^'"`]+)['"`]/g, defaultNamespace: null },
      // useTranslation('namespace') - look for the namespace
      { pattern: /useTranslation\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g, defaultNamespace: null },
      // Trans component i18nKey prop
      { pattern: /i18nKey\s*=\s*['"`]([^'"`]+)['"`]/g, defaultNamespace: 'common' }
    ]
    
    patterns.forEach(({ pattern, defaultNamespace }) => {
      let match
      while ((match = pattern.exec(content)) !== null) {
        const fullKey = match[1]
        
        let namespace: string
        let key: string
        
        if (fullKey.includes('.') && defaultNamespace === null) {
          // For patterns like 'namespace.key'
          const [ns, ...keyParts] = fullKey.split('.')
          namespace = ns
          key = keyParts.join('.')
        } else if (defaultNamespace) {
          // For patterns that assume a default namespace
          namespace = defaultNamespace
          key = fullKey
        } else {
          // For useTranslation patterns, this is just a namespace
          namespace = fullKey
          key = '' // No specific key, just namespace usage
        }
        
        if (key) { // Only add if we have an actual key, not just namespace
          if (!keys.has(namespace)) {
            keys.set(namespace, new Set())
          }
          keys.get(namespace)!.add(key)
        }
      }
    })
    
    return keys
  }

  /**
   * Load all translation files for specified languages
   */
  private async loadAllTranslations(languages: string[]): Promise<Record<string, Record<string, any>>> {
    const translations: Record<string, Record<string, any>> = {}
    
    for (const lang of languages) {
      const langPath = join(this.localesPath, lang)
      if (!existsSync(langPath)) {
        console.warn(`⚠️  Language directory not found: ${langPath}`)
        continue
      }
      
      const translationFiles = await glob('*.json', { cwd: langPath })
      
      for (const file of translationFiles) {
        const namespace = file.replace('.json', '')
        const key = `${lang}.${namespace}`
        
        try {
          const filePath = join(langPath, file)
          const content = readFileSync(filePath, 'utf-8')
          translations[key] = JSON.parse(content)
        } catch (error) {
          console.warn(`⚠️  Failed to load ${file} for ${lang}:`, error)
          translations[key] = {}
        }
      }
    }
    
    return translations
  }

  /**
   * Find missing translations
   */
  private findMissingTranslations(
    usedKeys: Map<string, Set<string>>,
    existingTranslations: Record<string, Record<string, any>>,
    languages: string[],
    filterNamespaces?: string[]
  ): MissingTranslation[] {
    const missing: MissingTranslation[] = []
    
    usedKeys.forEach((keys, namespace) => {
      // Skip if namespace filter is specified and this namespace isn't included
      if (filterNamespaces && filterNamespaces.length > 0 && !filterNamespaces.includes(namespace)) {
        return
      }
      
      keys.forEach(key => {
        languages.forEach(language => {
          const translationKey = `${language}.${namespace}`
          const namespaceTranslations = existingTranslations[translationKey]
          
          if (!namespaceTranslations) {
            missing.push({
              namespace,
              key,
              language,
              usedInFiles: [] // TODO: Track which files use this key
            })
            return
          }
          
          // Check if the specific key exists (handle nested keys)
          if (!this.keyExistsInTranslations(namespaceTranslations, key)) {
            missing.push({
              namespace,
              key,
              language,
              usedInFiles: [] // TODO: Track which files use this key
            })
          }
        })
      })
    })
    
    return missing
  }

  /**
   * Find orphaned translations (exist in files but not used in code)
   */
  private findOrphanedTranslations(
    usedKeys: Map<string, Set<string>>,
    existingTranslations: Record<string, Record<string, any>>,
    languages: string[],
    filterNamespaces?: string[]
  ): OrphanedTranslation[] {
    const orphaned: OrphanedTranslation[] = []
    
    Object.entries(existingTranslations).forEach(([langNamespace, translations]) => {
      const [language, namespace] = langNamespace.split('.')
      
      // Skip if namespace filter is specified and this namespace isn't included
      if (filterNamespaces && filterNamespaces.length > 0 && !filterNamespaces.includes(namespace)) {
        return
      }
      
      // Get all keys from translation file
      const translationKeys = this.getAllKeysFromTranslations(translations)
      const usedKeysForNamespace = usedKeys.get(namespace) || new Set()
      
      translationKeys.forEach(key => {
        if (!usedKeysForNamespace.has(key)) {
          orphaned.push({
            namespace,
            key,
            language,
            value: this.getTranslationValue(translations, key)
          })
        }
      })
    })
    
    return orphaned
  }

  /**
   * Check if a key exists in translations (handles nested keys)
   */
  private keyExistsInTranslations(translations: Record<string, any>, key: string): boolean {
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
   * Get all keys from translation object (flattened)
   */
  private getAllKeysFromTranslations(translations: Record<string, any>, prefix = ''): string[] {
    const keys: string[] = []
    
    Object.entries(translations).forEach(([key, value]) => {
      const fullKey = prefix ? `${prefix}.${key}` : key
      
      if (typeof value === 'object' && value !== null) {
        // Recursive for nested objects
        keys.push(...this.getAllKeysFromTranslations(value, fullKey))
      } else {
        keys.push(fullKey)
      }
    })
    
    return keys
  }

  /**
   * Get translation value for a key (handles nested keys)
   */
  private getTranslationValue(translations: Record<string, any>, key: string): string {
    const keyParts = key.split('.')
    let current = translations
    
    for (const part of keyParts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part]
      } else {
        return ''
      }
    }
    
    return typeof current === 'string' ? current : JSON.stringify(current)
  }

  /**
   * Generate detection summary
   */
  private generateSummary(
    missing: MissingTranslation[],
    orphaned: OrphanedTranslation[]
  ) {
    const missingByLanguage: Record<string, number> = {}
    const missingByNamespace: Record<string, number> = {}
    
    missing.forEach(item => {
      missingByLanguage[item.language] = (missingByLanguage[item.language] || 0) + 1
      missingByNamespace[item.namespace] = (missingByNamespace[item.namespace] || 0) + 1
    })
    
    return {
      totalMissing: missing.length,
      totalOrphaned: orphaned.length,
      missingByLanguage,
      missingByNamespace
    }
  }

  /**
   * Output detection results
   */
  outputResults(result: DetectionResult, options: DetectionOptions): void {
    console.log('\n🌍 Missing Translation Detection Results')
    console.log('=======================================')
    console.log(`Missing translations: ${result.summary.totalMissing}`)
    console.log(`Orphaned translations: ${result.summary.totalOrphaned}`)
    
    // Missing by language
    if (Object.keys(result.summary.missingByLanguage).length > 0) {
      console.log('\n❌ Missing by language:')
      Object.entries(result.summary.missingByLanguage).forEach(([lang, count]) => {
        console.log(`  ${lang}: ${count}`)
      })
    }
    
    // Missing by namespace
    if (Object.keys(result.summary.missingByNamespace).length > 0) {
      console.log('\n📂 Missing by namespace:')
      Object.entries(result.summary.missingByNamespace).forEach(([ns, count]) => {
        console.log(`  ${ns}: ${count}`)
      })
    }
    
    // List missing translations if verbose or if there aren't too many
    if (options.verbose || result.missingTranslations.length <= 20) {
      console.log('\n❌ Missing translations:')
      result.missingTranslations.forEach(missing => {
        console.log(`  ${missing.language}.${missing.namespace}.${missing.key}`)
      })
    } else if (result.missingTranslations.length > 20) {
      console.log(`\n❌ ${result.missingTranslations.length} missing translations (use --verbose to see all)`)
    }
    
    // List orphaned translations if there aren't too many
    if (result.orphanedTranslations.length > 0) {
      console.log('\n🗑️  Orphaned translations (exist but not used):')
      if (options.verbose || result.orphanedTranslations.length <= 10) {
        result.orphanedTranslations.forEach(orphaned => {
          console.log(`  ${orphaned.language}.${orphaned.namespace}.${orphaned.key} = "${orphaned.value}"`)
        })
      } else {
        console.log(`  ${result.orphanedTranslations.length} orphaned translations (use --verbose to see all)`)
      }
    }
    
    // Suggestions
    if (result.summary.totalMissing > 0) {
      console.log('\n💡 Suggestions:')
      console.log('  - Run with --fix to auto-generate placeholder entries')
      console.log('  - Use extract-keys script to see all used translation keys')
      console.log('  - Check if translation keys follow the correct namespace.key format')
    }
    
    if (result.summary.totalOrphaned > 0) {
      console.log('  - Review orphaned translations - they might be safe to remove')
      console.log('  - Or they might be used dynamically and need code pattern updates')
    }
  }

  /**
   * Automatically fix missing translations by adding placeholder entries
   */
  async autoFix(result: DetectionResult): Promise<void> {
    console.log('\n🔧 Auto-fixing missing translations...')
    
    // Group missing translations by language and namespace
    const grouped = new Map<string, Map<string, string[]>>()
    
    result.missingTranslations.forEach(missing => {
      const langKey = missing.language
      if (!grouped.has(langKey)) {
        grouped.set(langKey, new Map())
      }
      
      const langMap = grouped.get(langKey)!
      if (!langMap.has(missing.namespace)) {
        langMap.set(missing.namespace, [])
      }
      
      langMap.get(missing.namespace)!.push(missing.key)
    })
    
    // Apply fixes to each file
    grouped.forEach((namespaces, language) => {
      namespaces.forEach((keys, namespace) => {
        this.addMissingKeysToFile(language, namespace, keys)
      })
    })
    
    console.log('✅ Auto-fix complete!')
  }

  /**
   * Add missing keys to a translation file
   */
  private addMissingKeysToFile(language: string, namespace: string, keys: string[]): void {
    const filePath = join(this.localesPath, language, `${namespace}.json`)
    
    let translations = {}
    if (existsSync(filePath)) {
      try {
        const content = readFileSync(filePath, 'utf-8')
        translations = JSON.parse(content)
      } catch (error) {
        console.warn(`⚠️  Failed to read ${filePath}:`, error)
      }
    }
    
    // Add missing keys with placeholder values
    keys.forEach(key => {
      this.setNestedKey(translations, key, `TODO: Translate '${key}'`)
    })
    
    // Write back to file
    try {
      writeFileSync(filePath, `${JSON.stringify(translations, null, 2)  }\n`)
      console.log(`  📝 Added ${keys.length} keys to ${language}/${namespace}.json`)
    } catch (error) {
      console.error(`❌ Failed to write ${filePath}:`, error)
    }
  }

  /**
   * Set a nested key in an object
   */
  private setNestedKey(obj: any, key: string, value: any): void {
    const keyParts = key.split('.')
    let current = obj
    
    for (let i = 0; i < keyParts.length - 1; i++) {
      const part = keyParts[i]
      if (!(part in current)) {
        current[part] = {}
      }
      current = current[part]
    }
    
    const lastPart = keyParts[keyParts.length - 1]
    if (!(lastPart in current)) {
      current[lastPart] = value
    }
  }
}

/**
 * Parse command line arguments
 */
function parseArgs(): DetectionOptions {
  const args = process.argv.slice(2)
  const options: DetectionOptions = {
    fix: false,
    namespaces: [],
    languages: ['ro', 'en'],
    verbose: false
  }
  
  args.forEach(arg => {
    if (arg === '--fix') {
      options.fix = true
    } else if (arg.startsWith('--namespace=')) {
      options.namespaces = arg.split('=')[1].split(',')
    } else if (arg.startsWith('--lang=')) {
      options.languages = arg.split('=')[1].split(',')
    } else if (arg === '--verbose') {
      options.verbose = true
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
    const detector = new MissingTranslationDetector()
    
    console.log('🔍 Missing Translation Detection Tool')
    console.log('====================================')
    
    const result = await detector.detect(options)
    detector.outputResults(result, options)
    
    if (options.fix && result.missingTranslations.length > 0) {
      await detector.autoFix(result)
    }
    
    // Exit with error code if there are missing translations (for CI)
    if (result.missingTranslations.length > 0 && !options.fix) {
      process.exit(1)
    }
    
  } catch (error) {
    console.error('❌ Detection failed:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}