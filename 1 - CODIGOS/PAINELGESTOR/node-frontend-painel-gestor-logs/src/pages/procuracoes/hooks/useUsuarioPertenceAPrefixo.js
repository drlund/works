import useUsuarioLogado from '@/hooks/useUsuarioLogado';

/**
 * Verifica se o usuario logado pertence a um ou mais prefixos
 */
export function useUsuarioPertenceAPrefixo(/** @type {number|number[]} */ prefixos) {
  const { prefixo } = useUsuarioLogado();

  return (
    Array.isArray(prefixos) ? prefixos : [prefixos]
  ).includes(Number(prefixo));
}

/**
 * Verifica se usuario logado pertence a super (9009)
 */
export function useUsuarioSuper() {
  return useUsuarioPertenceAPrefixo([9009]);
}
