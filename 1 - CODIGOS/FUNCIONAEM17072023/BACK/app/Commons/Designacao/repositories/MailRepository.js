"use strict";

const moment = require("moment");
const Env = use("Env");
const _ = require("lodash");
const Solicitacao = require("../../../Models/Mysql/Designacao/Solicitacao");
const { sendMail } = use("SendMail");

const exception = use("App/Exceptions/Handler");
const { replaceVariable } = use("App/Commons/StringUtils");

const MailLog = use("App/Models/Mysql/Designacao/MailLog");
const Documento = use("App/Models/Mysql/Designacao/Documento");

const { getOneDependencia } = use("App/Commons/Arh");

const getSolicitacao = use("App/Commons/Designacao/getSolicitacao");
const getPrimGestor = use("App/Commons/Designacao/getPrimGestor");
const getPrefixoMadrinha = use("App/Commons/Designacao/getPrefixoMadrinha");
const getMainEmail = use("App/Commons/Designacao/getMainEmail");

const FRONTEND_URL = Env.get("FRONTEND_URL");


/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */

const Designacao = use("App/Models/Mysql/Designacao");

const {
  ATIVO,
  EMAIL_SUPER_PESSOAS,
  PREFIXO_SUPERADM,
  TIPOS_EMAIL,
  MENSAGEM,
  DATABASE_DATETIME_INPUT,
} = use('App/Commons/Designacao/Constants');

class MailRepository {
  constructor(dados, trx = null) {
    this.envioEmail = null;
    this.dados = dados;
    this.dadosEmail = null;
    this.trx = trx;
  }

