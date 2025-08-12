#!/usr/bin/env tsx

/**
 * Translation Debug Overlay
 * 
 * Development-only utility that provides visual debugging for translations:
 * - Shows translation keys instead of values
 * - Highlights missing translations
 * - Provides translation key information on hover/click
 * - Real-time translation editing in development
 * 
 * Usage:
 *   import { TranslationDebugOverlay } from "@coquinate/i18n/debug"
 *   // In development only:
 *   if (process.env.NODE_ENV === 'development') {
 *     TranslationDebugOverlay.enable()
 *   }
 */

interface DebugTranslationInfo {
  key: string
  namespace: string
  value: string | null
  isUsed: boolean
  file?: string
  line?: number
}

interface DebugOverlayOptions {
  showKeys: boolean
  highlightMissing: boolean
  enableEditing: boolean
  hotReloadUrl?: string
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

/**
 * Translation Debug Overlay for Development
 * Browser-side debugging utility (to be used in client applications)
 */
class TranslationDebugOverlay {
  private static instance: TranslationDebugOverlay | null = null
  private readonly options: DebugOverlayOptions
  private overlayElement: HTMLDivElement | null = null
  private isEnabled = false
  private translationMap = new Map<string, DebugTranslationInfo>()
  private hotReloadSocket: WebSocket | null = null

  private constructor(options: Partial<DebugOverlayOptions> = {}) {
    this.options = {
      showKeys: false,
      highlightMissing: true,
      enableEditing: true,
      position: 'top-right',
      ...options
    }
  }

  /**
   * Enable translation debugging (singleton)
   */
  static enable(options?: Partial<DebugOverlayOptions>): TranslationDebugOverlay {
    if (!this.instance) {
      this.instance = new TranslationDebugOverlay(options)
    }
    this.instance.start()
    return this.instance
  }

  /**
   * Disable translation debugging
   */
  static disable(): void {
    if (this.instance) {
      this.instance.stop()
      this.instance = null
    }
  }

  /**
   * Get current debug instance
   */
  static getInstance(): TranslationDebugOverlay | null {
    return this.instance
  }

  /**
   * Start the debug overlay
   */
  private start(): void {
    if (this.isEnabled) return
    
    console.log('🌍 Translation Debug Overlay enabled')
    this.isEnabled = true
    
    // Create overlay UI
    this.createOverlayUI()
    
    // Connect to hot-reload server if URL provided
    if (this.options.hotReloadUrl) {
      this.connectToHotReload()
    }
    
    // Monkey-patch i18next for debugging
    this.patchI18next()
    
    // Add global event listeners
    this.addEventListeners()
  }

  /**
   * Stop the debug overlay
   */
  private stop(): void {
    if (!this.isEnabled) return
    
    console.log('🌍 Translation Debug Overlay disabled')
    this.isEnabled = false
    
    // Remove overlay UI
    if (this.overlayElement) {
      document.body.removeChild(this.overlayElement)
      this.overlayElement = null
    }
    
    // Disconnect from hot-reload server
    if (this.hotReloadSocket) {
      this.hotReloadSocket.close()
      this.hotReloadSocket = null
    }
    
    // Remove global event listeners
    this.removeEventListeners()
    
    // Restore original i18next (if possible)
    this.restoreI18next()
  }

