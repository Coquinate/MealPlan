import { jsx as _jsx } from 'react/jsx-runtime';
import React from 'react';
import { Trans as I18nextTrans } from 'react-i18next';
/**
 * Trans component for complex translations with HTML content and interpolation
 * Wrapper around react-i18next's Trans component with type safety
 *
 * @example
 * // Simple interpolation
 * <Trans i18nKey="welcome.message" values={{name: "John"}} />
 *
 * // With HTML components
 * <Trans
 *   i18nKey="terms.agreement"
 *   components={[<Link href="/terms" />, <strong />]}
 * />
 *
 * // With named components
 * <Trans
 *   i18nKey="profile.editLink"
 *   components={{
 *     link: <Link href="/profile/edit" className="text-primary" />,
 *     bold: <strong className="font-semibold" />
 *   }}
 * />
 *
 * @param props - Trans component props
 * @returns JSX.Element - Rendered translation with interpolated content
 */
export const Trans = ({
  i18nKey,
  ns = 'common',
  values,
  components,
  shouldUnescape = false,
  defaults,
  children,
  ...otherProps
}) => {
  return _jsx(I18nextTrans, {
    i18nKey,
    ns,
    values,
    components,
    shouldUnescape,
    defaults,
    ...otherProps,
    children,
  });
};
/**
 * Factory function for creating namespace-specific Trans components
 *
 * Creates a customized Trans component that is pre-configured for a specific
 * translation namespace, eliminating the need to specify the 'ns' prop repeatedly.
 * This provides better developer experience and type safety.
 *
 * @param {TranslationNamespace} namespace - The translation namespace to use.
 *   Available options: 'common', 'auth', 'meals', 'shopping', 'admin', 'recipes', 'settings'
 *
 * @returns {React.ComponentType} A React component pre-configured for the specified namespace
 *
 * @example
 * ```typescript
 * // Create a custom Trans component for auth namespace
 * const AuthTrans = createNamespacedTrans('auth')
 *
 * // Use without specifying namespace
 * <AuthTrans i18nKey="login.title" />
 * // Instead of: <Trans i18nKey="login.title" ns="auth" />
 *
 * // With interpolation values
 * <AuthTrans
 *   i18nKey="welcome.message"
 *   values={{ name: user.firstName }}
 * />
 *
 * // With HTML components
 * <AuthTrans
 *   i18nKey="password.reset"
 *   components={[<Link href="/forgot-password" />]}
 * />
 * ```
 *
 * @see {@link Trans} Base Trans component
 * @see {@link CommonTrans} Pre-configured common namespace component
 * @see {@link AuthTrans} Pre-configured auth namespace component
 */
export function createNamespacedTrans(namespace) {
  return function NamespacedTrans(props) {
    return _jsx(Trans, { ...props, ns: namespace });
  };
}
/**
 * Common pre-configured Trans components for frequently used namespaces
 */
export const CommonTrans = createNamespacedTrans('common');
export const AuthTrans = createNamespacedTrans('auth');
export const MealsTrans = createNamespacedTrans('meals');
export const ShoppingTrans = createNamespacedTrans('shopping');
export const AdminTrans = createNamespacedTrans('admin');
export const RecipesTrans = createNamespacedTrans('recipes');
export const SettingsTrans = createNamespacedTrans('settings');
/**
 * Higher-order component for injecting translation utilities into components
 *
 * Wraps a component to provide a `trans` prop that is a pre-configured Trans
 * component bound to a specific namespace. This pattern is useful for components
 * that need consistent access to translations without prop drilling.
 *
 * @param {React.ComponentType} Component - The React component to wrap. Must accept
 *   a `trans` prop of type `typeof Trans`
 * @param {TranslationNamespace} [defaultNamespace='common'] - Default namespace for
 *   the injected trans function. Defaults to 'common'
 *
 * @returns {React.ComponentType} Enhanced component with translation utilities injected
 *
 * @example
 * ```typescript
 * // Define a component that uses translations
 * interface MyComponentProps {
 *   title: string
 *   trans: typeof Trans
 * }
 *
 * const MyComponent: React.FC<MyComponentProps> = ({ title, trans }) => (
 *   <div>
 *     <h1>{title}</h1>
 *     {trans({ i18nKey: 'button.save' })}
 *     {trans({ i18nKey: 'message.loading' })}
 *   </div>
 * )
 *
 * // Wrap with translation helpers for 'common' namespace
 * const MyComponentWithTranslations = withTranslationHelpers(MyComponent)
 *
 * // Use the enhanced component (no need to pass trans prop)
 * <MyComponentWithTranslations title="My Page" />
 *
 * // Or with a specific namespace
 * const MyAuthComponent = withTranslationHelpers(MyComponent, 'auth')
 * <MyAuthComponent title="Login Page" />
 * ```
 *
 * @see {@link Trans} Base Trans component
 * @see {@link useNamespacedTrans} Hook-based alternative for functional components
 */
export function withTranslationHelpers(Component, defaultNamespace = 'common') {
  return function WrappedWithTranslationHelpers(props) {
    const trans = React.useCallback(
      (transProps) => _jsx(Trans, { ...transProps, ns: defaultNamespace }),
      [defaultNamespace]
    );
    return _jsx(Component, { ...props, trans });
  };
}
/**
 * Hook for creating namespace-specific translation components
 * Useful for components that primarily use one namespace
 *
 * @param namespace - Translation namespace to use
 * @returns Trans component bound to the specified namespace
 */
export function useNamespacedTrans(namespace) {
  return React.useCallback((props) => _jsx(Trans, { ...props, ns: namespace }), [namespace]);
}
