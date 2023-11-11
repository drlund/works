const permissoesFerramentas = use(
  "App/Models/Mongo/PermissoesFerramentas"
);

class PermissoesFerramentasRepository {
  async find() {
    const consulta = await permissoesFerramentas.find({});

    return consulta;
  }

  async inserir(payload) {
    const novo = new permissoesFerramentas(payload);
    await novo.save();

    return novo;
  }

  async localizarEAtualizar(id, payload) {
    const consulta = await permissoesFerramentas.findByIdAndUpdate(
      id,
      payload,
      {
        new: true,
        returnDocument: 'after'
      }
    );

    return consulta;
  }

  async removerFerramentaPorId(id) {
    let permissaoExcluida = await permissoesFerramentas.findByIdAndRemove(
      id
    );

    return permissaoExcluida;
  }
}

module.exports = PermissoesFerramentasRepository;
