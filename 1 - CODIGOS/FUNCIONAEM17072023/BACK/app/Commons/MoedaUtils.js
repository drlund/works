const exception = use('App/Exceptions/Handler');
// const moment = use('App/Commons/MomentZoneBR');

/**
 *
 *    Classe que fornece serviços relacionados a valores decimais
 *
 */

module.exports = {
  /**
   *
   *   Transforma a string recebida em um valor decimal válido para o BD
   *   Ex.: "R$ 15.000,00" -> 15000.00
   */
  toDB: (valor) => {
    valor = valor.toString();
    valor = valor.trim(); // remover os espaços
    valor = valor.replace('R$', ''); // remover o identificador da moeda
    valor = valor.replace('.', ''); // remover os separadores de milhar
    valor = valor.replace(',', '.'); // trocar o separador de decimal
    return parseFloat(valor); // retorna o valor convertido para float
  },

  fromDB: (valor, cifra = false) => {
    valor = Number(valor);

    if (cifra) {
      // Valor com cifrão
      return "R$ " + valor.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+\,)/g, "$1.");
    } else {
      //Valor sem cifrão	
      return valor.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+\,)/g, "$1.");
    }
  }

};
