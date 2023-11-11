import { useSelector } from 'react-redux';
import { verifyPermission } from 'utils/Commons';

/**
 * @typedef {GetProps<verifyPermission>} verifyPermissionProps
 * @typedef {Omit<verifyPermissionProps,'authState'|'permissoesRequeridas'>
 *  & { permissoesRequeridas: string | string[] }
 * } useVerifyPermissionProps
 */

/**
 * Custom hook para uso direto do `verifyPermission`.
 *
 * Uso recomendado é não usar diretamente nos componentes.
 *
 * Em vez disso, criar outros hooks que já façam o set das informações
 * da `ferramenta` e depois das `permissoesRequeridas` e então usar esses hooks.
 *
 * O hook foi extendido para acomodar passar apenas uma permissão,
 * se encarregando de passar o formato correto para o `verifyPermission`.
 *
 * @param {useVerifyPermissionProps} props
 * @see verifyPermission
 */
export function useVerifyPermission({
  ferramenta,
  permissoesRequeridas,
  verificarTodas = false,
}) {
  const authState = useSelector((state) =>
    // @ts-ignore
    state.app.authState
  );

  const parsedPermissoes = typeof permissoesRequeridas === 'string' ? [permissoesRequeridas] : permissoesRequeridas;

  return verifyPermission({
    permissoesRequeridas: parsedPermissoes,
    ferramenta,
    authState,
    verificarTodas,
  });
}


