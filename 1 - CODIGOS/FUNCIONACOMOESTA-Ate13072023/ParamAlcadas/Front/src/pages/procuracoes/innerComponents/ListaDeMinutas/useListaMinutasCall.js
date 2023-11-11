import { useState } from 'react';
import { fetch, FETCH_METHODS } from 'services/apis/GenericFetch';

/**
 * @param {Object} [props]
 * @param {"0"|"1"|"2"} [props.activePanel] em qual posição de `dataMap` os dados dados serão salvos
 */
export function useListaMinutasCall({ activePanel = "0" } = {}) {
  const [searching, setSearching] = useState(false);
  const [dataMap, setDataMap] = useState(/** @type {DataMapType[]} */([]));

  /** @param {DataMapType} newData */
  const setDataAtActivePanel = (newData) => setDataMap((old) => {
    old[Number(activePanel)] = newData;
    return [...old];
  });

  return {
    /** array com os dados, cada posição é baseado no `activePanel` */
    dataMap,
    /** se a consulta está em progresso ou não */
    searching,
    /**
     * função para o fetch dos dados
     * @param {Object} props passar apenas matricula ou apenas o prefixo
     * @param {string} [props.matricula]
     * @param {string} [props.prefixo]
     */
    getListaMinutas: async ({ matricula = '', prefixo = '' }) => {
      if ((!matricula && !prefixo) || (matricula && matricula.length < 7)) {
        return;
      }

      const params = new URLSearchParams({
        matricula: matricula && `${matricula.length < 8 ? 'f' : ''}${matricula}`,
        prefixo
      }).toString();

      setSearching(true);
      setDataAtActivePanel(null);

      fetch(FETCH_METHODS.GET, `procuracoes/minutas?${params}`)
        .then((res) => {
          setDataAtActivePanel(Array.isArray(res) ? res : { error: res });
        })
        .catch((err) => {
          setDataAtActivePanel({ error: err });
        })
        .finally(() => {
          setSearching(false);
        });
    },
  };
}

/**
 * @typedef {{
 *  idMinuta: string,
 *  idFluxo: string,
 *  idMassificado: string,
 *  matriculaOutorgado: string,
 *  outorgante_idProcuracao: string,
 *  outorgante_idProxy: string,
 *  outorgante_subsidiariasSelected: string,
 *  idTemplateBase: string,
 *  idTemplateDerivado: string,
 *  dadosMinuta_diffs: string,
 *  dadosMinuta_customData: string,
 *  matriculaRegistro: string,
 *  createdAt: string,
 *  updatedAt: string,
 *  ativo: 1 | 0,
 *  outorgado: {
 *    matricula: string,
 *    nome: string,
 *    email: string,
 *    cpf_nr: string,
 *    data_nasc: string,
 *    data_posse: string,
 *    grau_instr: number,
 *    cod_func_lotacao: string,
 *    desc_func_lotacao: string,
 *    comissao: string,
 *    desc_cargo: string,
 *    cod_situacao: number,
 *    data_situacao: string,
 *    prefixo_lotacao: string,
 *    desc_localizacao: string,
 *    cod_uor_trabalho: string,
 *    nome_uor_trabalho: string,
 *    cod_uor_grupo: string,
 *    nome_uor_grupo: string,
 *    ddd_celular: number,
 *    fone_celular: number,
 *    sexo: number,
 *    est_civil: string,
 *    dt_imped_odi: string,
 *    ag_localiz: string,
 *    cargo: string,
 *    dt_imped_remocao: string,
 *    dt_imped_comissionamento: string,
 *    dt_imped_pas: string,
 *    dt_imped_instit_relac: string,
 *    dt_imped_demissao: string,
 *    dt_imped_bolsa_estudos: string,
 *    rg_emissor_uf: string,
 *  }
 * }[]} MinutaLista
 */

/** @typedef {{error: string}| MinutaLista} DataMapType */
