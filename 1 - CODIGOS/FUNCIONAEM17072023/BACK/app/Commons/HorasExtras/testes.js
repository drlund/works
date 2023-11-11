async function testGetConsultasBDHorasExtras({request, response, session}) {
  const user = session.get("currentUserAccount");

  const {id} = request.allParams();

  try {

    /**
    // let solicitacao = await Solicitacoes.query()
    //   .with("compensacao")
    //   .with("estado")
    //   .with("bhFunci")
    //   .with("orcado")
    //   .where('id', id)
    //   .fetch();
    //
    // if (solicitacao) {
    //   solicitacao = solicitacao.toJSON();
    // }
    **/


    /**
    // const despacho = {
    //   parecer_1_desp: "teste"
    // };

    // let solicitacao = await Solicitacoes.query()
    // .where('id', id)
    // .update(despacho);
    **/

    /**
    const trx = await Database.connection("horasExtras").beginTransaction();

    await Solicitacoes.create({id: "HE00TESTE"}, trx);

    await Compensacao
      .create({
        id_solicitacao: "HE00TESTE",
        compensacao: JSON.stringify({teste: "teste"})
      }, trx);

    await trx.commit();

    const solicitacao = true;
    **/

    const solicitacao = await getDadosSolicitacao(user, id);

    response.ok(solicitacao);
  } catch (error) {
    await trx.rollback();
    response.badRequest([]);
  }

}

async function testPostBDHorasExtras({request, response, session}) {
 const user = session.get("currentUserAccount");

 const {post} = request.allParams();

 try {
   const parecer = await addParecer(user, post);

   response.ok(parecer);
 } catch (error) {
   response.badRequest([]);
 }

}

async function testAddParecer({request, response, session}) {
  const user = session.get("currentUserAccount");

  const {post} = request.allParams();

  try {
    const parecer = await addParecer(user, post);

    response.ok(parecer);
  } catch (error) {
    response.badRequest([]);
  }

}

async function testIsUsuarioSuperintendente({response, session}) {
  const user = session.get("currentUserAccount");

  try {
    const isSuperRegional = await isSuper('regional', user);
    const isSuperEstadual = await isSuper('estadual', user);
    const isSuperAdm = await isSuper('superadm', user);

    response.ok({isSuperRegional, isSuperEstadual, isSuperAdm});
  } catch (error) {
    response.badRequest([]);
  }

}

async function testModelFunciWithDdComissao({request, response}) {
  try {
    const {matricula} = request.allParams();

    const funciNario = await Funci.query()
      .with("ddComissao")
      .with("ddComissaoFot06")
      .with("funcaoLotacao")
      .where("matricula", matricula)
      .first();

    const funci = funciNario.toJSON();

    response.ok(funci);
  } catch (error) {
    response.badRequest(error);
  }
}

module.exports = {
  testGetConsultasBDHorasExtras,
  testPostBDHorasExtras,
  testAddParecer,
  testIsUsuarioSuperintendente,
  testModelFunciWithDdComissao
}