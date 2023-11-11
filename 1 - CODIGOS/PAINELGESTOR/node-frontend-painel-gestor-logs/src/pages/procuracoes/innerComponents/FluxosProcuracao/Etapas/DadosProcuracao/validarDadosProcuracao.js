import { tiposEtapa } from './tiposEtapa';
import { verificaTipoEtapa } from './verificaTipoEtapa';

const camposProcuracaoBase = [
  ['dataEmissao', 'Data de emissão'],
  ['dataVencimento', 'Data de vencimento'],
];

const camposPublica = [
  ['dataManifesto', 'Data Manifesto de Assinaturas'],
  ['folha', 'Folha'],
  ['livro', 'Livro'],
];

const camposCusto = [
  ['prefixoCusto', 'Prefixo do Custo'],
];

/**
 * @typedef {Procuracoes.DocumentoProcuracao} DocumentoProcuracao
 * @typedef {import('./tiposEtapa').TiposEtapa[keyof import('./tiposEtapa').TiposEtapa]} TipoEtapa
 */

/**
 * @param {TipoEtapa} tipoEtapa
 * @returns {(dadosProcuracao: DocumentoProcuracao) => Promise<DocumentoProcuracao>}
 */
export const validarDadosProcuracao = (tipoEtapa = null) => (dadosProcuracao) => new Promise(
  (resolve, reject) => {
    verificaTipoEtapa(tipoEtapa);

    if (!dadosProcuracao) {
      reject('Todos os campos são obrigatórios');
    }

    if (!dadosProcuracao.urlDocumento && !dadosProcuracao.arquivoProcuracao) {
      reject('O arquivo é obrigatórios');
    }

    const camposProcuracaoPublica = camposPublica.concat(camposCusto);

    const camposObrigatorios = /** @type {[keyof DocumentoProcuracao, string][]} */ (
      camposProcuracaoBase
        .concat(
          tipoEtapa === tiposEtapa.publica
            ? camposProcuracaoPublica
            : []
        )
    );

    camposObrigatorios.forEach(([campo, campoLegivel]) => {
      if (!dadosProcuracao[campo]) {
        reject(`O campo ${campoLegivel} é obrigatório`);
      }
    });

    resolve(dadosProcuracao);
  }
);
