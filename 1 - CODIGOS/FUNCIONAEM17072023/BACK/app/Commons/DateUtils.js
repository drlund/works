/** @type {typeof import('moment')} */
const moment = use("App/Commons/MomentZone");
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const feriadoPrefixoModel = use("App/Models/Mysql/FeriadoPrefixo");
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const feriadoNacionalModel = use("App/Models/Mysql/FeriadoNacional");
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const ausenciasModel = use("App/Models/Mysql/Ausencia");
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const historicoUorsModel = use("App/Models/Mysql/HistoricoUors");
const Logger = use("Logger");

/**
 *
 *    Serviços relacionados a Datas
 *
 */

//Função que recebe uma instância de momentjs o string e retorna uma instância do momentjs.
const normalizaMomentjs = (data) => {
  if (typeof data === "string") {
    data = moment(data);
    if (!data.isValid()) {
      throw "String da data início no formato errado";
    }
  }

  return data;
};

/**
 *    Função qeu recebe uma data e retorna informa se é um feriado nacional.
 *    A base de feriados utilizada nesta função está no banco 'feriados' tabela 'base_feriados_nacionais'
 *
 *    @param {string/momentjs} data Data que se deseja saber se é um feriado nacional
 *
 *    @return {boolean}  Retorna true, caso seja
 *
 */

const isFeriadoNacional = async (data) => {
  data = normalizaMomentjs(data);

  const feriadoNacional = await feriadoNacionalModel.findBy(
    "data_feriado",
    data.format("YYYY-MM-DD")
  );

  return feriadoNacional ? true : false;
};

/**
 *    Função que recebe uma data e retorna informa se é um feriado municipal ou estadual em um determinado município.
 *    A base de feriados utilizada nesta função está no banco 'feriados' tabela 'base_feriados_prefixo'
 *
 *    @param {string/momentjs} data Data que se deseja saber se é um feriado nacional
 *    @param {string} prefixo Prefixo do qual se deseja consultar o feriado
 *    @return {boolean}  Retorna true, caso seja
 *
 */

const isFeriadoPrefixo = async (data, prefixo) => {
  data = normalizaMomentjs(data);

  const feriadosPrefixo = await feriadoPrefixoModel
    .query()
    .where("prefixo", prefixo)
    .where("data_feriado", data.format("YYYY-MM-DD"))
    .fetch();

  return feriadosPrefixo.rows.length > 0 ? true : false;
};

/**
 *    Função que retorna todos os feriados nacionais.
 *    A base de feriados utilizada nesta função está no banco 'feriados' tabela 'base_feriados_nacionais'
 *
 *    @param {null}
 *
 *    @return {Array[]}  Retorna array de datas.
 *
 */

const getFeriadosNacionais = async () => {
  const feriadoNacional = await feriadoNacionalModel.query()
    .select('data_feriado')
    .where('ativo', 1)
    .fetch();

  return feriadoNacional.toJSON();
};

/**
 *    Função que retorna feriados municipais ou estaduais em um determinado município.
 *    A base de feriados utilizada nesta função está no banco 'feriados' tabela 'base_feriados_prefixo'
 *
 *    @param {string} prefixo Prefixo do qual se deseja consultar o feriado
 *    @return {Array[]}  Retorna array de datas
 *
 */

const getFeriadosPrefixo = async (prefixo) => {
  const feriadosPrefixo = await feriadoPrefixoModel.query()
    .where("prefixo", prefixo)
    .fetch();

  return feriadosPrefixo.toJSON();
};

const getFeriadosFixos = async () => {
  const datas = await feriadoPrefixoModel.query()
    .table('base_nacional_fixo')
    .fetch();

  const feriados = datas.toJSON();

  const feriadosFixos = feriados.map((data) => `${data.mes}-${data.dia}`);

  return feriadosFixos;
}


/**
 *  Testa se um funcionário estava ausente na data especificada. A base utilizada é a tabela 'tb_funcis_ausencias' do banco de dados 'mestre_sas'
 * @param {string/momentjs} data Data a ser testada
 * @param {string} matricula Matrícula do funcionário
 */

const isFunciAusente = async (data, matricula) => {
  data = normalizaMomentjs(data);
  const ausencias = await ausenciasModel
    .query()
    .where("matricula", matricula)
    .where("dt_inicio", "<=", data.format("YYYY-MM-DD"))
    .where("dt_final", ">=", data.format("YYYY-MM-DD"))
    .fetch();

  return ausencias.rows.length > 0;
};

/**
 *  Função que verificar se uma data é final de semana
 * @param {string/momentjs} data Data que se deseja saber se é um final de semana
 *
 *  @return {boolean} Retorna true, caso final de semana e false caso contrário
 */

const isFinalSemana = (data) => {
  data = normalizaMomentjs(data);
  let diaSemana = data.day();
  return diaSemana === 0 || diaSemana === 6;
};

