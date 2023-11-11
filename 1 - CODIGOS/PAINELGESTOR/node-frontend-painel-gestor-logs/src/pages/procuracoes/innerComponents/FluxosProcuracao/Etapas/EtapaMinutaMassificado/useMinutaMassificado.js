import { useCadastroProcuracao } from 'pages/procuracoes/contexts/ProcuracoesContext';
import { useState } from 'react';
import { isFunciError } from '../EtapaOutorgadoMassificado/ListaOutorgados/isFunciError';
import { extractDadosProcuracao } from './extractDadosProcuracao';
import { createDadosMinuta } from './createDadosMinuta';

/**
 * @typedef {{
*    numberOfValid: number;
*    hasError: string[];
* } & Record<Funci['matricula'], {
*    isValid: boolean;
*    template: string;
*    diffs: string;
* }>} DadosMassificado
*/

export function useMinutaMassificado() {
  const [current, setCurrent] = useState(1);
  const { dadosProcuracao } = useCadastroProcuracao();

  const { ok: listaDeMatriculas, err: listaDeErros } = dadosProcuracao
    .outorgadoMassificado
    .listaDeMatriculas
    .reduce((acc, cur) => {
      const outorgado = dadosProcuracao.outorgadoMassificado.outorgados[cur];
      if (isFunciError(outorgado)) {
        acc.err.push(outorgado);
      } else {
        acc.ok.push(cur);
      }

      return acc;
    }, /** @type {{ ok: string[]; err: Procuracoes.FunciError[] }} */({ ok: [], err: [] }));

  const dadosMassificado = listaDeMatriculas.reduce((acc, matricula) => {
    const dados = createDadosMinuta({
      templateBase: dadosProcuracao.dadosMinuta.templateBase,
      dadosProcuracao: extractDadosProcuracao(matricula)
    });

    if (dados.isValid) {
      acc.numberOfValid += 1;
    } else {
      acc.hasError.push(matricula);
    }

    acc[matricula] = dados;
    return acc;
  }, /** @type {DadosMassificado} */({ numberOfValid: 0, hasError: [] })
  );

  const currentMatricula = listaDeMatriculas[current - 1];

  const currentDadosProcuracao = extractDadosProcuracao(currentMatricula);

  const isAllValid = dadosMassificado.numberOfValid === listaDeMatriculas.length;

  return {
    currentDadosProcuracao,
    currentMatricula,
    dadosMassificado,
    isAllValid,
    listaDeMatriculas,
    listaDeErros,
    current,
    setCurrent,
  };
}
