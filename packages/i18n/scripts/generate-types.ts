#!/usr/bin/env tsx
/**
 * TypeScript type generation script for i18n translation keys
 * Parses translation JSON files and generates type definitions
 * 
 * Usage: tsx scripts/generate-types.ts
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const LOCALES_DIR = join(__dirname, '../src/locales')
const OUTPUT_FILE = join(__dirname, '../src/types/generated.ts')

interface TranslationObject {
  [key: string]: string | TranslationObject
}

/**
 * Convert a translation object to TypeScript interface type
 * @param obj - Translation object to convert
 * @param interfaceName - Name for the generated interface
 * @param indent - Current indentation level
 * @returns TypeScript interface definition
 */
function generateInterfaceFromObject(
  obj: TranslationObject, 
  interfaceName: string, 
  indent: number = 0
): string {
  const spaces = '  '.repeat(indent)
  let result = `${spaces}interface ${interfaceName} {\n`
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      result += `${spaces}  "${key}": string\n`
    } else if (typeof value === 'object' && value !== null) {
      const nestedInterfaceName = `${interfaceName}${key.charAt(0).toUpperCase() + key.slice(1)}`
      result += `${spaces}  "${key}": ${nestedInterfaceName}\n`
    }
  }
  
  result += `${spaces}}\n`
  return result
}

/**
 * Generate nested interfaces for complex translation objects
 * @param obj - Translation object to process
 * @param baseName - Base name for interfaces
 * @param processed - Set to track processed interfaces
 * @returns Array of interface definitions
 */
function generateNestedInterfaces(
  obj: TranslationObject, 
  baseName: string, 
  processed: Set<string> = new Set()
): string[] {
  const interfaces: string[] = []
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && value !== null) {
      const interfaceName = `${baseName}${key.charAt(0).toUpperCase() + key.slice(1)}`
      
      if (!processed.has(interfaceName)) {
        processed.add(interfaceName)
        
        // Generate nested interfaces first
        interfaces.push(...generateNestedInterfaces(value, interfaceName, processed))
        
        // Generate this interface
        interfaces.push(generateInterfaceFromObject(value, interfaceName))
      }
    }
  }
  
  return interfaces
}

/**
 * Generate dot-notation key paths from translation object
 * @param obj - Translation object to process  
 * @param prefix - Current key prefix
 * @returns Array of dot-notation key paths
 */
function generateKeyPaths(obj: TranslationObject, prefix: string = ''): string[] {
  const paths: string[] = []
  
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = prefix ? `${prefix}.${key}` : key
    
    if (typeof value === 'string') {
      paths.push(currentPath)
    } else if (typeof value === 'object' && value !== null) {
      paths.push(...generateKeyPaths(value, currentPath))
    }
  }
  
  return paths
}

/**
 * Generate TypeScript types for a specific namespace
 * @param namespaceName - Name of the namespace (e.g., 'common', 'auth')
 * @param translations - Translation object for the namespace
 * @returns TypeScript type definitions as string
 */
function generateNamespaceTypes(namespaceName: string, translations: TranslationObject): string {
  const capitalizedName = namespaceName.charAt(0).toUpperCase() + namespaceName.slice(1)
  const interfaceName = `${capitalizedName}Translations`
  
  let result = `// Generated types for ${namespaceName} namespace\n\n`
  
  // Generate nested interfaces
  const nestedInterfaces = generateNestedInterfaces(translations, interfaceName)
  if (nestedInterfaces.length > 0) {
    result += `${nestedInterfaces.join('\n')  }\n`
  }
  
  // Generate main interface
  result += `${generateInterfaceFromObject(translations, interfaceName)  }\n`
  
  // Generate key paths union type
  const keyPaths = generateKeyPaths(translations)
  result += `export type ${capitalizedName}TranslationKeys = ${keyPaths.map(k => `'${k}'`).join(' | ')}\n\n`
  
  // Export the interface
  result += `export type { ${interfaceName} }\n\n`
  
  return result
}

/**
 * Main type generation function
 */
async function generateTypes() {
  try {
    console.log('🚀 Generating i18n TypeScript types...')
    
    // Check if Romanian locale directory exists
    const roLocaleDir = join(LOCALES_DIR, 'ro')
    if (!existsSync(roLocaleDir)) {
      throw new Error(`Romanian locale directory not found: ${roLocaleDir}`)
    }
    
    // Read all Romanian translation files
    const translationFiles = readdirSync(roLocaleDir)
      .filter(file => file.endsWith('.json'))
      .map(file => file.replace('.json', ''))
    
    if (translationFiles.length === 0) {
      throw new Error('No translation files found in Romanian locale directory')
    }
    
    console.log(`📁 Found ${translationFiles.length} translation files:`, translationFiles)
    
    let output = `/**
 * Generated TypeScript types for i18n translations
 * 
 * This file is auto-generated. DO NOT EDIT MANUALLY.
 * Run 'pnpm run generate-types' to regenerate.
 * 
 * Generated on: ${new Date().toISOString()}
 */

`
    
    const allNamespaces: string[] = []
    const allKeyTypes: string[] = []
    
    // Process each namespace
    for (const namespace of translationFiles) {
      const filePath = join(roLocaleDir, `${namespace}.json`)
      const translationContent = readFileSync(filePath, 'utf-8')
      const translations: TranslationObject = JSON.parse(translationContent)
      
      console.log(`⚙️  Processing ${namespace} namespace...`)
      
      // Generate types for this namespace
      output += generateNamespaceTypes(namespace, translations)
      
      allNamespaces.push(namespace)
      const capitalizedName = namespace.charAt(0).toUpperCase() + namespace.slice(1)
      allKeyTypes.push(`${capitalizedName}TranslationKeys`)
    }
    
    // Generate union types for all namespaces
    output += `// Union types for all namespaces\n`
    output += `export type AllNamespaces = ${allNamespaces.map(ns => `'${ns}'`).join(' | ')}\n\n`
    output += `export type AllTranslationKeys = ${allKeyTypes.join(' | ')}\n\n`
    
    // Generate namespace-to-keys mapping
    output += `// Namespace to keys mapping\n`
    output += `export interface NamespaceTranslationKeys {\n`
    for (const namespace of translationFiles) {
      const capitalizedName = namespace.charAt(0).toUpperCase() + namespace.slice(1)
      output += `  '${namespace}': ${capitalizedName}TranslationKeys\n`
    }
    output += `}\n\n`
    
    // Generate utility type for namespaced keys
    output += `// Utility type for namespaced translation keys\n`
    output += `export type NamespacedKey<T extends AllNamespaces> = NamespaceTranslationKeys[T]\n\n`
    
    // Write output file
    writeFileSync(OUTPUT_FILE, output, 'utf-8')
    
    console.log(`✅ Successfully generated types in: ${OUTPUT_FILE}`)
    console.log(`📊 Generated types for ${allNamespaces.length} namespaces`)
    
  } catch (error) {
    console.error('❌ Error generating types:', error)
    process.exit(1)
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  generateTypes()
}