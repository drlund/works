const exception = use("App/Exceptions/Handler");
const Status = use("App/Models/Mysql/HorasExtras/Status");
const {isPrefixoUT, isPrefixoUN} = use("App/Commons/Arh");
const isPrefixoSuperAdm = use("App/Commons/HorasExtras/isPrefixoSuperAdm");
const Constants = use("App/Commons/HorasExtras/Constants");

async function obterStatus(user) {
  try {

    let data = await Status.all();
    data = data.toJSON();

    const UNeg = await isPrefixoUN(user.prefixo);
    const SAdm = !UNeg && await isPrefixoSuperAdm(user.prefixo);
    const UTat = SAdm || UNeg ? false : await isPrefixoUT(user.prefixo);

    data.push({id_status: 5, nome_status: "TODOS OS STATUS"});

    data = data.map(estado => {
      const selected = (UNeg && estado.id_status === Constants.TODOS) || (SAdm && estado.id_status === Constants.AGUARDANDO_SUPER_ADM) || (UTat && estado.id_status === Constants.AGUARDANDO_SUPER_ESTADUAL);
      return ({
        ...estado,
        selected
      })
    });

    return data;
  } catch (err) {
    throw new exception(err, 404);
  }
}

module.exports = obterStatus;
