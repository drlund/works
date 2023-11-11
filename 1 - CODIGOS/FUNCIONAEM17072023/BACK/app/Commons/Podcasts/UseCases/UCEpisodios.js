const { AbstractUserCase } = require('../../AbstractUserCase');
class UCEpisodios extends AbstractUserCase {
  constructor({ repository }) {
    super({ repository });
    this._config({ useChecks: false, usePayload: false });
  }

  async _action(user) {
    const listaEpisodios = await this.repository.getEpisodios();

    if (!listaEpisodios || (Array.isArray(listaEpisodios) && listaEpisodios.length === 0)) {
      this._throwExpectedError("Nenhum episódio encontrado", 404);
    }
    const listaEpisodiosCompleta = listaEpisodios.map((episodio) => {
      return Promise.all([
        this.repository.countLikesEpisodio(episodio.id),
        this.repository.episodioIsLiked(episodio.id, user.chave)
      ]).then(([likesCount, matriculaLiked]) => {
        episodio.likesCount = likesCount;
        episodio.matriculaLiked = matriculaLiked;
        return episodio;
      });
    });
    return Promise.all(listaEpisodiosCompleta);
  }
}
module.exports = UCEpisodios;
