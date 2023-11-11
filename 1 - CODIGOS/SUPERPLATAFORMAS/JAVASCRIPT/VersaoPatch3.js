async patchPlataforma({ request, response, session }) {
    const usuario = session.get('currentUserAccount');
    const dados = request.only(['id', 'matricula', 'nome']);

    const ucEditaPlataforma = new UcEditaPlataforma({
      repository: new PlataformasRepository(request),
    });

    console.log('Dados da plataforma: ', dados);

    try {
      const { error, payload } = await ucEditaPlataforma.run(dados, usuario);
      if (error) {
        throw new Error(error);
      }

      response.ok(payload);
    } catch (error) {
      response.status(500).send({ error: 'Erro ao editar plataforma' });
    }
  }