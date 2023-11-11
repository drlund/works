import { v4 as uuid } from 'uuid';
/**
 * @typedef {React.Dispatch<React.SetStateAction<Procuracoes.DadosProcuracao['outorgadoMassificado']>>} setListas
 */

/**
 * @param {setListas} setListas
 * @param {Procuracoes.FetchedFunci[]} matriculas
 */
export function saveOutorgados(setListas, matriculas) {
  setListas((l) => {
    const newOutorgados = matriculas.reduce((acc, cur) => {
      acc[cur.matricula] = cur;

      // neste momento, para cada outorgado que foi fetched, é criado um uuid
      l.uuidMatriculas[cur.matricula] = uuid();

      return acc;
    }, l.outorgados);

    return {
      ...l,
      outorgados: newOutorgados,
    };
  });
}
