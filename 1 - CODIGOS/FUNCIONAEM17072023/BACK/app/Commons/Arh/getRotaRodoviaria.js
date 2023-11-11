const exception = use('App/Exceptions/Handler');
const Designacao = use('App/Models/Mysql/Designacao');
const Superadm = use('App/Models/Mysql/Superadm');
const Dipes = use("App/Models/Mysql/Dipes");
const _ = require('lodash');
const axios = require('axios').default;

//Private methods
async function getRotaRodoviaria(posicao) {
  try {
    let rota = await axios.get('http://pxl0hosp0483.dispositivos.bb.com.br:5000/route/v1/driving/' + posicao.longOrigem + ',' + posicao.latOrigem + ';' + posicao.longDestino + ',' + posicao.latDestino + '?steps=false');

    rota = _.head(rota.data.routes);

    rota.distancia = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(rota.distance / 1000);

    const m = Math.floor((rota.duration % 3600) / 60);
    const h = Math.floor((rota.duration % 86400) / 3600);
    const d = Math.floor((rota.duration % 2592000) / 86400);

    rota.duracao = d + 'd ' + h + 'h ' + m + 'm';

    return rota;
  }
  catch (error) {
    // throw new exception("Rota Rodoviária não localizada!", 400);
    return {distancia: 0, duracao: '0d 0h 0m'};
  }

}

module.exports = getRotaRodoviaria;