  async post(tipoEmail, solicitacao, analise, documento, trx = null) {
    const dados = await Solicitacao
      .query()
      .with('matricula_orig')
      .with('matricula_dest')
      .with('tipoDemanda')
      .with('prefixo_orig', (builder) => {
        builder
          .with('dadosDiretoria', (build) => {
            build.sb00()
          })
          .with('dadosSuper', (build) => {
            build.sb00()
          })
          .with('dadosGerev', (build) => {
            build.sb00()
          })
          .sb00()
      })
      .with('prefixo_dest', (builder) => {
        builder
          .with('dadosDiretoria', (build) => {
            build.sb00()
          })
          .with('dadosSuper', (build) => {
            build.sb00()
          })
          .with('dadosGerev', (build) => {
            build.sb00()
          })
          .sb00()
      })
      .with('funcaoDestino')
      .with('matricula_solicit')
      .with('status')
      .transacting(trx)
      .where('id', solicitacao.id)
      .first();

    const dadosSolicitacao = dados.toJSON();
    dadosSolicitacao.analise = analise.toJSON();

    if (
      dadosSolicitacao.analise.gg_ou_super ||
      dadosSolicitacao.analise.deacordo_super_destino ||
      dadosSolicitacao.limitrofes
    ) {
      dadosSolicitacao.situacaoSuperior = !!dadosSolicitacao.analise
        .parecer_super_destino
        ? "SIM"
        : "NÃO";
    } else if (dadosSolicitacao.super) {
      dadosSolicitacao.situacaoSuperior = !!dadosSolicitacao.analise.parecer_diretoria
        ? "SIM"
        : "NÃO";
    } else {
      dadosSolicitacao.situacaoSuperior = "Não Obrigatório";
    }

    const [
      emailPrefixoDest,
      emailGerevPrefixoDest,
      emailSuperPrefixoDest,
      emailDiretoriaPrefixoDest,
      emailPrefixoOrig,
      emailGerevPrefixoOrig,
      emailSuperPrefixoOrig,
      emailDiretoriaPrefixoOrig,
    ] = await Promise.all([
      dadosSolicitacao.prefixo_dest.prefixo
        ? getMainEmail(dadosSolicitacao.prefixo_dest.uor_dependencia)
        : null,

      dadosSolicitacao.prefixo_dest.dadosGerev
        ? getMainEmail(dadosSolicitacao.prefixo_dest.dadosGerev.uor_dependencia)
        : null,

      dadosSolicitacao.prefixo_dest.dadosSuper
        ? getMainEmail(dadosSolicitacao.prefixo_dest.dadosSuper.uor_dependencia)
        : null,

      dadosSolicitacao.prefixo_dest.dadosDiretoria
        ? getMainEmail(dadosSolicitacao.prefixo_dest.dadosDiretoria.uor_dependencia)
        : null,

      dadosSolicitacao.prefixo_orig.prefixo
        ? getMainEmail(dadosSolicitacao.prefixo_orig.uor_dependencia)
        : null,

      dadosSolicitacao.prefixo_orig.dadosGerev
        ? getMainEmail(dadosSolicitacao.prefixo_orig.dadosGerev.uor_dependencia)
        : null,

      dadosSolicitacao.prefixo_orig.dadosSuper
        ? getMainEmail(dadosSolicitacao.prefixo_orig.dadosSuper.uor_dependencia)
        : null,

      dadosSolicitacao.prefixo_orig.dadosDiretoria
        ? getMainEmail(dadosSolicitacao.prefixo_orig.dadosDiretoria.uor_dependencia)
        : null,
    ]);

    dadosSolicitacao.prefixo_dest.email = emailPrefixoDest;
    dadosSolicitacao.prefixo_dest.dadosGerev && (dadosSolicitacao.prefixo_dest.dadosGerev.email = emailGerevPrefixoDest);
    dadosSolicitacao.prefixo_dest.dadosSuper && (dadosSolicitacao.prefixo_dest.dadosSuper.email = emailSuperPrefixoDest);
    dadosSolicitacao.prefixo_dest.dadosDiretoria && (dadosSolicitacao.prefixo_dest.dadosDiretoria.email = emailDiretoriaPrefixoDest);
    dadosSolicitacao.prefixo_orig.email = emailPrefixoOrig;
    dadosSolicitacao.prefixo_orig.dadosGerev && (dadosSolicitacao.prefixo_orig.dadosGerev.email = emailGerevPrefixoOrig);
    dadosSolicitacao.prefixo_orig.dadosSuper && (dadosSolicitacao.prefixo_orig.dadosSuper.email = emailSuperPrefixoOrig);
    dadosSolicitacao.prefixo_orig.dadosDiretoria && (dadosSolicitacao.prefixo_orig.dadosDiretoria.email = emailDiretoriaPrefixoOrig);

    if (tipoEmail === TIPOS_EMAIL.ENCAMINHADA && dadosSolicitacao.encaminhado_para === PREFIXO_SUPERADM) {
      envioEmail = ATIVO;
    } else {
      const emailTexto = await this.getEmailCorreto(tipoEmail);
      const [assunto, corpo, destination] = await emailTexto({
        documento,
        solicitacao: dadosSolicitacao,
      });

      const dadosEmail = {
        from: EMAIL_SUPER_PESSOAS,
        to: destination.toString(),
        subject: assunto,
        body: corpo,
      };

      this.envioEmail = await sendMail(dadosEmail, trx);

      await this.logMail(dadosEmail, dadosSolicitacao, this.envioEmail, tipoEmail, trx);

      return this;
    }
  }

  async logMail(
    dadosEmail,
    dadosSolicitacao,
    emailEnviado,
    tipoEmail,
    trx = null
  ) {
    let mail = new MailLog();

    mail.tipo_email = tipoEmail;
    mail.id_solicitacao = dadosSolicitacao.id;
    mail.campo_de = dadosEmail.from;
    mail.campo_para = dadosEmail.to;
    mail.dt_envio = moment().format(DATABASE_DATETIME_INPUT);
    mail.situacao = emailEnviado ? MENSAGEM.SUCESSO : MENSAGEM.FALHA

    await mail.save(trx);

    return this;
  }

  async getEmailCorreto(id) {
    const listaCorpoEmails = {
      1: this._emailTextoInicio,
      2: this._emailTextoEncaminhado,
      3: this._emailTextoConclusao,
      4: this._emailTextoCancelamento,
    };

    return listaCorpoEmails[id];
  }

