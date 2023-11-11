import { useVerifyPermission } from 'hooks/useVerifyPermission';

/**
 * Acessos cadastrados na ferramenta de acessos.
 */
export const ProcuracaoAcessos = /** @type {const} */ ({
  /**
   * acesso para que os custos inseridos sejam
   * marcados como a ser controlados pela super
   */
  controleCusto: 'CONTROLE_CUSTO',
  /**
   * acesso para habilitar deleção de minutas criadas
   */
  deletarMinutas: 'DeletarMinutas',
  /**
   * acesso para os fluxos de massificado
   */
  massificado: 'MASSIFICADO',
  /**
   * acesso para gerenciar as solicitacoes
   */
  solicitacoes: 'SOLICITACOES',
});

/**
 * @param {ProcuracaoAcessos[keyof typeof ProcuracaoAcessos]} acesso
 */
export const useProcuracoesAcessos = (acesso) => useVerifyPermission({
  ferramenta: 'Procurações',
  permissoesRequeridas: acesso,
});
