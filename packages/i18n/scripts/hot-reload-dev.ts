#!/usr/bin/env tsx

/**
 * Translation Hot-Reload Development Server
 * 
 * This script provides hot-reload support for translation file changes during development.
 * It watches translation files and can notify connected applications to reload translations.
 * 
 * Features:
 * - File system watching for translation files
 * - WebSocket server for real-time notifications
 * - Translation validation on file changes  
 * - Development-only translation debug overlay
 * 
 * Usage:
 *   npx tsx scripts/hot-reload-dev.ts [--port=3001] [--debug] [--validate]
 */

import { readFileSync, existsSync, watch } from 'fs'
import { resolve, join, relative } from 'path'
import { WebSocketServer, WebSocket } from 'ws'
import { createServer } from 'http'

interface HotReloadOptions {
  port: number
  debug: boolean
  validate: boolean
  verbose: boolean
}

interface TranslationChange {
  type: 'change' | 'add' | 'remove'
  language: string
  namespace: string
  filePath: string
  timestamp: number
  validation?: {
    valid: boolean
    errors: string[]
  }
}

interface ConnectedClient {
  ws: WebSocket
  id: string
  userAgent?: string
  connectedAt: number
}

/**
 * Translation Hot-Reload Development Server
 */
class TranslationHotReloadServer {
  private readonly localesPath: string
  private readonly options: HotReloadOptions
  private wss: WebSocketServer | null = null
  private server: any = null
  private clients: Map<string, ConnectedClient> = new Map()
  private watchedFiles: Map<string, any> = new Map()

  constructor(options: HotReloadOptions) {
    this.localesPath = resolve(__dirname, '../src/locales')
    this.options = options
  }

  /**
   * Start the hot-reload server
   */
  async start(): Promise<void> {
    console.log('🌍 Starting Translation Hot-Reload Server...')
    console.log('=============================================')
    
    // Create HTTP server for WebSocket upgrade
    this.server = createServer()
    
    // Create WebSocket server
    this.wss = new WebSocketServer({ server: this.server })
    
    // Handle WebSocket connections
    this.wss.on('connection', (ws, req) => {
      this.handleNewConnection(ws, req)
    })
    
    // Start watching translation files
    await this.startWatching()
    
    // Start the server
    this.server.listen(this.options.port, () => {
      console.log(`🚀 Hot-reload server running on ws://localhost:${this.options.port}`)
      console.log(`📁 Watching translations in: ${relative(process.cwd(), this.localesPath)}`)
      console.log('💡 Connect your development app to receive real-time updates')
      console.log('')
      console.log('📝 Usage in React app:')
      console.log('   import { useTranslationHotReload } from "@coquinate/i18n/dev"')
      console.log('   useTranslationHotReload() // In your root component')
      console.log('')
    })
  }