  async _emailTextoInicio(dados) {
    // ! Método que envia email para os 'Acordantes'
    try {
      const texto =
        `#interna<p>` +
        `Senhor Administrador,<p>` +
        `Informamos que foi aberto o protocolo {1}, solicitando a Movimentação Transitória do funcionário {2}, ` +
        `no regime de {3}, apresentando as seguintes características:<p>` +
        `<ul>` +
        `<li>Prefixo de Origem: {4};</li>` +
        `<li>Prefixo de Destino: {5};</li>` +
        `<li>Função de Destino: {6};</li>` +
        `<li>Super Regional do Prefixo de Destino: {7};</li>` +
        `<li>Superintendência do Prefixo de Destino: {8};</li>` +
        `<li>Diretoria do Prefixo de Destino: {9};</li>`;

      const texto2 =
        `<li>Funcionário Solicitante: {1};</li>` +
        `<li>Período de Movimentação: {2};</li>` +
        `<li>Necessidade de Assinatura de De Acordo da Instância Superior do Prefixo de Destino (GEREV, Super Estadual ou Diretoria): {3}.</li>` +
        `</ul><p>` +
        `Para registrar o acórdão para esta movimentação, por favor siga o link <a href='{4}designacao/' noopener noref>{4}designacao/</a>, na aba 'Pendências De Acordo'.<p>` +
        `Informamos que todas as interações deverão ser feitas pelo link acima. Não haverá tratativas por e-mail.<p>` +
        `Atenciosamente,<p>` +
        `<strong>Gerência de Pessoas</strong><br>` +
        `<strong>9009 Superintendência Administrativa</strong>`;

      let gestor;
      const subsTexto = [
        dados.solicitacao.protocolo, //1
        `${dados.solicitacao.matr_orig} ${dados.solicitacao.matricula_orig.nome}`, //2
        `${dados.solicitacao.tipoDemanda.nome} (${dados.solicitacao.tipoDemanda.titulo})`, //3
        `${dados.solicitacao.pref_orig} ${dados.solicitacao.prefixo_orig.nome}`, //4
        `${dados.solicitacao.pref_dest} ${dados.solicitacao.prefixo_dest.nome}`, //5
        `${dados.solicitacao.funcao_dest || ''} ${dados.solicitacao.funcaoDestino ? dados.solicitacao.funcaoDestino.nome_comissao : ''}`, //6
        dados.solicitacao.prefixo_dest.dadosGerev
          ? `${dados.solicitacao.prefixo_dest.dadosGerev.prefixo} ${dados.solicitacao.prefixo_dest.dadosGerev.nome}`
          : "-", //7
        dados.solicitacao.prefixo_dest.dadosSuper
          ? `${dados.solicitacao.prefixo_dest.dadosSuper.prefixo} ${dados.solicitacao.prefixo_dest.dadosSuper.nome}`
          : "-", //8
        dados.solicitacao.prefixo_dest.dadosDiretoria
          ? `${dados.solicitacao.prefixo_dest.dadosDiretoria.prefixo} ${dados.solicitacao.prefixo_dest.dadosDiretoria.nome}`
          : "-", //9
      ];

      const subsTexto2 = [
        `${dados.solicitacao.matr_solicit} ${dados.solicitacao.matricula_solicit.nome}`, //1
        `${moment(dados.solicitacao.dt_ini).format("DD/MM/YYYY")} a ${moment(
          dados.solicitacao.dt_fim
        ).format("DD/MM/YYYY")}`, //2
        ["SIM", "NÃO"].includes(dados.solicitacao.situacaoSuperior)
          ? "SIM"
          : "NÃO", //3
        FRONTEND_URL, //4
      ];

      const subsSubject = [dados.solicitacao.protocolo, "Protocolo Iniciado"];
      const subject = "DESIGNAÇÃO INTERINA :: Movimentação Transitória {1}: {2}";

      const assunto = replaceVariable(subject, subsSubject);
      const corpo =
        replaceVariable(texto, subsTexto) + replaceVariable(texto2, subsTexto2);

      let destination = [];
      if (!_.isEmpty(dados.solicitacao.prefixo_dest.email) && dados.solicitacao.prefixo_dest.email.EmaildaUOR)
        destination.push(
          dados.solicitacao.prefixo_dest.email.EmaildaUOR.toLowerCase()
        );
      gestor = await getPrimGestor(dados.solicitacao.prefixo_dest.prefixo);
      !_.isEmpty(gestor) && destination.push(
        gestor.email.trim()
      );

      if (dados.solicitacao.pref_orig !== dados.solicitacao.pref_dest) {
        if (!_.isEmpty(dados.solicitacao.prefixo_orig.email) && dados.solicitacao.prefixo_orig.email.EmaildaUOR)
          destination.push(
            dados.solicitacao.prefixo_orig.email.EmaildaUOR.toLowerCase()
          );
        gestor = await getPrimGestor(dados.solicitacao.prefixo_orig.prefixo);
        !_.isEmpty(gestor) && destination.push(
          gestor.email.trim()
        );
      }

      if (
        dados.solicitacao.gg_ou_super ||
        dados.solicitacao.limitrofes ||
        dados.solicitacao.analise.deacordo_super_destino
      ) {
        if (!_.isNil(dados.solicitacao.prefixo_dest.dadosSuper)) {
          if (!_.isEmpty(dados.solicitacao.prefixo_dest.dadosSuper.email) && dados.solicitacao.prefixo_dest.dadosSuper.email.EmaildaUOR) {
            destination.push(
              dados.solicitacao.prefixo_dest.dadosSuper.email.EmaildaUOR.toLowerCase()
            );
          }
        }
        //gestor = await getPrimGestor(dados.solicitacao.prefixo_dest.dadosSuper.prefixo);
        //!_.isEmpty(gestor) && destination.push(gestor.email.trim());
        if (!_.isNil(dados.solicitacao.prefixo_dest.dadosGerev)) {
          if (!_.isEmpty(dados.solicitacao.prefixo_dest.dadosGerev.email) && dados.solicitacao.prefixo_dest.dadosGerev.email.EmaildaUOR)
            destination.push(
              dados.solicitacao.prefixo_dest.dadosGerev.email.EmaildaUOR.toLowerCase()
            );
          gestor = await getPrimGestor(dados.solicitacao.prefixo_dest.dadosGerev.prefixo, 1, 1);
          !_.isEmpty(gestor) && destination.push(gestor.email.trim());
        }
      } else if (dados.solicitacao.super) {
        dados.solicitacao.situacaoSuperior = !!dados.solicitacao.analise
          .parecer_diretoria;
        if (!_.isEmpty(dados.solicitacao.prefixo_dest.dadosDiretoria)) {
          if (!_.isEmpty(dados.solicitacao.prefixo_dest.dadosDiretoria.email) && dados.solicitacao.prefixo_dest.dadosDiretoria.email.EmaildaUOR)
            destination.push(
              dados.solicitacao.prefixo_dest.dadosDiretoria.email.EmaildaUOR.toLowerCase()
            );
        }
      }

      if (dados.solicitacao.prefixo_orig.tip_dep === 15) {
        const madrinha = await getPrefixoMadrinha(dados.solicitacao.pref_orig);
        const prefMadrinha = await getOneDependencia(madrinha.prefixo);
        const emailMadrinha = await getMainEmail(prefMadrinha.uor);
        if (!_.isEmpty(emailMadrinha) && emailMadrinha.EmaildaUOR)
          destination.push(emailMadrinha.EmaildaUOR.toLowerCase());
        gestor = await getPrimGestor(madrinha.prefixo);
        !_.isEmpty(gestor) && destination.push(gestor.email.trim());
      }

      if (dados.solicitacao.prefixo_dest.tip_dep === 15) {
        const madrinha = await getPrefixoMadrinha(dados.solicitacao.pref_dest);
        const prefMadrinha = await getOneDependencia(madrinha.prefixo);
        const emailMadrinha = await getMainEmail(prefMadrinha.uor);
        if (!_.isEmpty(emailMadrinha) && emailMadrinha.EmaildaUOR)
          destination.push(emailMadrinha.EmaildaUOR.toLowerCase());
        gestor = await getPrimGestor(madrinha.prefixo);
        !_.isEmpty(gestor) && destination.push(gestor.email.trim());
      }

      destination = [...new Set(destination)];

      return [assunto, corpo, destination];
    } catch (err) {
      throw new exception(err, 400);
    }
  }

