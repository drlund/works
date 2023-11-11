const funciModel = use('App/Models/Mysql/Funci');
const exception = use('App/Exceptions/Handler');
const _ = require('lodash');
const pretifyFunci = require('./pretifyFunci');

//Private methods
async function getMatchedFuncis(searchTerm, buscaSimplificada){

	let query = funciModel.query()
		.select("*")
		.table("arhfot01")
		.with("dependencia");

	if (!buscaSimplificada) {
		query.with("nomeGuerra")
	}

	if (/^[F|f]\d{1,7}/.test(searchTerm)) { //verifica se foi passada a matricula
		//faz a busca com a matricula iniciando com o texto
		//reduz as ocorrencias e faz uma busca mais precisa
		query.where("matricula", 'like', `${searchTerm}%` )
	} else if (/^\d{1,4}/.test(searchTerm)) { //verifica se foi passado um prefixo
		searchTerm = String(searchTerm).padStart(4, '0');

		query.whereHas('dependencia', builder => {
			builder.where('prefixo', 'like', `%${searchTerm}%`)
		})
	}	else {
		//faz a busca apenas pelo conteudo do nome
		//reduz as ocorrencias e faz uma busca mais precisa
		query.where("nome", 'like', `%${searchTerm}%`);
	}

	const funcis = await query.fetch();

  if (!funcis) {
    throw new exception("Funcionários não encontrados.", 404);
  }

	return funcis.toJSON().map((funci) => {
    if (!buscaSimplificada) {
			return pretifyFunci(funci);
		} else {
			//retorno simplificado para ser usado no componente de autocomplete.
			return {
				matricula: funci.matricula,
				nome: funci.nome,
				prefixo: funci.dependencia.prefixo,
				dependencia: funci.dependencia.nome
			}
		}
	});

}

module.exports = getMatchedFuncis;
