const pretifyFunci = require('./pretifyFunci');

const funciModel = use('App/Models/Mysql/Funci');

//Private methods
async function getOneFunciAdm(matricula){

	const result = await funciModel.query()
			.select("*")
			.table("arhfot01_adm")
			.where("matricula",matricula)
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

module.exports = getOneFunciAdm;