  async _emailTextoEncaminhado(dados) {
    try {
      // ! Método que envia email para os prefixos constantes no 'encaminhado_para'
      const texto =
        `#interna<p>` +
        `Senhor Analista/Assessor,<p>` +
        `Informamos que o protocolo {1}, referente a {2}, foi encaminhado, conforme segue:<p>` +
        `<ul>` +
        `<li>Prefixo Analisador: {3} {4};</li>` +
        `<li>Mensagem/Observação:<br><div style="border:1px dotted black">{5}</div></li>` +
        `</ul><p>` +
        `Para efetuar a análise desta movimentação, por favor siga o link <a href='{7}designacao/' noopener noref>{7}designacao/</a>, na aba 'Pendências De Análise'.<br>` +
        `Ao verificar a linha que possui o presente número do protocolo, clique no botão de ações e selecione MOVIMENTAR/ATUALIZAR.<br>` +
        `Para executar a análise e transferir a demanda para outras unidades ou concluir a análise, o funcionário necessita reivindicar ` +
        `responsabilidade sobre a solicitação. Ao clicar na ação MOVIMENTAR/ATUALIZAR, o sistema verifica se o funcionário que está acessando ` +
        `é o funcionário responsável pela análise do referido protocolo. Caso o funcionário não seja o responsável, uma janela abre perguntando ` +
        `se o funcionário deseja reivindicá-la. Caso não a reivindique, o funcionário tem apenas acesso às informações atuais da demanda, podendo fornecer ` +
        `parecer ou observações sobre o processo. O funcionário poderá acompanhar as solicitações pendentes de análise de sua ` +
        `responsabilidade na aba 'Minhas Pendências'.<p>` +
        `Informamos que todas as interações deverão ser feitas pelo link acima. Não haverá tratativas por e-mail.<p>` +
        `Atenciosamente,<p>` +
        `<strong>Gerência de Pessoas</strong><br>` +
        `<strong>9009 Superintendência Administrativa</strong>`;

      let gestor;
      const subsTexto = [
        dados.solicitacao.protocolo,
        dados.solicitacao.tipoDemanda.nome,
        dados.solicitacao.encaminhado_para,
        dados.solicitacao.prefixo_encaminhado_para.mento.texto.replace(/(?:\r\n|\r|\n)/g, "<br>"),
        !!dados.documento.documento.length ? "SIM" : "NÃO",
        FRONTEND_URL,
      ];

      const subsSubject = [
        dados.solicitacao.protocolo,
        "Protocolo Encaminhado",
      ];

      const assunto = replaceVariable(this._subject(), subsSubject);
      const corpo = replaceVariable(texto, subsTexto);
      let destination = [];

      if (!_.isEmpty(dados.solicitacao.prefixo_encaminhado_para.email) && dados.solicitacao.prefixo_encaminhado_para.email.EmaildaUOR)
        destination.push(dados.solicitacao.prefixo_encaminhado_para.email.EmaildaUOR.toLowerCase());

      if (!["8559", "8929", "8592", "9270", "9220"].includes(dados.solicitacao.prefixo_encaminhado_para.prefixo)) {
        gestor = await getPrimGestor(dados.solicitacao.prefixo_encaminhado_para.prefixo);
        !_.isEmpty(gestor) && destination.push(gestor.email.trim());
      }

      if (dados.solicitacao.prefixo_encaminhado_para.tip_dep === 15) {
        const madrinha = await getPrefixoMadrinha(dados.solicitacao.prefixo_encaminhado_para.prefixo);
        const prefMadrinha = await getOneDependencia(madrinha.prefixo);
        const emailMadrinha = await getMainEmail(prefMadrinha.uor);
        if (!_.isEmpty(emailMadrinha) && emailMadrinha.EmaildaUOR)
          destination.push(emailMadrinha.EmaildaUOR.toLowerCase());

        gestor = await getPrimGestor(madrinha.prefixo);
        !_.isEmpty(gestor) && destination.push(gestor.email.trim());
      }

      destination = [...new Set(destination)];

      return [assunto, corpo, destination];
    } catch (err) {
      throw new exception(err, 400);
    }
  }

