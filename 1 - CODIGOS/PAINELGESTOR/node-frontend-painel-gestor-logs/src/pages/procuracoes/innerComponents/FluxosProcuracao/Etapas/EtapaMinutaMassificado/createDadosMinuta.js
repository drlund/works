import { createPatch } from 'diff';
import { checkIsValidReplaced } from 'pages/procuracoes/innerComponents/MinutaTemplate/helpers/forEditor/checkIsValidReplaced';
import { createReplacerMap } from 'pages/procuracoes/innerComponents/MinutaTemplate/helpers/forGeneratedData/createReplacerMap';
import { replaceInTemplate } from 'pages/procuracoes/innerComponents/MinutaTemplate/helpers/forHtml/replaceInTemplate';

/**
 * @param {{
 *  templateBase: string,
 *  dadosProcuracao: Partial<Procuracoes.DadosProcuracao>
 * }} props
 */
export function createDadosMinuta({ templateBase, dadosProcuracao }) {
  const template = replaceInTemplate({
    templateBase,
    replacerMap: createReplacerMap(dadosProcuracao),
  });
  const isValid = checkIsValidReplaced(template, templateBase);

  return {
    isValid,
    template,
    diffs: createPatch('diff', templateBase, template),
    idMinuta: dadosProcuracao.dadosMinuta.idMinuta,
  };
}
