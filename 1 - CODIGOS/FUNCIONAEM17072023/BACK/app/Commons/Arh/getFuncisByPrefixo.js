const pretifyFunci = require('./pretifyFunci');

const funciModel = use('App/Models/Mysql/Funci');
const exception = use('App/Exceptions/Handler');

/**
 * Metodo que obtem a lista de todos os funcionários de um prefixo específico.
 *
 * @param {String | Integer} prefixo - prefixo da dependencia
 * @param {Boolean} findInLotacao - caso true, pesquisa o prefixo nos campos ag_localiz e prefixo_lotacao.
 */
async function getFuncisByPrefixo(prefixo, findInLotacao = false){
	//normaliza o prefixo
	let prefixoPesq = String(prefixo).padStart(4, '0');

	const query = funciModel.query()
		.with("nomeGuerra")
		.with("dependencia");

	if (findInLotacao) {
		query.where(function () {
			this
				.where('ag_localiz', prefixoPesq)
				.orWhere('prefixo_lotacao', prefixoPesq)
		});
	} else {
		query.where("ag_localiz", prefixoPesq);
	}

	const funcis = await query.fetch();

	if(!funcis){
		throw new exception(`Funcionários não encontrados. Para o prefixo: ${prefixoPesq}`, 404);
	}

  return funcis.toJSON().map((funci) => {
		return pretifyFunci(funci);
	});

}

module.exports = getFuncisByPrefixo;
