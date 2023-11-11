"use strict";
const moment = use("moment");

const Superadm = use("App/Models/Mysql/Superadm");

const Funci = use("App/Models/Mysql/Arh/Funci");
const Prefixo = use("App/Models/Mysql/Arh/Prefixo");
const Mstd500g = use("App/Models/Mysql/Arh/Mstd500g");
const CargosComissoes = use("App/Models/Mysql/Arh/CargosComissoes");

async function getDadosIdentificadores(concessoes) {
  const prefixos = [];
  const uors = [];
  const matriculas = [];
  const comissoes = [];
  const rfos = [];

  // Dentro do loop, verificar cada objeto de acesso e colocá-lo
  // em cada item de identificador
  concessoes.map((acesso) => {
    if (acesso.tipo) {
      "comite" === acesso.tipo.tipo &&
        prefixos.push(acesso.identificador.slice(-4));
      "prefixo" === acesso.tipo.tipo && prefixos.push(acesso.identificador);
      "matricula" === acesso.tipo.tipo && matriculas.push(acesso.identificador);
      "uor" === acesso.tipo.tipo && uors.push(acesso.identificador);
      "comissao" === acesso.tipo.tipo && comissoes.push(acesso.identificador);
      "rfo" === acesso.tipo.tipo && rfos.push(acesso.identificador);
    }
  });

  const lista = {
    prefixos: [...new Set(prefixos)],
    uors: [...new Set(uors)],
    matriculas: [...new Set(matriculas)],
    comissoes: [...new Set(comissoes)],
    rfos: [...new Set(rfos)],
  };

  const dadosIdentificadores = await _getDadosIds(lista);

  concessoes.forEach((elem) => {
    if (elem.tipo) {
      elem._doc.tipoNome = elem.tipo.nome;

      const nomeIdentificador = _getNomeIdentificador(
        elem.tipo.tipo,
        elem.identificador,
        dadosIdentificadores
      );
      if (!nomeIdentificador) {
        elem._doc.nomeIdentificador =
          elem.identificador === "F0000000" ? "ROBÔ SUPERADM" : "";
      } else {
        elem._doc.nomeIdentificador = String(nomeIdentificador).toUpperCase();
      }
    }
  });

  return concessoes;
}

// Métodos privados

async function _getNomesPrefixos(identificador) {
  if (Array.isArray(identificador) && !identificador.length) {
    return [];
  }
  const consulta = await Prefixo.query()
    .select("prefixo as identificador", "nome as nomeIdentificador")
    .whereIn("prefixo", identificador)
    .sb00()
    .fetch();

  const prefixosENomes = consulta.toJSON();
  return prefixosENomes.map((elem) => {
    return {
      nomeIdentificador: elem.nomeIdentificador,
      identificador: String(elem.identificador).padStart(4, "0"),
    };
  });
}
async function _getNomesUors(identificador) {
  if (Array.isArray(identificador) && !identificador.length) {
    return [];
  }
  const consulta = await Mstd500g.query()
    .select("CodigoUOR as identificador", "NomeUOR as nomeIdentificador")
    .whereIn("CodigoUOR", identificador)
    .fetch();

  const uorsENomes = consulta.toJSON();
  return uorsENomes.map((elem) => {
    return {
      ...elem,
      identificador: String(elem.identificador).padStart(9, "0"),
    };
  });
}
async function _getNomesMatriculas(identificador) {
  if (Array.isArray(identificador) && !identificador.length) {
    return [];
  }
  const funcisENomes = await Funci.query()
    .select("matricula as identificador", "nome as nomeIdentificador")
    .whereIn("matricula", identificador)
    .fetch();

  return funcisENomes.toJSON();
}
async function _getNomesComites(identificador) {
  if (Array.isArray(identificador) && !identificador.length) {
    return [];
  }
  const prefixosENomes = await Prefixo.query()
    .select("prefixo as identificador", "nome as nomeIdentificador")
    .whereIn("prefixo", [...identificador.map((elem) => elem.slice(-4))])
    .sb00()
    .fetch();

  const comitesENomes = prefixosENomes.toJSON();
  return comitesENomes.map((elem) => {
    return {
      identificador: `C${elem.identificador}`,
      nomeIdentificador: `Comitê do Prefixo ${elem.identificador} ${elem.nomeIdentificador}`,
    };
  });
}
async function _getNomesComissoes(identificador) {
  if (Array.isArray(identificador) && !identificador.length) {
    return [];
  }
  const consulta = await CargosComissoes.query()
    .select("cod_funcao as identificador", "nome_funcao as nomeIdentificador")
    .whereIn("cod_funcao", identificador)
    .fetch();

  const comissoesENomes = consulta.toJSON();
  return comissoesENomes.map((elem) => {
    return {
      ...elem,
      identificador: String(elem.identificador).padStart(6, "0"),
    };
  });
}
async function _getNomesRfos(identificador) {
  if (Array.isArray(identificador) && !identificador.length) {
    return [];
  }
  const consulta = await Superadm.query()
    .from("referenciaOrganizacional")
    .select("rfo as identificador", "descricao as nomeIdentificador")
    .whereIn("rfo", identificador)
    .fetch();

  if (!consulta) {
    return null;
  }
  return consulta.toJSON();
}

async function _getDadosIds(lista) {
  const [prefixo, uor, matricula, comissao, rfo] = await Promise.all([
    _getNomesPrefixos(lista.prefixos),
    _getNomesUors(lista.uors),
    _getNomesMatriculas(lista.matriculas),
    _getNomesComissoes(lista.comissoes),
    _getNomesRfos(lista.rfos),
  ]);

  return {
    prefixo,
    uor,
    matricula,
    comissao,
    rfo,
  };
}

function _getNomeIdentificador(tipo, identificador, listaIdentificadores) {
  const nome = listaIdentificadores[tipo]
    .filter((elem) => elem.identificador === identificador)
    .map((id) => String(id.nomeIdentificador).trim());

  return nome.toString();
}

module.exports = getDadosIdentificadores;
