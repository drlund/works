'use strict'
const { AbstractUserCase } = use("App/Commons/AbstractUserCase");

class UCFindTiposAcesso extends AbstractUserCase {
  _checks() {}

  async _action() {
   const {
    tiposAcesso
   } = this.repository;

   const tipos = await tiposAcesso.getAll();

   return tipos;
  }

}

module.exports = UCFindTiposAcesso;
