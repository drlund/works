const BumblebeeTransformer = use('Bumblebee/Transformer')
const { getComposicaoComite } = use("App/Commons/Arh");
const { OrdemServConsts } = use('Constants')
const { TIPO_VINCULO } = OrdemServConsts;

const _ = require('lodash');
 
class SetParticipanteEdicaoTransformer extends BumblebeeTransformer {

  async transform (base) {
    let transformed = {
      id_tipo_vinculo: base.tipoVinculo,
      tipo_participacao: _.capitalize(base.tipoParticipante),
      prefixo: base.prefixo,
      matricula: base.matricula,
      cargo_comissao: base.cargoComissao,
      codigo_comite: base.codigoComite || 0,
      nome_comite: base.nomeComite || "",
      quorum_minimo: 0
    }

    //obtem o quorum minimo no caso de comite e que nao tenha ainda sido salvo.
    if (transformed.id_tipo_vinculo === TIPO_VINCULO.COMITE && base.quorumMinimo === 0) {
      let membrosComite = await getComposicaoComite(transformed.prefixo, transformed.codigo_comite);

      if (membrosComite && membrosComite.length) {
        //usa regra geral para o quorum - se tiver mais de 03 membros o quorum eh 03, se for menos
        //o quorum sera o total de membros. Se conseguir a base da DIREO esta regra sera alterada.
        let quorumMinimo = membrosComite.length > 3 ? 3 : membrosComite.length;
        transformed.quorum_minimo = quorumMinimo;
      }
    }

    if (_.isNumber(base.id)) {
      transformed.id = base.id;
    } else {
      transformed.ativo = 1;
      transformed.resolvido = 0;
    }

    return transformed;
  }
}

module.exports = SetParticipanteEdicaoTransformer