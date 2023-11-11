const _ = require('lodash');

const Superadm = use("App/Models/Mysql/Superadm");
const Dipes = use("App/Models/Mysql/Dipes");
const exception = use('App/Exceptions/Handler');
const getPrefixoMadrinha = use('App/Commons/Designacao/getPrefixoMadrinha');

async function getPrimGestor(prefixo, regional = null) {
  try {

    //verifica se prefixo é PAA
    let uor = await Dipes.query()
      .from("mst606")
      .where("prefixo", prefixo)
      .where("cd_subord", "00")
      .first();

    if (uor.tip_dep === 15) {
      const madrinha = await getPrefixoMadrinha(prefixo);

      uor = await Dipes.query()
        .from("mst606")
        .where("prefixo", madrinha.prefixo)
        .where("cd_subord", "00")
        .first();
    }

    // ? obtem os codigos de administradores
    let comissoes = await Superadm.query()
      .select('cd_funcao')
      .from('cargos_e_comissoes')
      .where('flag_administrador', 1)
      .fetch();

    comissoes = comissoes.toJSON().map(e => e.cd_funcao);


    let uor_trabalho = uor.uor_dependencia;
    if (regional) {
      const gerev = await Superadm.query()
        .from('vinculo_gerev')
        .where('uor_gerev', uor_trabalho)
        .first();

      if (gerev) {
        uor_trabalho = gerev.uor_trabalho;
      }
    }

    // ? verifica se existe alguem lotado com essas comissoes
    let funciResp = await Dipes.query()
      .select('matricula', 'nome', 'comissao', 'sexo', 'desc_cargo', 'email')
      .from('arhfot01_adm')
      .whereIn('comissao', comissoes)
      .where('uor_trabalho', uor_trabalho)
      .first();

    funciResp = _.isNil(funciResp) ? [] : funciResp.toJSON();

    return funciResp;

  } catch (err) {
    throw new exception(err, 400);
  }
}

module.exports = getPrimGestor;