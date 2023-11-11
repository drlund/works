import { useVerifyPermission } from 'hooks/useVerifyPermission';

export function usePermissaoGerenciar() {
  return useVerifyPermission({
    ferramenta: 'Podcasts',
    permissoesRequeridas: 'GERENCIAR',
  });
}
