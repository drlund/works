import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';

/**
 * @param {Procuracoes.DadosProcuracao} props
 */
export const cadastrarProcuracaoSuperAdm = ({
  dadosProcuracao,
  tipoFluxo,
  outorgado,
  subsidiaria,
  poderes,
  cartorio,
  minutaCadastrada,
}) => {
  const formData = new FormData();

  if (cartorio) {
    formData.append('idCartorio', String(cartorio.id));
  }

  if (subsidiaria) {
    formData.append('idSubsidiaria', String(subsidiaria.id));
  }

  formData.append('urlDocumento', dadosProcuracao.urlDocumento);

  formData.append('matriculaOutorgado', outorgado.matricula);

  if (poderes) {
    formData.append('poderes', JSON.stringify(poderes.outorganteSelecionado));
  }

  const YYYYMMDD = 'YYYY-MM-DD';
  formData.append(
    'dadosProcuracao',
    JSON.stringify({
      dataEmissao: dadosProcuracao.dataEmissao.format(YYYYMMDD),
      dataVencimento: dadosProcuracao.dataVencimento.format(YYYYMMDD),
      custo: dadosProcuracao.custo,
      custoCadeia: dadosProcuracao.custoCadeia,
      cartorioCadeia: dadosProcuracao.cartorioCadeia,
      superCusto: Number(dadosProcuracao.superCusto),
      zerarCusto: Number(dadosProcuracao.zerarCusto || false),
      prefixoCusto: dadosProcuracao.prefixoCusto,
      dataManifesto: dadosProcuracao.dataManifesto?.format(YYYYMMDD),
      folha: dadosProcuracao.folha,
      livro: dadosProcuracao.livro,
    }),
  );

  if (dadosProcuracao.arquivoProcuracao) {
    formData.append(
      'arquivoProcuracao',
      dadosProcuracao.arquivoProcuracao.file,
    );
  }

  formData.append('tipoFluxo', JSON.stringify(tipoFluxo));

  if (minutaCadastrada) {
    formData.append('idMinutaCadastrada', minutaCadastrada.idMinuta);
  }

  return fetch(
    FETCH_METHODS.POST,
    'procuracoes/cadastro/cadastrar-procuracao',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data; boundary=12345678912345678;',
      },
    },
  );
};
