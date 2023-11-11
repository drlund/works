async patchPlataforma({ request, response, session }) {
    const usuario = session.get('currentUserAccount');
    const { id, matriculaResponsavel } = request.allParams();

    console.log('Matricula responsável: ', matriculaResponsavel);

    const ucEditaPlataforma = new UcEditaPlataforma({
      repository: new PlataformasRepository(request)
    });

    const { error, payload } = await ucEditaPlataforma.run({
      id,
      matriculaResponsavel,
      usuario
    });
    handleAbstractUserCaseError(error);

    response.ok(payload);
  }
