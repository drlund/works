const _ = require('lodash');

const { AbstractUserCase } = require("../../AbstractUserCase");

const {
  NIVEL_GER,
  GG_LOJABB,
  OPCOES_BASICAS,
  ITENS_OPTS_BASICAS
} = require('../Constants');

class UcCarregarOptsBasicos extends AbstractUserCase {
  _checks({ funcao, dotacao }) {
    if (!funcao) {
      throw new Error('Função não informada!');
    }
    if (!dotacao) {
      throw new Error('Dotação não informada!');
    }
  }

  async _action({ funcao, dotacao }) {
    const { refOrg, opcoes } = await this.repository.optsBasicasRepository.getOptsBasicas({ funcao });

    const filteredOptions = opcoes.map(elem => {
      elem.tipo_comissao = _.isNil(elem.tipo_comissao) ? [] : JSON.parse(elem.tipo_comissao);
      elem.cods_ausencia = _.isNil(elem.cods_ausencia) ? [] : JSON.parse(elem.cods_ausencia);
      elem.cods_comissao = _.isNil(elem.cods_comissao) ? [] : JSON.parse(elem.cods_comissao);
      return elem;
    }).filter((elem) => {
      return elem.cods_comissao.includes(parseInt(funcao, 10))
        || elem.tipo_comissao.includes(refOrg.ref_org);
    });

    let postFilteredOptions = [];

    if (refOrg.ref_org === NIVEL_GER.G1UN || (refOrg.ref_org === NIVEL_GER.G2UT && refOrg.flag_administrador)) {
      const vacancia = dotacao.dotacao > dotacao.existencia;
      postFilteredOptions = filteredOptions.filter(elem => {
        switch (elem.id) {
          case OPCOES_BASICAS.VACPOSS06:
            return dotacao.dotacao > dotacao.existencia
          case OPCOES_BASICAS.VAC06G2UT:
            return dotacao.dotacao > dotacao.existencia
          case OPCOES_BASICAS.LOBB1G1UN:
            return refOrg.cod_funcao === GG_LOJABB && refOrg.ref_org === NIVEL_GER.G1UN && dotacao.terGUN === 0;
          default:
            return !vacancia;
        }
      }).map(elem => {
        elem.tipo_comissao = _.intersection(elem.tipo_comissao, [refOrg.ref_org]);
        elem.cods_comissao = _.intersection(elem.cods_comissao, [funcao]);
        return elem;
      })
    } else {
      postFilteredOptions = filteredOptions.filter(elem => {
        switch (elem.id) {
          case OPCOES_BASICAS.LICSAUD07:
            return dotacao.qtdeFuncis <= ITENS_OPTS_BASICAS.QTDE_MAX_FUNCI_G3UN_AUS_LIC_SAU_60;
          case OPCOES_BASICAS.PREF1G3UN:
            return dotacao.terGUN === ITENS_OPTS_BASICAS.QTDE_MAX_FUNCI_G3UN_DESIGNACAO;
          case OPCOES_BASICAS.LICSAUD60:
            return dotacao.qtdeFuncis > ITENS_OPTS_BASICAS.QTDE_MAX_FUNCI_G3UN_AUS_LIC_SAU_60
              && dotacao.terGUN > ITENS_OPTS_BASICAS.QTDE_MAX_FUNCI_G3UN_DESIGNACAO;
          case OPCOES_BASICAS.APURDISCP:
            return dotacao.terGUN > ITENS_OPTS_BASICAS.QTDE_MAX_FUNCI_G3UN_DESIGNACAO;
          case OPCOES_BASICAS.VAC06G3UN:
            return dotacao.dotacao > dotacao.existencia;
          default:
            return true;
        }
      }).map((elem) => {
        elem.tipo_comissao = _.intersection(elem.tipo_comissao, [refOrg.ref_org]);
        elem.cods_comissao = _.intersection(elem.cods_comissao, [parseInt(funcao, 10)]);
        return elem;
      })
    }

    return postFilteredOptions;
  }
}


module.exports = UcCarregarOptsBasicos;
