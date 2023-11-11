/**
 * @param {Procuracoes.Subsidiaria[]} subsidiarias
 */
export function getSmallerDateFromSubsidiarias(subsidiarias) {
  const minDateArr = subsidiarias.map(
    (s) => getDateNum(s.vencimento)
  ).filter(Boolean);

  if (minDateArr.length === 0) {
    return null;
  }

  return new Date(Math.min(...minDateArr));
}

/**
 * @param {Date} date1
 * @param {Date} date2
 */
export function getSmallerDate(date1, date2) {
  const smallerDate = getSmallerDateNum(date1, date2);

  if (smallerDate === null) {
    return null;
  }

  return new Date(smallerDate);
}

/**
 * @param {Date} date1
 * @param {Date} date2
 */
function getSmallerDateNum(date1, date2) {
  if (date1 === null && date2 === null) {
    return null;
  }
  if (date1 === null) {
    return getDateNum(date2);
  }
  if (date2 === null) {
    return getDateNum(date1);
  }

  return Math.min(getDateNum(date1), getDateNum(date2));
}

/**
 * @param {Date|string} date
 */
function getDateNum(date) {
  if (date === null) {
    return null;
  }
  return new Date(date).getTime();
}
