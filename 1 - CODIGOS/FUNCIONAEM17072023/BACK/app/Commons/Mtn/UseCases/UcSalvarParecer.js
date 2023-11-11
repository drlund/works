"use strict";

const EnvolvidoEntity = require("../entities/Envolvido");
const { AbstractUserCase } = require("../../AbstractUserCase");
const { mtnConsts } = require("../../../Commons/Constants");
const moment = require("moment");

const { tiposAnexo, acoes, medidas } = mtnConsts;
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
    finalizarSemConsultarDedip,
    nrGedip,
  }) {
    this.finalizar = finalizar;
    this.finalizarSemConsultarDedip = finalizarSemConsultarDedip;

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

    if (finalizar && !idMedida) {
      throw new Error("Ao finalizar é obrigatório informar uma medida");
    }

    if (idMedida) {
      const dadosMedida = await this.repository.medida.getDadosMedida(idMedida);
      if (!dadosMedida) {
        throw new Error("Medida inválida");
      }
      this.dadosMedida = dadosMedida;
    }

    if (
      this.finalizar &&
      (idMedida == medidas.ALERTA_ETICO_NEGOCIAL ||
        idMedida == medidas.TERMO_DE_CIENCIA)
    ) {
      const consultaDedip =
        await this.repository.medida.consultaAplicacaoMedidaDedip(
          dadosUsuario,
          envolvido,
          idMedida
        );

      const CONSULTA_API_SUCESSO = 200;
      const CHAMADA_API_DEDIP_ERRO_AUTENTICACAO = 403;
      const ERRO_INTERNO_DEDIP = 502 | 500 | 400;

      //CASOS DE ERRO 500(servidor dedip caiu)/502(aplicação dedip caiu)/400(erro nos parametros)/403(erro no BBSSOToken) da api
      if (consultaDedip.response?.status) {
        //Salva o log de erro da api
        await this.repository.medida.salvarLogErro(
          dadosUsuario,
          envolvido,
          idMedida,
          consultaDedip.response.data
        );

        //Case developer com erro no token
        if (
          dadosUsuario.bb_token === "localhost" &&
          consultaDedip.response?.status === CHAMADA_API_DEDIP_ERRO_AUTENTICACAO
        ) {
          return this._throwExpectedError(
            `DEVELOPER: Necessario inclusão de um BBSSOToken valido em consultaApiDedip.js  Linha:~16 let mockBBSSOToken = "";.`
          );
        }

        //Case funci com token vencido|invalido
        if (
          consultaDedip.response?.status === CHAMADA_API_DEDIP_ERRO_AUTENTICACAO
        )
          return this._throwExpectedError(
            `Problemas na autenticação do usuario, tente refazer o login na intranet, caso o problema continue, contate o admnistrador do sistema.`
          );

        //Se o frontend não autorizar terminar sem a consulta vai retornar o erro
        if (
          finalizarSemConsultarDedip === false &&
          consultaDedip.response?.status === ERRO_INTERNO_DEDIP
        ) {
          return this._throwExpectedError(
            `Api da Dedip para consulta de agravamento de medida está inacessível.`
          );
        }
      }

      //CASO NECESSARIO AGRAVAMENTO
      if (
        consultaDedip.status === CONSULTA_API_SUCESSO &&
        consultaDedip.data[0]?.conducao !== "Condução em conformidade"
      ) {
        this._throwExpectedError(
          `Agravamento requerido:${consultaDedip.data[0].conducao}`
        );
      }
    } else {
      //Casos em que não consulta a api: finalizarSemConsultarDedip = null
      this.finalizarSemConsultarDedip = null;
    }
  }

  /**
   *
   *  Realização das ações do caso de uso
   *
   */

  async _action() {
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
  }

  /**
   *
   * ------ Métodos auxiliares para o caso de uso -------
   *
   */

  async _atualizarDadosParecerEnvolvido() {
    const newDadosEnvolvido = {
      id_medida: this.dadosMedida?.id ? this.dadosMedida?.id : null,
      mat_resp_analise: this.dadosUsuario.chave,
      nome_resp_analise: this.dadosUsuario.nome_usuario,
      txt_analise: this.txtParecer,
      enviado_aprovacao_em:
        this.finalizar === true ? moment().format("YYYY-MM-DD HH:mm") : null,
    };

    const possuiNrGedip =
      this.nrGedip &&
      (this.dadosMedida.id === medidas.GEDIP ||
        this.dadosMedida.id === medidas.GEDIP_COMUM);

    if (possuiNrGedip) {
      newDadosEnvolvido.nr_gedip = this.nrGedip;
    }

    if (this.finalizar) {
      newDadosEnvolvido.aprovacao_pendente = true;
    }

    if (this.finalizarSemConsultarDedip === true) {
      newDadosEnvolvido.falha_consulta_dedip = true;
    }
    if (this.finalizarSemConsultarDedip === false) {
      newDadosEnvolvido.falha_consulta_dedip = false;
    }

    await this.repository.envolvido.update(
      this.idEnvolvido,
      newDadosEnvolvido,
      this.trx
    );

    if (this.finalizar === true) {
      await this.functions.insereTimeline({
        idEnvolvido: this.idEnvolvido,
        idAcao: acoes.ENVIOU_PARA_APROVACAO,
        dadosRespAcao: this.dadosUsuario,
        tipoNotificacao: null,
        trx: this.trx,
      });
    }
  }
}

module.exports = UcSalvarParecer;
