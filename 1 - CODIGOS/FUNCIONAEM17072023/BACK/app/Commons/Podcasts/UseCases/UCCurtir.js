const { AbstractUserCase } = require('../../AbstractUserCase');
class UCCurtir extends AbstractUserCase {
  constructor({ repository }) {
    super({ repository });
    this._config({ useChecks: false });
  }

  async _action(idEpisodio, user) {
    const registroDoLike = await this.repository.verifyLikeStatus(idEpisodio, user.chave);
    if (registroDoLike.length === 0) {
      await this.repository.criarLike(user.chave, user.nome_usuario, idEpisodio);
    } else {
      const statusLike = registroDoLike[0].ativo;
      const idLike = registroDoLike[0].id;
      if (registroDoLike && statusLike === "1") {
        await this.repository.dislikeEpisodio(idLike);
      } else if (registroDoLike && statusLike === "0") {
        await this.repository.likeEpisodio(idLike);
      } else {
        this._throwExpectedError('Não foi possível registrar sua curtida');
      }
    }
    return this.repository.verifyLikeStatus(idEpisodio, user.chave);
  }
}

module.exports = UCCurtir;