  async _emailTextoConclusao(dados) {
    // ! Método que envia email para os prefixos de solicitação informando a situação final da solicitação
    try {
      const texto =
        `#interna<p>` +
        `Senhor Administrador,<p>` +
        `Informamos que o protocolo {1} foi {2}, conforme segue:<p>` +
        `<ul>` +
        `<li>Mensagem/Observação:<br><div style="border:1px dotted black">{3}</div></li>` +
        `</ul><p>` +
        `Para verificar o histórico dessa movimentação, por favor siga o link <a href='{5}designacao/consultas'>{5}designacao/consultas</a>.<p>` +
        `Informamos que todas as interações deverão ser feitas pelo link acima. Não haverá tratativas por e-mail.<p>` +
        `Atenciosamente,<p>` +
        `<strong>Gerência de Pessoas</strong><br>` +
        `<strong>9009 Superintendência Administrativa</strong>`;

      let gestor;
      const subsTexto = [
        dados.solicitacao.protocolo,
        dados.solicitacao.status.status,
        dados.documento.texto.replace(/(?:\r\n|\r|\n)/g, "<br>"),
        !!dados.documento.documento.length ? "SIM" : "NÃO",
        FRONTEND_URL,
      ];

      const subsSubject = [dados.solicitacao.protocolo, "Protocolo Encerrado"];

      const assunto = replaceVariable(this._subject(), subsSubject);
      const corpo = replaceVariable(texto, subsTexto);

      let destination = [];

      if (!_.isEmpty(dados.solicitacao.prefixo_dest.email) && dados.solicitacao.prefixo_dest.email.EmaildaUOR) {
        destination.push(dados.solicitacao.prefixo_dest.email.EmaildaUOR.toLowerCase());
      }

      gestor = await getPrimGestor(dados.solicitacao.prefixo_dest.prefixo);
      !_.isEmpty(gestor) && destination.push(gestor.email.trim());

      if (dados.solicitacao.pref_orig !== dados.solicitacao.pref_dest) {
        if (!_.isEmpty(dados.solicitacao.prefixo_orig.email) && dados.solicitacao.prefixo_orig.email.EmaildaUOR)
          destination.push(dados.solicitacao.prefixo_orig.email.EmaildaUOR.toLowerCase());

        gestor = await getPrimGestor(dados.solicitacao.prefixo_orig.prefixo);
        !_.isEmpty(gestor) && destination.push(gestor.email.trim());
      }

      if (
        dados.solicitacao.gg_ou_super ||
        dados.solicitacao.limitrofes ||
        dados.solicitacao.analise.deacordo_super_destino
      ) {
        if (!_.isNil(dados.solicitacao.prefixo_dest.dadosSuper)) {
          if (!_.isEmpty(dados.solicitacao.prefixo_dest.dadosSuper.email) && dados.solicitacao.prefixo_dest.dadosSuper.email.EmaildaUOR) {
            destination.push(dados.solicitacao.prefixo_dest.dadosSuper.email.EmaildaUOR.toLowerCase());
          }
        }
        // gestor = await getPrimGestor(dados.solicitacao.prefixo_dest.dadosSuper.prefixo);
        // !_.isEmpty(gestor) && destination.push(gestor.email.trim());
        if (!_.isNil(dados.solicitacao.prefixo_dest.dadosGerev)) {
          if (!_.isEmpty(dados.solicitacao.prefixo_dest.dadosGerev.email) && dados.solicitacao.prefixo_dest.dadosGerev.email.EmaildaUOR)
            destination.push(dados.solicitacao.prefixo_dest.dadosGerev.email.EmaildaUOR.toLowerCase());

          gestor = await getPrimGestor(dados.solicitacao.prefixo_dest.dadosGerev.prefixo, 1);
          !_.isEmpty(gestor) && destination.push(gestor.email.trim());
        }
      } else if (dados.solicitacao.super) {
        dados.solicitacao.situacaoSuperior = !!dados.solicitacao.analise.parecer_diretoria;
        if (!_.isEmpty(dados.solicitacao.prefixo_dest.dadosDiretoria)) {
          if (!_.isEmpty(dados.solicitacao.prefixo_dest.dadosDiretoria.email) && dados.solicitacao.prefixo_dest.dadosDiretoria.email.EmaildaUOR)
            destination.push(dados.solicitacao.prefixo_dest.dadosDiretoria.email.EmaildaUOR.toLowerCase());

          // gestor = await getPrimGestor(dados.solicitacao.prefixo_dest.dadosDiretoria.prefixo);
          // !_.isEmpty(gestor) && destination.push(gestor.email.trim());
        }
      }

      if (dados.solicitacao.prefixo_orig.tip_dep === 15) {
        const madrinha = await getPrefixoMadrinha(dados.solicitacao.pref_orig);
        const prefMadrinha = await getOneDependencia(madrinha.prefixo);
        const emailMadrinha = await getMainEmail(prefMadrinha.uor);
        if (!_.isEmpty(emailMadrinha) && emailMadrinha.EmaildaUOR)
          destination.push(emailMadrinha.EmaildaUOR.toLowerCase());

        gestor = await getPrimGestor(madrinha.prefixo);
        !_.isEmpty(gestor) && destination.push(gestor.email.trim());
      }

      if (dados.solicitacao.prefixo_dest.tip_dep === 15) {
        const madrinha = await getPrefixoMadrinha(dados.solicitacao.pref_dest);
        const prefMadrinha = await getOneDependencia(madrinha.prefixo);
        const emailMadrinha = await getMainEmail(prefMadrinha.uor);
        if (!_.isEmpty(emailMadrinha) && emailMadrinha.EmaildaUOR)
          destination.push(emailMadrinha.EmaildaUOR.toLowerCase());

        gestor = await getPrimGestor(madrinha.prefixo);
        !_.isEmpty(gestor) && destination.push(gestor.email.trim());
      }

      destination = [...new Set(destination)];

      return [assunto, corpo, destination];
    } catch (err) {
      throw new exception(err, 400);
    }
  }