  /**
   * Handle new WebSocket connection
   */
  private handleNewConnection(ws: WebSocket, req: any): void {
    const clientId = this.generateClientId()
    const client: ConnectedClient = {
      ws,
      id: clientId,
      userAgent: req.headers['user-agent'],
      connectedAt: Date.now()
    }
    
    this.clients.set(clientId, client)
    
    if (this.options.verbose) {
      console.log(`🔌 Client connected: ${clientId} (${client.userAgent})`)
    }
    
    // Send initial connection confirmation
    this.sendToClient(client, {
      type: 'connected',
      clientId,
      timestamp: Date.now(),
      availableLanguages: this.getAvailableLanguages(),
      availableNamespaces: this.getAvailableNamespaces()
    })
    
    // Handle client disconnection
    ws.on('close', () => {
      this.clients.delete(clientId)
      if (this.options.verbose) {
        console.log(`🔌 Client disconnected: ${clientId}`)
      }
    })
    
    // Handle client messages
    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString())
        this.handleClientMessage(client, message)
      } catch (error) {
        console.warn(`⚠️  Invalid message from client ${clientId}:`, error)
      }
    })
  }

  /**
   * Handle messages from connected clients
   */
  private handleClientMessage(client: ConnectedClient, message: any): void {
    switch (message.type) {
      case 'ping':
        this.sendToClient(client, { type: 'pong', timestamp: Date.now() })
        break
        
      case 'request-current-translations':
        this.sendCurrentTranslations(client, message.language, message.namespace)
        break
        
      case 'validate-key':
        this.validateTranslationKey(client, message.key, message.namespace, message.language)
        break
        
      default:
        if (this.options.verbose) {
          console.log(`📨 Unknown message type from ${client.id}:`, message.type)
        }
    }
  }

  /**
   * Start watching translation files
   */
  private async startWatching(): Promise<void> {
    if (!existsSync(this.localesPath)) {
      console.error(`❌ Locales path not found: ${this.localesPath}`)
      return
    }
    
    console.log('👀 Starting file watchers...')
    
    // Watch each language directory
    const languages = this.getAvailableLanguages()
    
    for (const language of languages) {
      const langPath = join(this.localesPath, language)
      if (existsSync(langPath)) {
        this.watchDirectory(langPath, language)
      }
    }
    
    console.log(`✅ Watching ${languages.length} language directories`)
  }

  /**
   * Watch a specific language directory
   */
  private watchDirectory(langPath: string, language: string): void {
    const watcher = watch(langPath, { recursive: true }, (eventType, filename) => {
      if (!filename || !filename.endsWith('.json')) {
        return
      }
      
      const filePath = join(langPath, filename)
      const namespace = filename.replace('.json', '')
      
      this.handleFileChange(eventType, filePath, language, namespace)
    })
    
    this.watchedFiles.set(language, watcher)
    
    if (this.options.verbose) {
      console.log(`  📁 ${language}/ - watching for changes`)
    }
  }

  /**
   * Handle translation file changes
   */
  private handleFileChange(
    eventType: string, 
    filePath: string, 
    language: string, 
    namespace: string
  ): void {
    const changeType = eventType === 'rename' 
      ? (existsSync(filePath) ? 'add' : 'remove')
      : 'change'
    
    console.log(`📝 ${changeType.toUpperCase()}: ${language}/${namespace}.json`)
    
    const change: TranslationChange = {
      type: changeType as any,
      language,
      namespace,
      filePath: relative(this.localesPath, filePath),
      timestamp: Date.now()
    }
    
    // Validate the file if validation is enabled
    if (this.options.validate && changeType !== 'remove') {
      change.validation = this.validateTranslationFile(filePath)
      
      if (!change.validation.valid) {
        console.error(`❌ Validation errors in ${language}/${namespace}.json:`)
        change.validation.errors.forEach(error => {
          console.error(`  - ${error}`)
        })
      } else if (this.options.verbose) {
        console.log(`✅ Validation passed for ${language}/${namespace}.json`)
      }
    }
    
    // Broadcast change to all connected clients
    this.broadcastChange(change)
  }

  /**
   * Validate a translation file
   */
  private validateTranslationFile(filePath: string): { valid: boolean; errors: string[] } {
    const errors: string[] = []
    
    try {
      const content = readFileSync(filePath, 'utf-8')
      
      // Check JSON validity
      let translations
      try {
        translations = JSON.parse(content)
      } catch (parseError) {
        errors.push(`Invalid JSON: ${parseError}`)
        return { valid: false, errors }
      }
      
      // Check for common translation issues
      this.validateTranslationStructure(translations, '', errors)
      
      // Check for duplicate keys (case sensitivity)
      this.checkDuplicateKeys(translations, '', errors)
      
      // Check for missing interpolation variables
      this.checkInterpolationVariables(translations, '', errors)
      
    } catch (error) {
      errors.push(`File read error: ${error}`)
    }
    
    return { valid: errors.length === 0, errors }
  }

  /**
   * Validate translation structure recursively
   */
  private validateTranslationStructure(
    obj: any, 
    keyPath: string, 
    errors: string[]
  ): void {
    if (typeof obj !== 'object' || obj === null) {
      return
    }
    
    Object.entries(obj).forEach(([key, value]) => {
      const currentPath = keyPath ? `${keyPath}.${key}` : key
      
      // Check key format
      if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(key)) {
        errors.push(`Invalid key format: "${currentPath}" - use camelCase or snake_case`)
      }
      
      if (typeof value === 'object' && value !== null) {
        // Recursive validation for nested objects
        this.validateTranslationStructure(value, currentPath, errors)
      } else if (typeof value === 'string') {
        // Check for common string issues
        if (value.trim() === '') {
          errors.push(`Empty translation: "${currentPath}"`)
        }
        
        // Check for potentially untranslated content (common English words in Romanian files)
        if (currentPath.includes('ro') && this.looksLikeUntranslatedEnglish(value)) {
          errors.push(`Possibly untranslated English: "${currentPath}" = "${value}"`)
        }
      } else {
        errors.push(`Invalid value type for "${currentPath}": expected string or object, got ${typeof value}`)
      }
    })
  }

  /**
   * Check for duplicate keys (case insensitive)
   */
  private checkDuplicateKeys(obj: any, keyPath: string, errors: string[]): void {
    if (typeof obj !== 'object' || obj === null) {
      return
    }
    
    const keysLowerCase = new Set<string>()
    const duplicates = new Set<string>()
    
    Object.keys(obj).forEach(key => {
      const lowerKey = key.toLowerCase()
      if (keysLowerCase.has(lowerKey)) {
        duplicates.add(lowerKey)
      }
      keysLowerCase.add(lowerKey)
    })
    
    duplicates.forEach(duplicate => {
      const fullPath = keyPath ? `${keyPath}.${duplicate}` : duplicate
      errors.push(`Case-insensitive duplicate key: "${fullPath}"`)
    })
    
    // Recursive check
    Object.entries(obj).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        const currentPath = keyPath ? `${keyPath}.${key}` : key
        this.checkDuplicateKeys(value, currentPath, errors)
      }
    })
  }

  /**
   * Check for interpolation variable consistency
   */
  private checkInterpolationVariables(obj: any, keyPath: string, errors: string[]): void {
    if (typeof obj !== 'object' || obj === null) {
      return
    }
    
    Object.entries(obj).forEach(([key, value]) => {
      const currentPath = keyPath ? `${keyPath}.${key}` : key
      
      if (typeof value === 'string') {
        // Check for unmatched interpolation braces
        const openBraces = (value.match(/\{\{/g) || []).length
        const closeBraces = (value.match(/\}\}/g) || []).length
        
        if (openBraces !== closeBraces) {
          errors.push(`Unmatched interpolation braces in "${currentPath}": ${value}`)
        }
        
        // Extract variable names
        const variables = value.match(/\{\{([^}]+)\}\}/g)
        if (variables) {
          variables.forEach(variable => {
            const varName = variable.slice(2, -2).trim()
            if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(varName)) {
              errors.push(`Invalid interpolation variable name in "${currentPath}": ${variable}`)
            }
          })
        }
      } else if (typeof value === 'object' && value !== null) {
        this.checkInterpolationVariables(value, currentPath, errors)
      }
    })
  }

  /**
   * Check if text looks like untranslated English (basic heuristic)
   */
  private looksLikeUntranslatedEnglish(text: string): boolean {
    // Common English words that shouldn't appear in Romanian translations
    const englishWords = [
      'the', 'and', 'or', 'but', 'with', 'for', 'from', 'to', 'of', 'in', 'on', 'at',
      'save', 'cancel', 'delete', 'edit', 'add', 'submit', 'close', 'back', 'next',
      'loading', 'error', 'success', 'warning', 'info', 'please', 'click', 'here'
    ]
    
    const lowercaseText = text.toLowerCase()
    return englishWords.some(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'i')
      return regex.test(lowercaseText)
    })
  }

  /**
   * Broadcast changes to all connected clients
   */
  private broadcastChange(change: TranslationChange): void {
    const message = {
      type: 'translation-changed',
      change,
      clientCount: this.clients.size
    }
    
    this.clients.forEach(client => {
      this.sendToClient(client, message)
    })
    
    if (this.options.debug) {
      console.log(`📡 Broadcasted change to ${this.clients.size} clients`)
    }
  }

  /**
   * Send current translations to a client
   */
  private sendCurrentTranslations(client: ConnectedClient, language?: string, namespace?: string): void {
    try {
      const languages = language ? [language] : this.getAvailableLanguages()
      const translations: Record<string, any> = {}
      
      languages.forEach(lang => {
        const langPath = join(this.localesPath, lang)
        const namespaces = namespace ? [namespace] : this.getNamespacesForLanguage(lang)
        
        namespaces.forEach(ns => {
          const filePath = join(langPath, `${ns}.json`)
          if (existsSync(filePath)) {
            try {
              const content = readFileSync(filePath, 'utf-8')
              const key = `${lang}.${ns}`
              translations[key] = JSON.parse(content)
            } catch (error) {
              console.warn(`⚠️  Failed to load ${lang}/${ns}.json:`, error)
            }
          }
        })
      })
      
      this.sendToClient(client, {
        type: 'current-translations',
        translations,
        timestamp: Date.now()
      })
    } catch (error) {
      console.error(`❌ Failed to send translations to client ${client.id}:`, error)
    }
  }

  /**
   * Validate a specific translation key
   */
  private validateTranslationKey(client: ConnectedClient, key: string, namespace: string, language: string): void {
    const filePath = join(this.localesPath, language, `${namespace}.json`)
    const result = {
      type: 'key-validation-result',
      key,
      namespace,
      language,
      exists: false,
      value: null as string | null,
      suggestions: [] as string[]
    }
    
    if (existsSync(filePath)) {
      try {
        const content = readFileSync(filePath, 'utf-8')
        const translations = JSON.parse(content)
        
        // Check if key exists
        const keyParts = key.split('.')
        let current = translations
        let exists = true
        
        for (const part of keyParts) {
          if (current && typeof current === 'object' && part in current) {
            current = current[part]
          } else {
            exists = false
            break
          }
        }
        
        result.exists = exists
        if (exists && typeof current === 'string') {
          result.value = current
        }
        
        // Generate suggestions for similar keys if not found
        if (!exists) {
          result.suggestions = this.generateKeySuggestions(key, translations)
        }
        
      } catch (error) {
        console.warn(`⚠️  Failed to validate key ${key} in ${language}/${namespace}:`, error)
      }
    }
    
    this.sendToClient(client, result)
  }

  /**
   * Generate suggestions for similar translation keys
   */
  private generateKeySuggestions(targetKey: string, translations: any, prefix = ''): string[] {
    const suggestions: string[] = []
    const targetLower = targetKey.toLowerCase()
    
    Object.entries(translations).forEach(([key, value]) => {
      const fullKey = prefix ? `${prefix}.${key}` : key
      
      if (typeof value === 'object' && value !== null) {
        suggestions.push(...this.generateKeySuggestions(targetKey, value, fullKey))
      } else {
        // Simple similarity check
        const keyLower = key.toLowerCase()
        if (keyLower.includes(targetLower) || targetLower.includes(keyLower)) {
          suggestions.push(fullKey)
        }
        
        // Levenshtein distance could be added here for better suggestions
      }
    })
    
    return suggestions.slice(0, 5) // Limit to 5 suggestions
  }

  /**
   * Send message to a specific client
   */
  private sendToClient(client: ConnectedClient, message: any): void {
    if (client.ws.readyState === WebSocket.OPEN) {
      try {
        client.ws.send(JSON.stringify(message))
      } catch (error) {
        console.warn(`⚠️  Failed to send message to client ${client.id}:`, error)
      }
    }
  }

  /**
   * Get available languages
   */
  private getAvailableLanguages(): string[] {
    try {
      const { readdirSync, statSync } = require('fs')
      return readdirSync(this.localesPath)
        .filter(item => statSync(join(this.localesPath, item)).isDirectory())
    } catch {
      return []
    }
  }

  /**
   * Get available namespaces across all languages
   */
  private getAvailableNamespaces(): string[] {
    const namespaces = new Set<string>()
    
    this.getAvailableLanguages().forEach(language => {
      this.getNamespacesForLanguage(language).forEach(ns => namespaces.add(ns))
    })
    
    return Array.from(namespaces).sort()
  }

  /**
   * Get namespaces for a specific language
   */
  private getNamespacesForLanguage(language: string): string[] {
    try {
      const { readdirSync } = require('fs')
      const langPath = join(this.localesPath, language)
      return readdirSync(langPath)
        .filter(file => file.endsWith('.json'))
        .map(file => file.replace('.json', ''))
    } catch {
      return []
    }
  }

  /**
   * Generate a unique client ID
   */
  private generateClientId(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15)
  }

  /**
   * Stop the server and cleanup
   */
  async stop(): Promise<void> {
    console.log('\n🛑 Stopping hot-reload server...')
    
    // Close all WebSocket connections
    this.clients.forEach(client => {
      client.ws.close()
    })
    this.clients.clear()
    
    // Close file watchers
    this.watchedFiles.forEach(watcher => {
      watcher.close()
    })
    this.watchedFiles.clear()
    
    // Close WebSocket server
    if (this.wss) {
      this.wss.close()
    }
    
    // Close HTTP server
    if (this.server) {
      this.server.close()
    }
    
    console.log('✅ Hot-reload server stopped')
  }
}

/**
 * Parse command line arguments
 */
function parseArgs(): HotReloadOptions {
  const args = process.argv.slice(2)
  const options: HotReloadOptions = {
    port: 3001,
    debug: false,
    validate: true,
    verbose: false
  }
  
  args.forEach(arg => {
    if (arg.startsWith('--port=')) {
      options.port = parseInt(arg.split('=')[1], 10) || 3001
    } else if (arg === '--debug') {
      options.debug = true
    } else if (arg === '--no-validate') {
      options.validate = false
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
  const options = parseArgs()
  const server = new TranslationHotReloadServer(options)
  
  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    await server.stop()
    process.exit(0)
  })
  
  process.on('SIGTERM', async () => {
    await server.stop()
    process.exit(0)
  })
  
  try {
    await server.start()
  } catch (error) {
    console.error('❌ Failed to start hot-reload server:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}