  /**
   * Create the debug overlay UI
   */
  private createOverlayUI(): void {
    if (this.overlayElement) return
    
    this.overlayElement = document.createElement('div')
    this.overlayElement.id = 'translation-debug-overlay'
    this.overlayElement.innerHTML = `
      <div class="debug-overlay-container">
        <div class="debug-overlay-header">
          <span>🌍 i18n Debug</span>
          <button class="debug-overlay-minimize">−</button>
          <button class="debug-overlay-close">×</button>
        </div>
        <div class="debug-overlay-content">
          <div class="debug-overlay-stats">
            <div>Keys: <span id="debug-key-count">0</span></div>
            <div>Missing: <span id="debug-missing-count">0</span></div>
            <div>Used: <span id="debug-used-count">0</span></div>
          </div>
          <div class="debug-overlay-controls">
            <label>
              <input type="checkbox" id="debug-show-keys" ${this.options.showKeys ? 'checked' : ''}>
              Show Keys
            </label>
            <label>
              <input type="checkbox" id="debug-highlight-missing" ${this.options.highlightMissing ? 'checked' : ''}>
              Highlight Missing
            </label>
            <label>
              <input type="checkbox" id="debug-enable-editing" ${this.options.enableEditing ? 'checked' : ''}>
              Enable Editing
            </label>
          </div>
          <div class="debug-overlay-current-translation">
            <div>Current: <span id="debug-current-key">-</span></div>
            <div>Value: <span id="debug-current-value">-</span></div>
            <div>Namespace: <span id="debug-current-namespace">-</span></div>
          </div>
        </div>
      </div>
    `
    
    // Add styles
    this.addOverlayStyles()
    
    // Position the overlay
    this.positionOverlay()
    
    // Add event listeners to overlay controls
    this.addOverlayEventListeners()
    
    // Add to DOM
    document.body.appendChild(this.overlayElement)
  }

  /**
   * Add CSS styles for the debug overlay
   */
  private addOverlayStyles(): void {
    const existingStyle = document.getElementById('translation-debug-overlay-styles')
    if (existingStyle) return
    
    const style = document.createElement('style')
    style.id = 'translation-debug-overlay-styles'
    style.textContent = `
      #translation-debug-overlay {
        position: fixed;
        z-index: 10000;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        border-radius: 8px;
        padding: 0;
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        font-size: 12px;
        width: 300px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      #translation-debug-overlay.minimized .debug-overlay-content {
        display: none;
      }
      
      .debug-overlay-header {
        background: rgba(255, 255, 255, 0.1);
        padding: 8px 12px;
        border-radius: 8px 8px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: move;
      }
      
      .debug-overlay-header button {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 2px 6px;
        margin-left: 4px;
        border-radius: 3px;
        font-size: 14px;
      }
      
      .debug-overlay-header button:hover {
        background: rgba(255, 255, 255, 0.1);
      }
      
      .debug-overlay-content {
        padding: 12px;
      }
      
      .debug-overlay-stats {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 8px;
        margin-bottom: 12px;
        text-align: center;
      }
      
      .debug-overlay-stats > div {
        background: rgba(255, 255, 255, 0.1);
        padding: 6px;
        border-radius: 4px;
      }
      
      .debug-overlay-controls {
        margin-bottom: 12px;
      }
      
      .debug-overlay-controls label {
        display: block;
        margin-bottom: 6px;
        cursor: pointer;
      }
      
      .debug-overlay-controls input {
        margin-right: 6px;
      }
      
      .debug-overlay-current-translation {
        background: rgba(255, 255, 255, 0.05);
        padding: 8px;
        border-radius: 4px;
        font-size: 11px;
      }
      
      .debug-overlay-current-translation > div {
        margin-bottom: 4px;
        word-break: break-all;
      }
      
      .debug-translation-highlight {
        background: rgba(255, 0, 0, 0.3) !important;
        outline: 2px solid rgba(255, 0, 0, 0.6) !important;
        outline-offset: 1px !important;
      }
      
      .debug-translation-key-visible::before {
        content: '[' attr(data-debug-key) '] ';
        background: rgba(0, 255, 0, 0.8);
        color: black;
        font-size: 10px;
        padding: 2px 4px;
        border-radius: 3px;
        margin-right: 4px;
        font-weight: bold;
      }
      
      .debug-missing-translation {
        background: rgba(255, 0, 0, 0.5) !important;
        position: relative;
      }
      
      .debug-missing-translation::after {
        content: '❌ MISSING';
        position: absolute;
        top: -20px;
        left: 0;
        background: red;
        color: white;
        font-size: 10px;
        padding: 2px 6px;
        border-radius: 3px;
        white-space: nowrap;
        z-index: 10001;
      }
    `
    
    document.head.appendChild(style)
  }

  /**
   * Position the overlay based on options
   */
  private positionOverlay(): void {
    if (!this.overlayElement) return
    
    const positions = {
      'top-left': { top: '20px', left: '20px' },
      'top-right': { top: '20px', right: '20px' },
      'bottom-left': { bottom: '20px', left: '20px' },
      'bottom-right': { bottom: '20px', right: '20px' }
    }
    
    const position = positions[this.options.position]
    Object.assign(this.overlayElement.style, position)
  }

