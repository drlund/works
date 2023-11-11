const demandasModel = use('App/Models/Mongo/Demandas/Demandas');
const hasPermission = use('App/Commons/HasPermission')

async function isUserColaborador(params){

    let { dadosUsuario, idDemanda, matricula } = params;

    if (dadosUsuario) {
        const isAdmin = await hasPermission({ 
            nomeFerramenta: 'Demandas', 
            dadosUsuario, 
            permissoesRequeridas: ['ADMIN']
        });

        if (isAdmin) {
            return true;
        }
    }

    let demandaAtual = await demandasModel.findById(idDemanda);
    let isColaborador = false;

    demandaAtual.colaboradores.forEach((elemento) => {
        if(elemento.matricula == matricula){
            isColaborador = true;
        }
    });

    return isColaborador;
}

module.exports = isUserColaborador;

