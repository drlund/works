/**
 * Fluxos possíveis da ferramenta, válido para Cadastro e Minutas
 */
const FLUXOS = /** @type {const} */ ({
  PUBLICA: 'PUBLICA',
  PARTICULAR: 'PARTICULAR',
  SUBSIDIARIA: 'SUBSIDIARIA',
});

/**
 * @typedef {|
 * 'SEM_RESTRICAO' |
 * 'PRIMEIRO_NIVEL' |
 * 'SEGUNDO_NIVEL' |
 * 'TERCEIRO_NIVEL' |
 * 'SUPERINTENDENTE' |
 * 'SUPER_REGIONAL'
 * } TiposOutorgadoKeys
 */

/**
 * A validação dos tipos de outorgados é feita se houver as chaves 'refOrganizacional' e 'prefixos'
 *
 * Caso exista a chave, se verifica se o predicado está incluído nos arrays.
 * Caso não exista a chave, o predicado é considerado válido.
 *
 * Atenção: caso a chave contenha um array vazio, o predicado é considerado INVÁLIDO.
 *
 * exemplo:
 * SUPER_ADM: {
 *   refOrganizacional: ["1GUT"],
 *   prefixos: ["9009"],
 * },
 *
 * @type {Record<TiposOutorgadoKeys, {refOrganizacional?: string[], prefixos?: string[]}>}
 */
const TIPOS_OUTORGADO = {
  SEM_RESTRICAO: {
  },
  PRIMEIRO_NIVEL: {
    refOrganizacional: ["1GUN"],
  },
  SEGUNDO_NIVEL: {
    refOrganizacional: ["2GUN"],
  },
  TERCEIRO_NIVEL: {
    refOrganizacional: ["3GUN"],
  },
  SUPERINTENDENTE: {
    refOrganizacional: ["1GUT"],
  },
  SUPER_REGIONAL: {
    refOrganizacional: ["2GUT"],
  },
};

const prefixosComAcessoEspecial = /** @type {const} */([
  "9009", "8380", "8485", "8486", "8487", "8488", "8489", "8490",
  "8491", "8493", "8494", "8495", "8496", "8497", "8498", "8499",
  "8500", "8501", "8503", "8508", "8510", "8515", "9007", "9008", "9942"
]);

/**
 * Informação para o frontend se a pessoa é da dependencia
 * que pode ver a opção, seja para cadastro ou minuta.
 */
const VISIBILIDADE = /** @type {const} */({
  SUPER: ["9009"],
  PARA_UT: prefixosComAcessoEspecial,
});

/**
 * @typedef {{
 *   minuta: string;
 *   fluxo: typeof FLUXOS[keyof typeof FLUXOS];
 *   outorgados: typeof TIPOS_OUTORGADO[keyof typeof TIPOS_OUTORGADO];
 *   visibilidade?: typeof VISIBILIDADE[keyof typeof VISIBILIDADE];
 * }} FluxoMinuta
 */

/**
 * @returns {Record<string,FluxoMinuta>}
 */
