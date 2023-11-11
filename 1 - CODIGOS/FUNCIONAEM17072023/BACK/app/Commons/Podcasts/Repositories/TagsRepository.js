"use strict";

const Tag = use("App/Models/Mysql/Podcasts/Tag");

class TagsRepository {
  async getTags() {
    const tags = await Tag.query()
      .where("ativo", 1)
      .fetch();
    return tags ? tags.toJSON() : null;
  }

  async deleteTag(id) {
    const deletar = await Tag.find(id);
    deletar.merge({ ativo: "0" });
    await deletar.save();

    return deletar;
  }

  async criarManyTags(arrayDeTagsTratadas, trx) {
    return Tag.createMany(arrayDeTagsTratadas, trx);
  }

  async getTagsByName(nome) {
    const tag = await Tag.findBy("nome", nome);
    return tag;
  }
}

module.exports = TagsRepository;
