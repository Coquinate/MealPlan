import React, { type ReactNode, type ReactElement } from 'react';
import type { TranslationNamespace } from './hooks';
interface TransProps {
    /** Translation key to use */
    i18nKey: string;
    /** Namespace to use for translation */
    ns?: TranslationNamespace;
    /** Values to interpolate into the translation */
    values?: Record<string, string | number | ReactNode>;
    /** Components to use for translation replacement */
    components?: readonly ReactElement[] | Record<string, ReactElement>;
    /** Whether to use HTML in translation */
    shouldUnescape?: boolean;
    /** Default value to use if translation is missing */
    defaults?: string;
    /** Children to use as translation content */
    children?: ReactNode;
    /** Additional props passed to react-i18next Trans */
    [key: string]: unknown;
}
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
export declare const Trans: React.FC<TransProps>;
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
export declare function createNamespacedTrans<T extends TranslationNamespace>(namespace: T): (props: Omit<TransProps, "ns"> & {
    i18nKey: string;
}) => import("react/jsx-runtime").JSX.Element;
/**
 * Common pre-configured Trans components for frequently used namespaces
 */
export declare const CommonTrans: (props: Omit<TransProps, "ns"> & {
    i18nKey: string;
}) => import("react/jsx-runtime").JSX.Element;
export declare const AuthTrans: (props: Omit<TransProps, "ns"> & {
    i18nKey: string;
}) => import("react/jsx-runtime").JSX.Element;
export declare const MealsTrans: (props: Omit<TransProps, "ns"> & {
    i18nKey: string;
}) => import("react/jsx-runtime").JSX.Element;
export declare const ShoppingTrans: (props: Omit<TransProps, "ns"> & {
    i18nKey: string;
}) => import("react/jsx-runtime").JSX.Element;
export declare const AdminTrans: (props: Omit<TransProps, "ns"> & {
    i18nKey: string;
}) => import("react/jsx-runtime").JSX.Element;
export declare const RecipesTrans: (props: Omit<TransProps, "ns"> & {
    i18nKey: string;
}) => import("react/jsx-runtime").JSX.Element;
export declare const SettingsTrans: (props: Omit<TransProps, "ns"> & {
    i18nKey: string;
}) => import("react/jsx-runtime").JSX.Element;
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
export declare function withTranslationHelpers<T extends object>(Component: React.ComponentType<T & {
    trans: typeof Trans;
}>, defaultNamespace?: TranslationNamespace): (props: T) => import("react/jsx-runtime").JSX.Element;
/**
 * Hook for creating namespace-specific translation components
 * Useful for components that primarily use one namespace
 *
 * @param namespace - Translation namespace to use
 * @returns Trans component bound to the specified namespace
 */
export declare function useNamespacedTrans(namespace: TranslationNamespace): (props: Omit<TransProps, "ns"> & {
    i18nKey: string;
}) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=trans-component.d.ts.map