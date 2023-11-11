/**
 * Wrapper que renderiza os children apenas fora de production
 */
export function DEVOnlyNotProduction({ children }) {
  if (process.env.NODE_ENV === 'production') {
    return null;
  }
  return children;
}