/**
 *
 *  Função que recebe duas datas, como instâncias do momentjs ou string aceita pela biblioteca, e retorna o intervalo de dias corridos entre elas em dias, ignorando as horas.
 *
 *   EX:
 *
 *    2019-01-01 12:00:00 2019-01-03 10:00:00 => Retorna 2 dias
 *
 * @param {string/moment} dataInicio  String/Momentjs representando a data de início
 * @param {string/moment} dataInicio  String/Momentjs representando a data de início. Caso não seja informado, será considerada a data atual
 *
 * @throws Caso ocorra algum erro, levanta uma exceção
 * @return {int} Quantidade de dias
 *
 */

const dateDiff = (dataInicio, dataFim) => {
  if (!dataInicio) {
    throw "Data início deve ser informada";
  }

  if (!dataFim) {
    dataFim = moment();
  }

  dataInicio = normalizaMomentjs(dataInicio);
  dataFim = normalizaMomentjs(dataFim);
  dataInicio.add(1, "days").startOf("day");
  dataFim.add(1, "days").startOf("day");
  let diffHoras = dataFim.diff(dataInicio, "hours");
  //Arredonda pra o quanto passou de 1 hora
  return Math.ceil(diffHoras / 24);
};

const getDiasTrabalhadosPrefixo = async (prefixo, dataInicial, dataFinal) => {
  //Caso a data final não seja informada, será considerada a data atual.
  if (!dataFinal) {
    dataFinal = moment();
  }

  let data = dataInicial;
  const qtdDias = dateDiff(moment(dataInicial), moment(dataFinal));
  let qtdDiasTrabalhados = 0;

  data = normalizaMomentjs(data);
  for (let i = 0; i < qtdDias; i++) {
    if (i > 0) {
      data.add(1, "days");
    }

    if (
      isFinalSemana(data) ||
      (await isFeriadoNacional(data)) ||
      (await isFeriadoPrefixo(data, prefixo))
    ) {
      continue;
    }
    qtdDiasTrabalhados += 1;
  }

  return qtdDiasTrabalhados;
};

const getDiasTrabalhados = async (
  matricula,
  dataInicial,
  dataFinal,
  logAusencia = null
) => {
  //Caso a data final não seja informada, será considerada a data atual.
  if (!dataFinal) {
    dataFinal = moment();
  }

  let data = moment(dataInicial);
  const qtdDias = dateDiff(moment(dataInicial), moment(dataFinal).endOf("day"));
  let qtdDiasTrabalhados = 0;

  for (let i = 0; i < qtdDias; i++) {
    if (i > 0) {
      data.add(1, "days");
    }

    const historicoUor = await historicoUorsModel
      .query()
      .select("prefixo")
      .where("matricula", matricula)
      .where("dt_inicio", "<=", data.format("YYYY-MM-DD"))
      .where("dt_final", ">=", data.format("YYYY-MM-DD"))
      .first();

    if(!historicoUor || historicoUor === null || !historicoUor.prefixo){
      qtdDiasTrabalhados += 1;
      continue;
    }

    //Caso a UOR do funcionário à época não seja encontrado, considera-se como dia trabalhado.
    if (!isFinalSemana(data) && (!historicoUor || !historicoUor.prefixo)) {
      qtdDiasTrabalhados += 1;
      continue;
    }

    const finalSemana = isFinalSemana(data);
    const feriadoNacional = await isFeriadoNacional(data);
    const feriadoPrefixo = await isFeriadoPrefixo(data, historicoUor.prefixo);
    const funciAusente = await isFunciAusente(data, matricula);

    if (finalSemana || feriadoNacional || feriadoPrefixo || funciAusente) {
      if (logAusencia !== null) {
        await logAusencia.func(
          data,
          matricula,
          {
            finalSemana,
            feriadoNacional,
            feriadoPrefixo,
            funciAusente,
          },
          logAusencia.trx ? logAusencia.trx : null
        );
      }
      continue;
    }

    qtdDiasTrabalhados += 1;
  }

  return qtdDiasTrabalhados;
};

const getUltimoDiaUtil = async () => {
  let achouDiaUtil = false;
  const dataAtual = moment();

  while (!achouDiaUtil) {
    dataAtual.subtract(1, "day");
    const finalSemana = await isFinalSemana(dataAtual);
    const feriado = await isFeriadoNacional(dataAtual);
    achouDiaUtil = !finalSemana && !feriado;
  }
  return dataAtual;
};

module.exports = {
  dateDiff,
  isFeriadoNacional,
  normalizaMomentjs,
  isFeriadoPrefixo,
  isFinalSemana,
  isFunciAusente,
  getDiasTrabalhados,
  getUltimoDiaUtil,
  getDiasTrabalhadosPrefixo,
  getFeriadosNacionais,
  getFeriadosPrefixo,
  getFeriadosFixos,
};
