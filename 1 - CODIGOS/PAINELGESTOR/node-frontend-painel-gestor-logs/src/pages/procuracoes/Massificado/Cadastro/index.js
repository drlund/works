import { PermissionGuard } from 'components/PermissionGuard';
import { useProcuracoesMassificado } from 'pages/procuracoes/hooks/useProcuracoesMassificado';

function Cadastro() {
  const massificadoPermission = useProcuracoesMassificado();
  return (
    <PermissionGuard
      guard={massificadoPermission}
    >
      <div>Cadastro Massificada</div>
    </PermissionGuard>
  );
}

export default Cadastro;
