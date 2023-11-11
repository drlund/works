import { displayDateBR } from 'utils/dateFunctions/displayDateBR';

/**
 * @param {Procuracoes.Poderes} props
 */
export function createSubsidiariaText({ outorgantes, outorganteSelecionado }) {
  const [{ procuracao }] = outorgantes.filter((o) => (
    o.idProcuracao === outorganteSelecionado.idProcuracao
    && o.idProxy === outorganteSelecionado.idProxy
  ));

  return getSubsidiariasText({
    procuracao: procuracao[0],
    subsidiariasSelected: outorganteSelecionado.subsidiariasSelected
  });
}

/**
 * @param {{
 *  procuracao: Procuracoes.Procuracao,
 *  subsidiariasSelected: number[]
 * }} props
 */
function getSubsidiariasText({ procuracao, subsidiariasSelected }) {
  const { procuracaoAgregada } = procuracao;
  const subsidiarias = procuracao
    .subsidiarias
    .filter((s) => subsidiariasSelected.includes(s.id))
    .sort((a, b) => (a.id > b.id ? 1 : -1));

  if (procuracaoAgregada) {
    return getAgregadaText({
      procuracaoAgregada,
      subsidiarias,
    });
  }

  return getNaoAgregadaText({ subsidiarias });
}

/**
 * @param {{
 *  procuracaoAgregada: Procuracoes.ProcuracaoAgregada,
 *  subsidiarias: Procuracoes.Subsidiaria[]
 * }} props
 */
function getAgregadaText({ procuracaoAgregada, subsidiarias }) {
  const subsText = subsidiarias.map((subsidiaria) => {
    const extraText = getExtraSubsidiariaText(subsidiaria);

    return `${subsidiaria.nome_completo}${extraText}`;
  }).join(', ');

  return `${subsText}, da procuração lavrada no ${procuracaoAgregada.cartorio}, à(s) folha(s) nº ${procuracaoAgregada.folha}, do(s) livro(s) nº ${procuracaoAgregada.livro}, em ${displayDateBR(procuracaoAgregada.emissao)}`;
}

/**
 * @param {{ subsidiarias: Procuracoes.Subsidiaria[]}} props
 */
function getNaoAgregadaText({ subsidiarias }) {
  return subsidiarias.map((subsidiaria) => {
    const extraText = getExtraSubsidiariaText(subsidiaria);

    return `${subsidiaria.nome_completo}${extraText}, nos termos da procuração lavrada ${subsidiaria.cartorio}, à(s) folha(s) nº ${subsidiaria.folha}, do(s) livro(s) nº ${subsidiaria.livro}, em ${displayDateBR(subsidiaria.emissao)}`;
  }).join(
    ', e pela Subsidiária '
  );
}

/**
 * @param {Procuracoes.Subsidiaria} subsidiaria
 */
function getExtraSubsidiariaText(subsidiaria) {
  const idBB = 1; // texto especial aligneas

  const specialText = {
    [idBB]: ', com exceção daqueles descritos na alínea "14.a" e observadas as alíneas "9", "13", "14.b", "14.c" e "14.d"'
  }[subsidiaria.id] ?? false;

  return /** @type {string} */ (specialText || '');
}
