/**
 * Translation type re-exports for i18next declaration merging
 * This file provides a clean interface between generated types and i18next declarations
 */
/**
 * Type guard to check if a string is a valid translation namespace
 * Useful for runtime validation and IDE assistance
 *
 * @param value - String to check
 * @returns True if value is a valid namespace
 */
export function isValidNamespace(value) {
  const validNamespaces = ['common', 'auth', 'meals', 'shopping', 'admin', 'recipes', 'settings'];
  return validNamespaces.includes(value);
}
