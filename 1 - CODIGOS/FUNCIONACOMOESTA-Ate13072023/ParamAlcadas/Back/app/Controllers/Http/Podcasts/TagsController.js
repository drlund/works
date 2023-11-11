"use strict";

const UCTags = require("../../../Commons/Podcasts/UseCases/UCTags");
const UCIncluirTag = require("../../../Commons/Podcasts/UseCases/UCIncluirTag");
const UCDeleteTag = require("../../../Commons/Podcasts/UseCases/UCDeleteTag");
const TagsRepository = require("../../../Commons/Podcasts/Repositories/TagsRepository");
const hasPermission = use("App/Commons/HasPermission");

const { handleAbstractUserCaseError } = use("App/Commons/AbstractUserCase");

class TagsController {

  async getTags({ response }) {
    const ucTags = new UCTags({
      repository: new TagsRepository(),
    });

    const { error, payload } = await ucTags.run();

    handleAbstractUserCaseError(error);

    response.ok(payload);
  }

  async deleteTag({ request, response, session }) {
    const { id } = request.allParams();
    const user = session.get("currentUserAccount");

    const ucDeleteTag = new UCDeleteTag({
      repository: new TagsRepository(),
      functions: { hasPermission },
    });

    const { error, payload } = await ucDeleteTag.run(id, user);

    handleAbstractUserCaseError(error);

    response.ok(payload);
  }

}

module.exports = TagsController;
