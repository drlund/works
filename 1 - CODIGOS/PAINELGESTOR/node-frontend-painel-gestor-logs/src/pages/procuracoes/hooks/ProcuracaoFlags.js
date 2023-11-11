/**
 * Feature flags relacionadas a ferramenta de procurações
 */
export const ProcuracaoFlags = /** @type {const} */ ({
  /**
   * flag para habilitar marcar um custo como a ser controlado pela super
   * (query only)
   */
  controleCusto: 'ProcuracaoControleCusto',
  /**
   * acesso aos fluxos de massificado
   * (query only)
   */
  massificado: 'ProcuracaoMassificado',
  /**
   * Habilita acessar `procuracoes/gerarMinuta?flag=MinutaTemplate`
   * Onde é possível criar templates da minuta.
   */
  minutaTemplate: 'MinutaTemplate',
});