  /**
   * Add event listeners to overlay controls
   */
  private addOverlayEventListeners(): void {
    if (!this.overlayElement) return
    
    // Minimize/restore
    const minimizeBtn = this.overlayElement.querySelector('.debug-overlay-minimize')
    minimizeBtn?.addEventListener('click', () => {
      this.overlayElement?.classList.toggle('minimized')
      const btn = minimizeBtn as HTMLButtonElement
      btn.textContent = this.overlayElement?.classList.contains('minimized') ? '+' : '−'
    })
    
    // Close
    const closeBtn = this.overlayElement.querySelector('.debug-overlay-close')
    closeBtn?.addEventListener('click', () => {
      TranslationDebugOverlay.disable()
    })
    
    // Controls
    const showKeysCheckbox = this.overlayElement.querySelector('#debug-show-keys') as HTMLInputElement
    showKeysCheckbox?.addEventListener('change', () => {
      this.options.showKeys = showKeysCheckbox.checked
      this.updateTranslationDisplay()
    })
    
    const highlightMissingCheckbox = this.overlayElement.querySelector('#debug-highlight-missing') as HTMLInputElement
    highlightMissingCheckbox?.addEventListener('change', () => {
      this.options.highlightMissing = highlightMissingCheckbox.checked
      this.updateTranslationDisplay()
    })
    
    const enableEditingCheckbox = this.overlayElement.querySelector('#debug-enable-editing') as HTMLInputElement
    enableEditingCheckbox?.addEventListener('change', () => {
      this.options.enableEditing = enableEditingCheckbox.checked
    })
    
    // Make header draggable
    const header = this.overlayElement.querySelector('.debug-overlay-header') as HTMLElement
    this.makeDraggable(header, this.overlayElement)
  }

  /**
   * Make an element draggable
   */
  private makeDraggable(handle: HTMLElement, element: HTMLElement): void {
    let isDragging = false
    let startX: number, startY: number, startLeft: number, startTop: number
    
    handle.addEventListener('mousedown', (e) => {
      isDragging = true
      startX = e.clientX
      startY = e.clientY
      const rect = element.getBoundingClientRect()
      startLeft = rect.left
      startTop = rect.top
    })
    
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return
      
      const deltaX = e.clientX - startX
      const deltaY = e.clientY - startY
      
      element.style.left = (startLeft + deltaX) + 'px'
      element.style.top = (startTop + deltaY) + 'px'
      element.style.right = 'auto'
      element.style.bottom = 'auto'
    })
    
