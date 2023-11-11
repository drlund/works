const dependenciaModel = use('App/Models/Mysql/Dependencia');
const pretifyDependencia = use('App/Commons/Arh/pretifyDependencia');
const exception = use('App/Exceptions/Handler')

async function getOnePrefixo(prefixo){

    prefixo = String(prefixo).padStart(4, '0');
    const resultDependencia = await dependenciaModel.findBy('prefixo', prefixo);

    if(!resultDependencia){
      throw new exception("Dependência: [" + prefixo + "] não encontrada.", 404);
    }

    let dependencia = resultDependencia.toJSON();
    const resultEmail = await dependenciaModel.query().select("EmaildaUOR").table("mstd503e").where("CodigodaUOR", dependencia.uor_dependencia).first()
    
    if (resultEmail) {
      dependencia.email = String(resultEmail.EmaildaUOR).toLowerCase();
    } else {
      dependencia.email = "";
    }

    return pretifyDependencia(dependencia);
  }

  module.exports = getOnePrefixo;