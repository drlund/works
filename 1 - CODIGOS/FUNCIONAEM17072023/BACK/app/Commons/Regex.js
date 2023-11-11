/**
 *   Lista de Regex comuns para validação
 *
 */

const REGEX_MCI = /^\d{1,9}$/;
const REGEX_CNPJ = /^\d{2}.\d{3}.\d{3}\/\d{4}-\d{2}$/;
const REGEX_CEP = /^\d{5}-\d{3}$/;
const REGEX_CPF = /^\d{11}$/;
const REGEX_VALOR_NUMERICO = /^\d+$/;
const REGEX_MATRICULA = /^[Ff]\d{7}$/;

module.exports = {
  REGEX_MCI,
  REGEX_CPF,
  REGEX_CNPJ,
  REGEX_CEP,
  REGEX_VALOR_NUMERICO,
  REGEX_MATRICULA
};
