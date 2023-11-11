import { fetchOutorgados } from '../../fetchOutorgados';
import { getMatriculasToFetch } from './getMatriculasToFetch';
import { clearFromFetchingMatriculas } from './clearFromFetchingMatriculas';
import { saveOutorgados } from './saveOutorgados';

/**
 * @typedef {React.Dispatch<React.SetStateAction<Procuracoes.DadosProcuracao['outorgadoMassificado']>>} setListas
 */

/**
 * @param {string} idFluxo
 * @param {string[]} newMatriculas
 * @param {Procuracoes.DadosProcuracao['outorgadoMassificado']} old
 * @param {setListas} setListas
 */
export function getNewFetchingMatriculas(idFluxo, newMatriculas, old, setListas) {
  // gera um random key para o fetch, para poder remover depois
  const randomKey = String(performance.now());

  // acha as matriculas para fazer o fetch
  const matriculasToFetch = getMatriculasToFetch(newMatriculas, old);

  // se houverem matriculas
  if (matriculasToFetch.length > 0) {
    fetchOutorgados(matriculasToFetch, idFluxo)
      .then((matriculas) => saveOutorgados(setListas, matriculas))
      .finally(() => clearFromFetchingMatriculas(setListas, randomKey));

    return {
      ...old.fetchingMatriculas,
      [randomKey]: matriculasToFetch,
    };
  }

  return old.fetchingMatriculas;
}
