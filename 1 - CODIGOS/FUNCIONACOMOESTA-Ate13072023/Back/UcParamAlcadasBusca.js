// @ts-nocheck
"use strict";

const { AbstractUserCase } = require("../../AbstractUserCase");
// @ts-ignore
class UcParamAlcadasBusca extends AbstractUserCase {

    // @ts-ignore
    async _checks(dadosUsuario){
        const hasAcessosNecessarios = await this.functions.checkAcessosMovimentacao(dadosUsuario, ["ADM_QUORUM_QUALQUER", "ADM_QUORUM_PROPRIO"]);
        if (!hasAcessosNecessarios) {
            throw new Error("Usuário não possui acessos necessários.");
          }
    }

    // @ts-ignore
    async validate(id){
        // @ts-ignore
        this.prefixoDestino = prefixoDestino;
        this.id = id;
        // @ts-ignore
        this.validate = true;
    }
// @ts-ignore
}

// @ts-ignore
module.exports = UcParamAlcadasBusca;