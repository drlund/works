"use strict";
const { AbstractUserCase } = require("../../AbstractUserCase");
const moment = require("moment");
const { mtnConsts } = require("../../Constants");
const { acoes, tiposAnexo } = mtnConsts;

class UcAprovarMedidas extends AbstractUserCase {
  async _checks({ idsEnvolvidos, usuarioLogado, deveRegistrarAprovacao }) {
    if (!idsEnvolvidos || !Array.isArray(idsEnvolvidos) || idsEnvolvidos.length === 0) {
      throw new Error(
        "É obrigatório informar a lista de envolvidos cujas medidas devem ser aprovadas."
      );
    }

    const isTodosEnvolvidosPendentesAprovacao =
      await this._checaTodosEnvolvidosPendentesAprovacao(idsEnvolvidos);

    if (!isTodosEnvolvidosPendentesAprovacao) {
      throw new Error(
        "Um ou mais dos pareceres recebidos não estão pendentes de aprovação."
      );
    }

    this.idsEnvolvidos = idsEnvolvidos;
    this.usuarioLogado = usuarioLogado;
    this.deveRegistrarAprovacao = deveRegistrarAprovacao;
  }

  async _action() {
    const notificacoes = [];

    for (const idEnvolvido of this.idsEnvolvidos) {
      const dadosEnvolvido = await this.repository.envolvido.getDadosEnvolvido(
        {
          idEnvolvido,
          loadRecursos: true,
          loadAnexos: false,
        },
        this.trx
      );

      if (this.deveRegistrarAprovacao === true) {
        await this._registrarAprovacao(idEnvolvido);
      }

      const dadosMedida = await this.repository.medida.getDadosMedida(
        dadosEnvolvido.id_medida
      );

      const deveCriarRecurso = this._checaDeveCriarRecurso({
        medidaCabeRecurso: dadosMedida.cabe_recurso,
        qtdRecursosJaCriados: dadosEnvolvido.recursos.length,
      });

      let acaoExecutada = null;
      if (deveCriarRecurso) {
        const novoRecurso = await this._criarRecurso({
          dadosEnvolvido,
          dadosMedida,
        });
        await this._limparDadosRascunhoParecer(idEnvolvido);

        await this.repository.anexo.salvarAnexos(
          {
            arquivos: dadosEnvolvido.anexos,
            tipoAnexo: tiposAnexo.PARECER_RECURSO,
            idVinculo: novoRecurso.id,
            dadosUsuario: this.usuarioLogado,
          },
          this.trx
        );

        await this.repository.envolvido.update(
          idEnvolvido,
          { aprovacao_pendente: false },
          this.trx
        );

        await this._moverAnexosParaRecursos({
          idRecurso: novoRecurso.id,
          idEnvolvido,
        });
        acaoExecutada = acoes.SALVAR_PARECER_RECURSO;
      } else {
        await this.repository.anexo.salvarAnexos(
          {
            arquivos: dadosEnvolvido.anexos,
            tipoAnexo: tiposAnexo.PARECER,
            idVinculo: this.idEnvolvido,
            dadosUsuario: this.dadosUsuario,
          },
          this.trx
        );
        await this._atualizarDadosParecerEnvolvido(idEnvolvido);

        acaoExecutada = acoes.FINALIZAR_ANALISE;
      }

      const notificacaoParecer = await this.functions.executarAcao(
        acaoExecutada,
        this.usuarioLogado,
        idEnvolvido,
        this.trx
      );

      notificacoes.push(notificacaoParecer);
    }
    return notificacoes;
  }

  async _registrarAprovacao(idEnvolvido) {
    const dadosEnvolvido = await this.repository.envolvido.getDadosEnvolvido({
      idEnvolvido,
    });
    const dadosAprovacao = {
      analista_matricula: dadosEnvolvido.mat_resp_analise,
      analista_nome: dadosEnvolvido.nome_resp_analise,
      analise_em: moment().format("YYYY-MM-DD HH:mm"),
      id_medida_proposta: dadosEnvolvido.id_medida,
      aprovador_matricula: this.usuarioLogado.chave,
      aprovador_nome: this.usuarioLogado.nome_usuario,
      id_envolvido: idEnvolvido,
      id_medida_aprovada: dadosEnvolvido.id_medida,
      parecer_proposto: dadosEnvolvido.txt_analise,
      parecer_aprovado: dadosEnvolvido.txt_analise,
      alterado: false,
    };

    await this.repository.envolvido.salvarAprovacaoMedida(
      dadosAprovacao,
      this.trx
    );
  }

  /**
   * Verifica se todos os pareceres estão pendentes de aprovação
   *
   */

  async _checaTodosEnvolvidosPendentesAprovacao(idsEnvolvidos) {
    const envolvidosPendentesAprovacao =
      await this.repository.envolvido.getPareceresPendentesAprovacao(
        idsEnvolvidos
      );

    // A quantidade de pendentes deve ser a mesma daqueles recebidos para aprovar
    return envolvidosPendentesAprovacao.length === idsEnvolvidos.length;
  }

  async _moverAnexosParaRecursos({ idRecurso, idEnvolvido }) {
    const envolvido = await this.repository.envolvido.getDadosEnvolvido(
      {
        idEnvolvido: idEnvolvido,
        loadRecursos: false,
        loadAnexos: true,
      },
      this.trx
    );

    const envolvidoPossuiAnexos = envolvido.anexos.length > 0;

    if (envolvidoPossuiAnexos) {
      await this.repository.envolvido.moveAnexosToRecurso(
        {
          idEnvolvido: envolvido.id,
          idRecurso,
          anexos: envolvido.anexos,
        },
        this.trx
      );
    }
  }

  async _limparDadosRascunhoParecer(idEnvolvido) {
    const newDadosEnvolvido = {
      pendente_recurso: true,
      txt_analise: null,
      mat_resp_analise: null,
      nome_resp_analise: null,
      id_medida: null,
    };
    await this.repository.envolvido.update(
      idEnvolvido,
      newDadosEnvolvido,
      this.trx
    );
  }

  async _criarRecurso({ dadosEnvolvido, dadosMedida }) {
    const dadosNovoRecurso = {
      idEnvolvido: dadosEnvolvido.id,
      txtParecer: dadosEnvolvido.txt_analise,
      idMedida: dadosMedida.id,
      matRespAnalise: this.usuarioLogado.chave,
      nomeRespAnalise: this.usuarioLogado.nome_usuario,
      prefixoRespAnalise: this.usuarioLogado.prefixo,
      nomePrefixoRespAnalise: this.usuarioLogado.dependencia,
    };

    const novoRecurso = await this.repository.recurso.create(
      dadosNovoRecurso,
      this.trx
    );
    return novoRecurso;
  }

  async _atualizarDadosParecerEnvolvido(idEnvolvido) {
    const agora = moment().format("YYYY-MM-DD HH:mm:ss");
    const newDadosEnvolvido = {
      respondido_em: agora,
      aprovacao_pendente: false,
    };

    await this.repository.envolvido.update(
      idEnvolvido,
      newDadosEnvolvido,
      this.trx
    );
  }

  _checaDeveCriarRecurso({ medidaCabeRecurso, qtdRecursosJaCriados }) {
    return medidaCabeRecurso === true && qtdRecursosJaCriados === 0;
  }
}

module.exports = UcAprovarMedidas;
