  /**
   * @typedef {{
   * idTag: number,
   * idEpisodio: number,
   * }} Podcasts.Tag.PivotTag
   */

  /**
   * @typedef {{
   * id: number,
   * nome: string,
   * ativo: string,
   * createdAt: string,
   * updateAt: string,
   * cor: string,
   * pivot: Podcasts.Tag.PivotTag
   * }} Podcasts.Tag
   */

  /**
   * @typedef {{
   * id: number,
   * nome: string,
   * descricao: string,
   * imagem: string,
   * uorResponsavel: string,
   * prefixoResponsavel: string,
   * nomePrefixoResponsavel: string,
   * matriculaResponsavel: string,
   * nomeResponsavel: string,
   * ativo: string,
   * createdAt: string,
   * updateAt: string,
   * }} Podcasts.Canal
   */

  /**
   * @typedef {{
   * id: number,
   * matricula: string,
   * nome: string,
   * ativo: string,
   * createdAt: string,
   * updateAt: string,
   * idEpisodio: number
   * }} Podcasts.Episodio.Likes
   */

  /**
   * @typedef {{
   * id: number,
   * idCanal: number,
   * urlEpisodio: string,
   * titulo: string,
   * ativo: string,
   * tags: Array<Podcasts.Tag>,
   * createdAt: string,
   * canal: Podcasts.Canal,
   * likes: Podcasts.Episodio.Likes,
   * matriculaLiked: number,
   * likesCount: number,
   * }} Podcasts.Episodio
   */

