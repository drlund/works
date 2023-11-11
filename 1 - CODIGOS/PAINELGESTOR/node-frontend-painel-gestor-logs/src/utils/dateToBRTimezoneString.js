/**
 * Converte um Date Object ou Date String para o padrão BR, no timezone BR.
 * Datas sem horário podem acabar aparecendo como
 * no "dia anterior" por causa da diferença de timezone.
 * Esta função mostra a data considerando o timezone como UTC+0
 *
 * @param {string | Date} date
 * @example '2020-01-01' vira '01/01/2020'
 */
export function dateToBRTimezoneString(date) {
  return new Intl
    .DateTimeFormat('pt-BR', { timeZone: 'UTC' })
    .format(new Date(date));
}

/**
 * If date is a string and includes separator, then calls `dateToBRTimezoneString`.
 *
 * Usually the `-` means an untreated date
 * (avoiding double parsing a date already in DDMMYYYY format)
 *
 * @param {string | Date} date date in string format
 * @param {string} [separator] defaults to `-`, if date string has the separator
 * @returns date in string format, pt-br locale
 */
export function datoToBRStringOnlyIfSeparator(date, separator = '-') {
  if (typeof date === 'string' && date.includes(separator)) {
    return dateToBRTimezoneString(date);
  }
  return date;
}
