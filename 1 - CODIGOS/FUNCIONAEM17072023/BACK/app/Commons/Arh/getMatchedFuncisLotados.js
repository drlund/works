const pretifyFunci = require('./pretifyFunci');

const funciModel = use('App/Models/Mysql/Funci');
const exception = use('App/Exceptions/Handler');

//Private methods
async function getMatchedFuncisLotados(prefixo, comissao) {

	comissao += '';

	const funcis = await funciModel.query()
		.select("*")
		.table("arhfot01")
		.where("prefixo_lotacao", prefixo)
		.where("comissao", comissao.padStart(5, '0'))
		.with("nomeGuerra")
		.with("dependencia")
		.fetch();

	if (!funcis) {
		throw new exception("Funcionários não encontrados.", 404);
	}

  return funcis.toJSON().map((funci) => {
		return pretifyFunci(funci);
	});

}

module.exports = getMatchedFuncisLotados;
