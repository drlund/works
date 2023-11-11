"use strict";

const EnvolvidoEntity = require("../entities/Envolvido");
const { AbstractUserCase } = require("../../AbstractUserCase");
const { mtnConsts } = use("Constants");
const { tiposAnexo, acoes, medidas } = mtnConsts;
const moment = require("moment");
class UcSalvarParecer extends AbstractUserCase {
  envolvidoEntity = new EnvolvidoEntity();

  /**
   *
   *  Validação dos dados de input para o caso de uso
   *
   */
  async _checks({
    arquivos,
    dadosUsuario,
    idEnvolvido,
    txtParecer,
    idMedida,
    finalizar,
    nrGedip,
  }) {
    this.finalizar = finalizar;

    if (!txtParecer) {
      throw new Error("O texto do parecer é obrigatório");
    }
    this.txtParecer = txtParecer;
    if (nrGedip) {
      this.nrGedip = nrGedip;
    }

    if (arquivos) {
      this.arquivos = arquivos;
    }

    this.dadosUsuario = dadosUsuario;
    const envolvido = await this.repository.envolvido.getDadosEnvolvido(
      {
        idEnvolvido,
        loadRecursos: true,
        loadAnexos: false,
      },
      this.trx
    );

    if (!envolvido) {
      throw new Error("Envolvido inválido");
    }

    this.dadosEnvolvido = envolvido;
    this.idEnvolvido = idEnvolvido;
    const isParecerFinalizado = this.envolvidoEntity.isFinalizado(envolvido);
    if (isParecerFinalizado === true) {
      throw new Error("Parecer já registrado");
    }

    const dadosMedida = await this.repository.medida.getDadosMedida(idMedida);
    if (!dadosMedida) {
      throw new Error("Medida inválida");
    }
    this.dadosMedida = dadosMedida;
    this.deveCriarRecurso = this._checaDeveCriarRecurso({
      finalizarAnalise: finalizar,
      medidaCabeRecurso: dadosMedida.cabe_recurso,
      qtdRecursosJaCriados: this.dadosEnvolvido.recursos.length,
    });

    const podeGravarParecerAposRecurso =
      await this._checaUsuarioPodeGravarParecerAposRecurso({
        idEnvolvido,
        matriculaUsuario: this.dadosUsuario.chave,
      });

    if (!this.deveCriarRecurso && podeGravarParecerAposRecurso) {
      throw new Error(
        `O analista ${matriculaUsuario} foi o responsável por gravar o parecer antes do recurso. Outro analista deve registrar o novo parecer`
      );
    }
  }

  /**
   *
   *  Realização das ações do caso de uso
   *
   */

  async _action() {
    let acaoExecutada = null;

    if (this.deveCriarRecurso) {
      const novoRecurso = await this._criarRecurso();
      await this._limparDadosRascunhoParecer();
      await this.repository.anexo.salvarAnexos(
        {
          arquivos: this.arquivos,
          tipoAnexo: tiposAnexo.PARECER_RECURSO,
          idVinculo: novoRecurso.id,
          dadosUsuario: this.dadosUsuario,
        },
        this.trx
      );

      await this._moverAnexosParaRecursos({ idRecurso: novoRecurso.id });
      acaoExecutada = acoes.SALVAR_PARECER_RECURSO;
    } else {
      await this.repository.anexo.salvarAnexos(
        {
          arquivos: this.arquivos,
          tipoAnexo: tiposAnexo.PARECER,
          idVinculo: this.idEnvolvido,
          dadosUsuario: this.dadosUsuario,
        },
        this.trx
      );
      await this._atualizarDadosParecerEnvolvido();

      acaoExecutada = this.finalizar ? acoes.FINALIZAR_ANALISE : acoes.PARECER;
    }

    const notificacaoParecer = await this.functions.executarAcao(
      acaoExecutada,
      this.dadosUsuario,
      this.idEnvolvido,
      this.trx
    );

    return notificacaoParecer;
  }

  /**
   *
   * ------ Métodos auxiliares para o caso de uso -------
   *
   */

  async _atualizarDadosParecerEnvolvido() {
    const newDadosEnvolvido = {
      id_medida: this.dadosMedida.id,
      mat_resp_analise: this.dadosUsuario.chave,
      nome_resp_analise: this.dadosUsuario.nome_usuario,
      txt_analise: this.txtParecer,
    };

    const possuiNrGedip =
      this.nrGedip &&
      (this.dadosMedida.id === medidas.GEDIP ||
        this.dadosMedida.id === medidas.GEDIP_COMUM);

    if (possuiNrGedip) {
      newDadosEnvolvido.nr_gedip = nrGedip;
    }

    if (this.finalizar) {
      newDadosEnvolvido.aprovacao_pendente = true;
    }

    await this.repository.envolvido.update(
      this.idEnvolvido,
      newDadosEnvolvido,
      this.trx
    );
  }

  async _moverAnexosParaRecursos({ idRecurso }) {
    const envolvido = await this.repository.envolvido.getDadosEnvolvido(
      {
        idEnvolvido: this.idEnvolvido,
        loadRecursos: false,
        loadAnexos: true,
      },
      this.trx
    );

    const envolvidoPossuiAnexos = envolvido.anexos.length > 0;

    if (envolvidoPossuiAnexos) {
      await this.repository.envolvido.moveToRecurso(
        {
          idEnvolvido: envolvido.id,
          idRecurso,
          anexos: envolvido.anexos,
        },
        this.trx
      );
    }
  }

  async _limparDadosRascunhoParecer() {
    const newDadosEnvolvido = {
      pendente_recurso: true,
      txt_analise: null,
      mat_resp_analise: null,
      nome_resp_analise: null,
      id_medida: null,
    };
    await this.repository.envolvido.update(
      this.idEnvolvido,
      newDadosEnvolvido,
      this.trx
    );
  }

  async _criarRecurso() {
    const dadosNovoRecurso = {
      idEnvolvido: this.dadosEnvolvido.id,
      txtParecer: this.txtParecer,
      idMedida: this.dadosMedida.id,
      matRespAnalise: this.dadosUsuario.chave,
      nomeRespAnalise: this.dadosUsuario.nome_usuario,
      prefixoRespAnalise: this.dadosUsuario.prefixo,
      nomePrefixoRespAnalise: this.dadosUsuario.dependencia,
    };

    const novoRecurso = await this.repository.recurso.create(
      dadosNovoRecurso,
      this.trx
    );
    return novoRecurso;
  }

  /**
   *
   *  No caso de uma ocorrência que já possui um recurso,
   *  o mesmo analista não pode gravar a análise posterior, ou seja,
   *  Quem fez a primeira análise que deu origem a um recurso não pode gravar
   *  o parecer após o recurso.
   *
   */

  async _checaUsuarioPodeGravarParecerAposRecurso({
    idEnvolvido,
    matriculaUsuario,
  }) {
    const recurso = await this.repository.recurso.getRecursoByEnvolvido(
      idEnvolvido
    );
    if (!recurso) {
      return false;
    }

    return recurso.mat_resp_analise === matriculaUsuario;
  }

  _checaDeveCriarRecurso({
    finalizarAnalise,
    medidaCabeRecurso,
    qtdRecursosJaCriados,
  }) {
    return (
      finalizarAnalise === true &&
      medidaCabeRecurso === true &&
      qtdRecursosJaCriados === 0
    );
  }
}

module.exports = UcSalvarParecer;
