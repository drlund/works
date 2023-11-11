const funciModel = use('App/Models/Mysql/Funci');
const cargosComissoesModel = use('App/Models/Mysql/Arh/CargosComissoes');
const _ = require('lodash');
const pretifyFunci = require('./pretifyFunci');

/**
 * Obtem a lista dos funcis de um determinado prefixo que possuem um
 * dos cargos especificados.
 *
 * @param {String | Integer} prefixo - prefixo da dependencia
 * @param {Array} listaCargos - Lista com os nomes dos cargos conforme definidos
 *                              na tabela cargos_e_comissoes.
 */
async function getFuncisByNomeCargo(prefixo, listaCargos = [], findInLotacao = false){

	try {
		//normaliza o prefixo
		let prefixoPesq = String(prefixo).padStart(4, '0');

		//obtem a lista de codigos dos cargos
		let listaCodigosCargos = await cargosComissoesModel.query()
			.setVisible(['cod_funcao'])
			.whereIn('nome_funcao', listaCargos)
			.fetch();

		if ( !listaCodigosCargos) {
			return [];
		}

		listaCodigosCargos = listaCodigosCargos.toJSON();
		listaCodigosCargos = _.map(listaCodigosCargos, 'cod_funcao');
		listaCodigosCargos = _.map(listaCodigosCargos, (elem) => String(elem).padStart(5, '0'));

		const query = funciModel.query()
			/*.where(function () {
				this
					.whereIn('funcao_lotacao', listaCodigosCargos)
					.orWhereIn('comissao', listaCodigosCargos)
			})*/
			.whereIn('comissao', listaCodigosCargos)
			.with("nomeGuerra")
			.with("dependencia");

		if (findInLotacao) {
			query.where(function () {
				this
					.where('ag_localiz', prefixoPesq)
					.orWhere('prefixo_lotacao', prefixoPesq)
      });
		} else {
			query.where("ag_localiz", prefixoPesq)
		}

		const funcis = await query.fetch();

		if(!funcis){
			return [];
		}

    return funcis.toJSON().map((funci) => {
			return pretifyFunci(funci);
		});

	} catch (err) {
		return [];
	}
}

module.exports = getFuncisByNomeCargo;
