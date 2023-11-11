"use strict";

const { validate } = use("Validator");

const exception = use("App/Exceptions/Handler");

const { ESTADOS } = use("App/Commons/Acesso/Constants");
const { getListaComitesByMatricula } = use("App/Commons/Arh/dadosComites");
const getDadosComissaoCompleto = use(
  "App/Commons/Arh/getDadosComissaoCompleto"
);

const PermissoesFerramentas = use("App/Models/Mongo/PermissoesFerramentas");
const ConcessoesAcessos = use("App/Models/Mongo/ConcessoesAcessos");

async function hasPermission({
  nomeFerramenta,
  dadosUsuario,
  permissoesRequeridas,
  verificarTodas,
}) {
  const schema = {
    nomeFerramenta: "required|string",
    dadosUsuario: "required|object",
    permissoesRequeridas: "required|array",
    verificarTodas: "boolean",
  };

  const validation = await validate(
    {
      nomeFerramenta,
      permissoesRequeridas,
      dadosUsuario,
    },
    schema
  );

  if (validation.fails()) {
    throw new exception(
      "Função has_permissions não recebeu todos os parâmetros obrigatórios",
      400
    );
  }

  const listaIdentificadores = [
    dadosUsuario.chave,
    dadosUsuario.prefixo,
    dadosUsuario.uor,
    dadosUsuario.uor_trabalho,
    dadosUsuario.nome_funcao,
    dadosUsuario.ref_org,
    `C${dadosUsuario.prefixo}`,
    String(dadosUsuario.cod_funcao).padStart(6, "0"),
  ];

  // obtem a lista de comitês pela matrícula
  const listaComitesByMatricula = await getListaComitesByMatricula(
    dadosUsuario.chave
  );
  const listaComites = listaComitesByMatricula.map(
    (comite) => `C${comite.PREFIXO}`
  );
  listaIdentificadores.push(...listaComites);
  // obtem o rfo da matrícula do Funcionário logado
  const dadosComissao = await getDadosComissaoCompleto(dadosUsuario.cod_funcao);
  const rfo = dadosComissao.ref_org;
  if (rfo !== null) {
    listaIdentificadores.push(rfo);
  }

  const dadosFerramenta = await PermissoesFerramentas.findOne({
    nomeFerramenta,
  });

  // Usuário não tem permissão na
  if (!dadosFerramenta) {
    throw new exception(`Ferramenta não encontrada: ${nomeFerramenta}`, 400);
  }

  const concessoes = await ConcessoesAcessos.find({
    ferramenta: dadosFerramenta.id,
    identificador: { $in: listaIdentificadores },
    ativo: ESTADOS.ATIVO,
  })
    .select({ permissoes: 1 })
    .lean();

  if (!concessoes) {
    throw new exception(
      `Usuário ${dadosUsuario.chave} sem permissão na ferramenta ${nomeFerramenta}`,
      401
    );
  }

  // unifica a lista de permissoes dos identificadores encontrados
  let permissoesCadastradas = [];

  concessoes.map((reg) => {
    reg.permissoes.map((permissao) => {
      if (!permissoesCadastradas.includes(permissao)) {
        permissoesCadastradas.push(permissao);
      }
      return permissao;
    });
    return reg;
  });

  // faz a verificacao das permissoes requeridas x as permissoes cadastradas
  let intersection = permissoesRequeridas.filter((x) =>
    permissoesCadastradas.includes(x)
  );
  let result = intersection.length > 0;

  if (verificarTodas) {
    // precisa ter todas as obrigatorias para indicar permissao
    result = intersection.length === permissoesRequeridas.length;
  }

  return result;
}

module.exports = hasPermission;
