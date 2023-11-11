"use strict";

const { getOneDependenciaByUor } = require("../../Arh");

class PrefixosRepository {
    async getPrefixoDataByUor(uor) {
        return await getOneDependenciaByUor(uor);
    }
}

module.exports = PrefixosRepository;