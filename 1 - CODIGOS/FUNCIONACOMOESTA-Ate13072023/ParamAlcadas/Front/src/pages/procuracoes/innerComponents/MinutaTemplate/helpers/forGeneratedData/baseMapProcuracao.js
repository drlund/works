import { extractOutorgante } from './extractOutorgante';
import { createSubsidiariaText } from './createSubsidiariaText';

/**
 * @param {Partial<Procuracoes.DadosProcuracao>} props
 */
export function baseMapProcuracao({
  tipoFluxo, outorgado, poderes, dadosMinuta: { idTemplate, idMinuta }
}) {
  const outorgante = extractOutorgante(poderes);
  const blocoSubsidiarias = createSubsidiariaText(poderes);

  const cartorio = {
    cidadeUF: `${outorgante.municipio}/${outorgante.uf}`,
  };

  return {
    idMinuta,
    idTemplate,
    tipoFluxo,
    outorgado,
    outorgante,
    blocoSubsidiarias,
    cartorio
  };
}
