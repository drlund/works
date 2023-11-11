function pretifyDependencia(dependencia){

    let transformed =  {

        prefixo: dependencia.prefixo,
        nome: dependencia.nome,
        subordinada: dependencia.cd_subord,
        uor: dependencia.uor_dependencia,
        gerev: dependencia.cd_gerev_juris,
        super: dependencia.cd_super_juris,
        diretoria: dependencia.cd_diretor_juris,
        email: dependencia.email,
        dv: dependencia.dv_prefixo
    }


    for(let key in transformed){
        transformed[key]  = typeof transformed[key] === 'string' ?
        transformed[key].trim() : transformed[key]
    }


    return transformed;

}

module.exports = pretifyDependencia;