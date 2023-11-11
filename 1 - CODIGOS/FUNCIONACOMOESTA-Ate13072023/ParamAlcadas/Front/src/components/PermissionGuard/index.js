import PageNotFound from 'pages/errors/PageNotFound';

/**
 * A ideia deste componente é similar a `FeatureFlag`
 * no entanto voltado para permissions ou outros tipos de acesso
 *
 * @param {Object} props
 * @param {import('react').ReactNode} props.children
 * @param {import('react').ReactNode} [props.fallback] componente a ser renderizado em caso de não permissão, default pra 404 page
 * @param {boolean} [props.guard] flag de permissão. true para permitir, false para não permitir. pode ser inclusive `useVerifyPermission`
 * ou qualquer outro boolean ex: `process.env.NODE_ENV === 'development'`
 *
 * @example
 * ```js
 * <PermissionGuard
 *  guard={useVerifyPermission(...)}
 *  fallback={<OtherPageNotFound />}
 * >
 *    <Component />
 * </PermissionGuard>
 * ```
 * @see {FeatureFlag}
 */
export function PermissionGuard({
  children,
  guard = true,
  fallback = <PageNotFound />,
}) {
  if (guard) {
    return /** @type {JSX.Element} */ (children);
  }

  return /** @type {JSX.Element} */ (fallback);
}
