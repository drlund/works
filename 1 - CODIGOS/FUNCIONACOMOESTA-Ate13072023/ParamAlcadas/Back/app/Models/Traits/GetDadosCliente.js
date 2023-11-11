'use strict'

const getDadosBasicosCliente = use(
  "App/Commons/Clientes/getDadosBasicosCliente"
);

class GetDadosCliente {
  register (Model, customOptions = {}) {
    const defaultOptions = {}
    const options = Object.assign(defaultOptions, customOptions)


    Model.prototype.getDadosCliente = async function(){
      const dadosCliente = await getDadosBasicosCliente(this.mci, true);
      return dadosCliente;
    }

  }
}

module.exports = GetDadosCliente
