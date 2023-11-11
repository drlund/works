const REGEX_MATRICULA = /^[Ff]\d{7}$/;

export const validarMatricula = (termoPesquisa) => REGEX_MATRICULA.test(termoPesquisa);
