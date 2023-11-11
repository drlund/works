const dependenciaModel = use('App/Models/Mysql/DependenciaTodas');
const pretifyDependencia = use('App/Commons/Arh/pretifyDependencia');
const exception = use('App/Exceptions/Handler')

async function getOnePrefixoByUor(uor){

    uor = String(uor).padStart(9, '0');
    const resultDependencia = await dependenciaModel.findBy('uor_dependencia', uor);

    if(!resultDependencia){
      return null;
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

  module.exports = getOnePrefixoByUor;