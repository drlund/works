"use strict";

const exception = use("App/Exceptions/Handler");
const visaoModel = use("App/Models/Postgres/MtnVisao");

const validarDadosMonitoramento = (dadosMonitoramento) => {
  const { ativa, origem, nomeReduzido, descricao } = dadosMonitoramento;

  const isValido =
    ativa !== undefined &&
    origem !== undefined &&
    nomeReduzido !== undefined &&
    descricao !== undefined;

  return isValido;
};

async function incluirMonitoramento(dadosMonitoramento) {
  const isValido = validarDadosMonitoramento(dadosMonitoramento);
  if (!isValido) {
    throw new exception("Dados do monitoramento inválidos", 400);
  }
  const novaVisao = new visaoModel();
  novaVisao.ativa = dadosMonitoramento.ativa;
  novaVisao.desc_visao = dadosMonitoramento.descricao;
  novaVisao.nome_reduzido = dadosMonitoramento.nomeReduzido;
  novaVisao.origem_visao = dadosMonitoramento.origem;
  await novaVisao.save();
}

module.exports = incluirMonitoramento;
