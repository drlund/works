"use strict";

const {
  AbstractUserCase,
  ExpectedAbstractError,
} = require("../../AbstractUserCase");
const {
  STATUS,
  LOCALIZACOES,
  ETAPAS,
  SITUACOES,
  PARECER,
  ACOES,
  PARECER_STRING,
} = require("../Constants");
const Manifestacao = require("../Entidades/Manifestacao");

class UcRegistrarDeferimento extends AbstractUserCase {
  async _checks(deferir) {
    const podeDeferirNestaSolicitacao = await this.functions.hasPermission({
      nomeFerramenta: "Flex Critérios",
      dadosUsuario: deferir.usuario,
      permissoesRequeridas: ["DEFERIDOR", "ROOT"],
    });
    /*     if (!podeDeferirNestaSolicitacao) {
      throw new Error(
        "Você não tem permissão para realizar o deferimento da solicitação informada"
      );
    } */
  }

  async _action(deferir) {
    const {
      solicitacoesRepository,
      manifestacoesRepository,
      escaloesRepository,
    } = this.repository;

    const dadosAnalise = Manifestacao.transformNovoDeferimento(deferir);

    // 1)) Esta matrícula Já registrou deferimento nesta solicitacao ???
    const deferimentoJaRegistrado =
      await manifestacoesRepository.getDeferimentoByMatricula(
        deferir.idSolicitacao,
        deferir.usuario.chave,
        ACOES.DEFERIMENTO,
        SITUACOES.REGISTRADA,
        this.trx
      );
    //Lança erro

    /*    const complementoPendente =
      await manifestacoesRepository.getComplementoPendenteBySolicitacaoEPrefixo(
        deferir.idSolicitacao,
        deferir.usuario.prefixo,
        this.trx
      ); */

    const deferimentoComplementarPendente =
      await manifestacoesRepository.deferimentoComplementarPendente(
        deferir.idSolicitacao,
        deferir.usuario.prefixo,
        this.trx
      );

    if (!deferimentoComplementarPendente && deferimentoJaRegistrado) {
      throw new ExpectedAbstractError(
        "Deferimento já registrado pra esta solicitação e este deferidor!",
        403
      );
    }

    // 2)) Deferimento predefinido Cases = coordenador e matricula indicada
    const deferimentoPendenteByMatricula =
      await manifestacoesRepository.getDeferimentoByMatricula(
        deferir.idSolicitacao,
        deferir.usuario.chave,
        ACOES.DEFERIMENTO,
        SITUACOES.PENDENTE,
        this.trx
      );
    //Gravo caso tenha os slots com a matricula definida
    if (deferimentoPendenteByMatricula) {
      if (deferir.parecer == PARECER.DESFAVORAVEL) {
        dadosAnalise.id_situacao = SITUACOES.NAO_VIGENTE;
        await manifestacoesRepository.atualizaManifestacaoDeferidor(
          deferimentoPendenteByMatricula,
          dadosAnalise,
          this.trx
        );
        await solicitacoesRepository.cancelarSolicitacao(
          deferir.idSolicitacao,
          this.trx
        );
        return dadosAnalise.id_solicitacao;
      }

      await manifestacoesRepository.atualizaManifestacaoDeferidor(
        deferimentoPendenteByMatricula,
        dadosAnalise,
        this.trx
      );

      return deferimentoPendenteByMatricula.id;
    }

    // 3)) Deferimento pendente com função denifida(caso admnistrador)
    const deferimentoPendenteByFuncao =
      await manifestacoesRepository.getDeferimentoByFuncaoEPrefixo(
        deferir.idSolicitacao,
        deferir.usuario.cod_funcao,
        deferir.usuario.prefixo,
        ACOES.DEFERIMENTO,
        SITUACOES.PENDENTE,
        this.trx
      );
    //Gravo caso tenha os slots com a matricula definida
    if (deferimentoPendenteByFuncao) {
      if (deferir.parecer == PARECER.DESFAVORAVEL) {
        dadosAnalise.id_situacao = SITUACOES.NAO_VIGENTE;
        await manifestacoesRepository.atualizaManifestacaoDeferidor(
          deferimentoPendenteByFuncao,
          dadosAnalise,
          this.trx
        );
        await solicitacoesRepository.cancelarSolicitacao(
          deferir.idSolicitacao,
          this.trx
        );
        return dadosAnalise.id_solicitacao;
      }

      dadosAnalise.parecer = PARECER_STRING.FAVORAVEL;

      await manifestacoesRepository.atualizaManifestacaoDeferidor(
        deferimentoPendenteByFuncao,
        dadosAnalise,
        this.trx
      );

      return deferimentoPendenteByFuncao.id;
    }

    // 3)) é membro comite do prefixo dele?
    const membrosDoComite = await escaloesRepository.getDadosEscalao(
      deferir.usuario.prefixo
    );
    const funciMembroComite = membrosDoComite.filter(
      (membro) => membro.MATRICULA_MEMBRO == deferir.usuario.matricula
    );

    if (!funciMembroComite.length) {
      throw new ExpectedAbstractError(
        "Usuario não faz parte de nenhum comite desta solicitação.!",
        403
      );
    }

    if (funciMembroComite.length) {
      const primeiroSlotDeferimentoPendente =
        await manifestacoesRepository.getFirstDeferimentoPendenteSemMatriculaEFuncaoVinculada(
          deferir.idSolicitacao,
          deferir.usuario.prefixo,
          this.trx
        );

      if (!primeiroSlotDeferimentoPendente) {
        throw new ExpectedAbstractError(
          "Todos os deferimentos desta solicitação já foram registrados!",
          403
        );
      }

      if (deferir.parecer == PARECER.DESFAVORAVEL) {
        dadosAnalise.id_situacao = SITUACOES.NAO_VIGENTE;
        await manifestacoesRepository.atualizaManifestacaoDeferidor(
          primeiroSlotDeferimentoPendente,
          dadosAnalise,
          this.trx
        );
        await solicitacoesRepository.cancelarSolicitacao(
          deferir.idSolicitacao,
          this.trx
        );
        return dadosAnalise.id_solicitacao;
      }

      await manifestacoesRepository.atualizaManifestacaoDeferidor(
        primeiroSlotDeferimentoPendente,
        dadosAnalise,
        this.trx
      );
    }
  }
}

module.exports = UcRegistrarDeferimento;
