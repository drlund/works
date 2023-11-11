const demandasModel = use('App/Models/Mongo/Demandas/Demandas');
const exception = use('App/Exceptions/Handler');
const _ = require('lodash');

const PUBLICOS = 'publicos';
const LISTA = 'lista';

function _verificaPorPublicoDefault({ matricula, prefixo, publicos}) {
	//verifica se a matricula pesquisada esta na lista de matriculas cadastradas
	if (matricula && !_.isEmpty(publicos.matriculas) && 
			(publicos.matriculas.includes(matricula.toUpperCase()) || publicos.matriculas.includes(matricula.toLowerCase())) ) {
		//achou pela matrícula
		return true;
	}

	//verifica se o prefixo pesquisado esta na lista de prefixos cadastrados
	if (prefixo) {
		prefixo = String(prefixo).padStart(4, '0');

		if (!_.isEmpty(publicos.prefixos) && publicos.prefixos.includes(prefixo)) {
			//achou pelo prefixo
			return true;
		}
	}

	//nao encontrou o funci com a matricula/prefixo especificados
	//no publico-alvo desta demanda.
	return false;
}

function _verificaPorTipoLista({matricula, prefixo , lista}) {
	let found = false;

	for (const registro of lista.dados) {
		if (registro[0].trim().toUpperCase() === matricula || registro[0].trim() === prefixo) {
			found = true;
			break;
		}
	}

	return found;
}

/**
 * Metodo Principal do Helper
 * @param {*} params - objeto contendo:
 * 
 * {
 *    matricula, //opcional caso informe o prefixo
 *    prefixo,   //opcional caso informe a matricula
 *    idDemanda  //obrigatorio
 * }
 * 
 */
async function isPublicoAlvo(params) {
	
	let {matricula, prefixo, idDemanda} = params;

	if (idDemanda.length !== 24 ) {
		throw new exception("Id inválido", 400);
	}

	let demanda = await demandasModel.findById(idDemanda);

	if (!demanda) {
		throw new exception("Demanda não encontrada", 404);
	}

	const tipoPublico = demanda.publicoAlvo.tipoPublico;

	if (!tipoPublico || tipoPublico === PUBLICOS) {		
		return _verificaPorPublicoDefault({ matricula, prefixo, publicos: demanda.publicoAlvo.publicos});
	}

	if (tipoPublico === LISTA) {
		return _verificaPorTipoLista({ matricula, prefixo, lista: demanda.publicoAlvo.lista});
	}

	//default return value
  return false;
}


module.exports = isPublicoAlvo;