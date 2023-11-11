import {
  createContext,
  useContext,
  useMemo,
  useState
} from 'react';

/**
 * @typedef {{
 *  setListas: React.Dispatch<React.SetStateAction<PeopleCost.ListaEmails>>,
 *  source: PeopleCost.Pesquisa[],
 *  perSecond: number,
 *  maxMinutes: number,
 *  totalHora: number,
 *  totalTempo: number,
 *  currentTotal: number,
 *  setMaxMinutes: React.Dispatch<React.SetStateAction<number>>,
 *  currentSeconds: number,
 *  setCurrentSeconds: React.Dispatch<React.SetStateAction<number>>,
 *  withTaxes: boolean,
 *  setWithTaxes: React.Dispatch<React.SetStateAction<boolean>>,
 *  withExtra: boolean,
 *  setWithExtra: React.Dispatch<React.SetStateAction<boolean>>,
 *  costCalculator: (valorMinuto: number, totalMinutes?: number) => {
 *    perSecond: number;
 *    totalHora: number;
 *    totalTempo: number;
 *    currentTotal: number;
 *    extra: number;
 *  },
 *  constant: typeof peopleCostConstants[keyof typeof peopleCostConstants],
 * }} PeopleCostContext
 */

const taxes60percent = 1.6;
const hourToMin = 60;
const minToSec = 60;

function secToHour(/** @type {number} */ secs) {
  return secs * hourToMin * minToSec;
}

// @ts-expect-error
const PeopleCost = createContext(/** @type {PeopleCostContext} */(null));

const meeting = /** @type {unique symbol} */ Symbol('meeting');
const efficiency =/** @type {unique symbol} */ Symbol('efficiency');

export const peopleCostConstants = /** @type {const} */({
  meeting,
  efficiency,
});

/**
 * @param {{
 *  children: import('react').ReactNode,
 *  defaultExtra: boolean,
 *  constant: PeopleCostContext['constant'],
 * }} props
 */
export function PeopleCostProvider({ children, defaultExtra, constant }) {
  const [maxMinutes, setMaxMinutes] = useState(60);
  const [currentSeconds, setCurrentSeconds] = useState(0);
  const [withTaxes, setWithTaxes] = useState(true);
  const [withExtra, setWithExtra] = useState(defaultExtra);

  const [listas, setListas] = useState(/** @type {PeopleCost.ListaEmails} */({
    funcis: {},
    fetchingFuncis: {},
  }));

  const fetching = /** @type {PeopleCost.PesquisaLoading[]} */(
    Object
      .values(listas.fetchingFuncis)
      .flat()
      .map((email) => ({ email, loading: true }))
  );

  const source = /** @type {PeopleCost.Pesquisa[]} */([...Object.values(listas.funcis), ...fetching]);

  /**
   * sorting por email
   * no entanto deixando entradas com erro primeiro
   */
  source.sort((a, b) => {
    if (/** @type {PeopleCost.PesquisaError} */ (a).error && !/** @type {PeopleCost.PesquisaError} */ (b).error) {
      return -1;
    }
    if (!/** @type {PeopleCost.PesquisaError} */ (a).error && /** @type {PeopleCost.PesquisaError} */ (b).error) {
      return 1;
    }

    return (a.email < b.email) ? -1 : 1;
  });

  const totalPerMinute = source.reduce(
    (acc, cur) => acc + ((/** @type {PeopleCost.PesquisaOk} */(cur).valorMinuto || 0)),
    0
  );

  const costCalculator = (/** @type {number} */ valorMinuto, totalMinutes = maxMinutes) => {
    const perSecondCalc = (valorMinuto / minToSec) * (withTaxes ? taxes60percent : 1);

    // extra: considerar 30 minutas a 50% do valor
    const extra = withExtra ? ((perSecondCalc / 2) * 30 * minToSec) : 0;

    return {
      perSecond: perSecondCalc,
      totalHora: secToHour(perSecondCalc) + extra,
      totalTempo: (perSecondCalc * minToSec * totalMinutes) + extra,
      currentTotal: (perSecondCalc * currentSeconds) + extra,
      extra,
    };
  };

  const {
    perSecond,
    totalHora,
    totalTempo,
    currentTotal,
  } = costCalculator(totalPerMinute);

  const values = useMemo(() => /** @type {PeopleCostContext} */({
    costCalculator,
    setListas,
    source,
    perSecond,
    totalHora,
    totalTempo,
    currentTotal,
    currentSeconds,
    setCurrentSeconds,
    maxMinutes,
    setMaxMinutes,
    withTaxes,
    setWithTaxes,
    withExtra,
    setWithExtra,
    constant,
  }), [currentSeconds, maxMinutes, withTaxes, withExtra, listas, source]);

  return (
    <PeopleCost.Provider value={values}>
      {children}
    </PeopleCost.Provider>
  );
}

export function usePeopleCost() {
  return useContext(PeopleCost);
}
