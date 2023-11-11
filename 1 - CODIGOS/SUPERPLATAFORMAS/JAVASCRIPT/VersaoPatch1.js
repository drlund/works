async patchPlataforma({ request, response, session }) {
    const usuario = session.get('currentUserAccount');
    const { id, nomeResponsavel } = request.allParams();

    console.log('Nome responsável: ', nomeResponsavel);

    const ucEditaPlataforma = new UcEditaPlataforma({
      repository: new PlataformasRepository(request)
    });

    const { error, payload } = await ucEditaPlataforma.run({
      id,
      nomeResponsavel,
      usuario
    });
    handleAbstractUserCaseError(error);

    response.ok(payload);
  }
}