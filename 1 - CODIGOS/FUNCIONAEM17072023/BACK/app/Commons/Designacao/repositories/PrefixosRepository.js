"use strict";

const { NIVEL_ALFAB } = require("../Constants");

const JurisdicoesSubordinadasModel = use('App/Models/Mysql/JurisdicoesSubordinadas');
const Uors500gModel = use("App/Models/Mysql/Arh/Uors500g");
const PrefixoModel = use("App/Models/Mysql/Prefixo");

class PrefixosRepository {
  async getDestino(prefixo, funcao = null) {
    const dest = PrefixoModel.query()
      .with('dadosSuper')
      .with('dadosDiretoria')
      .with('dadosGerev')
      .where('prefixo', prefixo)
      .where("cd_subord", '00');

    if (funcao) {
      dest.innerJoin("DIPES.arhfot06", "arhfot06.cod_comissao", "arhfot06.cod_comissao")
        .where("arhfot06.cod_comissao", funcao);
    }

    const destino = await dest.first();

    return destino.toJSON();
  }

  async getCodigoUor(uor) {
    const dadosUOR = await Uors500gModel
      .findBy('CodigoUOR', parseInt(uor));

    return dadosUOR.toJSON();
  }

  async getNivelAlfab(nivel) {
    const chavesInt = Object.keys(NIVEL_ALFAB).map(chave => parseInt(chave));
    return chavesInt.includes(parseInt(nivel)) ? NIVEL_ALFAB[nivel] : '';
  }

  async getAllJurisdicaoSubordinadas(usuario) {
    let deps = JurisdicoesSubordinadasModel.query()
      .with('prefixo_subord_mst', (builder) => {
        builder
          .select("mstd503e.EmaildaUOR as email", "mst606.*")
          .innerJoin('mstd503e', (builderOn) => {
            builderOn
              .on('mst606.uor_dependencia', 'mstd503e.CodigodaUOR')
          })
          .where("mst606.cd_subord", "00")
          .where("mstd503e.IndEmailPrincipal", "S")
          .where("mst606.dt_encerramento", ">", "NOW()")
      })
      .where((builderWhere) => {
        if ([usuario.isGerev]) {
          builderWhere.where('prefixo', usuario.isGerev[1])
        } else {
          builderWhere.where('uor', usuario.uor)
        }
        builderWhere.where("cd_subord_subordinada", "00")
      })
      .orWhere((builderOrWhere) => {
        builderOrWhere
          .where('uor_subordinada', usuario.uor)
          .where("nivel", 10)
      });


    const depends = await deps.fetch();

    const dependencias = depends.toJSON();

    return dependencias.map((dependencia) => dependencia.prefixo_subord_mst);
  }

  async getJurisdicaoSubordinadas(usuario, prefixo) {
    const deps = await JurisdicoesSubordinadasModel.query()
      .with('prefixo_subord_mst', (builder) => {
        builder
          .select("mstd503e.EmaildaUOR as email", "mst606.*")
          .innerJoin('mstd503e', (builderOn) => {
            builderOn
              .on('mst606.uor_dependencia', 'mstd503e.CodigodaUOR')
          })
          .where("mst606.cd_subord", "00")
          .where("mstd503e.IndEmailPrincipal", "S")
          .where("mst606.dt_encerramento", ">", "NOW()")
      })
      .where((builderWhere) => {
        builderWhere
          .where('prefixo_subordinada', 'like', `%${prefixo}%`)
          .orWhere('nome_subordinada', 'like', `%${prefixo}%`)
      })
      .where("cd_subord_subordinada", "00")
      .where((builderWhere) => {
        if (usuario.isGerev[0]) {
          builderWhere.where('prefixo', usuario.isGerev[1])
        } else {
          builderWhere.where('uor', usuario.uor)
        }
      })
      .fetch();

    const dependencias = deps.toJSON();
    return dependencias.map((dependencia) => dependencia.prefixo_subord_mst);
  }
}

module.exports = PrefixosRepository;