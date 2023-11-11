const exception = use('App/Exceptions/Handler');
const Dipes = use("App/Models/Mysql/Dipes");
const { getCursosEtica, getTreinamentosFunci, getCPAFunci } = use("App/Commons/Arh");
const _ = require('lodash');

//Private methods
async function getTreinamentosRealizados(funci) {
  try {
    let treinamentos = await getTreinamentosFunci(funci);

    treinamentos = treinamentos.map(elem => parseInt(elem.cod_curso));

    let etica = await getCursosEtica();

    etica = etica.map(elem => parseInt(elem.cd_curso));

    const trilhaEtica = etica.filter(curso => !treinamentos.includes(curso)); //etica.every(i => treinamentos.includes(i));

    const cursosTrilhaEticaNaoRealizados = trilhaEtica ? (new Uint16Array(etica.filter(curso => !treinamentos.includes(curso)))).sort((atual, ant) => atual - ant) : [];

    let stringCursosTrilhaEticaNaoRealizados = "";

    if (cursosTrilhaEticaNaoRealizados.length === 1) {
      stringCursosTrilhaEticaNaoRealizados = cursosTrilhaEticaNaoRealizados.toString().concat('. ');
    }

    if (cursosTrilhaEticaNaoRealizados.length > 1) {
      stringCursosTrilhaEticaNaoRealizados = [...cursosTrilhaEticaNaoRealizados];
      const ultimo = stringCursosTrilhaEticaNaoRealizados.pop();
      stringCursosTrilhaEticaNaoRealizados = stringCursosTrilhaEticaNaoRealizados
        .toString()
        .replace(/,/g, ", ")
        .concat(` e ${ultimo}. `);
    }

    let cpaFunci = await getCPAFunci(funci);

    return ({ treinamentos, trilhaEtica, cpaFunci, cursosTrilhaEticaNaoRealizados, stringCursosTrilhaEticaNaoRealizados });
  } catch (err) {
    throw new exception(err, 400);
  }
}

module.exports = getTreinamentosRealizados;
