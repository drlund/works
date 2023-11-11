const pretifyFunci = require('./pretifyFunci');
const funciModel = use('App/Models/Mysql/Funci');

//Private methods
async function getFunciByCPF(cpf){

	const result = await funciModel.query()
			.select("*")
			.table("arhfot01")
			.where("cpf_nr",cpf)
			.with('dependencia', (builder) => {
				builder.where("cd_subord" , "00")
			})
			.with("nomeGuerra")
			.fetch();

	if (!result.first()) {
		return null;
  }

  let funci = result.first().toJSON();
	return pretifyFunci(funci);
}

module.exports = getFunciByCPF;
