const BumblebeeTransformer = use('Bumblebee/Transformer')
const { getOneDependencia } = use("App/Commons/Arh");

class GetParticipanteEdicaoTransformer extends BumblebeeTransformer {

  async transform (model) {
    let transformed = {
      id: model.id,
      tipoVinculo: model.id_tipo_vinculo,
      nomeTipoVinculo: model.tipoVinculo.tipo_vinculo,
      tipoParticipante: model.tipo_participacao.toLowerCase(),
      prefixo: model.prefixo,
      matricula: model.matricula,
      cargoComissao: model.cargo_comissao,
      codigoComite: model.codigo_comite || 0,
      nomeComite: model.nome_comite || "",
      quorumMinimo: model.quorum_minimo
    }

    if (model.participanteExpandido) {
      transformed.participanteExpandido = model.participanteExpandido.map( elem => { 
        return {
          id: elem.id,
          idPartEdicao: elem.id_part_edicao,
          matricula: elem.matricula, 
          nomeFunci: elem.dadosFunci ? elem.dadosFunci.nome : elem.nome,
          prefixo: elem.prefixo,
          codTipoVotacao: elem.cod_tipo_votacao,
          assinou: elem.assinou === 1 ? true : false,          
          dataAssinatura: elem.data_assinatura ? elem.data_assinatura : "Não Assinou",
          naoPassivelAssinatura: elem.nao_passivel_assinatura === 1 ? true : false
        }
      });
    }

    let nomeFunci = "";
    let nomeDependencia = "DEPENDÊNCIA NÃO LOCALIZADA.";

    if (model.id_tipo_vinculo === 1) {
      if (model.dadosFunciVinculado) {
        nomeFunci = model.dadosFunciVinculado.nome;
      } else {
        let nomeTmp = "FUNCI NÃO LOCALIZADO";
        //funci nao esta na base DIPES, procura o nome na lista de participantes expandidos
        if (model.participanteExpandido) {
          for (let participante of model.participanteExpandido) {
            if (participante.matricula === model.matricula) {
              nomeTmp = participante.nome;
              break;
            }
          }
        }

        nomeFunci = nomeTmp;
      }
    }

    transformed.nomeFunci = nomeFunci;

    //obtendo o nome do prefixo
    if (model.prefixo) {
      try {
        let dadosPrefixo = await getOneDependencia(model.prefixo);
        nomeDependencia = dadosPrefixo.nome;  
      } catch (err) { /* NOTHING */ }
    }

    transformed.nomeDependencia = nomeDependencia;

    return transformed;
  }

  async transformWithResolucaoVinculo (model) {
    let base = await this.transform(model);

    return {
      ...base,
      resolvido: model.resolvido == 1 ? 'Sim' : 'Não'
    }
  }
}

module.exports = GetParticipanteEdicaoTransformer