    document.addEventListener('mouseup', () => {
      isDragging = false
    })
  }

  /**
   * Monkey-patch i18next for debugging
   */
  private patchI18next(): void {
    // This would need to be implemented based on the actual i18next instance
    // For now, this is a placeholder for the concept
    console.log('🔧 Patching i18next for debugging...')
    
    // Store reference to original t function
    // Wrap t function to track translation usage
    // Add debug attributes to DOM elements
  }

  /**
   * Restore original i18next
   */
  private restoreI18next(): void {
    console.log('🔧 Restoring original i18next...')
    // Restore original t function
  }

  /**
   * Add global event listeners
   */
  private addEventListeners(): void {
    document.addEventListener('click', this.handleElementClick.bind(this))
    document.addEventListener('mouseover', this.handleElementHover.bind(this))
    document.addEventListener('keydown', this.handleKeyboardShortcuts.bind(this))
  }

  /**
   * Remove global event listeners
   */
  private removeEventListeners(): void {
    document.removeEventListener('click', this.handleElementClick.bind(this))
    document.removeEventListener('mouseover', this.handleElementHover.bind(this))
    document.removeEventListener('keydown', this.handleKeyboardShortcuts.bind(this))
  }

  /**
   * Handle element clicks for translation debugging
   */
  private handleElementClick(event: MouseEvent): void {
    if (!this.options.enableEditing) return
    
    const target = event.target as HTMLElement
    const debugKey = target.getAttribute('data-debug-key')
    const debugNamespace = target.getAttribute('data-debug-namespace')
    
    if (debugKey && debugNamespace && event.ctrlKey) {
      event.preventDefault()
      this.editTranslation(debugKey, debugNamespace, target)
    }
  }

  /**
   * Handle element hover for translation info
   */
  private handleElementHover(event: MouseEvent): void {
    const target = event.target as HTMLElement
    const debugKey = target.getAttribute('data-debug-key')
    const debugNamespace = target.getAttribute('data-debug-namespace')
    const debugValue = target.getAttribute('data-debug-value')
    
    if (debugKey && debugNamespace) {
      this.updateCurrentTranslationDisplay(debugKey, debugNamespace, debugValue || '')
    }
  }

  /**
   * Handle keyboard shortcuts
   */
  private handleKeyboardShortcuts(event: KeyboardEvent): void {
    // Ctrl+Shift+I = Toggle overlay visibility
    if (event.ctrlKey && event.shiftKey && event.code === 'KeyI') {
      event.preventDefault()
      this.toggleOverlayVisibility()
    }
    
    // Ctrl+Shift+K = Toggle key display
    if (event.ctrlKey && event.shiftKey && event.code === 'KeyK') {
      event.preventDefault()
      this.options.showKeys = !this.options.showKeys
      this.updateTranslationDisplay()
      this.updateCheckbox('debug-show-keys', this.options.showKeys)
    }
    
    // Ctrl+Shift+M = Toggle missing highlight
    if (event.ctrlKey && event.shiftKey && event.code === 'KeyM') {
      event.preventDefault()
      this.options.highlightMissing = !this.options.highlightMissing
      this.updateTranslationDisplay()
      this.updateCheckbox('debug-highlight-missing', this.options.highlightMissing)
    }
  }

  /**
   * Toggle overlay visibility
   */
  private toggleOverlayVisibility(): void {
    if (this.overlayElement) {
      const isVisible = this.overlayElement.style.display !== 'none'
      this.overlayElement.style.display = isVisible ? 'none' : 'block'
    }
  }

  /**
   * Update checkbox state
   */
  private updateCheckbox(id: string, checked: boolean): void {
    const checkbox = document.getElementById(id) as HTMLInputElement
    if (checkbox) {
      checkbox.checked = checked
    }
  }

  /**
   * Update translation display based on current options
   */
  private updateTranslationDisplay(): void {
    const elements = document.querySelectorAll('[data-debug-key]')
    
    elements.forEach((element) => {
      const htmlElement = element as HTMLElement
      const isMissing = htmlElement.getAttribute('data-debug-missing') === 'true'
      
      // Show/hide keys
      if (this.options.showKeys) {
        htmlElement.classList.add('debug-translation-key-visible')
      } else {
        htmlElement.classList.remove('debug-translation-key-visible')
      }
      
      // Highlight missing
      if (this.options.highlightMissing && isMissing) {
        htmlElement.classList.add('debug-missing-translation')
      } else {
        htmlElement.classList.remove('debug-missing-translation')
      }
    })
  }

  /**
   * Update current translation display in overlay
   */
  private updateCurrentTranslationDisplay(key: string, namespace: string, value: string): void {
    const keyEl = document.getElementById('debug-current-key')
    const valueEl = document.getElementById('debug-current-value')
    const namespaceEl = document.getElementById('debug-current-namespace')
    
    if (keyEl) keyEl.textContent = key
    if (valueEl) valueEl.textContent = value || '(missing)'
    if (namespaceEl) namespaceEl.textContent = namespace
  }

  /**
   * Edit a translation inline
   */
  private editTranslation(key: string, namespace: string, element: HTMLElement): void {
    const currentValue = element.textContent || ''
    const newValue = prompt(`Edit translation for ${namespace}.${key}:`, currentValue)
    
    if (newValue !== null && newValue !== currentValue) {
      // Update element immediately
      element.textContent = newValue
      element.setAttribute('data-debug-value', newValue)
      
      // Send to hot-reload server if connected
      if (this.hotReloadSocket && this.hotReloadSocket.readyState === WebSocket.OPEN) {
        this.hotReloadSocket.send(JSON.stringify({
          type: 'update-translation',
          namespace,
          key,
          value: newValue,
          language: 'ro' // TODO: detect current language
        }))
      }
      
      console.log(`🌍 Updated translation: ${namespace}.${key} = "${newValue}"`)
    }
  }

  /**
   * Connect to hot-reload server
   */
  private connectToHotReload(): void {
    if (!this.options.hotReloadUrl) return
    
    try {
      this.hotReloadSocket = new WebSocket(this.options.hotReloadUrl)
      
      this.hotReloadSocket.onopen = () => {
        console.log('🔌 Connected to translation hot-reload server')
      }
      
      this.hotReloadSocket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data)
          this.handleHotReloadMessage(message)
        } catch (error) {
          console.warn('⚠️ Invalid hot-reload message:', error)
        }
      }
      
      this.hotReloadSocket.onclose = () => {
        console.log('🔌 Disconnected from translation hot-reload server')
      }
      
      this.hotReloadSocket.onerror = (error) => {
        console.warn('⚠️ Hot-reload connection error:', error)
      }
      
    } catch (error) {
      console.warn('⚠️ Failed to connect to hot-reload server:', error)
    }
  }

  /**
   * Handle messages from hot-reload server
   */
  private handleHotReloadMessage(message: any): void {
    switch (message.type) {
      case 'translation-changed':
        this.handleTranslationChanged(message.change)
        break
        
      case 'connected':
        console.log(`🌍 Hot-reload server connected (${message.clientId})`)
        break
        
      default:
        console.log('📨 Hot-reload message:', message)
    }
  }

  /**
   * Handle translation file changes from hot-reload
   */
  private handleTranslationChanged(change: any): void {
    console.log(`🔄 Translation changed: ${change.language}/${change.namespace}`)
    
    // Reload affected translations in the page
    // This would need to integrate with the actual i18next instance
    window.location.reload()
  }

  /**
   * Register a translation for debugging
   */
  registerTranslation(key: string, namespace: string, value: string | null, element?: HTMLElement): void {
    const fullKey = `${namespace}.${key}`
    
    this.translationMap.set(fullKey, {
      key,
      namespace,
      value,
      isUsed: true
    })
    
    // Add debug attributes to DOM element if provided
    if (element) {
      element.setAttribute('data-debug-key', key)
      element.setAttribute('data-debug-namespace', namespace)
      element.setAttribute('data-debug-value', value || '')
      element.setAttribute('data-debug-missing', value ? 'false' : 'true')
      
      // Apply current display options
      if (this.options.showKeys) {
        element.classList.add('debug-translation-key-visible')
      }
      
      if (this.options.highlightMissing && !value) {
        element.classList.add('debug-missing-translation')
      }
    }
    
    // Update stats
    this.updateStats()
  }

  /**
   * Update stats display
   */
  private updateStats(): void {
    const totalKeys = this.translationMap.size
    const missingCount = Array.from(this.translationMap.values()).filter(t => !t.value).length
    const usedCount = Array.from(this.translationMap.values()).filter(t => t.isUsed).length
    
    const keyCountEl = document.getElementById('debug-key-count')
    const missingCountEl = document.getElementById('debug-missing-count')
    const usedCountEl = document.getElementById('debug-used-count')
    
    if (keyCountEl) keyCountEl.textContent = totalKeys.toString()
    if (missingCountEl) missingCountEl.textContent = missingCount.toString()
    if (usedCountEl) usedCountEl.textContent = usedCount.toString()
  }
}

/**
 * Development-only React hook for translation debugging
 * This would be exported from a separate development module
 */
export function useTranslationDebug(hotReloadUrl?: string): void {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') {
    return
  }
  
  // Enable debug overlay on first use
  TranslationDebugOverlay.enable({ hotReloadUrl })
}

/**
 * Development-only translation debug component
 * This would be exported from a separate development module
 */
export function TranslationDebugProvider({ 
  children, 
  hotReloadUrl = 'ws://localhost:3001' 
}: { 
  children: React.ReactNode
  hotReloadUrl?: string 
}) {
  useTranslationDebug(hotReloadUrl)
  return <>{children}</>
}

// Export for browser usage
if (typeof window !== 'undefined') {
  (window as any).TranslationDebugOverlay = TranslationDebugOverlay
}

export default TranslationDebugOverlay