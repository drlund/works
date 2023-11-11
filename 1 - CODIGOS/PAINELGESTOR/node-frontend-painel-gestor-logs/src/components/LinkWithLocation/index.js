import { Link, useLocation } from 'react-router-dom';

/**
 * @typedef {Object} CustomOptions sets if to keep the search, hash and state
 * @property {boolean} [search=true] if to keep the search, defaults true
 * @property {boolean} [hash=true] if to keep the hash, defaults true
 * @property {boolean} [state=true] if to keep the state, defaults true
 */

/**
 * @param {GetProps<Link> & { customOptions?: CustomOptions }} props
 * React Router Dom Link, but keeps by default the search, hash and state.
 *
 * Can be overrided by passing the appropriate options and/or custom options.
 */
export function LinkWithLocation({ children, to, customOptions, ...rest }) {
  const customTo = useCustomTo(to, customOptions);

  return (
    <Link to={customTo} {...rest}>{children}</Link>
  );
}

/**
 * keeps by default the search, hash and state
 * can be overrided
 * @param {GetProps<Link>['to']} to
 * @param {CustomOptions} [customOptions]
 * @returns {GetProps<Link>['to']}
 */
function useCustomTo(to, {
  search = true,
  hash = true,
  state = true,
} = {}) {
  const location = useLocation();

  const createBaseTo = (/** @type {string} */ pathname) => ({
    search: search ? location.search : undefined,
    hash: hash ? location.hash : undefined,
    state: state ? location.state : undefined,
    pathname,
  });

  if (typeof to === "string") {
    return createBaseTo(to);
  }

  if (typeof to === "function") {
    return /** @type {typeof to} */ (
      (args) => ({ ...createBaseTo(args.pathname), ...args })
    );
  }

  return {
    ...createBaseTo(to.pathname),
    ...to,
  };
}