const MINUTAS_BASE = () => ({
  "f8dd7ebd-8c5c-4f7e-92c0-4a9ac7e52ba4": {
    minuta: "1º Nível Gerencial UT (Superintendente UT)",
    fluxo: FLUXOS.SUBSIDIARIA,
    outorgados: TIPOS_OUTORGADO.SUPERINTENDENTE,
    visibilidade: VISIBILIDADE.SUPER,
  },
  "9bca0a03-9b9e-454c-a6a1-b963942fc25c": {
    minuta: "2º Nível Gerencial UT (Gerente de Negócios ou Administração, Superintendente Regional) | Pública",
    fluxo: FLUXOS.PUBLICA,
    outorgados: TIPOS_OUTORGADO.SUPER_REGIONAL,
    visibilidade: VISIBILIDADE.PARA_UT,
  },
  "9b27efa1-99f3-4787-b6c8-ae018721c02c": {
    minuta: "2º Nível Gerencial UT (Gerente de Negócios ou Administração, Superintendente Regional) | Particular",
    fluxo: FLUXOS.PARTICULAR,
    outorgados: TIPOS_OUTORGADO.SUPER_REGIONAL,
    visibilidade: VISIBILIDADE.PARA_UT,
  },
  "183e8ee8-29bf-44b9-8b2a-06c0b20020a9": {
    minuta: "2º Nível Gerencial UT (Superintendente Regional ou Gerente de Negócios) em substituição ao Superintendente UT | Pública",
    fluxo: FLUXOS.PUBLICA,
    outorgados: TIPOS_OUTORGADO.SUPER_REGIONAL,
    visibilidade: VISIBILIDADE.PARA_UT,
  },
  "e9b1d2c5-ace3-4349-ad2d-6c6f757d49da": {
    minuta: "2º Nível Gerencial UT (Superintendente Regional ou Gerente de Negócios) em substituição ao Superintendente UT | Particular",
    fluxo: FLUXOS.PARTICULAR,
    outorgados: TIPOS_OUTORGADO.SUPER_REGIONAL,
    visibilidade: VISIBILIDADE.PARA_UT,
  },
  "33c79330-1c11-4021-bf7c-d22e70359438": {
    minuta: "1º Nível Gerencial UN (Gerente Geral)",
    fluxo: FLUXOS.PUBLICA,
    outorgados: TIPOS_OUTORGADO.PRIMEIRO_NIVEL,
    visibilidade: VISIBILIDADE.SUPER,
  },
  "b5dfd889-9196-4199-9706-2da7900c98b4": {
    minuta: "Substituição ao 1º Nível Gerencial UN (Gerente Geral) | Pública",
    fluxo: FLUXOS.PUBLICA,
    outorgados: TIPOS_OUTORGADO.SEM_RESTRICAO,
    visibilidade: VISIBILIDADE.SUPER,
  },
  "7c87cabf-6f73-4a63-aae1-8619417c52c6": {
    minuta: "Substituição ao 1º Nível Gerencial UN (Gerente Geral) | Particular",
    fluxo: FLUXOS.PARTICULAR,
    outorgados: TIPOS_OUTORGADO.SEM_RESTRICAO,
  },
  "6e7d44f6-3c9f-4efe-87aa-6307af65df17": {
    minuta: "2º Nível Gerencial UN (Gerente de Negócios ou Administração) | Pública",
    fluxo: FLUXOS.PUBLICA,
    outorgados: TIPOS_OUTORGADO.SEGUNDO_NIVEL,
    visibilidade: VISIBILIDADE.SUPER,
  },
  "89998559-8d58-4031-a708-8386379ba8bf": {
    minuta: "2º Nível Gerencial UN (Gerente de Negócios ou Administração) | Particular",
    fluxo: FLUXOS.PARTICULAR,
    outorgados: TIPOS_OUTORGADO.SEGUNDO_NIVEL,
  },
  "a6c2cb94-8c1a-4d5c-8208-b9e49f53bd21": {
    minuta: "3º Nível Gerencial UN (Demais Gerentes) | Pública",
    fluxo: FLUXOS.PUBLICA,
    outorgados: TIPOS_OUTORGADO.TERCEIRO_NIVEL,
    visibilidade: VISIBILIDADE.SUPER,
  },
  "f2a79756-0a31-44af-aa3a-cbcfcd5d03ef": {
    minuta: "3º Nível Gerencial UN (Demais Gerentes) | Particular",
    fluxo: FLUXOS.PARTICULAR,
    outorgados: TIPOS_OUTORGADO.TERCEIRO_NIVEL,
  },
});

const getAllFluxosMinutas = MINUTAS_BASE;

/**
 * @param {string} id
 * @returns {FluxoMinuta|undefined}
 */
const getOneFluxoMinuta = (id) => MINUTAS_BASE()[id];

/**
 * Função que retorna um objeto com as ids das minutas e dentro delas o nome da minuta e o fluxo
 */
const getMinutasFluxos = () => {
  const minutas = MINUTAS_BASE();
  Object.keys(minutas).forEach((key) => {
    Reflect.deleteProperty(minutas[key], 'outorgados');
  });

  return minutas;
};

/**
 * Função que retorna um objeto com as ids das minutas e dentro delas o nome da minuta, refOrganizacional e prefixos
 */
const getFluxosMinutasOutorgados = () => {
  const minutas = /** @type {Record<string, {minuta: string, refOrganizacional: string[], prefixos: string[]}>} */({});
  Object.entries(MINUTAS_BASE()).forEach(([key, value]) => {
    minutas[key] = {
      minuta: value.minuta,
      refOrganizacional: value.outorgados.refOrganizacional,
      prefixos: value.outorgados.prefixos,
    };
  });

  return minutas;
};

const getFluxos = () => FLUXOS;

const getPrefixosComAcessoEspecial = () => prefixosComAcessoEspecial;

module.exports = {
  getAllFluxosMinutas,
  getOneFluxoMinuta,
  getMinutasFluxos,
  getFluxosMinutasOutorgados,
  getFluxos,
  getPrefixosComAcessoEspecial,
};
