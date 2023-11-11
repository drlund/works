"use strict";
const NotasInternas = use("App/Models/Postgres/MtnNotasInternas.js");
const LeituraNota = use("App/Models/Postgres/MtnNotasInternasLeitura.js");
const moment = require("moment");

class NotasInternasFactory {
  novaNota = async (notaInterna, usuario) => {
    const notaFactory = new NotasInternas();
    notaFactory.id_envolvido = notaInterna.idEnvolvido;
    notaFactory.mat_resp_acao = usuario.chave;
    notaFactory.nome_resp_acao = usuario.nome_usuario;
    notaFactory.prefixo_resp_acao = usuario.prefixo;
    notaFactory.nome_prefixo_resp_acao = usuario.dependencia;
    notaFactory.desc_nota = notaInterna.desc_nota;

    return notaFactory;
  };

  leituraNota = async (idEnvolvido, idNotaInterna, usuario) => {
    const leituraNotaFactory = new LeituraNota();
    leituraNotaFactory.id_envolvido = idEnvolvido;
    leituraNotaFactory.prefixo_leitura = usuario.prefixo;
    leituraNotaFactory.nome_prefixo_leitura = usuario.dependencia;
    leituraNotaFactory.data_leitura = moment().format("YYYY-MM-DD HH:mm:ss");
    leituraNotaFactory.mat_leitura = usuario.chave;
    leituraNotaFactory.nome_leitura = usuario.nome_usuario;
    leituraNotaFactory.id_nota_interna = idNotaInterna;

    return leituraNotaFactory;
  }
}

module.exports = NotasInternasFactory;