  async _emailTextoCancelamento(dados) {
    // ! Método que envia email para os prefixos de solicitação informando a situação final da solicitação
    try {
      const texto =
        `#interna<p>` +
        `Senhor Administrador,<p>` +
        `Informamos que o protocolo {1} foi CANCELADO por falta de manifestação De Acordo antes da data de início registrada.<p>` +
        `Para verificar o histórico dessa movimentação, por favor siga o link <a href='{5}designacao/'>{5}designacao/</a>, na aba "Consultas".<p>` +
        `Informamos que todas as interações deverão ser feitas pelo link acima. Não haverá tratativas por e-mail.<p>` +
        `Atenciosamente,<p>` +
        `<strong>Gerência de Pessoas</strong><br>` +
        `<strong>9009 Superintendência Administrativa</strong>`;

      let gestor;
      const subsTexto = [
        dados.solicitacao.protocolo,
        dados.solicitacao.status.status,
        dados.documento.texto.replace(/(?:\r\n|\r|\n)/g, "<br>"),
        !!dados.documento.documento.length ? "SIM" : "NÃO",
        FRONTEND_URL,
      ];

      const subsSubject = [dados.solicitacao.protocolo, "Protocolo Encerrado"];

      const assunto = replaceVariable(this._subject(), subsSubject);
      const corpo = replaceVariable(texto, subsTexto);
      let destination = [];

      if (!_.isEmpty(dados.solicitacao.prefixo_dest.email) && dados.solicitacao.prefixo_dest.email.EmaildaUOR)
        destination.push(dados.solicitacao.prefixo_dest.email.EmaildaUOR.toLowerCase());

      gestor = await getPrimGestor(dados.solicitacao.prefixo_dest.prefixo);
      !_.isEmpty(gestor) && destination.push(gestor.email.trim());

      if (dados.solicitacao.pref_orig !== dados.solicitacao.pref_dest) {
        if (!_.isEmpty(dados.solicitacao.prefixo_orig.email) && dados.solicitacao.prefixo_orig.email.EmaildaUOR)
          destination.push(dados.solicitacao.prefixo_orig.email.EmaildaUOR.toLowerCase());

        gestor = await getPrimGestor(dados.solicitacao.prefixo_orig.prefixo);
        !_.isEmpty(gestor) && destination.push(gestor.email.trim());
      }

      if (
        dados.solicitacao.gg_ou_super ||
        dados.solicitacao.limitrofes ||
        dados.solicitacao.analise.deacordo_super_destino
      ) {
        if (!_.isEmpty(dados.solicitacao.prefixo_dest.dadosSuper.email) && dados.solicitacao.prefixo_dest.dadosSuper.email.EmaildaUOR)
          destination.push(dados.solicitacao.prefixo_super_dest.email.EmaildaUOR.toLowerCase());

        // gestor = await getPrimGestor(dados.solicitacao.prefixo_super_dest.prefixo);
        // !_.isEmpty(gestor) && destination.push(gestor.email.trim());

        if (!_.isEmpty(dados.solicitacao.prefixo_dest.dadosGerev)) {
          if (!_.isEmpty(dados.solicitacao.prefixo_dest.dadosGerev.email) && dados.solicitacao.prefixo_dest.dadosGerev.email.EmaildaUOR)
            destination.push(dados.solicitacao.prefixo_dest.dadosGerev.email.EmaildaUOR.toLowerCase());

          gestor = await getPrimGestor(dados.solicitacao.prefixo_dest.dadosGerev.prefixo, 1);
          !_.isEmpty(gestor) && destination.push(gestor.email.trim());
        }
      } else if (dados.solicitacao.super) {
        dados.solicitacao.situacaoSuperior = !!dados.solicitacao.analise.parecer_diretoria;
        if (!_.isEmpty(dados.solicitacao.prefixo_dest.dadosDiretoria)) {
          if (!_.isEmpty(dados.solicitacao.prefixo_dest.dadosDiretoria.email) && dados.solicitacao.prefixo_dest.dadosDiretoria.email.EmaildaUOR)
            destination.push(dados.solicitacao.prefixo_dest.dadosDiretoria.email.EmaildaUOR.toLowerCase());

          // gestor = await getPrimGestor(dados.solicitacao.prefixo_dest.dadosDiretoria.prefixo);
          // !_.isEmpty(gestor) && destination.push(gestor.email.trim());
        }
      }

      if (dados.solicitacao.prefixo_orig.tip_dep === 15) {
        const madrinha = await getPrefixoMadrinha(dados.solicitacao.pref_orig);
        const prefMadrinha = await getOneDependencia(madrinha.prefixo);
        const emailMadrinha = await getMainEmail(prefMadrinha.uor);
        if (!_.isEmpty(emailMadrinha) && emailMadrinha.EmaildaUOR)
          destination.push(emailMadrinha.EmaildaUOR.toLowerCase());

        gestor = await getPrimGestor(madrinha.prefixo);
        !_.isEmpty(gestor) && destination.push(gestor.email.trim());
      }

      if (dados.solicitacao.prefixo_dest.tip_dep === 15) {
        const madrinha = await getPrefixoMadrinha(dados.solicitacao.pref_dest);
        const prefMadrinha = await getOneDependencia(madrinha.prefixo);
        const emailMadrinha = await getMainEmail(prefMadrinha.uor);
        if (!_.isEmpty(emailMadrinha) && emailMadrinha.EmaildaUOR)
          destination.push(emailMadrinha.EmaildaUOR.toLowerCase());

        gestor = await getPrimGestor(madrinha.prefixo);
        !_.isEmpty(gestor) && destination.push(gestor.email.trim());
      }

      destination = [...new Set(destination)];

      return [assunto, corpo, destination];
    } catch (err) {
      throw new exception(err, 400);
    }
  }
}

module.exports = MailRepository;